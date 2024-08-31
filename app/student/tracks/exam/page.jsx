'use server';
import '../../../style/exam.css';
import { Navbar, Sidebar } from '@/app/components';
import FormWrapper from './FormWrapper';
import { Suspense } from 'react';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import { getServerSession } from 'next-auth';

async function getAllTracks() {
    const option = await getOptions("/api/tracks/all", "get")
    try {
        const res = await axios(option)
        const tracks = res.data.data
        return tracks
    } catch (error) {
        return []
    }
}

async function getSuggestionForm() {
    const option = await getOptions("/api/suggestion-forms/available", "get")
    try {
        const res = await axios(option)
        const form = res.data.data
        return form
    } catch (error) {
        return {}
    }
}

const Page = async () => {
    const user = await getServerSession()
    const trackData = getAllTracks()
    const formData = getSuggestionForm()
    const [tracks, form] = await Promise.all([trackData, formData])
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />

            <Suspense fallback={<div>Loading...</div>}>
                <FormWrapper
                    email={user?.user?.email}
                    tracks={tracks}
                    form={form} />
            </Suspense>

        </>
    )
}

export default Page;