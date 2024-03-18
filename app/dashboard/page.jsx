"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '../components';
import PieChart from './PieChart';
import { getAcadyears } from '@/src/util/academicYear';
import Select from 'react-select';
import { SearchIcon } from '../components/icons';
import { Button } from '@nextui-org/react';
import ReatChart from './ReatChart';
import { fetchDataObj } from '../admin/action';

export default function Page() {

    async function getGpaOption(selections) {
        if (!selections.length) return {}
        const all = {
            "BIT": {
                gpa: 0,
                c: 0
            },
            "Network": {
                gpa: 0,
                c: 0
            },
            "Web and Mobile": {
                gpa: 0,
                c: 0
            },
        }
        for (const select of selections) {
            const result = select.result
            if (!result) continue
            all[result].gpa += select.gpa
            all[result].c += 1
        }
        const gpa = {
            "BIT": parseFloat(all.BIT.gpa / all.BIT.c || 1).toFixed(2),
            "Network": parseFloat(all.Network.gpa / all.Network.c || 1).toFixed(2),
            "Web and Mobile": parseFloat(all["Web and Mobile"].gpa / all["Web and Mobile"].c || 1).toFixed(2)
        }
        setAllGpa(gpa)
        const option = {
            series: [{
                data: Object.values(gpa)
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                    events: {
                        click: function (chart, w, e) {
                            // console.log(chart, w, e)
                        }
                    }
                },
                // colors: colors,
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    categories: [
                        ['BIT'],
                        ['Network'],
                        ['Web and Mobile'],
                    ],
                    labels: {
                        style: {
                            fontSize: '12px'
                        }
                    }
                }
            },
        }
        setGpaOptionBar(option)
    }

    async function getTrackSelect(acadyear = null) {
        let ts
        if (acadyear == null) {
            ts = await fetchDataObj("/api/tracks/selects/get/last")
        } else {
            ts = await fetchDataObj(`/api/tracks/selects/${acadyear}/students`)
        }
        setTrackSelect(ts)
        if (ts?.Selections && Object.keys(ts.Selections).length) {
            getGpaOption(ts?.Selections || [])
            const sumOfTrack = getSumOfTrack(ts?.Selections || [])
            setSumTrackOption({
                series: Object?.values(sumOfTrack),
                options: {
                    chart: {
                        type: 'donut',
                    },
                    labels: Object?.keys(sumOfTrack),
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
                    }]
                }
            })
        }
    }
    function getSumOfTrack(selections, field = "result") {
        if (!selections.length) {
            return
        }

        const sumOfTracks = { "BIT": 0, "Network": 0, "Web and Mobile": 0 }

        for (const select of selections) {
            const result = select[field]
            if (!result) continue
            if (Object.keys(sumOfTracks).includes(result)) {
                sumOfTracks[result] += 1
            }
        }
        return sumOfTracks

    }

    async function getPopularTracks() {
        const popular = await fetchDataObj(`/api/tracks/selects/${acadyear.value}/popular`);
        for (const entry of popular) {
            entry.Selections = getSumOfTrack(entry.Selections, "track_order_1");
        }
        if (popular?.length) {
            const totalPop = [];
            if(!popular[0]?.Selections) return
            Object.keys(popular[0].Selections).forEach(category => {
                let categoryData = {
                    name: category,
                    data: []
                };

                popular.forEach(yearData => {
                    if (yearData.Selections && yearData.Selections[category]) {
                        categoryData.data.push(yearData.Selections[category]);
                    } else {
                        categoryData.data.push(0);
                    }
                });

                totalPop.push(categoryData);
            });
            const totalOption = {
                chart: {
                    type: 'bar',
                    toolbar: {
                        show: false,
                    },
                },
                colors: ['#008FFB', '#00E396', '#FEAF1A'],
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: false,
                        columnWidth: '55%',
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                grid: {
                    show: false,
                },
                stroke: {
                    colors: ['transparent'],
                    width: 4,
                },
                xaxis: {
                    categories: popular.map(pop => pop.acadyear),
                },
                yaxis: {
                    title: {
                        text: 'จำนวน (คน)',
                    },
                },
                fill: {
                    opacity: 1,
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                },
                tooltip: {
                    y: {
                        formatter(val) {
                            return `${val} คน`;
                        },
                    },
                },
            }
            setTotalPopular(totalPop)
            setTotalPopularOptions(totalOption)
        }

    }

    useEffect(() => {
        setSearching(true)
        getTrackSelect()
        getPopularTracks()
        setSearching(false)
    }, [])

    const [searching, setSearching] = useState(false)
    const acadyears = getAcadyears().map(acadyear => ({
        value: acadyear,
        label: acadyear
    }));
    const [acadyear, setAcadyear] = useState(acadyears[0])
    const [trackSelect, setTrackSelect] = useState({})
    const [gpaAll, setGpaAll] = useState({})

    const [sumTrackOption, setSumTrackOption] = useState({
        series: [1, 1, 1],
        options: {
            chart: {
                type: 'donut',
            },
            labels: ["1", "2", "3"],
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
            }]
        }
    });

    const [totalPopular, setTotalPopular] = useState([
        {
            name: '',
            data: [0, 0, 0, 0, 0],
        },
        {
            name: '',
            data: [0, 0, 0, 0, 0],
        },
        {
            name: '',
            data: [0, 0, 0, 0, 0],
        },
    ])
    const [totalPopularOptions, setTotalPopularOptions] = useState({
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        colors: ['#475BE8', '#CFC8FF', '#CFC8FE'],
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '55%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: false,
        },
        stroke: {
            colors: ['transparent'],
            width: 4,
        },
        xaxis: {
            categories: ['1', '2', '3', '4', '5'],
        },
        yaxis: {
            title: {
                text: 'จำนวน (คน)',
            },
        },
        fill: {
            opacity: 1,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        tooltip: {
            y: {
                formatter(val) {
                    return `${val} คน`;
                },
            },
        },
    })

    async function handleSearch() {
        getTrackSelect(acadyear.value)
        getPopularTracks()
    }
    const [allGpa, setAllGpa] = useState({})
    const [gpaOptionBar, setGpaOptionBar] = useState({
        series: [{
            data: [0, 0, 0,]
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                        // console.log(chart, w, e)
                    }
                }
            },
            // colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: [
                    ['BIT'],
                    ['Network'],
                    ['Web'],
                ],
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            }
        },
    })

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
                        isClearable
                    />
                    <Button
                        onClick={handleSearch}
                        radius="sm"
                        size="md"
                        variant="solid"
                        className="bg-gray-200"
                        isLoading={searching}
                        isDisabled={searching}
                        startContent={<SearchIcon />}
                    >
                        ค้นหา
                    </Button>
                </div>
                {
                    !trackSelect?.Selections?.length ?
                        <p className='text-lg font-bold color-[#11142D] mb-4 text-center'>
                            ไม่มีข้อมูลการคัดเลือกแทรคของปีการศึกษา {acadyear.value}
                        </p>
                        :
                        <>
                            <div className='mt-[30px]'>
                                <p className='text-lg mt-4 font-bold color-[#11142D] mb-4'>
                                    ตัวชี้วัดแสดงผลรวมการคัดเลือกแทรคประจำปีการศึกษา {acadyear.value}
                                </p>
                            </div>

                            {/* <div className='my-[30px] flex flex-wrap gap-4'>
                                <PieChart
                                    title={"Property for BIS"}
                                    value={64}
                                    series={[64, 25]}
                                    colors={['#475be8', '#e4e8ef']} />
                                <PieChart
                                    title={"Property for WEB"}
                                    value={52}
                                    series={[60, 40]}
                                    colors={['#475ae8', '#e4b8ef']} />
                                <PieChart
                                    title={"Property for Network"}
                                    value={56}
                                    series={[75, 25]}
                                    colors={['#275be8', '#c4e8ef']} />
                                <PieChart
                                    title={"Total Student"}
                                    value={172}
                                    series={[75, 25]}
                                    colors={['#475be8', '#e4e8ef']} />
                            </div> */}

                            <div className="w-full gap-4 grid place-items-center grid-cols-12 grid-rows-1">
                                <div className="flex gap-3 flex-col items-center p-4 group w-full h-full col-span-12 sm:col-span-4 bg-[#fcfcfc] rounded-lg border-1 border-[#e5e5e5]">
                                    <div className='w-full text-start'>
                                        <p className='text-lg font-semi-bold text-[#11142d]'>
                                            นักศึกษาปีการศึกษา {acadyear.value} ภายในกลุ่มความเชี่ยวชาญ
                                        </p>
                                        <p className='text-lg font-semi-bold text-[#11142d]'>
                                            {trackSelect?.Selections?.length} คน
                                        </p>
                                    </div>
                                    <ReatChart
                                        className={"w-full"}
                                        options={sumTrackOption.options}
                                        series={sumTrackOption.series}
                                        type="donut" />
                                </div>
                                <div className="flex gap-3 flex-col items-center p-4 group w-full h-full col-span-12 sm:col-span-4 bg-[#fcfcfc] rounded-lg border-1 border-[#e5e5e5]">
                                    <div className='w-full text-start'>
                                        <p className='text-lg font-semi-bold text-[#11142d]'>
                                            เกรดเฉลี่ยรวมของนักศึกษาภายในแทรค ปีการศึกษา {acadyear.value}
                                        </p>
                                    </div>
                                    <ReatChart
                                        className={"w-full"}
                                        options={gpaOptionBar.options}
                                        series={gpaOptionBar.series}
                                        type="bar"
                                        height={320}
                                    />
                                </div>
                                <div className="flex gap-3 flex-col items-start p-4 group w-full h-full col-span-12 sm:col-span-4 bg-[#fcfcfc] rounded-lg border-1 border-[#e5e5e5]">
                                    <div className='p-4 border-1 rounded-lg bg-white'>BIT {allGpa["BIT"]}</div>
                                    <div className='p-4 border-1 rounded-lg bg-white'>Network {allGpa["Network"]}</div>
                                    <div className='p-4 border-1 rounded-lg bg-white'>Web {allGpa["Web and Mobile"]}</div>
                                </div>
                            </div>

                            <div className="w-full my-4 gap-4 grid place-items-center grid-cols-12 grid-rows-1">
                                <div className='w-full col-span-12'>
                                    <div className='w-full p-4 flex-1 bg-[#fcfcfc] flex flex-col rounded-lg border-1 border-[#e5e5e5]'>
                                        <p className='text-lg font-semi-bold text-[#11142d]'>
                                            แทรคที่ถูกเลือกในแต่ละปี (5 ปีย้อนหลัง)
                                        </p>

                                        <ReatChart
                                            series={totalPopular}
                                            type="bar"
                                            height={310}
                                            options={totalPopularOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </ContentWrap>
        </>
    )
}
