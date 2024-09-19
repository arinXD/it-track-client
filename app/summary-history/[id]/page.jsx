
"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Steps, message } from 'antd';
import "../../student/tracks/exam/stepperStyle.css"
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import localFont from 'next/font/local'
import { Spinner } from "@nextui-org/react";
import SummarizeQuestions from "@/app/student/tracks/exam/SummarizeQuestions";
import SummarizeAssessments from "@/app/student/tracks/exam/SummarizeAssessments";
import SummarizeCareer from "@/app/student/tracks/exam/SummarizeCareers";
import SummaryResult from "@/app/student/tracks/exam/SummaryResult";

const Page = ({ params }) => {
     const { id } = params
     const [fetching, setFetching] = useState(true);
     const [current, setCurrent] = useState(0)
     const [summarizeData, setsummarizeData] = useState({});

     const steps = useMemo(() => ([
          {
               title: 'ผลสรุปแบบทดสอบ',
          },
          {
               title: 'ผลสรุปแบบประเมิน',
          },
          {
               title: 'ผลสรุปความชอบ',
          },
          {
               title: 'คำแนะนำ',
          },
     ]), [])

     const items = useMemo(() => steps.map((item) => ({
          key: item.title,
          title: item.title,
          description: item.description,
     })), [])

     const next = useCallback(() => {
          setCurrent(prev => prev + 1)
     }, [])

     const prev = useCallback(() => {
          setCurrent(prev => prev - 1)
     }, [])

     const getData = useCallback(async (id) => {
          setFetching(true)
          try {
               const option = await getOptions(`/api/suggestion-forms/history/detail/${id}`, "get")
               const data = (await axios(option)).data.data
               setsummarizeData(data)
          } catch (error) {
               setsummarizeData([])
          } finally {
               setFetching(false)
          }
     }, [])

     useEffect(() => {
          getData(id)
     }, [])

     useEffect(() => {
          window.scrollTo(0, 0)
     }, [current])

     return (
          <section className={`px-12 py-12 bg-[#F9F9F9]`}>
               <section className="min-h-screen p-8 max-w-4xl mx-auto bg-white shadow-sm rounded-[5px] border-1 border-gray-200">
                    <Steps
                         className="mb-8"
                         current={current}
                         onChange={setCurrent}
                         items={items} />
                    <section>
                         {
                              fetching ?
                                   <dix className="flex justify-center items-center my-4"><Spinner /></dix>
                                   :
                                   <>
                                        <section className={`w-full ${current === 0 ? "block" : "hidden"}`}>
                                             <SummarizeQuestions
                                                  next={next}
                                                  data={summarizeData}
                                             />
                                        </section>
                                        <section className={`w-full ${current === 1 ? "block" : "hidden"}`}>
                                             <SummarizeAssessments
                                                  next={next}
                                                  prev={prev}
                                                  data={summarizeData}
                                             />
                                        </section>
                                        <section className={`w-full ${current === 2 ? "block" : "hidden"}`}>
                                             <SummarizeCareer
                                                  next={next}
                                                  prev={prev}
                                                  data={summarizeData}
                                             />
                                        </section>
                                        <section className={`w-full ${current === 3 ? "block" : "hidden"}`}>
                                             <SummaryResult
                                                  data={summarizeData}
                                             />
                                        </section>
                                   </>
                         }
                    </section>
               </section>
          </section>
     )
}

export default Page