"use client"

import { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";

const Page = () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <ToastContainer />
                <p>test</p>
            </ContentWrap>
        </>
    )
}

export default Page