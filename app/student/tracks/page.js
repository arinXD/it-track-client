"use client"
import React, { useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
import { useSession } from "next-auth/react"
import TrackSelectionForm from './TrackSelectionForm';
import StudentEnrollment from './StudentEnrollment';
const Page = () => {
    const [userData, setUserData] = useState({})
    const [enrollments, setEnrollment] = useState([])
    const { data: session } = useSession();
    console.log(session);
    if (!session?.user?.stu_id) {
        return (
            <>
                <header>
                    <Navbar />
                </header>
                <Sidebar />
                <ContentWrap>
                    <div>
                        Sign in as kkumail.
                    </div>
                </ContentWrap>
            </>
        )
    }
    // if (!(Object.keys(userData).length === 0)) {
    //     console.log(enrollments);
    // }
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <StudentEnrollment setUserData={setUserData} setEnrollment={setEnrollment} />
                <TrackSelectionForm enrollments={enrollments} userData={userData} />
            </ContentWrap>
        </>

    )
}

export default Page;