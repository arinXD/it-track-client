"use client"
import React, { useState,useEffect} from 'react'
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
import { useSession } from "next-auth/react"
import StudentEnrollment from '../tracks/StudentEnrollment';

import TMonlicaEmail from '@/app/components/TMonlicaEmail';
const Page = () => {
    const [enrollments, setEnrollment] = useState([])
    const [userData, setUserData] = useState({})
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
                        ไม่สามารถเข้าถึงข้อมูลของคุณได้ กรุณาติดต่อ <TMonlicaEmail />
                    </div>
                </ContentWrap>
            </>
        )
    }
    console.log(enrollments);
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <div>
                    <p>ตรวจสอบสำเร็จการศึกษา</p>
                    <StudentEnrollment setUserData={setUserData} setEnrollment={setEnrollment} />
                </div>
            </ContentWrap>
        </>
    )
}

export default Page;