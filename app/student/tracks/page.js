"use client"
import React, { useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
import TrackSelectionForm from './TrackSelectionForm';
import StudentEnrollment from './StudentEnrollment';
const Page = () => {
    const [userData, setUserData] = useState({})
    const [enrollments, setEnrollment] = useState([])
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