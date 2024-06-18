"use client"
import { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
import { useSession } from "next-auth/react"
import TrackSelectionForm from './TrackSelectionForm';
import TMonlicaEmail from '@/app/components/TMonlicaEmail';
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';

const Page = () => {
    const [userData, setUserData] = useState({})
    const [enrollments, setEnrollment] = useState([])
    const { data: session } = useSession();

    const fetchStudentData = useCallback(async function (stu_id) {
        try {
            const URL = `/api/students/enrollments/${stu_id}`
            const option = await getOptions(URL, "GET")
            const response = await axios(option)
            const data = response.data.data
            setUserData(data)
            if (data.Enrollments.length > 0) {
                setEnrollment(data.Enrollments)
            } else {
                setEnrollment([])
            }
        } catch (error) {
            setUserData({})
            setEnrollment([])
        }
    }, [])

    useEffect(() => {
        if (session?.user?.stu_id != undefined) {
            fetchStudentData(session?.user?.stu_id)
        }
    }, [session])

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                {
                    !session?.user?.stu_id ?
                        <div>
                            ไม่สามารถเข้าถึงข้อมูลของคุณได้ กรุณาติดต่อ <TMonlicaEmail />
                        </div>
                        :
                        <TrackSelectionForm enrollments={enrollments} userData={userData} />
                }
            </ContentWrap>
        </>

    )
}

export default Page;