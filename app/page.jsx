import { ContentWrap, Navbar, Sidebar } from '@/app/components'
import dynamic from 'next/dynamic'
import React from 'react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { hostname } from './api/hostname';
import { SearchIcon } from './components/icons';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BiBook } from "react-icons/bi";
import { Input, Button } from "@nextui-org/react";
import Link from 'next/link';

const News = dynamic(() => import('./components/News'), { ssr: false })

async function getData() {
    try {
        const res = await axios.get(`${hostname}/api/test`, {
            withCredentials: true
        })
        const data = res.data.data
        if (data.length == 0) return [{ id: 1, "ข้อมูล": "ไม่มีข้อมูล" }]

        return data
    } catch (error) {
        return ([{ "ข้อมูล": "ไม่พบข้อมูล" }])
    }
}

const Page = async () => {
    const session = await getServerSession()
    const rootData = await getData()
    // console.log("Home page session: ", session);
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <h1 className='mb-4'>ข่าวสารและประชาสัมพันธ์</h1>
                <News />
            </ContentWrap>
        </>
    )
}

export default Page;