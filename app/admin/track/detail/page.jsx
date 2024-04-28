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
                <BreadCrumb />
                <div>
                    {
                        track == undefined ?
                            <Empty className='my-16' />
                            :
                            <>
                                <TrackForm
                                    track={track} />
                                <TeacherTrack
                                    track={track} />
                                <TrackSubject
                                    track={track} />
                            </>
                    }
                </div>
            </ContentWrap>
        </>
    )
}

export default Page