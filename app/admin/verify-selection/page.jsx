"use client"

import { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import Swal from 'sweetalert2';
import { fetchData } from '../action'
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { useDisclosure } from "@nextui-org/react";
import { getAcadyears } from '@/src/util/academicYear';
import Link from 'next/link'
import { dmy, dmyt } from '@/src/util/dateFormater'
import { Input, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Tooltip, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, ChevronDownIcon, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import { Icon } from '@iconify/react';
import { Loading } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { Tabs, Tab, Card, CardBody, Switch } from "@nextui-org/react";
import { VscArchive, VscCheckAll, VscHistory } from "react-icons/vsc";
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CiSearch } from "react-icons/ci";


const Page = () => {
    const [verify, setVerify] = useState([]);
    const [verifyAdmin, setVerifyByAdmin] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    //state fillter
    const [statusOptions, setStatusOptions] = useState([])
    const [statusFilter, setStatusFilter] = useState(["10", "50", "62"]);
    const [filterValue, setFilterValue] = useState("");

    ///////////////////////////////////////////////////
    const callApproveByTeacher = useCallback(async () => {
        try {
            const URL = `/api/verifies/approve/teacher`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const data = response.data.data;

            const filteredData = data.filter((verifies) => {
                const teacherEmail = verifies.Student.Teacher?.email;
                return teacherEmail === session?.user?.email;
            });

            setVerify(filteredData);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, [session]);

    const callApproveByAdmin = useCallback(async () => {
        try {
            const URL = `/api/verifies/approve/admin`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const data = response.data.data;

            setVerifyByAdmin(data);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, []);

    const getStudentStatuses = useCallback(async function () {
        try {
            const statuses = await fetchData("/api/statuses")
            setStatusOptions(statuses)
        } catch (err) {
            setStatusOptions([])
        }
    }, [])

    useEffect(() => {
        if (session) {
            if (session?.user?.role === 'teacher') {
                callApproveByTeacher();
            } else if (session?.user?.role === 'admin') {
                callApproveByAdmin();
            }
            setLoading(false);
        }
        getStudentStatuses()
    }, [session, callApproveByTeacher, callApproveByAdmin, getStudentStatuses]);

    const removeStatusFilter = useCallback((id) => {
        setStatusFilter((prev) => {
            const newStatusFilter = [...prev]
            const index = newStatusFilter.indexOf(String(id));
            if (index > -1) {
                newStatusFilter.splice(index, 1)
            }
            return newStatusFilter
        });
    }, [])

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);

    const applySearchFilter = (verifies) => {
        return verifies.filter(verifies => {
            const nameMatch = `${verifies.Student.first_name} ${verifies.Student.last_name}`.toLowerCase().includes(filterValue.toLowerCase());
            const emailMatch = verifies.Student.email.toLowerCase().includes(filterValue.toLowerCase());
            return nameMatch || emailMatch;
        });
    };

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <div className='my-[30px]'>
                    {loading ? (
                        <div className='w-fit mx-auto mt-14'>
                            <Loading />
                        </div>
                    ) : (
                        <>
                            <div className='border p-4 rounded-[10px] w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 flex-wrap '>
                                <div className="flex gap-4  flex-wrap items-center">
                                    <Dropdown>
                                        <DropdownTrigger className="flex">
                                            <Button
                                                size="sm"
                                                radius="sm"
                                                className="bg-blue-100 text-blue-500"
                                                endContent={<ChevronDownIcon className="text-small" />}
                                                variant="flat">
                                                สถานะภาพ
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection
                                            aria-label="Table Columns"
                                            closeOnSelect={false}
                                            selectedKeys={statusFilter}
                                            selectionMode="multiple"
                                            onSelectionChange={setStatusFilter}
                                            className="h-[500px] overflow-y-auto"
                                        >
                                            {statusOptions.map((status) => (
                                                <DropdownItem key={status.id} className="capitalize">
                                                    {status.id} {status.description}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className="flex gap-4  flex-wrap items-center">
                                    <Input
                                        isClearable
                                        classNames={{
                                            base: "w-full",
                                            inputWrapper: "border-1",
                                        
                                        }}
                                        className='text-lg'
                                        color='primary'
                                        placeholder="ค้นหา"
                                        startContent={<CiSearch />}
                                        size="sm"
                                        value={filterValue}
                                        variant="bordered"
                                        onClear={() => setFilterValue("")}
                                        onValueChange={onSearchChange}
                                    />
                                </div>
                            </div>
                            <Tabs aria-label="Options" color="primary" size="md">
                                {/* คำร้องใหม่ Tab */}
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

                                        {applySearchFilter(session?.user?.role === 'teacher' ? verify : verifyAdmin)
                                            .filter(verifies => session?.user?.role === 'admin' ? verifies.status === 2 : verifies.status === 1)
                                            .map(verifies => (
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
                                            ))}
                                    </div>
                                </Tab>

                                {/* คำร้องที่อนุมัติ Tab */}
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

                                        {applySearchFilter(session?.user?.role === 'teacher' ? verify : verifyAdmin)
                                            .filter(verifies => session?.user?.role === 'admin' ? verifies.status === 3 : verifies.status === 2)
                                            .map(verifies => (
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
                                                                <span className='w-3 h-3 inline-block bg-green-500 rounded-full mr-2'></span>
                                                                อนุมัติ
                                                            </div>
                                                        </div>
                                                        <div className='border-t mt-5 border-gray-300'></div>
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                </Tab>

                                {/* รอนักศึกษากรอกแบบฟอร์มอีกครั้ง Tab */}
                                <Tab
                                    key="reject"
                                    title={
                                        <div className="flex items-center space-x-2">
                                            <VscHistory />
                                            <span>รอนักศึกษากรอกแบบฟอร์มอีกครั้ง</span>
                                        </div>
                                    }
                                >
                                    <div className='border border-gray-300 rounded-md p-5 shadow-sm'>
                                        <h1 className='text-2xl font-semibold'>รอคำร้องจากนักศึกษา</h1>
                                        <div className='border-t mt-5 border-gray-300'></div>

                                        {applySearchFilter(session?.user?.role === 'teacher' ? verify : verifyAdmin)
                                            .filter(verifies => verifies.status === 0)
                                            .map(verifies => (
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
                                                            <div className='inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300'>
                                                                <span className='w-3 h-3 inline-block bg-red-500 rounded-full mr-2'></span>
                                                                รอคำร้องจากนักศึกษา
                                                            </div>
                                                        </div>
                                                        <div className='border-t mt-5 border-gray-300'></div>
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                </Tab>
                            </Tabs>
                        </>
                    )}
                </div>
            </ContentWrap>
        </>
    );
}

export default Page;