import React from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import AcadYears from "./components/AcadYears"
import { fetchData } from '../action'

const page = async () => {
    const data = await fetchData("/api/acadyear")
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <AcadYears data={data}/>
            </ContentWrap>
        </>

    )
}

export default page