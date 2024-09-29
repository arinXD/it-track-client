"use client"

import { useState, useEffect, useCallback } from 'react';
import { Navbar, Sidebar, SubGroupInsert, SubGroupUpdate, ContentWrap, BreadCrumb } from '@/app/components';
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
import { TbRestore } from "react-icons/tb";
import Link from 'next/link';
import { fetchData, fetchDataObj } from '../action';
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import InsertSemi from './insertSemi';
import { Empty, message } from 'antd';


export default function SemiSubGroup() {
    const [semi, setSemi] = useState([]);
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);

    const callSemi = useCallback(async () => {
        try {
            const URL = `/api/semisubgroups`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const semisubgroups = response.data.data;
            setSemi(semisubgroups);
            console.log(semisubgroups);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, []);

    useEffect(() => {
        callSemi();
    }, [])

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleDataInserted = async () => {
        try {
            callSemi();
            handleInsertModalClose();

        } catch (error) {
            console.error('Error inserting data:', error);
            showToastMessage(false, "Error adding")
        }
    };

    const handleDeleteSemi = async (id) => {
        const url = `/api/semisubgroups/${id}`
        const options = await getOptions(url, 'DELETE')
        axios(options)
            .then(async result => {
                const { ok, message:msg } = result.data
                message.success(msg)
                callSemi();
            })
            .catch(error => {
                const { ok, message:msg } = result.data
                message.success(msg)
            })
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
                            // value={searchQuery}
                            // onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="flex md:flex-row gap-3 ml-3">
                                <Button
                                    radius="sm"
                                    onPress={handleInsertModalOpen}
                                    color="primary"
                                    endContent={<PlusIcon width={16} height={16} />}>
                                    เพิ่มกลุ่มรองวิชา
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Table
                        removeWrapper
                        onRowAction={() => { }}
                        aria-label="subgroup table">
                        <TableHeader>
                            <TableColumn>Actions</TableColumn>
                            <TableColumn>กลุ่มรองวิชา</TableColumn>
                            <TableColumn>กลุ่มย่อยวิชา</TableColumn>
                            <TableColumn>กลุ่มวิชา</TableColumn>
                            <TableColumn>วันที่สร้าง</TableColumn>
                            <TableColumn>วันที่แก้ไข</TableColumn>
                        </TableHeader>
                        {semi.length > 0 ? (
                            <TableBody>
                                {semi.map(semisubgroup => (
                                    <TableRow key={semisubgroup.id}>
                                        <TableCell>
                                            <div className='relative flex items-center gap-2'>
                                                <Tooltip color="danger" content="ลบ">
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon2 onClick={() => handleDeleteSemi(semisubgroup.id)} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                        <TableCell>{semisubgroup.semi_sub_group_title}</TableCell>
                                        <TableCell>{semisubgroup.SubGroup ? semisubgroup.SubGroup.sub_group_title : 'ไม่มีกลุ่มย่อยวิชา'}</TableCell>
                                        <TableCell>{semisubgroup.SubGroup.Group ? semisubgroup.SubGroup.Group.group_title : 'ไม่มีกลุ่มวิชา'}</TableCell>
                                        {["createdAt", "updatedAt"].map(column => (
                                            <TableCell key={column}>
                                                <span>{column === "createdAt" || column === "updatedAt" ? dmy(semisubgroup[column]) : semisubgroup[column]}</span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลกลุ่มรองวิชา"}>{[]}</TableBody>
                        )}
                    </Table>
                </div>
                <InsertSemi
                    isOpen={isInsertModalOpen}
                    onClose={handleInsertModalClose}
                    onDataInserted={handleDataInserted}
                />

            </ContentWrap>
        </>
    )
}