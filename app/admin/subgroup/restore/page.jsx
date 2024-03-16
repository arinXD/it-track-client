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
        const result = await axios.get(`${hostname}/api/subgroups/getrestore`);
        const data = result.data.data;

        const subGroupData = await Promise.all(data.map(async subgroup => {
            const groupResult = await axios.get(`${hostname}/api/groups/${subgroup.group_id}`);
            const groupData = groupResult.data.data;

            // Fetch category details for each group
            const categoryResult = await axios.get(`${hostname}/api/categories/${groupData.category_id}`);
            const categoryData = categoryResult.data.data;

            return {
                ...subgroup,
                group: groupData,
                category: categoryData
            };
        }));

        return subGroupData;
    } catch (error) {
        console.log(error);
        return [{ "sub_group_title": "ไม่มี" }];
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
        fetchDatas().then(data => setRestores(data));
    }, []);

    const handleRestore = async (id) => {
        const swal = Swal.mixin({
            customClass: {
                confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
                cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
            },
            buttonsStyling: false
        });
        const { value } = await swal.fire({
            text: `ต้องการคืนค่ากลุ่มย่อยวิชา ${id.sub_group_title} หรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        });
        if (value) {
            try {
                const result = await axios.post(`${hostname}/api/subgroups/restoreSubGroup/${id.id}`);
                const { ok, message } = result.data
                showToastMessage(true, `คืนค่ารหัสกลุ่มย่อยวิชา ${id.sub_group_title} สำเร็จ`)
                const data = await fetchDatas();
                setRestores(data)
            } catch (error) {
                const message = error?.response?.data?.message
                showToastMessage(false, message)
            }
        }
    };


    const filteredSubGroup = restores.filter(subgroup => {
        const queryLowerCase = searchQuery.toLowerCase();

        return (
            subgroup.category.category_title.toLowerCase().includes(queryLowerCase) ||
            subgroup.group.group_title.toLowerCase().includes(queryLowerCase) ||
            subgroup.sub_group_title.toLowerCase().includes(queryLowerCase)
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
                            className='ml-3'
                                radius="sm"
                                color="default"
                                endContent={<TbRestore className="w-[18px] h-[18px]" />}>
                                กู้คืนรายการที่เลือก
                            </Button>

                        </div>
                    </div>
                    <Table
                        removeWrapper
                        selectionMode="multiple"
                        onRowAction={() => { }}
                        aria-label="subgroup table"
                    >
                        <TableHeader>
                            <TableColumn>#</TableColumn>
                            <TableColumn>กลุ่มย่อยวิชา</TableColumn>
                            <TableColumn>กลุ่มวิชา</TableColumn>
                            <TableColumn>หมวดหมู่วิชา</TableColumn>
                            <TableColumn>วันที่ลบ</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        {filteredSubGroup.length > 0 ? (
                            <TableBody>
                                {filteredSubGroup.map((subgroup, index) => (
                                    <TableRow key={subgroup.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{subgroup.sub_group_title}</TableCell>
                                        <TableCell>{subgroup.group ? subgroup.group.group_title : '-'}</TableCell>
                                        <TableCell>{subgroup.category ? subgroup.category.category_title : '-'}</TableCell>
                                        <TableCell>{dmy(subgroup.deletedAt || "-")}</TableCell>
                                        <TableCell>
                                            <div className='relative flex items-center gap-2'>
                                                <Tooltip color="primary" content="คืนค่า">
                                                    <span className="text-lg text-primary-400 cursor-pointer active:opacity-50">
                                                        <TbRestore onClick={() => handleRestore(subgroup)} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลกลุ่มย่อยวิชา"}>{[]}</TableBody>
                        )}
                    </Table>
                </div>
            </ContentWrap>

        </>
    );
}