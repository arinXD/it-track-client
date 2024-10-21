"use client"
import React, { useCallback, useEffect, useState } from 'react'
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
import InsertVerify from './InsertVerify';
import { Empty, message } from 'antd';

const Page = () => {
    const [verify, setVerify] = useState([]);
    const [loading, setLoading] = useState(true)
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);

    const swal = useCallback(Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
            cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
        },
        buttonsStyling: false
    }), [])

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
            const URL = `/api/verify`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const verifySelections = response.data.data;

            setVerify(verifySelections);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, []);

    useEffect(() => {
        callVerify()
        setLoading(false)
    }, [])

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleDataInserted = async () => {
        try {
            callVerify();
            handleInsertModalClose();

        } catch (error) {
            console.error('Error inserting data:', error);
            showToastMessage(false, "Error adding verify")
        }
    };

    const handleDeleteVerify = async (id) => {
        const url = `/api/verify/${id}`;
        const options = await getOptions(url, 'DELETE');

        axios(options)
            .then(result => {
                // Handle success case (status code 200)
                const { ok, message: msg } = result.data;
                if (ok) {
                    message.success(msg);
                    callVerify(); // Refresh the data after deletion
                }
            })
            .catch(error => {
                // Handle error response (status code 400, 500, etc.)
                if (error.response) {
                    const { data, status } = error.response;
                    if (status === 400) {
                        // Handle 400 error specifically
                        message.error(data.message || 'ไม่สามารถลบได้ กรุณาลบข้อมูลที่เกี่ยวข้องก่อน');
                    } else {
                        // Generic error message for other status codes
                        message.error('เกิดข้อผิดพลาดในการลบแบบฟอร์ม');
                    }
                } else {
                    console.error(error); // Log the actual error for debugging
                    message.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
                }
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
                <ToastContainer />
                <div className='my-[30px]'>
                    <div className='bg-gray-100 border-gray-200 border-1 p-2 flex flex-row justify-end items-center rounded-md mb-4'>
                        <div className="flex md:flex-row gap-2">
                            <Button
                                radius="sm"
                                size='sm'
                                onPress={handleInsertModalOpen}
                                className='bg-gray-300'
                                color="default"
                                startContent={<PlusIcon className="w-5 h-5" />}>
                                เพิ่มแบบฟอร์มตรวจสอบจบ
                            </Button>
                        </div>
                    </div>
                    {
                        loading ?
                            <div className='w-fit mx-auto mt-14'>
                                <Loading />
                            </div>
                            :
                            <>
                                {/* {JSON.stringify(verify)} */}
                                <Table
                                    removeWrapper
                                    onRowAction={() => { }}
                                    className='overflow-x-auto'
                                    aria-label="programcode table">
                                    <TableHeader>
                                        <TableColumn></TableColumn>
                                        <TableColumn>รหัส</TableColumn>
                                        <TableColumn>ชื่อ</TableColumn>
                                        <TableColumn>หลักสูตร</TableColumn>
                                        <TableColumn>ปีการศึกษา</TableColumn>
                                        <TableColumn>วันที่สร้าง</TableColumn>
                                        <TableColumn>วันที่แก้ไข</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent={"ไม่มีข้อมูลแบบฟอร์มตรวจสอบจบ"}>
                                        {verify?.map(verifies => (
                                            <TableRow key={verifies.id}>
                                                <TableCell>
                                                    <div className='relative flex items-center gap-2'>
                                                        <Tooltip color="danger" content="ลบ">
                                                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                <DeleteIcon2 onClick={() => handleDeleteVerify(verifies?.id)} />
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{verifies.verify}</TableCell>
                                                <TableCell className="w-1/3">
                                                    <Link
                                                        href={`/admin/verify/${verifies.verify}`}
                                                        className='text-blue-500'
                                                    >{verifies.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{verifies.program}</TableCell>
                                                <TableCell>{verifies.acadyear}</TableCell>
                                                {["createdAt", "updatedAt"].map(column => (
                                                    <TableCell key={column}>
                                                        <span>{column === "createdAt" || column === "updatedAt" ? dmy(verifies[column]) : verifies[column]}</span>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                    }
                </div>

                <InsertVerify
                    isOpen={isInsertModalOpen}
                    onClose={handleInsertModalClose}
                    onDataInserted={handleDataInserted}
                />

            </ContentWrap>
        </>
    )
}

export default Page