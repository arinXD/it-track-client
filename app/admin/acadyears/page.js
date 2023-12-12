import React from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import axios from 'axios'
import { hostname } from '@/app/api/hostname'
import { getServerSession } from 'next-auth';
import { signToken } from '@/app/components/serverAction/TokenAction'
import AcadYears from "./components/AcadYears"

const fetchData = async (email) => {
    const noData = [{ id: 1, data: "no data" }]
    try {
        const token = await signToken({ email })
        console.log("admin token:", token);
        const res = await axios.get(`${hostname}/api/acadyear`, {
            headers: {
                "authorization": `${token}`,
            }
        })
        let data = res.data.data
        data = data.length ? data : noData
        return data
    } catch (error) {
        console.error(error);
        return noData
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