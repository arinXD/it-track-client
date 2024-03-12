import { ContentWrap, Navbar, News, Sidebar } from '@/app/components'

import React from 'react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { hostname } from './api/hostname';
import { Button, Input } from '@nextui-org/react';
import { SearchIcon } from './components/icons';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BiBook } from "react-icons/bi";

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
                <h1>ข่าวสารและประชาสัมพันธ์</h1>
                <div className="flex flex-col gap-4 my-4">
                    <div className="flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%] h-fit shadow-none"
                            placeholder="Search by name..."
                            variant='bordered'
                            color="primary"
                            size="sm"
                            startContent={<SearchIcon />}
                        // value={filterValue}
                        // onClear={() => onClear()}
                        // onValueChange={onSearchChange}
                        />
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
                <News data={rootData} />
            </ContentWrap>
        </>
    )
}

export default Page;