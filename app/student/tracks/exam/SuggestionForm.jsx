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

const SuggestionForm = ({ form }) => {
    const allQuestions = form?.Questions
    const allAssessments = form?.Assessments
    const allCareers = form?.Careers
    const [questions, setQuestions] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [careers, setCareers] = useState([]);
    const [current, setCurrent] = useState(0)
    const steps = useMemo(() => ([
        {
            title: 'แบบทดสอบ',
        },
        {
            title: 'แบบประเมิน',
        },
        {
            title: 'ความชอบ',
        },
        {
            title: 'สรุปผล',
        },
    ]), [])
    const summarize = useMemo(() => ({
        questions: questions?.filter(q => q.aId).length > 0,
        assessments: assessments?.filter(q => q.index).length > 0,
        careers: careers?.length > 0,
    }), [questions, assessments, careers,])

    const next = useCallback(() => {
        setCurrent(prev => prev + 1)
    }, [])
    const prev = useCallback(() => {
        setCurrent(prev => prev - 1)
    }, [])

    useEffect(() => {
        if (form && questions?.length == 0 && assessments?.length == 0) {
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
            const res = await axios(option)
            const form = res.data.data
            return form
        } catch (error) {
            return {}
        }
    }, [questions, assessments, careers])

    return (
        <div className={`my-8 px-8`}>
            {
                Object.keys(form).length === 0 ?
                    <section className='text-center font-bold text-lg my-28'>
                        Coming soon!
                    </section>
                    :
                    <section>
                        <Steps
                            className="my-8"
                            current={current}
                            onChange={setCurrent}
                            items={items} />
                        <form
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
                                        summarize={summarize}
                                        setCurrent={setCurrent}
                                        prev={prev}
                                    />
                                </section>
                            </section>
                        </form>
                    </section>
            }
        </div>
    )
}

export default SuggestionForm