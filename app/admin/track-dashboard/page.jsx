"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '@/app/components';
import { getAcadyears } from '@/src/util/academicYear';
import { SearchIcon } from '@/app/components/icons';
import { Button } from '@nextui-org/react';
import { fetchDataObj } from '../action';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import { Card, CardBody } from "@nextui-org/card";
import { Alert, Spin, Tabs } from 'antd';
import localFont from 'next/font/local'
import StudentTable from './StudentTable';

const prompt = localFont({ src: '../../../public/fonts/Prompt-Regular.woff2' })
const BarChart = dynamic(() => import('@/app/components/charts/ApexBarChart'), { ssr: false });

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [popularity, setPopularity] = useState([]);
    const [searching, setSearching] = useState(false)
    const acadyears = getAcadyears().map(acadyear => ({
        value: acadyear,
        label: acadyear
    }));
    const [acadyear, setAcadyear] = useState(acadyears[0])
    const courseTypes = useMemo(() => ([
        { value: "all", label: "ทั้งหมด" },
        { value: "regular", label: "ภาคปกติ" },
        { value: "special", label: "โครงการพิเศษ" },
    ]), [])
    const [courseType, setCourseType] = useState(courseTypes[0]);
    const [startYear, setStartYear] = useState({});
    const [endYear, setEndYear] = useState({});

    useEffect(() => {
        setStartYear({
            value: acadyear.value - 5, label: acadyear.value - 5
        })
        setEndYear(acadyear)
    }, [acadyear])

    const getDashboardData = useCallback(async (acadyear) => {
        try {
            const data = await fetchDataObj(`/api/tracks/selects/${acadyear}/students/dashboard`);
            setDashboardData(data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error(err);
        }
    }, []);

    const getPopularTracks = useCallback(async (startYear, endYear) => {
        try {
            const data = await fetchDataObj(`/api/tracks/selects/popular/${startYear}/${endYear}`);
            setPopularity(data)
        } catch (err) {
            setError('Failed to fetch popularity data');
            console.error(err);
        }
    }, [])

    const init = useCallback(async (acadyear) => {
        setIsLoading(true)
        await getDashboardData(acadyear)
        await getPopularTracks(startYear.value, endYear.value)
        setIsLoading(false)
    }, [startYear, endYear])

    const handleSearch = useCallback((acadyear) => {
        init(acadyear)
    }, [init])

    const getChartOption = useCallback((
        series, categories, title = undefined, showXaxis = true, colors = ['#F4538A', '#FAA300', "#7EA1FF", "#2CD3E1"]
    ) => ({
        series: series,
        options: {
            title: {
                text: title,
                style: {
                    ...prompt.style
                }
            },
            chart: {
                height: 200,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                    }
                },
                toolbar: {
                    show: false,
                }
            },
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    distributed: true,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false
            },
            xaxis: {
                categories,
                labels: {
                    show: showXaxis,
                    style: {
                        fontSize: '12px',
                        colors: ['#333'],
                        ...prompt.style
                    },
                },
            },
            yaxis: {
                title: {
                    text: 'คะแนน',
                    style: {
                        paddingTop: "10px",
                        fontSize: '10px',
                        colors: ['#333'],
                        ...prompt.style
                    }
                },
            },
        },
    }), [])

    const studentTableItems = useCallback((items) => {
        if (isLoading) return <Spin className='mx-auto' />;
        if (error) return <Alert message={error} type="error" />;
        if (dashboardData != null) {
            return (
                <StudentTable
                    studentsData={items}
                />
            );
        }
        return null;
    }, [dashboardData, isLoading, error]);

    const tabsItems = useMemo(() => {
        const selected = dashboardData?.selectedCount?.selected?.filter(sl => sl.courseType === courseType.value || courseType.value === "all")
        const nonSelected = dashboardData?.selectedCount?.nonSelected?.filter(sl => sl.courseType === courseType.value || courseType.value === "all")
        return (
            [
                {
                    key: '1',
                    label: `นักศึกษาเข้าคัดแทร็ก ${selected?.length} คน`,
                    children: studentTableItems(selected),
                },
                {
                    key: '2',
                    label: `นักศึกษาไม่ได้เข้าคัดแทร็ก ${nonSelected?.length} คน`,
                    children: studentTableItems(nonSelected),
                },
            ]
        )
    }, [dashboardData, studentTableItems, courseType])

    const getFilteredData = useCallback((data, type) => {
        if (!data) return []
        return data.find(item => item.type === type)?.data || [];
    }, [])

    const popularityOption = useMemo(() => {
        if (!dashboardData) return null;

        const filteredData = getFilteredData(dashboardData.popularity, courseType.value);
        const series = [{
            data: filteredData.map(pop => pop.selected)
        }];
        const categories = filteredData.map(pop => pop.track?.split(" ")[0] ?? "ไม่เข้าคัดเลือก");
        const popData = dashboardData?.popularity?.filter(type => type.type === courseType.value)?.data
        for (let i = 0; i < popData?.length; i++) {
            const pop = popData[i]
            series[0].data.push(pop.selected)
            categories.push(pop.track?.split(" ")[0] ?? "ไม่เข้าคัดเลือก")
        }
        const option = getChartOption(series, categories, undefined, true)
        option.options.legend = {
            position: 'top',
            horizontalAlign: 'center',
            offsetX: 40
        }
        option.options.dataLabels.enabled = true
        option.options.plotOptions.bar.dataLabels.total = {
            enabled: true,
            style: {
                fontSize: '13px',
                fontWeight: 900
            }
        }
        return option
    }, [dashboardData, courseType])

    const ratioPopulation = useMemo(() => {
        if (!dashboardData) return null;

        const filteredData = getFilteredData(dashboardData.popularity, courseType.value);
        return {
            series: filteredData.map(pop => pop.selected),
            options: {
                chart: {
                    width: 380,
                    type: 'pie',
                },
                colors: ['#F4538A', '#FAA300', "#7EA1FF", "#2CD3E1"],
                labels: filteredData.map(pop => pop.track?.split(" ")[0] ?? "ไม่เข้าคัดเลือก"),
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }],
                legend: {
                    show: true,
                    position: 'top',
                    fontSize: '10px',
                },
            },
        }
    }, [dashboardData, courseType])

    const selectedCount = useMemo(() => {
        if ((dashboardData && Object.keys(dashboardData)?.length === 0) || !dashboardData) return { selected: [], nonSelected: [] };
        const result = {}
        Object.keys(dashboardData.selectedCount).map(key => {
            result[key] = dashboardData.selectedCount[key]?.filter(student => student.courseType === courseType.value || courseType.value === "all")
        })
        return result
    }, [dashboardData, courseType]);

    const filteredResults = useMemo(() => {
        if (!dashboardData) return [];
        return getFilteredData(dashboardData.result, courseType.value);
    }, [dashboardData, courseType, getFilteredData]);


    const trackPopularityEachYear = useMemo(() => {
        const allTracks = Array.from(new Set(popularity.flatMap(year =>
            year.result.flatMap(type =>
                type.data.map(item => item.track || 'ไม่เข้าคัดเลือก')
            )
        )));

        const series = allTracks.map(track => ({
            name: track,
            data: popularity.map(year => {
                let count = 0;
                if (courseType.value === 'all') {
                    count = year.result.reduce((sum, type) =>
                        sum + (type.data.find(item => (item.track || 'ไม่เข้าคัดเลือก') === track)?.count || 0), 0
                    );
                } else {
                    const typeData = year.result.find(type => type.type === courseType.value);
                    if (typeData) {
                        const trackData = typeData.data.find(item => (item.track || 'ไม่เข้าคัดเลือก') === track);
                        count = trackData ? trackData.count : 0;
                    }
                }
                return count;
            })
        }));

        const categories = popularity.map(year => year.acadyear.toString());
        const option = getChartOption(series, categories, "แทร็กที่ถูกเลือกเยอะที่สุดในแต่ละปี", true);

        option.options.dataLabels.enabled = true;
        option.options.plotOptions.bar.distributed = false;
        option.options.legend = {
            position: 'top',
            horizontalAlign: 'center',
            offsetX: 40
        };
        option.options.plotOptions.bar.dataLabels.total = {
            enabled: true,
            style: {
                fontSize: '13px',
                fontWeight: 900
            }
        };
        option.options.stroke = {
            show: true,
            width: 1,
            colors: ['#fff']
        };
        option.options.tooltip = {
            shared: true,
            intersect: false
        };

        return option;
    }, [popularity, courseType]);


    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <div className='flex flex-row gap-4 my-4'>
                    <Select
                        className='w-[100%]'
                        id="acadyear"
                        value={acadyear}
                        options={acadyears}
                        onChange={(selectedOption) => setAcadyear(selectedOption)}
                        placeholder='เลือกปีการศึกษา'
                    />
                    <Button
                        onClick={() => handleSearch(acadyear.value)}
                        size="md"
                        color='primary'
                        className="rounded-[5px]"
                        isLoading={searching}
                        isDisabled={searching}
                        startContent={<SearchIcon className="w-5 h-5" />}
                    >
                        ค้นหา
                    </Button>
                </div>
                {
                    dashboardData == null ?
                        <p className='text-lg font-bold color-[#11142D] mb-4 text-center'>
                            เลือกปีการศึกษาที่ต้องการ
                        </p>
                        :
                        Object.keys(dashboardData).length === 0 ?
                            <p className='text-lg font-bold color-[#11142D] mb-4 text-center'>
                                ไม่พบข้อมูลการคัดเลือกที่ค้นหา
                            </p>
                            :
                            <section className='w-full bg-gray-100 p-6 rounded-sm h-full'>
                                <section className='grid grid-cols-5 gap-6'>
                                    <div className='col-span-5'>
                                        <label className='text-[12px] text-default-500'>ประเภทโครงการ</label>
                                        <Select
                                            className='w-full'
                                            id="acadyear"
                                            value={courseType}
                                            options={courseTypes}
                                            onChange={(selectedOption) => setCourseType(selectedOption)}
                                            placeholder='เลือกปีการศึกษา'
                                        />
                                    </div>
                                    <Card
                                        className='w-full rounded-[5px] border-1 border-gray-300 shadow-none h-fit'
                                    >
                                        <CardBody>
                                            <section className='p-2 flex flex-col gap-3'>
                                                <p className='text-xs text-default-500 text-center'>นักศึกษาเข้าคัดแทร็ก</p>
                                                <p className='flex gap-2 justify-center items-center'>
                                                    <span className='text-2xl'>{selectedCount.selected.length}</span>
                                                    <span className='text-2xl'>คน</span>
                                                </p>
                                            </section>
                                        </CardBody>
                                    </Card>
                                    <Card
                                        className='w-full rounded-[5px] border-1 border-gray-300 shadow-none h-fit'
                                    >
                                        <CardBody>
                                            <section className='p-2 flex flex-col gap-3'>
                                                <p className='text-xs text-default-500 text-center'>นักศึกษาไม่ได้เข้าคัดแทร็ก</p>
                                                <p className='flex gap-2 justify-center items-center'>
                                                    <span className='text-2xl'>{selectedCount.nonSelected.length}</span>
                                                    <span className='text-2xl'>คน</span>
                                                </p>
                                            </section>
                                        </CardBody>
                                    </Card>
                                    {filteredResults.map((rs, index) => (
                                        <Card
                                            key={index}
                                            className='w-full rounded-[5px] border-1 border-gray-300 shadow-none'
                                        >
                                            <CardBody className='p-3 flex flex-col justify-between text-center'>
                                                <p className='text-xs text-default-500'>นักศึกษาสังกัดแทร็ก {rs.track?.split(" ")[0]}</p>
                                                <p className='flex gap-2 justify-center items-center'>
                                                    <span className='text-lg'>{rs.total}</span>
                                                    <span className='text-lg'>คน</span>
                                                </p>
                                                <p className='text-xs text-default-600 flex justify-between px-6'>
                                                    <span>เกรดเฉลี่ยรวม</span>
                                                    <span>{rs.gpaAvg.toFixed(2)}</span>
                                                </p>
                                            </CardBody>
                                        </Card>
                                    ))}

                                </section>
                                <section className='w-full mt-6 grid grid-cols-5 gap-6'>
                                    <section className='col col-span-5 grid grid-cols-2 gap-6'>
                                        <Card
                                            className='col-span-1 rounded-[5px] border-1 border-gray-300 shadow-none'
                                        >
                                            <CardBody>
                                                <p className='text-center text-sm mb-7 mt-2'>แทร็กที่ถูกเลือกเยอะในปีการศึกษา {acadyear.value}</p>
                                                <BarChart
                                                    height={250}
                                                    type={"bar"}
                                                    option={popularityOption} />
                                            </CardBody>
                                        </Card>
                                        <Card
                                            className='col-span-1 rounded-[5px] border-1 border-gray-300 shadow-none'
                                        >
                                            <CardBody>
                                                <p className='text-center text-sm mb-8 mt-2'>อัตราส่วนแทร็กที่ถูกเลือกเยอะที่สุด</p>
                                                <BarChart
                                                    height={250}
                                                    type={"pie"}
                                                    option={ratioPopulation} />
                                            </CardBody>
                                        </Card>
                                    </section>
                                    <div className='bg-white col-span-5 grid grid-cols-5 rounded-[5px] border-1 border-gray-300'>
                                        <div className=' col-span-5 flex gap-4 items-end py-4 px-4'>
                                            <div className='w-full'>
                                                <label className='text-[12px] text-default-500'>เริ่มต้น</label>
                                                <Select
                                                    className='w-full'
                                                    id="acadyear"
                                                    value={startYear}
                                                    options={acadyears}
                                                    onChange={(selectedOption) => setStartYear(selectedOption)}
                                                    placeholder='เลือกปีการศึกษา'
                                                />
                                            </div>
                                            <div className='w-full'>
                                                <label className='text-[12px] text-default-500'>สิ้นสุด</label>
                                                <Select
                                                    className='w-full'
                                                    id="acadyear"
                                                    value={endYear}
                                                    options={acadyears}
                                                    onChange={(selectedOption) => setEndYear(selectedOption)}
                                                    placeholder='เลือกปีการศึกษา'
                                                />
                                            </div>
                                            <Button
                                                onClick={async () => {
                                                    await getPopularTracks(startYear.value, endYear.value)
                                                }}
                                                size="md"
                                                color='primary'
                                                className="rounded-[5px]"
                                                isLoading={searching}
                                                isDisabled={searching}
                                                startContent={<SearchIcon className="w-5 h-5" />}
                                            >
                                                ค้นหา
                                            </Button>
                                        </div>
                                        <Card
                                            className='col-span-5 shadow-none'
                                        >
                                            <CardBody>
                                                <BarChart
                                                    height={250}
                                                    type={"bar"}
                                                    option={trackPopularityEachYear} />
                                            </CardBody>
                                        </Card>
                                    </div>


                                    {/* Table */}
                                    <Card
                                        className='w-full col-span-5 rounded-[5px] border-1 border-gray-300 shadow-none'
                                    >
                                        <CardBody>
                                            <Tabs
                                                defaultActiveKey="1"
                                                items={tabsItems}
                                                aria-label="Student selection status tabs"
                                            />
                                        </CardBody>
                                    </Card>
                                </section>
                            </section>
                }
            </ContentWrap >
        </>
    )
}
