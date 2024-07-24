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
import { Tabs } from 'antd';
const BarChart = dynamic(() => import('@/app/components/charts/ApexBarChart'), { ssr: false });
import localFont from 'next/font/local'
import StudentTable from './StudentTable';
const prompt = localFont({ src: '../../../public/fonts/Prompt-Regular.woff2' })

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

    const getDashboardData = useCallback(async (acadyear) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchDataObj(`/api/tracks/selects/${acadyear}/students/dashboard`);
            setDashboardData(data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);


    const getPopularTracks = useCallback(async (acadyear) => {
        const data = await fetchDataObj(`/api/tracks/selects/${acadyear}/popular`);
        setPopularity(data)
    }, [])

    const handleSearch = useCallback((acadyear) => {
        getDashboardData(acadyear)
        getPopularTracks(acadyear)
    }, [])

    const getChartOption = useCallback((series, categories, title = undefined, showXaxis = true) => ({
        series,
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
            colors: ['#F4538A', '#FAA300', "#7EA1FF"],
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

    const studentTableItems = useMemo(() => (items) => {
        if (isLoading) return <Spin />;
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

    const tabsItems = useMemo(() => ([
        {
            key: '1',
            label: 'นักศึกษาเข้าคัดแทร็ก',
            children: studentTableItems(dashboardData?.selectedCount?.selected),
        },
        {
            key: '2',
            label: 'นักศึกษาไม่ได้เข้าคัดแทร็ก',
            children: studentTableItems(dashboardData?.selectedCount?.nonSelected),
        },
    ]), [dashboardData])

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
                        isSearchable
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
                            <section className='w-full bg-gray-100 p-6 rounded-sm'>
                                <section className='grid grid-cols-5 gap-6'>
                                    <Card
                                        className='w-full rounded-[5px] border-1 border-gray-300 shadow-none h-fit'
                                    >
                                        <CardBody>
                                            <section className='p-2 flex flex-col gap-3'>
                                                <p className='text-xs text-default-500 text-center'>นักศึกษาเข้าคัดแทร็ก</p>
                                                <p className='flex gap-4 justify-center items-center'>
                                                    <span className='text-2xl'>{dashboardData.selectedCount.selected.length}</span>
                                                    <span className='text-sm'>คน</span>
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
                                                <p className='flex gap-4 justify-center items-center'>
                                                    <span className='text-2xl'>{dashboardData.selectedCount.nonSelected.length}</span>
                                                    <span className='text-sm'>คน</span>
                                                </p>
                                            </section>
                                        </CardBody>
                                    </Card>
                                    {
                                        dashboardData.result.map(rs => (
                                            <Card
                                                className='w-full rounded-[5px] border-1 border-gray-300 shadow-none'
                                            >
                                                <CardBody>
                                                    <section className='p-2 flex flex-col gap-3'>
                                                        <p className='text-xs text-default-500 text-center'>นักศึกษาแทร็ก {rs.track?.split(" ")[0]}</p>
                                                        <p className='flex gap-4 justify-center items-center'>
                                                            <span className='text-2xl'>{rs.total}</span>
                                                            <span className='text-sm'>คน</span>
                                                        </p>
                                                    </section>
                                                </CardBody>
                                            </Card>
                                        ))
                                    }
                                </section>
                                <section className='w-full mt-6 grid grid-cols-5 h-[300px] '>
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
                                {/* <div className="gap-4 grid grid-cols-3 mt-4">
                                    <div className='bg-white border rounded p-2'>
                                        <BarChart height={250} type={"bar"} option={optionQ} />
                                    </div>
                                    <div className='bg-white border rounded p-2'>
                                        <BarChart height={250} type={"bar"} option={optionA} />
                                    </div>
                                    <div className='bg-white border rounded p-2'>
                                        <BarChart height={250} type={"bar"} option={optionC} />
                                    </div>
                                </div> */}
                            </section>
                }
            </ContentWrap>
        </>
    )
}
