"use client"

import { useState, useEffect } from 'react';
import { Navbar, Sidebar, CategoryInsert, CategoryUpdate, ContentWrap, BreadCrumb } from '@/app/components';
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
        const result = await axios.get(`${hostname}/api/categories`);
        const data = result.data.data;
        return data;
    } catch (error) {
        console.log(error);
    }
}

export default function Category() {
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
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchData();
                setCategories(data);
            } catch (error) {
                // Handle error if needed
                console.error('Error fetching data:', error);
            }
        };

        getData();
    }, []);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleDataInserted = async () => {
        try {
            // Fetch data again after inserting to update the list
            const data = await fetchData();
            setCategories(data);

            // Close the modal after inserting
            handleModalClose();

            const lastInsertedCategory = data[data.length - 1];
            const categoryTitle = lastInsertedCategory?.category_title || 'Unknown Category';
            showToastMessage(true, `เพิ่มหมวดหมู่วิชา ${categoryTitle} สำเร็จ`);
        } catch (error) {
            // Handle error if needed
            console.error('Error inserting data:', error);

            // Show warning toast message if there is an error
            showToastMessage(false, "Error adding category");
        }
    };

    const handleDeleteCategory = async (category) => {
        // Show a confirmation dialog using SweetAlert2
        const { value } = await Swal.fire({
            text: `ต้องการลบหมวดหมู่วิชา ${category.category_title} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        });

        // If the user clicks on "Yes, delete it!", proceed with deletion
        if (value) {
            try {
                const result = await axios.delete(`${hostname}/api/categories/deleteCategory/${category.id}`);
                // Fetch data again after deleting to update the list
                const { ok, message } = result.data
                showToastMessage(ok, `ลบหมวดหมู่วิชา ${category.category_title} สำเร็จ`)

                const data = await fetchData();
                setCategories(data);

            } catch (error) {
                const message = error?.response?.data?.message
                showToastMessage(false, message)
            }
        }
    };

    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');

    const handleUpdateModalOpen = (categoryId, categoryTitle) => {
        setSelectedCategoryId(categoryId);
        setSelectedCategoryTitle(categoryTitle);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async (categoryId) => {
        try {

            const data = await fetchData();
            setCategories(data);

            showToastMessage(true, `อัปเดตข้อมูลสำเร็จ`);
            handleUpdateModalClose()

        } catch (error) {
            // Handle error if needed
            console.error('Error updating data:', error);
            showToastMessage(false, "ไม่สามารถอัปเดตข้อมูลได้");
        }
    };

    const filteredCategories = categories.filter(category => {
        const queryLowerCase = searchQuery.toLowerCase();

        return (
            category.category_title.toLowerCase().includes(queryLowerCase) ||
            category.createdAt.toLowerCase().includes(queryLowerCase) ||
            category.updatedAt.toLowerCase().includes(queryLowerCase)
            // Add more conditions for additional columns if needed
        );
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

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
                            <div className="flex md:flex-row gap-3">
                                <Button
                                    className="w-1/2 ml-3"
                                    onPress={handleModalOpen}
                                    color="primary"
                                >
                                    เพิ่มหมวดหมู่วิชา
                                    <PlusIcon className={'w-[18px] h-[18px] text-white hidden md:block md:w-6 md:h-6'} />
                                </Button>
                                <Button
                                    className="bg-red-400 text-white w-1/2"

                                >
                                    Delete Select
                                    <DeleteIcon className={'w-[18px] h-[18px] text-white hidden md:block md:w-8 md:h-8'} />
                                </Button>
                                <Link href={'/admin/category/restore'}>
                                    <Button
                                        className="bg-gray-300 text-black"
                                        endContent={<TbRestore className={'w-[18px] h-[18px] text-black hidden md:block '} />}
                                    >
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
                        aria-label="category table">
                        <TableHeader>
                            <TableColumn>Actions</TableColumn>
                            {/* <TableColumn>#</TableColumn> */}
                            <TableColumn >ชื่อ</TableColumn>
                            <TableColumn>วันที่สร้าง</TableColumn>
                            <TableColumn>วันที่แก้ไข</TableColumn>
                        </TableHeader>
                        {currentItems.length > 0 ? (
                            <TableBody>
                                {currentItems.map((category, index) => (
                                    <TableRow key={category.id}>
                                        <TableCell className='w-1/12'>
                                            <div className='relative flex items-center gap-2'>
                                                <Tooltip content="แก้ไข">
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        <EditIcon2 onClick={() => handleUpdateModalOpen(category.id, category.category_title)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip color="danger" content="ลบ">
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon2 onClick={() => handleDeleteCategory(category)} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                        {/* <TableCell>{index + 1}</TableCell> */}
                                        <TableCell className='text-blue-500 w-1/2'>{category.category_title}</TableCell>
                                        {["createdAt", "updatedAt"].map(column => (
                                            <TableCell key={column}>
                                                <span>{column === "createdAt" || column === "updatedAt" ? dmy(category[column]) : category[column]}</span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลหมวดหมู่วิชา"}>{[]}</TableBody>
                        )}
                    </Table>
                    <Pagination
                        onChange={handlePageChange}
                        current={currentPage}
                        total={Math.ceil(filteredCategories.length / itemsPerPage)}
                        isCompact
                        showControls
                        loop
                        className="flex justify-center mt-3"
                    />
                    <CategoryInsert isOpen={isModalOpen} onClose={handleModalClose} onDataInserted={handleDataInserted} />

                    <CategoryUpdate
                        isOpen={isUpdateModalOpen}
                        onClose={handleUpdateModalClose}
                        onUpdate={handleDataUpdated}
                        categoryId={selectedCategoryId}
                        currentTitle={selectedCategoryTitle}
                    />
                </div>
            </ContentWrap>
        </>
    );
}
