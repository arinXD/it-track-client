"use client"
import React, { useEffect } from 'react'
import { useSession } from "next-auth/react"
import axios from 'axios'
import { hostname } from '@/app/api/hostname'

const StudentEnrollment = ({ setUserData, setEnrollment }) => {
    const { data: session } = useSession();
    useEffect(() => {
        async function fetchEnrollment(stu_id) {
            if (session?.user?.stu_id) {
                const { stu_id } = session.user
                try {
                    const response = await axios.get(`${hostname}/api/students/enrollments/${stu_id}`)
                    const data = response.data.data
                    setUserData(data)
                    if (data.Enrollments.length > 0) {
                        setEnrollment(data.Enrollments)
                    } else {
                        setEnrollment([])
                    }
                } catch (error) {
                    console.log("Cant fetch enrollment.");
                    setUserData({})
                    setEnrollment([])
                }
            }
        }
        fetchEnrollment()
    }, [session])
    return (
        <></>
    )
}

export default StudentEnrollment