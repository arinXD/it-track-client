"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
import { useSession } from "next-auth/react"
import { getOptions } from '@/app/components/serverAction/TokenAction';
import TMonlicaEmail from '@/app/components/TMonlicaEmail';
import axios from 'axios';
import { Loading } from '@/app/components'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner } from '@nextui-org/react'

const Page = () => {
    const [loading, setLoading] = useState(true)
    const [verifySelect, setVerifySelect] = useState({})
    const [verifySubjects, setVerifySubjects] = useState([])
    const [userData, setUserData] = useState({})
    const [enrollments, setEnrollment] = useState([])
    const { data: session } = useSession();

    const fetchEnrollment = useCallback(async function (stu_id) {
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
            fetchEnrollment(session?.user?.stu_id)
        }
    }, [session])

    const fetchData = async function () {
        try {
            let URL = `/api/verify/selects/${userData.program}/${userData.acadyear}`
            let option = await getOptions(URL, "GET")
            const response = await axios(option)

            const data = response.data.data;

            setVerifySelect(data);
            if (data?.Subjects) {
                setVerifySubjects(data.Subjects)
            } else {
                setVerifySubjects([])
            }
        } catch (error) {
            console.log(error);
            setVerifySelect({});
            setVerifySubjects([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            fetchData()
        }
    }, [userData])


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
    console.log(userData);
    console.log(verifySelect);
    console.log(verifySubjects);
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                {loading ?
                    <div className='w-full flex justify-center h-[70vh]'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    !(verifySelect?.id) ?
                        <>
                            <p>รอการประกาศการคัดเลือกแทรคจากอาจารย์ครับ/ค่ะ</p>
                        </>
                        :
                        <>
                            <div>
                                <p>ตรวจสอบสำเร็จการศึกษา</p>
                            </div>
                        </>
                }
            </ContentWrap>
        </>
    );

}

export default Page;