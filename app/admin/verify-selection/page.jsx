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
import { dmy } from '@/src/util/dateFormater'
import { Tooltip, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import { Icon } from '@iconify/react';
import { Loading } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { Tabs, Tab, Card, CardBody, Switch } from "@nextui-org/react";


const Page = () => {

    const [verify, setVerify] = useState([]);
    const [loading, setLoading] = useState(true)
    const [isVertical, setIsVertical] = useState(true);

    const showToastMessage = useCallback((ok, message) => {
        toast[ok ? 'success' : 'warning'](message, {
            position: toast.POSITION.TOP_RIGHT,
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, [])

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
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <ToastContainer />
                <div className='my-[30px]'>
                    {
                        loading ?
                            <div className='w-fit mx-auto mt-14'>
                                <Loading />
                            </div>
                            :
                            <>
                                <Table
                                    removeWrapper
                                    selectionMode="multiple"
                                    onRowAction={() => { }}
                                    aria-label="programcode table">
                                    <TableHeader>
                                        <TableColumn></TableColumn>
                                        {/* <TableColumn>ปีการศึกษา</TableColumn> */}
                                        <TableColumn>รหัสนักศึกษา</TableColumn>
                                        {/* <TableColumn>หลักสูตร</TableColumn> */}
                                        <TableColumn>ปีการศึกษา</TableColumn>
                                        <TableColumn>วันที่ส่งการอนุมัติ</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent={"ไม่มีข้อมูลอนุมัติแบบฟอร์มตรวจสอบจบ"}>
                                        {verify?.map(verifies => (
                                            <TableRow key={verifies.id}>
                                                <TableCell>
                                                    <div className='relative flex items-center gap-2'>
                                                        <Tooltip color="danger" content="ลบ">
                                                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                <DeleteIcon2 />
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell>{verifies.term}</TableCell> */}
                                                <TableCell className="w-1/3">
                                                    <Link
                                                        href={`/admin/verify-selection/${verifies.stu_id}`}
                                                        className='text-blue-500'
                                                    >{verifies.stu_id}
                                                    </Link>
                                                </TableCell>
                                                {/* <TableCell>{verifies.program}</TableCell> */}
                                                <TableCell>{verifies.acadyear}</TableCell>
                                                {["createdAt"].map(column => (
                                                    <TableCell key={column}>
                                                        <span>{column === "createdAt" ? dmy(verifies[column]) : verifies[column]}</span>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>


                                <div className="flex w-full flex-col">
                                    <Tabs aria-label="Options" color="primary" size="lg">
                                        <Tab key="photos" title="คำร้องใหม่">
                                            <Card>
                                                <CardBody>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                                </CardBody>
                                            </Card>
                                        </Tab>
                                        <Tab key="music" title="คำร้องที่อนุมัติ">
                                            <Card>
                                                <CardBody>
                                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                                </CardBody>
                                            </Card>
                                        </Tab>
                                    </Tabs>
                                </div>

                            </>
                    }

                </div>
            </ContentWrap>
        </>
    )
}

export default Page