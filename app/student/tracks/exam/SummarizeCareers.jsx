"use client"
import { useMemo } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import dynamic from 'next/dynamic';
const BarChart = dynamic(() => import('@/app/components/charts/ApexBarChart'), { ssr: false });

const SummarizeCareer = ({ next, prev, data }) => {
    const { careersScores, trackSummaries } = data;
    const option = useMemo(() => ({
        series: [{
            data: trackSummaries.map((ts) => ts.careerScore),
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                    }
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
                categories: trackSummaries.map((ts) => [ts.track]),
                labels: {
                    style: {
                        fontSize: '12px',
                        colors: ['#333'],
                        
                    },
                },
                title: {
                    text: 'แทร็ก',
                    style: {
                        paddingTop: "10px",
                        fontSize: '10px',
                        colors: ['#333'],
                        
                    }
                },
            },
            yaxis: {
                title: {
                    text: 'คะแนน',
                    style: {
                        paddingTop: "10px",
                        fontSize: '10px',
                        colors: ['#333'],
                        
                    }
                },
            },
        },
    }), [trackSummaries])
    return (
        <section>
            <section className='bg-gray-100 min-h-screen p-8 rounded-sm'>
                <section className='max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
                    <header className="bg-blue-600 text-white p-6">
                        <h1 className="text-3xl font-bold">ผลสรุปความชอบ</h1>
                    </header>
                    <div className="p-6 space-y-6">
                        <section className='p-6 bg-blue-50 rounded-lg '>
                            <h2 className="text-2xl font-semibold text-blue-800 mb-4">อาชีพทั้งหมด {careersScores?.length} อาชีพ</h2>
                            <div className="bg-white shadow overflow-auto rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่ออาชีพ (TH)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่ออาชีพ (EN)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">แทร็ก</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {careersScores.map((qs, index) => (
                                            <tr key={`career_sm_index_${index}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{qs.name_th}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{qs.name_en}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{qs.track}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className='flex flex-col gap-6 p-6 bg-blue-50 rounded-lg'>
                            <section>
                                <h2 className="text-2xl font-semibold text-blue-800 mb-6">สรุปผลคะแนนในแต่ละแทร็ก (อาชีพละ 5 คะแนน)</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {trackSummaries.map((ts) => (
                                        <div key={ts.track} className="bg-white p-4 rounded shadow">
                                            <h3 className="text-lg font-semibold text-blue-600 mb-3">{ts.track}</h3>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-gray-600">คะแนนทั้งหมด</p>
                                                <p className="text-sm font-bold">{ts.careerScore} คะแนน</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <section className='bg-white rounded p-4'>
                                <BarChart type={"bar"} option={option} />
                            </section>
                        </section>

                    </div>
                </section>
            </section>
            <div className="w-full flex justify-between">
                <div
                    onClick={prev}
                    className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                >
                    <MdKeyboardArrowLeft className="w-5 h-5" />
                    <div className="flex flex-col">
                        <span className="text-sm text-default-400">Step 2</span>
                        <span className="text-base">ผลสรุปแบบประเมิน</span>
                    </div>
                </div>
                <div
                    onClick={next}
                    className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                >
                    <div className="flex flex-col">
                        <span className="text-sm text-default-400">Final</span>
                        <span className="text-base">คำแนะนำ</span>
                    </div>
                    <MdKeyboardArrowRight className="w-5 h-5" />
                </div>
            </div>
        </section>
    )
}

export default SummarizeCareer