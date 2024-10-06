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
import { swal } from "@/src/util/sweetyAlert";

const SuggestionForm = ({ form, email, setResultData }) => {
    const allQuestions = form?.Questions
    const allAssessments = form?.Assessments
    const allCareers = form?.Careers
    const [questions, setQuestions] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [careers, setCareers] = useState([]);
    const [current, setCurrent] = useState(0)
    const [summarizing, setSummarizing] = useState(false);
    const [summarizeData, setsummarizeData] = useState({});
    const [isSummarize, setIsSummarize] = useState(false);
    const [isAskingFeedback, setIsAskingFeedback] = useState(false);

    const steps = useMemo(() => ([
        {
            title: 'คำถาม',
        },
        {
            title: 'ความชอบ',
        },
        {
            title: 'อาชีพ',
        },
        {
            title: 'สรุปผล',
        },
    ]), [isSummarize])

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
        const option = await getOptions(`/api/suggestion-forms/summarize/${email}`, "post", formData)
        try {
            setSummarizing(true)
            const res = await axios(option)
            const data = res.data.data
            setsummarizeData(data)
            setIsSummarize(true)
            setCurrent(0)
            setResultData(data)
            window.scrollTo(0, 0)
        } catch (error) {
            setsummarizeData({})
        } finally {
            setSummarizing(false)
        }
    }, [questions, assessments, careers, email])

    const resetForm = useCallback(() => {
        initForm()
        setCareers([])
        setCurrent(0)
        setsummarizeData({})
        setResultData({})
        window.scrollTo(0, 0)
    }, [])


    const detectDeviceType = useCallback(async () => {
        const userAgent = navigator.userAgent;

        const mobilePattern = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const tabletPattern = /iPad|iPad|Tablet|PlayBook/i;

        if (tabletPattern.test(userAgent)) {
            return 'tablet';
        } else if (mobilePattern.test(userAgent)) {
            return 'mobile';
        } else {
            return 'desktop';
        }
    }, [])

    useEffect(() => {
        if (Object.keys(summarizeData).length > 0 && current == 3 && !isAskingFeedback) {
            setIsAskingFeedback(true)
            swal.fire({
                title: "ขออนุญาตผู้ใช้ทำแบบสอบถาม",
                text: `ขออนุญาตผู้ใช้ทำแบบสอบถามเพื่อนำ feedback มาปรับปรุงแก้ไขเว็บไซต์ให้มีประสิทธิภาพต่อไป`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ยินยอม",
                cancelButtonText: "ไม่ยินยอม",
                reverseButtons: true
            }).then(result => {
                if (result.isConfirmed) {
                    window.open(`https://forms.gle/q2zNnbxfDXxv1R4d6`)
                }
            })
        }
        const type = detectDeviceType()
        if (type == "mobile") {
            window.scrollTo(0, 680)
        } else if (type == "tablet") {
            window.scrollTo(0, 700)
        }
        else {
            const range = Object.keys(summarizeData).length == 0 ? 750 : 0
            if (current) {
                window.scrollTo(0, range)
            }
        }
    }, [current])

    return (
        <div className={`p-4 md:pt-0 md:px-12 md:pb-12 bg-[#F9F9F9] ${Object.keys(summarizeData).length === 0 ? "" : "pt-4 md:pt-12"}`}>
            {
                Object.keys(form).length === 0 ?
                    <section className='text-center font-bold text-lg py-28'>
                        Coming soon!
                    </section>
                    :
                    <section className={`min-h-screen ${Object.keys(summarizeData).length === 0 ? "p-4 " : "p-0"} lg:p-8 max-w-4xl mx-auto bg-white border border-gray-100 shadow rounded-lg`}>
                        <Steps
                            className="mb-6 !hidden md:!flex"
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
                                            <SummarizeCareers
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
                                    </section>
                                    {
                                        current === 3 &&
                                        <div className="flex justify-center mt-4 md:mt-8 mb-8 md:mb-8 lg:mb-0">
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