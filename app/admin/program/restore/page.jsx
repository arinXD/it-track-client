"use client"

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';

import Swal from 'sweetalert2';
import { dmy } from "@/src/util/dateFormater";

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Button,
    Tooltip
} from "@nextui-org/react";
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from 'next/link';
import { TbRestore } from "react-icons/tb";

async function fetchDatas() {
    try {
        const programResult = await axios.get(`${hostname}/api/programs/getrestore`);
        const program = programResult.data.data;

        return { program };
    } catch (error) {
        console.error("Fetch error:", error);
    }
}


export default function RestoreProgramCode() {
    const [restores, setRestores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const showToastMessage = (ok, message) => {
        if (ok) {
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.warning(message, {
                position: toast.POSITION.TOP_RIGHT,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    useEffect(() => {
        fetchDatas().then(data => {
            console.log(data);
            setRestores(data.program)
        }).catch(err => {
            console.log("error on useeffect:", err);
        });
    }, []);

    const handleRestore = async (program) => {
        const { value } = await Swal.fire({
            text: `ต้องการคืนค่าหลักสูตร ${program} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        });
        if (value) {
            try {
                const result = await axios.post(`${hostname}/api/programs/restorePrograms/${program}`);
                const { ok, message } = result.data
                showToastMessage(true, `คืนค่าหลักสูตร ${program} สำเร็จ`)
                const data = await fetchDatas();
                setRestores(data.program)
            } catch (error) {
                const message = error?.response?.data?.message
                showToastMessage(false, `คืนค่าหลักสูตรไม่สำเร็จ`)
            }
        }
    };


    const filteredProgram = restores.filter(program => {
        const queryLowerCase = searchQuery.toLowerCase();

        return (
            program.program.toLowerCase().includes(queryLowerCase) ||
            program.title_en.toLowerCase().includes(queryLowerCase) ||
            program.title_th.toLowerCase().includes(queryLowerCase)
        );
    });

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
                    <div className="flex flex-col md:flex-row justify-end gap-3 mb-3">
                        <div className='flex justify-end'>
                            <div className="flex justify-center items-center rounded-e-none py-2 px-3 text-sm text-gray-900 rounded-lg bg-gray-100">
                                <SearchIcon width={16} height={16} />
                            </div>
                            <input
                                type="search"
                                id="search"
                                className="rounded-s-none pl-0 py-2 px-4 text-sm text-gray-900 rounded-lg bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                className="bg-gray-300 text-black w-1/2 ml-3"
                            >
                                คืนค่ารายการทั้งหมด
                                <TbRestore className={'w-5 h-5 text-black hidden md:block '} />
                            </Button>

                        </div>
                    </div>
                    <Table
                        removeWrapper
                        selectionMode="multiple"
                        onRowAction={() => { }}
                        aria-label="programcode table"
                    >
                        <TableHeader>
                            <TableColumn>#</TableColumn>
                            <TableColumn>หลักสูตร</TableColumn>
                            <TableColumn>ชื่ออังกฤษ</TableColumn>
                            <TableColumn>ชื่อไทย</TableColumn>
                            <TableColumn>วันที่ลบ</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        {filteredProgram.length > 0 ? (
                            <TableBody>
                                {filteredProgram.map((program, index) => (
                                    <TableRow key={program.program}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{program.program}</TableCell>
                                        <TableCell>{program.title_en || "-"}</TableCell>
                                        <TableCell>{program.title_th || "-"}</TableCell>
                                        <TableCell>{dmy(program.deletedAt || "-")}</TableCell>
                                        <TableCell>
                                            <div className='relative flex items-center gap-2'>
                                                <Tooltip color="primary" content="คืนค่า">
                                                    <span className="text-lg text-primary-400 cursor-pointer active:opacity-50">
                                                        <TbRestore onClick={() => handleRestore(program.program)} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลหลักสูตร"}>{[]}</TableBody>
                        )}
                    </Table>
                </div>
            </ContentWrap>

        </>
    );
}