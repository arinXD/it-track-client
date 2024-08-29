"use client"

import { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchData } from '../action'
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { useDisclosure } from "@nextui-org/react";
import { getAcadyears } from '@/src/util/academicYear';
import Link from 'next/link'
import { dmy, dmyt } from '@/src/util/dateFormater'
import { Tooltip, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import { Icon } from '@iconify/react';
import { Loading } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { Tabs, Tab, Card, CardBody, Switch } from "@nextui-org/react";
import { VscArchive, VscCheckAll } from "react-icons/vsc";
import Image from 'next/image';


const Page = () => {

    const [verify, setVerify] = useState([]);
    const [loading, setLoading] = useState(true)

    const callVerify = useCallback(async () => {
        try {
            const URL = `/api/verifies/approve`
            const option = await getOptions(URL, "GET")
            const response = await axios(option)
            const data = response.data.data
            console.log(data);
            setVerify(data);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, []);

    useEffect(() => {
        callVerify()
        setLoading(false)
    }, [])

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <ToastContainer />
                <div className='my-[30px]'>
                    {loading ? (
                        <div className='w-fit mx-auto mt-14'>
                            <Loading />
                        </div>
                    ) : (
                        <Tabs aria-label="Options" color="primary" size="md">
                            <Tab
                                key="sd"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <VscArchive />
                                        <span>คำร้องใหม่</span>
                                    </div>
                                }
                            >
                                <div className='border border-gray-300 rounded-md p-5 shadow-sm'>
                                    <h1 className='text-2xl font-semibold'>คำร้องอนุมัติจบการศึกษา</h1>
                                    <div className='border-t mt-5 border-gray-300'></div>
                                    {verify.map((verifies) => (
                                        verifies.status === 1 && (
                                            <div key={verifies.id}>
                                                <Link
                                                    href={`/admin/verify-selection/${verifies.stu_id}`}
                                                    className='block text-black hover:text-sky-700'
                                                >
                                                    <div className='flex justify-between items-center my-5'>
                                                        <div>
                                                            <div className='flex items-center'>
                                                                <p className='font-semibold text-lg'>
                                                                    {verifies.Student.first_name} {verifies.Student.last_name}
                                                                </p>
                                                                <span className='text-sm ml-3'>
                                                                    {verifies.Student.email}
                                                                </span>
                                                            </div>
                                                            <p className='text-sm mt-2'>
                                                                {dmyt(verifies.createdAt)}
                                                            </p>
                                                        </div>
                                                        <div className='inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300'>
                                                            <span className='w-3 h-3 inline-block bg-yellow-500 rounded-full mr-2'></span>
                                                            รอการยืนยัน
                                                        </div>
                                                    </div>
                                                    <div className='border-t mt-5 border-gray-300'></div>
                                                </Link>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </Tab>
                            <Tab
                                key="approved"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <VscCheckAll />
                                        <span>คำร้องที่อนุมัติ</span>
                                    </div>
                                }
                            >
                                <div className='border border-gray-300 rounded-md p-5 shadow-sm'>
                                    <h1 className='text-2xl font-semibold'>คำร้องที่อนุมัติจบการศึกษา</h1>
                                    <div className='border-t mt-5 border-gray-300'></div>
                                    {verify.map((verifies) => (
                                        verifies.status === 2 && (
                                            <div key={verifies.id}>
                                                <Link
                                                    href={`/admin/verify-selection/${verifies.stu_id}`}
                                                    className='text-black hover:text-sky-700'
                                                >
                                                    <div className='flex justify-between items-center my-5'>
                                                        <div>
                                                            <div className='flex items-center'>
                                                                <p className='font-semibold text-lg'>
                                                                    {verifies.Student.first_name} {verifies.Student.last_name}
                                                                </p>
                                                                <span className='text-sm ml-3'>
                                                                    {verifies.Student.email}
                                                                </span>
                                                            </div>
                                                            <p className='text-sm mt-2'>
                                                                {dmyt(verifies.createdAt)}
                                                            </p>
                                                        </div>
                                                        <div className='inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>
                                                            <span class="w-3 h-3 inline-block bg-green-500 rounded-full mr-2"></span>อนุมัติ
                                                        </div>
                                                    </div>
                                                    <div className='border-t mt-5 border-gray-300'></div>
                                                </Link>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </Tab>
                        </Tabs>
                    )}
                </div>
            </ContentWrap>
        </>
    );
}

export default Page