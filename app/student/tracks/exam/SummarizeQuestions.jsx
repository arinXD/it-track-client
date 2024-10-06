"use client"
import { useMemo } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md'
import dynamic from 'next/dynamic';
const BarChart = dynamic(() => import('@/app/components/charts/ApexBarChart'), { ssr: false });

const SummarizeQuestions = ({ next, data }) => {
    const { questionScores, totalQuestionScore, totalCorrectAnswers, totalQuestions, overallCorrectPercentage, trackSummaries } = data;
    const option = useMemo(() => ({
        series: [{
            data: trackSummaries.map((ts) => ts.questionScore),
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
            <section className='bg-gray-100 min-h-screen lg:p-8 rounded-sm'>
                <section className='max-w-4xl mx-auto bg-white md:shadow-lg rounded-lg overflow-hidden'>
                    <header className="bg-blue-600 text-white p-6">
                        <h1 className="text-2xl md:text-3xl font-bold">ผลสรุปการตอบคำถาม</h1>
                    </header>
                    <div className="p-2 space-y-4 md:p-6 md:space-y-6">
                        <section className="bg-blue-50 p-4 rounded-lg">
                            <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-4">การตอบคำถาม</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded shadow">
                                    <p className="text-xs text-gray-600 mb-1">คำถามทั้งหมด</p>
                                    <p className="text-lg md:text-xl font-bold">{totalQuestions} ข้อ</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow">
                                    <p className="text-xs text-gray-600 mb-1">ตอบถูกทั้งหมด</p>
                                    <p className="text-lg md:text-xl font-bold">{totalCorrectAnswers} / {totalQuestions} ข้อ</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow">
                                    <p className="text-xs text-gray-600 mb-1">คะแนนทั้งหมด</p>
                                    <p className="text-lg md:text-xl font-bold">{totalQuestionScore} / {totalQuestions * 10} คะแนน</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow">
                                    <p className="text-xs text-gray-600 mb-1">ความถูกต้อง</p>
                                    <p className="text-lg md:text-xl font-bold">{overallCorrectPercentage} %</p>
                                </div>
                            </div>
                        </section>

                        <section className='p-4 md:p-6 bg-blue-50 rounded-lg'>
                            <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-4">คำถามทั้งหมด</h2>
                            <div className="bg-white shadow overflow-auto rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คำถาม</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {questionScores.map((qs, index) => (
                                            <tr key={`q_tr_${qs.index}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{qs.question}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">{qs.score}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${qs.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {qs.isCorrect ? 'ถูก' : 'ผิด'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className='flex flex-col gap-4 md:gap-6 p-4 md:p-6 bg-blue-50 rounded-lg'>
                            <section>
                                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-6">สรุปผลคะแนนในแต่ละแทร็ก</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {trackSummaries.map((ts) => (
                                        <div key={ts.track} className="bg-white p-4 rounded shadow">
                                            <h3 className="text-lg font-semibold text-blue-600 mb-3">{ts.track}</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-600">คะแนนทั้งหมด</p>
                                                    <p className="text-sm font-bold">{ts.questionScore} คะแนน</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600">ตอบถูกทั้งหมด</p>
                                                    <p className="text-sm font-bold">{ts.correctAnswers} / {ts.totalQuestions} ข้อ</p>
                                                </div>
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
            <div
                className="w-full flex justify-end p-4 md:p-0 md:mt-8">
                <div
                    onClick={next}
                    className="cursor-pointer flex flex-row items-center gap-2 md:gap-4 opacity-60 hover:opacity-100 transition-all rounded-none pb-4 md:p-0"
                >
                    <div className="flex flex-col">
                        <span className="text-xs md:text-sm text-default-400">Step 2</span>
                        <span className="text-xs md:text-base">ผลสรุปความชอบ</span>
                    </div>
                    <MdKeyboardArrowRight className="w-5 h-5" />
                </div>
            </div>
        </section>
    )
}

export default SummarizeQuestions