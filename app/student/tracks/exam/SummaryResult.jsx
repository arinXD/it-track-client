"use client"
import dynamic from 'next/dynamic';
import { useCallback, useMemo } from "react";
const BarChart = dynamic(() => import('@/app/components/charts/ApexBarChart'), { ssr: false });

const SummaryResult = ({ data }) => {
     const { assessmentScores, careersScores, trackSummaries, totalQuestionScore, totalCorrectAnswers, totalQuestions, recommendation } = data;
     const getChartOption = useCallback((key, title = undefined, showXaxis = true) => ({
          series: [{
               data: trackSummaries.map((ts) => ts[key]),
          }],
          options: {
               title: {
                    text: title,
                    style: {

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
                    categories: trackSummaries.map((ts) => [ts.track.split(" ")[0]]),
                    labels: {
                         show: showXaxis,
                         style: {
                              fontSize: '12px',
                              colors: ['#333'],

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

                         }
                    },
               },
          },
     }), [trackSummaries])

     const optionQ = useMemo(() => (getChartOption("questionScore", "คำถาม")), [trackSummaries])
     const optionA = useMemo(() => (getChartOption("assessmentScore", "ความชอบ")), [trackSummaries])
     const optionC = useMemo(() => (getChartOption("careerScore", "อาชีพ")), [trackSummaries])
     const optionAll = useMemo(() => {
          const defOption = getChartOption("totalScore", "ผลสรุปแบบทดสอบ", true)
          defOption.options.chart.stacked = true
          defOption.options.stroke = {
               width: 1,
               colors: ['#fff']
          }
          defOption.options.legend = {
               position: 'top',
               horizontalAlign: 'center',
               offsetX: 40
          }
          defOption.options.fill = {
               opacity: 1
          }
          defOption.options.dataLabels.enabled = true
          defOption.options.plotOptions.bar.distributed = false
          defOption.options.plotOptions.bar.dataLabels.total = {
               enabled: true,
               style: {
                    fontSize: '13px',
                    fontWeight: 900
               }
          }
          defOption.series = [
               {
                    name: "คำถาม",
                    data: [trackSummaries[0].questionScore, trackSummaries[1].questionScore, trackSummaries[2].questionScore]
               },
               {
                    name: "ความชอบ",
                    data: [trackSummaries[0].assessmentScore, trackSummaries[1].assessmentScore, trackSummaries[2].assessmentScore]
               },
               {
                    name: "อาชีพ",
                    data: [trackSummaries[0].careerScore, trackSummaries[1].careerScore, trackSummaries[2].careerScore]
               },
          ]
          delete defOption.options.colors
          return defOption
     }, [trackSummaries])

     const optionPieAll = useMemo(() => ({
          series: trackSummaries.map((ts) => ts["totalScore"]),
          options: {
               // title: {
               //      text: "อัตราส่วนคะแนนในแต่ละแทร็ก",
               //      style: {
               //           
               //      }
               // },
               chart: {
                    width: 380,
                    type: 'pie',
               },
               colors: ['#F4538A', '#FAA300', "#7EA1FF"],
               labels: trackSummaries.map((ts) => ts.track),
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
     }), [trackSummaries])

     return (
          <section className="">
               <section className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <header className="bg-blue-600 text-white p-6">
                         <h1 className="text-3xl font-bold">สรุปผลแบบทดสอบกลุ่มความเชี่ยวชาญ</h1>
                    </header>
                    <section className="p-6 w-full">
                         <section className="p-6 bg-blue-50 gap-6 grid grid-cols-3">
                              <section className="bg-white p-4 rounded-lg shadow">
                                   <h2 className="text-base font-semibold text-blue-800 mb-2">คำถาม</h2>
                                   <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-white p-3 rounded border">
                                             <p className="text-xs text-gray-600 mb-1">ตอบถูกทั้งหมด</p>
                                             <p className="text-sm font-bold">{totalCorrectAnswers} / {totalQuestions} ข้อ</p>
                                        </div>
                                        <div className="bg-white p-3 rounded border">
                                             <p className="text-xs text-gray-600 mb-1">คะแนนทั้งหมด</p>
                                             <p className="text-sm font-bold">{totalQuestionScore} / {totalQuestions * 10} คะแนน</p>
                                        </div>
                                   </div>
                              </section>

                              <section className="bg-white p-4 rounded-lg shadow">
                                   <h2 className="text-base font-semibold text-blue-800 mb-2">ความชอบ</h2>
                                   <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-white p-3 rounded border">
                                             <p className="text-xs text-gray-600 mb-1">คำถามทั้งหมด</p>
                                             <p className="text-sm font-bold">{assessmentScores?.length} ข้อ</p>
                                        </div>
                                        <div className="bg-white p-3 rounded border">
                                             <p className="text-xs text-gray-600 mb-1">คะแนนทั้งหมด</p>
                                             <p className="text-sm font-bold">
                                                  {assessmentScores.reduce((total, ass) => {
                                                       return total + ass.score;
                                                  }, 0)} คะแนน</p>
                                        </div>
                                   </div>
                              </section>
                              <section className="bg-white p-4 rounded-lg shadow">
                                   <h2 className="text-base font-semibold text-blue-800 mb-2">อาชีพ</h2>
                                   <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-white p-3 rounded border">
                                             <p className="text-xs text-gray-600 mb-1">อาชีพทั้งหมด</p>
                                             <p className="text-sm font-bold">{careersScores?.length} อาชีพ</p>
                                        </div>
                                        <div className="bg-white p-3 rounded border">
                                             <p className="text-xs text-gray-600 mb-1">คะแนนทั้งหมด</p>
                                             <p className="text-sm font-bold">
                                                  {careersScores.reduce((total, ass) => {
                                                       return total + ass.score;
                                                  }, 0)} คะแนน</p>
                                        </div>
                                   </div>
                              </section>
                         </section>
                    </section>
                    <div className="p-6 pt-0 space-y-8">
                         <section className='bg-gray-100 p-6'>
                              <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">สรุปผลแทร็ก</h2>
                              <div className="gap-4 grid grid-cols-3">
                                   {trackSummaries.map((ts) => (
                                        <div key={ts.track} className="bg-white p-6 rounded-lg border">
                                             <h3 className="text-base font-semibold text-blue-600 mb-3">{ts.track}</h3>
                                             <div className="grid grid-cols-1 gap-2">
                                                  <div className="flex justify-between items-end">
                                                       <p className="text-sm text-gray-600">คะแนนรวม</p>
                                                       <p className="text-sm font-bold">{ts.totalScore} คะแนน</p>
                                                  </div>
                                                  <div className="flex justify-between items-end">
                                                       <p className="text-sm text-gray-600">แบบทดสอบ</p>
                                                       <p className="text-sm font-bold">{ts.questionScore} คะแนน</p>
                                                  </div>
                                                  <div className="flex justify-between items-end">
                                                       <p className="text-sm text-gray-600">แบบประเมิน</p>
                                                       <p className="text-sm font-bold">{ts.assessmentScore} คะแนน</p>
                                                  </div>
                                                  <div className="flex justify-between items-end">
                                                       <p className="text-sm text-gray-600">ความชอบ</p>
                                                       <p className="text-sm font-bold">{ts.careerScore} คะแนน</p>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                              <div className="gap-4 grid grid-cols-3 mt-4">
                                   <div className='bg-white border rounded p-2'>
                                        <BarChart height={250} type={"bar"} option={optionQ} />
                                   </div>
                                   <div className='bg-white border rounded p-2'>
                                        <BarChart height={250} type={"bar"} option={optionA} />
                                   </div>
                                   <div className='bg-white border rounded p-2'>
                                        <BarChart height={250} type={"bar"} option={optionC} />
                                   </div>
                              </div>
                              <div className='flex gap-4 mt-4'>
                                   <div className='w-[50%] bg-white border rounded p-2'>
                                        <BarChart height={280} type={"bar"} option={optionAll} />
                                   </div>
                                   <div className='w-[50%] bg-white border rounded p-2'>
                                        <p className='text-sm mb-[23.5px] ms-2 mt-0.5 font-bold'> อัตราส่วนคะแนนในแต่ละแทร็ก  </p>
                                        <BarChart height={280} type={"pie"} option={optionPieAll} />
                                   </div>
                              </div>
                         </section>

                         <section className="bg-yellow-50 p-6 rounded-lg">
                              <h2 className="text-2xl font-semibold text-yellow-800 mb-4">คำแนะนำ</h2>
                              <ul className="text-gray-800 flex flex-col gap-4">
                                   {
                                        recommendation.map((rec, recKey) => (
                                             <li key={recKey} className='flex gap-4'>
                                                  <p className='w-[15px]'>{`${recKey + 1})`}</p>
                                                  <p className='flex flex-col'>
                                                       <span>{rec.recText}</span>
                                                       <span>{rec.descText}</span>
                                                  </p>
                                             </li>
                                        ))
                                   }
                              </ul>
                         </section>
                    </div>
               </section>
          </section>
     );
};

export default SummaryResult