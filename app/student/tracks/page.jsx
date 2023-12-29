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
    if (!session?.user?.stu_id) {
        return (
            <>
                <header>
                    <Navbar />
                </header>
                <Sidebar />
                <ContentWrap>
                    <div>
                        ไม่สามารถเข้าถึงข้อมูลของคุณได้ กรุณาติดต่อ ittrack@gmail.com
                    </div>
                </ContentWrap>
            </>
        )
    }
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