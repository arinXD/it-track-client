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
                <div className={`mt-16 bg-gradient-to-br from-blue-100 to-purple-100 p-8 text-center ${Object.keys(resultData).length === 0 ? "p-4 " : "p-0"} lg:p-16`}>
                    <h1 className='text-2lx mb-2'>แทร็กที่คุณได้คือ</h1>
                    <h2 className='text-4xl font-bold'>{resultData?.recommendation[0]?.track}</h2>
                </div>
            }
            <SuggestionForm setResultData={setResultData} email={email} form={form} />
        </section>
    )
}

export default FormWrapper