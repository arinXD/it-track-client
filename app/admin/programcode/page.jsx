"use client"

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, ProgramCodeInsert, ProgramCodeUpdate, ContentWrap, BreadCrumb } from '@/app/components';
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

export default function ProgramCode() {
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedProgramCodeForUpdate, setSelectedProgramCodeForUpdate] = useState(null);
    const [programCodes, setProgramCodes] = useState([]);
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

    async function fetchData() {
        try {
            const result = await axios.get(`${hostname}/api/programcodes`);
            const data = result.data.data;

            const programcodeData = await Promise.all(data.map(async programcode => {
                const programResult = await axios.get(`${hostname}/api/programs/${programcode.program}`);
                const programData = programResult.data.data;

                return {
                    ...programcode,
                    program: programData
                };
            }));

            return programcodeData;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData().then(data => setProgramCodes(data));
    }, []);

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleUpdateModalOpen = (programCode) => {
        setSelectedProgramCodeForUpdate(programCode);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedProgramCodeForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataInserted = async () => {
        try {
            const data = await fetchData();
            setProgramCodes(data);
            handleInsertModalClose();

        } catch (error) {
            console.error('Error inserting data:', error);
            showToastMessage(false, "Error adding programcode")
        }

    };

    const handleDataUpdated = async () => {
        try {
            const data = await fetchData();
            setProgramCodes(data);
            console.log(data);
            showToastMessage(true, `อัปเดตข้อมูลสำเร็จ`);
            handleUpdateModalClose();

        } catch (error) {
            console.error('Error updating data:', error);
            showToastMessage(false, "Error updating programcode");
        }
    };

    const handleDeleteProgramCode = async (programCodeId) => {
        const swal = Swal.mixin({
            customClass: {
                confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
                cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
            },
            buttonsStyling: false
        });
        const { value } = await swal.fire({
            text: `ต้องการลบรหัสหลักสูตร ${programCodeId.program_code} หรือไม่ ?`,
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
                const result = await axios.delete(`${hostname}/api/programcodes/deleteProgramCode/${programCodeId.program_code}`);
                const { ok, message } = result.data
                showToastMessage(true, `ลบรหัสหลักสูตร ${programCodeId.program_code} สำเร็จ`)

                const data = await fetchData();
                setProgramCodes(data);
            } catch (error) {
                const message = error?.response?.data?.message
                showToastMessage(false, message)
            }
        }
    };
    const filteredProgramcode = programCodes.filter(programcode => {
        const queryLowerCase = searchQuery.toLowerCase();

        return (
            (programcode.program.title_th && programcode.program.title_th.toLowerCase().includes(queryLowerCase)) ||
            (programcode.program_code && programcode.program_code.toLowerCase().includes(queryLowerCase)) ||
            (programcode.desc && programcode.desc.toLowerCase().includes(queryLowerCase)) ||
            (programcode.version && programcode.version.toString().toLowerCase().includes(queryLowerCase)) ||
            (programcode.createdAt && programcode.createdAt.toLowerCase().includes(queryLowerCase)) ||
            (programcode.updatedAt && programcode.updatedAt.toLowerCase().includes(queryLowerCase))
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
                            <div className="flex md:flex-row gap-3 ml-3">
                                <Button
                                    radius="sm"
                                    onPress={handleInsertModalOpen}
                                    color="primary"
                                    endContent={<PlusIcon width={16} height={16} />}>
                                    เพิ่มรหัสหลักสูตร
                                </Button>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    endContent={<DeleteIcon2 width={16} height={16} />}>
                                    ลบรายการที่เลือก
                                </Button>
                                <Link href={'/admin/programcode/restore'}>
                                    <Button
                                        radius="sm"
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
                        selectionMode="multiple"
                        onRowAction={() => { }}
                        aria-label="programcode table">
                        <TableHeader>
                            <TableColumn>Actions</TableColumn>
                            <TableColumn>รหัสหลักสูตร</TableColumn>
                            <TableColumn>หลักสูตร</TableColumn>
                            <TableColumn>ปีการศึกษา</TableColumn>
                            <TableColumn>คำอธิบาย</TableColumn>
                            <TableColumn>วันที่สร้าง</TableColumn>
                            <TableColumn>วันที่แก้ไข</TableColumn>
                        </TableHeader>
                        {filteredProgramcode.length > 0 ? (
                            <TableBody>
                                {filteredProgramcode.map(programcode => (
                                    <TableRow key={programcode.program_code}>
                                        <TableCell>
                                            <div className='relative flex items-center gap-2'>
                                                <Tooltip content="แก้ไข">
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        <EditIcon2 onClick={() => handleUpdateModalOpen(programcode)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip color="danger" content="ลบ">
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon2 onClick={() => handleDeleteProgramCode(programcode)} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                        <TableCell>{programcode.program_code}</TableCell>
                                        <TableCell>{programcode.program ? programcode.program.title_th : 'ไม่มีหลักสูตร'}</TableCell>
                                        <TableCell>{programcode.version || "-"}</TableCell>
                                        <TableCell>{programcode.desc || "-"}</TableCell>
                                        {["createdAt", "updatedAt"].map(column => (
                                            <TableCell key={column}>
                                                <span>{column === "createdAt" || column === "updatedAt" ? dmy(programcode[column]) : programcode[column]}</span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลรหัสหลักสูตร"}>{[]}</TableBody>
                        )}
                    </Table>
                </div>

                {/* Render the ProgramCodeInsert modal */}
                <ProgramCodeInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />

                {/* Render the ProgramCodeUpdate modal */}
                <ProgramCodeUpdate
                    isOpen={isUpdateModalOpen}
                    onClose={handleUpdateModalClose}
                    onUpdate={handleDataUpdated}
                    programCodeId={selectedProgramCodeForUpdate ? selectedProgramCodeForUpdate.id : null}
                />
            </ContentWrap>
        </>
    );
}