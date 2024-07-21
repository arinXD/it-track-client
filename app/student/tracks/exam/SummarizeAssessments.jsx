"use client"

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"

const SummarizeAssessments = ({ next, prev, data }) => {
    const { assessmentScores } = data;
    return (
        <section>
            <section className='bg-gray-100 min-h-screen p-8 rounded-sm'>
                <section className='p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
                    SummarizeAssessments
                </section>
            </section>
            <div className="w-full flex justify-between">
                <div
                    onClick={prev}
                    className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                >
                    <MdKeyboardArrowLeft className="w-5 h-5" />
                    <div className="flex flex-col">
                        <span className="text-sm text-default-400">Step 1</span>
                        <span className="text-base">ผลสรุปแบบทดสอบ</span>
                    </div>
                </div>
                <div
                    onClick={next}
                    className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                >
                    <div className="flex flex-col">
                        <span className="text-sm text-default-400">Step 3</span>
                        <span className="text-base">ผลสรุปความชอบ</span>
                    </div>
                    <MdKeyboardArrowRight className="w-5 h-5" />
                </div>
            </div>
        </section>
    )
}

export default SummarizeAssessments