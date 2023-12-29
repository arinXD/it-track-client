import React from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import axios from 'axios'
import { hostname } from '@/app/api/hostname'
import { getServerSession } from 'next-auth';
import { getToken } from '@/app/components/serverAction/TokenAction'
import AcadYears from "./components/AcadYears"

const fetchData = async (email) => {
    "use server"
    try {
        const token = await getToken()
        // console.log("admin token:", token);
        const res = await fetch(`${hostname}/api/acadyear`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
            },
        })
        const responseData = await res.json();
        let data = responseData.data;
        data = data.length ? data : [];
        return data;
    } catch (error) {
        console.error(error);
        return []
    }
}
const page = async () => {
    const session = await getServerSession()
    const data = await fetchData(session.user.email)
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <AcadYears data={data}>

                </AcadYears>
            </ContentWrap>
        </>

    )
}

export default page