"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Steps, message } from 'antd';
import "./stepperStyle.css"
import Questions from "./Questions";
import Assessments from "./Assessments";
import Careers from "./Careers";
import Summarize from "./Summarize";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import SummaryResult from "./SummaryResult";
import { Button } from "@nextui-org/react";
import SummarizeQuestions from "./SummarizeQuestions";
import SummarizeAssessments from "./SummarizeAssessments";
import SummarizeCareers from "./SummarizeCareers";
import localFont from 'next/font/local'
const prompt = localFont({ src: '../../../../public/fonts/Prompt-Regular.woff2' })

const SuggestionForm = ({ form }) => {
    const allQuestions = form?.Questions
    const allAssessments = form?.Assessments
    const allCareers = form?.Careers
    const [questions, setQuestions] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [careers, setCareers] = useState([]);
    const [current, setCurrent] = useState(0)
    const [summarizing, setSummarizing] = useState(false);
    const [summarizeData, setsummarizeData] = useState({
        "questionScores": [
            {
                "qId": 3,
                "question": "คำถาม Web 3",
                "track": "Web and Mobile",
                "score": 0,
                "isCorrect": false
            },
            {
                "qId": 2,
                "question": "คำถาม Network 1",
                "track": "Network",
                "score": 0,
                "isCorrect": false
            },
            {
                "qId": 1,
                "question": "คำถาม BITs 1",
                "track": "BIT",
                "score": 0,
                "isCorrect": false
            }
        ],
        "assessmentScores": [
            {
                "assId": 1,
                "question": "Bit assesstion",
                "track": "BIT",
                "score": 4
            },
            {
                "assId": 3,
                "question": "Web assesstion",
                "track": "Web and Mobile",
                "score": 4
            },
            {
                "assId": 2,
                "question": "Network assesstion",
                "track": "Network",
                "score": 4
            }
        ],
        "trackSummaries": [
            {
                "track": "BIT",
                "questionScore": 10,
                "assessmentScore": 4,
                "careerScore": 5,
                "totalScore": 9,
                "correctAnswers": 0,
                "totalQuestions": 1,
                "correctPercentage": "0.00%",
                "summary": "คะแนนคำถาม 0 คะแนน, คะแนนแบบประเมิน 4 คะแนน, คะแนนความชอบ 5 คะแนน, ตอบคำถามถูก 0 จาก 1 ข้อ (0.00%)."
            },
            {
                "track": "Network",
                "questionScore": 20,
                "assessmentScore": 4,
                "careerScore": 0,
                "totalScore": 4,
                "correctAnswers": 0,
                "totalQuestions": 1,
                "correctPercentage": "0.00%",
                "summary": "คะแนนคำถาม 0 คะแนน, คะแนนแบบประเมิน 4 คะแนน, คะแนนความชอบ 0 คะแนน, ตอบคำถามถูก 0 จาก 1 ข้อ (0.00%)."
            },
            {
                "track": "Web and Mobile",
                "questionScore": 30,
                "assessmentScore": 4,
                "careerScore": 0,
                "totalScore": 4,
                "correctAnswers": 0,
                "totalQuestions": 1,
                "correctPercentage": "0.00%",
                "summary": "คะแนนคำถาม 0 คะแนน, คะแนนแบบประเมิน 4 คะแนน, คะแนนความชอบ 0 คะแนน, ตอบคำถามถูก 0 จาก 1 ข้อ (0.00%)."
            }
        ],
        "totalQuestionScore": 0,
        "totalCorrectAnswers": 0,
        "totalQuestions": 3,
        "overallCorrectPercentage": "0.00%",
        "recommendation": [
            "1) คุณเหมาะสมมากกับแทร็ก BIT คะแนนรวมของคุณคือ 9 คะแนน, คุณตอบคำถามถูก 0.00% จากคำถามทั้งหมดภายในแทร็ก",
            "2) คุณค่อนข้างเหมาะสมกับแทร็ก Network คะแนนรวมของคุณคือ 4 คะแนน, คุณตอบคำถามถูก 0.00% จากคำถามทั้งหมดภายในแทร็ก",
            "3) คุณทำได้ดีกับแทร็ก Web and Mobile คะแนนรวมของคุณคือ 4 คะแนน, คุณตอบคำถามถูก 0.00% จากคำถามทั้งหมดภายในแทร็ก"
        ]
    },);
    const steps = useMemo(() => ([
        {
            title: Object.keys(summarizeData).length === 0 ? 'แบบทดสอบ' : 'ผลสรุปแบบทดสอบ',
        },
        {
            title: Object.keys(summarizeData).length === 0 ? 'แบบประเมิน' : 'ผลสรุปแบบประเมิน',
        },
        {
            title: Object.keys(summarizeData).length === 0 ? 'ความชอบ' : 'ผลสรุปความชอบ',
        },
        {
            title: Object.keys(summarizeData).length === 0 ? 'สรุปผล' : 'คำแนะนำ',
        },
    ]), [Object.keys(summarizeData).length])

    const summarize = useMemo(() => ({
        questions: questions?.filter(q => q.aId).length === questions?.length,
        assessments: assessments?.filter(q => q.index !== null).length === assessments?.length,
        careers: careers?.length > 0,
    }), [questions, assessments, careers,])

    const next = useCallback(() => {
        setCurrent(prev => prev + 1)
    }, [])
    const prev = useCallback(() => {
        setCurrent(prev => prev - 1)
    }, [])

    const initForm = useCallback(() => {
        const allQuestions = form?.Questions?.map(q => ({
            qId: q.id,
            aId: null
        }))
        const allAssessments = form?.Assessments?.map(ass => ({
            assId: ass.id,
            index: null
        }))
        setQuestions(allQuestions)
        setAssessments(allAssessments)
    }, [form])

    useEffect(() => {
        if (form && questions?.length == 0 && assessments?.length == 0) {
            initForm()
        }
    }, [form])

    const items = useMemo(() => steps.map((item) => ({
        key: item.title,
        title: item.title,
        description: item.description,
    })), [])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        const formData = {
            questions,
            assessments,
            careers,
        }
        const option = await getOptions("/api/suggestion-forms/summarize", "post", formData)
        try {
            setSummarizing(true)
            const res = await axios(option)
            const data = res.data.data
            setsummarizeData(data)
            setCurrent(0)
        } catch (error) {
            setsummarizeData({})
        } finally {
            setSummarizing(false)
            window.scrollTo(0, 750)
        }
    }, [questions, assessments, careers])

    const resetForm = useCallback(() => {
        initForm()
        setCareers([])
        setCurrent(0)
        setsummarizeData({})
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (current) window.scrollTo(0, 750)
    }, [current])

    return (
        <div className={` px-12 pb-12 bg-[#F9F9F9]`}>
            {
                Object.keys(form).length === 0 ?
                    <section className='text-center font-bold text-lg py-28'>
                        Coming soon!
                    </section>
                    :
                    <section className="min-h-screen p-8 max-w-4xl mx-auto bg-white shadow-sm rounded-[5px] border-1 border-gray-200">
                        <Steps
                            className="mb-8"
                            current={current}
                            onChange={setCurrent}
                            items={items} />
                        {
                            Object.keys(summarizeData).length === 0
                                ?
                                <>
                                    <form
                                        className=""
                                        onSubmit={handleSubmit}>
                                        <section className="w-full">
                                            <section className={`w-full ${current === 0 ? "block" : "hidden"}`}>
                                                <Questions
                                                    next={next}
                                                    questions={questions}
                                                    allQuestions={allQuestions}
                                                    setQuestions={setQuestions}
                                                />
                                            </section>
                                            <section className={`w-full ${current === 1 ? "block" : "hidden"}`}>
                                                <Assessments
                                                    next={next}
                                                    prev={prev}
                                                    assessments={assessments}
                                                    allAssessments={allAssessments}
                                                    setAssessments={setAssessments}
                                                />
                                            </section>
                                            <section className={`w-full ${current === 2 ? "block" : "hidden"}`}>
                                                <Careers
                                                    next={next}
                                                    prev={prev}
                                                    careers={careers}
                                                    setCareers={setCareers}
                                                    allCareers={allCareers}
                                                />
                                            </section>
                                            <section className={`w-full ${current === 3 ? "block" : "hidden"}`}>
                                                <Summarize
                                                    summarizing={summarizing}
                                                    summarize={summarize}
                                                    setCurrent={setCurrent}
                                                    prev={prev}
                                                />
                                            </section>
                                        </section>
                                    </form>
                                </>
                                :
                                <section>
                                    <section>
                                        <section className={`w-full ${current === 0 ? "block" : "hidden"}`}>
                                            <SummarizeQuestions
                                                next={next}
                                                data={summarizeData}
                                                prompt={prompt}
                                            />
                                        </section>
                                        <section className={`w-full ${current === 1 ? "block" : "hidden"}`}>
                                            <SummarizeAssessments
                                                next={next}
                                                prev={prev}
                                                data={summarizeData}
                                                prompt={prompt}
                                            />
                                        </section>
                                        <section className={`w-full ${current === 2 ? "block" : "hidden"}`}>
                                            <SummarizeCareers
                                                next={next}
                                                prev={prev}
                                                data={summarizeData}
                                                prompt={prompt}
                                            />
                                        </section>
                                        <section className={`w-full ${current === 3 ? "block" : "hidden"}`}>
                                            <SummaryResult
                                                data={summarizeData}
                                                prompt={prompt}
                                            />
                                        </section>
                                    </section>
                                    {
                                        current === 3 &&
                                        <div className="flex justify-center mt-8">
                                            <Button
                                                onClick={resetForm}
                                                color="primary"
                                                className="rounded-[5px]"
                                            >
                                                ทำแบบทดสอบอีกครั้ง
                                            </Button>
                                        </div>
                                    }
                                </section>
                        }
                    </section>
            }
        </div>
    )
}

export default SuggestionForm