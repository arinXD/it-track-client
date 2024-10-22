"use client"
import TrackBanner from './TrackBanner';
import SuggestionForm from './SuggestionForm';
import { useToggleSideBarStore } from '@/src/store';
import { useState } from 'react';

const FormWrapper = ({ tracks, form, email }) => {
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)
    const [resultData, setResultData] = useState({});
    return (
        <section className={`${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}>
            {Object.keys(resultData).length == 0 ?
                <TrackBanner tracks={tracks} form={form} />
                :
                //     "trackSummaries": [
                // {
                //     "track": "BIT",
                //     "questionScore": 10,
                //     "assessmentScore": 10,
                //     "careerScore": 5,
                //     "totalScore": 25,
                //     "correctAnswers": 1,
                //     "totalQuestions": 1,
                //     "correctPercentage": 100,
                //     "summary": "คะแนนแบบทดสอบ 10 คะแนน, คะแนนแบบประเมิน 10 คะแนน, คะแนนความชอบ 5 คะแนน"
                // },
                <div className={`mt-16 bg-gradient-to-br from-blue-100 to-purple-100 p-8 text-center ${Object.keys(resultData).length === 0 ? "p-4 " : "p-0"} lg:p-16`}>
                    <h1 className='text-2lx mb-2'>แทร็กที่คุณได้คือ</h1>
                    <h2 className='text-4xl font-bold'>{
                        resultData?.recommendation[0]?.track === null ?
                            resultData?.recommendation[0]?.recText
                            :
                            resultData?.recommendation[0]?.track
                    }</h2>
                </div>
            }
            <SuggestionForm setResultData={setResultData} email={email} form={form} />
        </section>
    )
}

export default FormWrapper