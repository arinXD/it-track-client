"use client"

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, GroupInsert, GroupUpdate, ContentWrap, BreadCrumb } from '@/app/components';
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
    Tooltip,
    Pagination
} from "@nextui-org/react";
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from 'next/link';
import { TbRestore } from "react-icons/tb";

async function fetchData() {
    try {
        const result = await axios.get(`${hostname}/api/groups`);
        const data = result.data.data;
        let groupData = []
        if (data.length) {
            groupData = await Promise.all(data.map(async group => {
                const categoryResult = await axios.get(`${hostname}/api/categories/${group.category_id}`);
                const categoryData = categoryResult.data.data;

                return {
                    ...group,
                    category: categoryData
                };
            }));
        }

        return groupData;
    } catch (error) {
        console.log(error);
        return [{ "group_title": "ไม่มี" }];
    }
}

export default function Group() {
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedGroupForUpdate, setSelectedGroupForUpdate] = useState(null);
    const [groups, setGroups] = useState([]);
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
        fetchData().then(data => setGroups(data));
    }, []);

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleDataInserted = async () => {
        try {
            const data = await fetchData();
            setGroups(data);
            handleInsertModalClose();
        } catch (error) {
            console.error('Error inserting data:', error);

            // Show warning toast message if there is an error
            showToastMessage(false, "Error adding group");
        }
    };


    const handleUpdateModalOpen = (group) => {
        setSelectedGroupForUpdate(group);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedGroupForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async () => {
        try {

            const data = await fetchData();
            setGroups(data);

            showToastMessage(true, `อัปเดตข้อมูลสำเร็จ`);
            handleUpdateModalClose();
        } catch (error) {
            console.error('Error updating data:', error);
            showToastMessage(false, "Error updating group");
        }
    };

    const handleDeleteGroup = async (group) => {
        const swal = Swal.mixin({
            customClass: {
                confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
                cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
            },
            buttonsStyling: false
        });
        const { value } = await swal.fire({
            text: `ต้องการลบกลุ่มวิชา ${group.group_title} หรือไม่ ?`,
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
                const result = await axios.delete(`${hostname}/api/groups/deleteGroup/${group.id}`);

                const { ok, message } = result.data
                showToastMessage(ok, `ลบกลุ่มวิชา ${group.group_title} สำเร็จ`)

                const data = await fetchData();
                setGroups(data);
            } catch (error) {

                const message = error?.response?.data?.message
                showToastMessage(false, message)
            }
        }
    };
    const filteredGroup = groups.filter(group => {
        const queryLowerCase = searchQuery.toLowerCase();

        return (
            group.category.category_title.toLowerCase().includes(queryLowerCase) ||
            group.group_title.toLowerCase().includes(queryLowerCase) ||
            group.createdAt.toLowerCase().includes(queryLowerCase) ||
            group.updatedAt.toLowerCase().includes(queryLowerCase)
        );
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredGroup.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                                onChange={(e) => setSearchQuery(e.target.value)} // Step 2
                            />
                            <div className="flex md:flex-row gap-3 ml-3">
                                <Button
                                    radius="sm"
                                    onPress={handleInsertModalOpen}
                                    color="primary"
                                    endContent={<PlusIcon width={16} height={16} />}>
                                    เพิ่มกลุ่มวิชา
                                </Button>
                                <Link href={'/admin/group/restore'}>
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
                        onRowAction={() => { }}
                        aria-label="group table">
                        <TableHeader>
                            <TableColumn>Actions</TableColumn>
                            <TableColumn>กลุ่มวิชา</TableColumn>
                            <TableColumn>หมวดหมู่วิชา</TableColumn>
                            <TableColumn>วันที่สร้าง</TableColumn>
                            <TableColumn>วันที่แก้ไข</TableColumn>
                        </TableHeader>
                        {currentItems.length > 0 ? (
                            <TableBody>
                                {currentItems.map(group => (
                                    <TableRow key={group.id}>
                                        <TableCell>
                                            <div className='relative flex items-center gap-2'>
                                                <Tooltip content="แก้ไข">
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        <EditIcon2 onClick={() => handleUpdateModalOpen(group)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip color="danger" content="ลบ">
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon2 onClick={() => handleDeleteGroup(group)} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                        <TableCell>{group.group_title}</TableCell>
                                        <TableCell>{group.category ? group.category.category_title : 'No Group'}</TableCell>
                                        {["createdAt", "updatedAt"].map(column => (
                                            <TableCell key={column}>
                                                <span>{column === "createdAt" || column === "updatedAt" ? dmy(group[column]) : group[column]}</span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลกลุ่มวิชา"}>{[]}</TableBody>
                        )}
                    </Table>
                    <Pagination
                        onChange={handlePageChange}
                        current={currentPage}
                        total={Math.ceil(filteredGroup.length / itemsPerPage)}
                        isCompact
                        showControls
                        loop
                        className="flex justify-center mt-3"
                    />
                </div>
                {/* Render the GroupInsert modal */}
                <GroupInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />

                <GroupUpdate
                    isOpen={isUpdateModalOpen}
                    onClose={handleUpdateModalClose}
                    onUpdate={handleDataUpdated}
                    groupId={selectedGroupForUpdate ? selectedGroupForUpdate.id : null}
                />
            </ContentWrap>
        </>
    );
}

