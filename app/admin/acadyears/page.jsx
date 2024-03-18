"use client"
import React from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import AcadYears from "./components/AcadYears"

const page = async () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                {/* <AcadYears data={data}/> */}
            </ContentWrap>
        </>

    )
}

export default page