"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import { Empty } from 'antd';
import TrackForm from './TrackForm';
import TeacherTrack from './TeacherTrack';
import TrackSubject from './TrackSubject';

const Page = () => {
    const track = useSearchParams().get('track')

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
                            <div className='space-y-6'>
                                <TrackForm
                                    track={track} />
                                <div className='flex gap-6 flex-row-reverse'>
                                    <div className="w-[40%]">
                                        <TeacherTrack
                                            track={track} />
                                    </div>
                                    <di className="w-[60%]">
                                        <TrackSubject
                                            track={track} />
                                    </di>
                                </div>
                            </div>

                    }
                </div>
            </ContentWrap>
        </>
    )
}

export default Page