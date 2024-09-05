"use client"
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import { Empty } from 'antd';
import TrackForm from './TrackForm';
import TeacherTrack from './TeacherTrack';
import TrackSubject from './TrackSubject';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import CareerTable from './CareerTable';

const Page = () => {
    const queryTrack = useSearchParams().get('track')
    const [track, setTrack] = useState("");
    const getTrack = useCallback(async () => {
        const option = await getOptions(`/api/tracks/${queryTrack}/get-track`)
        const res = await axios(option)
        setTrack(res?.data?.data?.track)
    }, [queryTrack])

    useEffect(() => {
        getTrack()
    }, [])

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <div className='flex flex-col justify-center items-center w-full'>
                    <BreadCrumb />
                    {
                        track == undefined ?
                            <Empty
                                description="ไม่พบข้อมูลแทร็ก"
                                className='my-16' />
                            :
                            <div className='w-full space-y-6'>
                                <TrackForm
                                    track={queryTrack} />
                                <div className='w-full flex gap-6 flex-col lg:flex-row'>
                                    <div className="w-full lg:w-[50%]">
                                        <TrackSubject track={queryTrack} />
                                    </div>
                                    <div className="w-full lg:w-[50%]">
                                        <TeacherTrack track={queryTrack} />
                                    </div>
                                </div>
                                <div className='border p-6 rounded-[10px] w-full'>
                                    <CareerTable track={queryTrack} />
                                </div>
                            </div>

                    }
                </div>
            </ContentWrap>
        </>
    )
}

export default Page