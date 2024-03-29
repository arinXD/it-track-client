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

const News = dynamic(() => import('./components/News'), { ssr: false })

async function getData() {
    try {
        const res = await axios.get(`${hostname}/api/posts`)
        const data = res.data.data
        if (data.length == 0) return [{ id: 1, "ข้อมูล": "ไม่มีข้อมูล" }]

        return data
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return ([{ "ข้อมูล": "ไม่พบข้อมูล" }])
    }
}

const Page = async () => {
    const session = await getServerSession()
    const rootData = await getData()
    // console.log(rootData);
    // console.log("Home page session: ", session);
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <div className="flex flex-col gap-4 my-4">
                    <div className="flex justify-between gap-3 items-start">
                        <h1>ข่าวสารและประชาสัมพันธ์</h1>
                        <div className="flex gap-6">
                            <Button
                                startContent={<BiBook className='w-5 h-5' />}
                                className=''>
                                ค้นหาวิชา
                            </Button>
                            <Button
                                startContent={<HiOutlineUserGroup className='h-5 w-5' />}
                                className=''>
                                ค้นหาแทรค
                            </Button>
                        </div>
                    </div>
                </div>
                <News />
            </ContentWrap>
        </>
    )
}

export default Page;