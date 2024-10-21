"use client"

// Program.js
import { useState, useEffect, useCallback } from 'react';
import { Navbar, Sidebar, ProgramInsert, ProgramUpdate, ContentWrap, BreadCrumb } from '@/app/components';
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
import { TbRestore } from "react-icons/tb";

import Link from 'next/link';
import { tableClass } from '@/src/util/ComponentClass';

import { Empty, message } from 'antd';
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'


export default function Program() {
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedProgramForUpdate, setSelectedProgramForUpdate] = useState(null);
    const [programs, setPrograms] = useState([]);
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

    const callprogram = useCallback(async () => {
        try {
            const URL = `/api/programs`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const pro = response.data.data;

            console.log(pro);


            setPrograms(pro);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, []);

    useEffect(() => {
        callprogram();
    }, [])

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleDataInserted = async () => {
        try {

            callprogram();
            handleInsertModalClose();

        } catch (error) {
            console.error('Error inserting data:', error);

            // Show warning toast message if there is an error
            showToastMessage(false, "Error adding program");
        }
    };

    const handleUpdateModalOpen = (program) => {
        setSelectedProgramForUpdate(program);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedProgramForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async () => {
        try {
            callprogram();
            handleUpdateModalClose();

        } catch (error) {
            console.error('Error updating data:', error);
            showToastMessage(false, "Error updating program");
        }
    };

    const handleDeleteProgram = async (program) => {
        const swal = Swal.mixin({
            customClass: {
                confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
                cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
            },
            buttonsStyling: false
        });
        const { value } = await swal.fire({
            text: `ต้องการลบหลักสูตร ${program.title_th ? program.title_th : program.program} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        });

        if (value) {
            try {
                const url = `/api/programs/deleteProgram/${program.program}`
                const options = await getOptions(url, 'DELETE')
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        showToastMessage(ok, message)
                    })
                    .catch(error => {
                        showToastMessage(false, error)
                    })
                callprogram();

            } catch (error) {
                const message = error?.response?.data?.message
                showToastMessage(false, message)
            }
        }
    };
    const filteredProgram = programs.filter(program => {
        const queryLowerCase = searchQuery.toLowerCase();

        return (
            program.program.toLowerCase().includes(queryLowerCase) ||
            program.title_en.toLowerCase().includes(queryLowerCase) ||
            program.title_th.toLowerCase().includes(queryLowerCase) ||
            program.createdAt.toLowerCase().includes(queryLowerCase) ||
            program.updatedAt.toLowerCase().includes(queryLowerCase)
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
                    <div className="flex justify-end gap-3 mb-3">
                        <div className='flex justify-end max-md:w-full'>
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
                            <div className="flex md:flex-row w-full gap-3 ml-3">
                                <Button
                                    radius="sm"
                                    onPress={handleInsertModalOpen}
                                    color="primary"
                                    className='max-md:w-1/2'
                                    endContent={<PlusIcon width={16} height={16} />}>
                                    เพิ่มหลักสูตร
                                </Button>
                                <Link href={'/admin/program/restore'} className='max-md:w-1/2'>
                                    <Button
                                        radius="sm"
                                        className='max-md:w-full'
                                        color="default"
                                        endContent={<TbRestore className="w-[18px] h-[18px]" />}>
                                        รายการที่ถูกลบ
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Table
                        removeWrapper
                        onRowAction={() => { }}
                        className='overflow-x-auto'
                        aria-label="program table"
                    >
                        <TableHeader>
                            <TableColumn>Actions</TableColumn>
                            <TableColumn>หลักสูตร</TableColumn>
                            <TableColumn>ชื่อไทย</TableColumn>
                            <TableColumn>ชื่ออังกฤษ</TableColumn>
                            <TableColumn>วันที่สร้าง</TableColumn>
                            <TableColumn>วันที่แก้ไข</TableColumn>
                        </TableHeader>
                        {filteredProgram.length > 0 ? (
                            <TableBody>
                                {filteredProgram.map(program => (
                                    <TableRow key={program.program}>
                                        <TableCell>
                                            <div className='relative flex items-center gap-2'>
                                                <Tooltip content="แก้ไข">
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        <EditIcon2 onClick={() => handleUpdateModalOpen(program)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip color="danger" content="ลบ">
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon2 onClick={() => handleDeleteProgram(program)} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                        <TableCell>{program.program || "-"}</TableCell>
                                        <TableCell>{program.title_th || "-"}</TableCell>
                                        <TableCell>{program.title_en || "-"}</TableCell>
                                        {["createdAt", "updatedAt"].map(column => (
                                            <TableCell key={column}>
                                                <span>{column === "createdAt" || column === "updatedAt" ? dmy(program[column]) : program[column]}</span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลหลักสูตร"}>{[]}</TableBody>
                        )}
                    </Table>
                </div>

                {/* Render the ProgramInsert modal */}
                <ProgramInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />

                {/* Render the ProgramUpdate modal */}
                <ProgramUpdate
                    isOpen={isUpdateModalOpen}
                    onClose={handleUpdateModalClose}
                    onUpdate={handleDataUpdated}
                    programId={selectedProgramForUpdate ? selectedProgramForUpdate.program : null}
                />
            </ContentWrap>
        </>
    );
}
