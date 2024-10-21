"use client"
// Subject.js
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, SubjectInsert, SubjectUpdate, ExcelUpload, ContentWrap, BreadCrumb } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
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
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegFile } from "react-icons/fa6";
import { TbFileImport } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';

import { fetchData } from '../action'

import { getAcadyears } from "@/src/util/academicYear";
import { Empty, message } from 'antd';
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { FiDownload, FiTrash } from "react-icons/fi";


async function fetchDatas() {
    try {
        let option = await getOptions("/api/subjects", "GET")
        const result = await axios(option)
        const subjects = result.data.data;

        option = await getOptions("/api/tracks/all", "GET")
        const track = await axios(option)
        const tracks = track.data.data;
        // const groupResult = await axios.get(`${hostname}/api/groups`);
        // const groups = groupResult.data.data;

        // const acadyears = getAcadyears().map(acadyear => ({
        //     value: acadyear,
        //     label: acadyear
        // }));

        // const subgroupResult = await axios.get(`${hostname}/api/subgroups`);
        // const subgroups = subgroupResult.data.data;

        // const programResult = await axios.get(`${hostname}/api/programs`);
        // const programs = programResult.data.data;


        return { subjects, tracks }
        // return { subjects, groups, acadyears, subgroups, programs }
    } catch (error) {
        console.log("fetch error:", error);
    }
}

export default function Subject() {
    const [subjects, setSubjects] = useState([]);
    const [tracks, setTracks] = useState([])
    // const [groups, setGroups] = useState([]);
    // const [acadyears, setAcadyears] = useState([]);
    // const [subgroups, setSubgroups] = useState([]);
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isImportModalOpen, setImportModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedSubjectForUpdate, setSelectedSupjectForUpdate] = useState(null);
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
            setSubjects(data.subjects)
            setTracks(data.tracks)
            // setGroups(data.groups)
            // setAcadyears(data.acadyears);
            // setSubgroups(data.subgroups)

        }).catch(err => {
            console.log("error on useeffect:", err);
        });
    }, []);

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleImportModalOpen = () => {
        setImportModalOpen(true);
    };

    const handleImportModalClose = () => {
        setImportModalOpen(false);
    };



    const handleUpdateModalOpen = (group) => {
        setSelectedSupjectForUpdate(group);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedSupjectForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async () => {
        try {
            const data = await fetchDatas();
            setSubjects(data.subjects)
            setTracks(data.tracks)
            // setGroups(data.groups)
            // setAcadyears(data.acadyears)
            // setSubgroups(data.subgroups)
            // Close the modal after updating
            showToastMessage(true, `อัปเดตข้อมูลสำเร็จ`);
            handleUpdateModalClose();

        } catch (error) {
            console.error('Error updating data:', error);
            showToastMessage(false, "Error updating subject");

        }
    };

    const handleDataInserted = async () => {
        try {
            const data = await fetchDatas();
            setSubjects(data.subjects)
            setTracks(data.tracks)
            // setGroups(data.groups)
            // setAcadyears(data.acadyears)
            // setSubgroups(data.subgroups)

            handleInsertModalClose();
            handleImportModalClose()

        } catch (error) {
            console.error('Error inserting data:', error);
            showToastMessage(false, "Error adding subject");
        }
    };


    const handleDeleteSubject = async (subjectId) => {
        const swal = Swal.mixin({
            customClass: {
                confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
                cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
            },
            buttonsStyling: false
        });
        const { value } = await swal.fire({
            text: `ต้องการลบวิชา ${subjectId.title_th ? subjectId.title_th : subjectId.subject_code} หรือไม่ ?`,
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
                const url = `/api/subjects/deleteSubject/${subjectId.subject_id}`
                const options = await getOptions(url, 'DELETE')
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        showToastMessage(ok, message)
                    })
                    .catch(error => {
                        showToastMessage(false, error)
                    })

                const data = await fetchDatas();
                setSubjects(data.subjects);

            } catch (error) {
                const message = error?.response?.data?.message
                showToastMessage(false, "ข้อมูลถูกเชื่อมกับอีกตาราง")
            }
        }
    };
    const getTrackTitle = (trackId) => {
        const track = tracks.find(e => e.track === trackId);
        return track ? track.track : '-';
    }

    // const getAcadyearTitle = (acadYearId) => {
    //     const acadYear = acadyears.find(e => e.acadyear === acadYearId);
    //     return acadYear ? acadYear.acadyear : '-';
    // };

    // const getGroupTitle = (groupId) => {
    //     const group = groups.find(e => e.id === groupId);
    //     return group ? group.group_title : '-';
    // };

    // const getSubGroupTitle = (subGroupId) => {
    //     const subGroup = subgroups.find(e => e.id === subGroupId);
    //     return subGroup ? subGroup.sub_group_title : '-';
    // };

    const handleExportCSV = () => {
        try {
            const csvData = subjects.map(subject => [
                // getAcadyearTitle(subject.acadyear),
                // getGroupTitle(subject.group_id),
                // getSubGroupTitle(subject.sub_group_id),
                // subject.semester || "-",
                subject.subject_code || "-",
                subject.title_th || "-",
                subject.title_en || "-",
                subject.credit || "-",
                subject.information || "-",
            ]);

            const csvHeaders = [
                // 'Acadyear', 'Group', 'SubGroup', 'Semester', 'Subject Code',
                // 'Title (TH)', 'Title (EN)', 'Information', 'Credit'
                'subject_code', 'title_th', 'title_en', 'credit', 'information'
            ];

            csvData.unshift(csvHeaders);

            const csvFilename = 'subjects_data.csv';
            const csvBlob = new Blob([csvData.map(row => row.join(',')).join('\n')], { type: 'text/csv' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(csvBlob);
            link.download = csvFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToastMessage(true, 'CSV export successful');
        } catch (error) {
            console.error('Error exporting CSV:', error);
            showToastMessage(false, 'Error exporting CSV');
        }
    };

    const handleExportExcel = () => {
        try {
            // Create a workbook with a worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(subjects.map(subject => ({
                // 'Acadyear': getAcadyearTitle(subject.acadyear),
                // Group: getGroupTitle(subject.group_id),
                // SubGroup: getSubGroupTitle(subject.sub_group_id),
                // Semester: subject.semester || "-",
                'subject_code': subject.subject_code || "-",
                'title_th': subject.title_th || "-",
                'title_en': subject.title_en || "-",
                credit: subject.credit || "-",
                information: subject.information || "-",
            })));

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Subjects');

            // Save the workbook to a file
            XLSX.writeFile(wb, 'subjects_data.xlsx');

            showToastMessage(true, 'Excel export successful');
        } catch (error) {
            console.error('Error exporting Excel:', error);
            showToastMessage(false, 'Error exporting Excel');
        }
    };

    const handleExportExcelTemplate = () => {
        try {
            // Create a workbook with a worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(subjects.map(subject => ({
                // 'Acadyear': getAcadyearTitle(subject.acadyear),
                // Group: getGroupTitle(subject.group_id),
                // SubGroup: getSubGroupTitle(subject.sub_group_id),
                // Semester: subject.semester || "-",
                'subject_code': "",
                'title_th': "",
                'title_en': "",
                'credit': "",
                'information': "",
            })));

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Subjects');

            // Save the workbook to a file
            XLSX.writeFile(wb, 'subjects_template.xlsx');

            showToastMessage(true, 'Excel export successful');
        } catch (error) {
            console.error('Error exporting Excel:', error);
            showToastMessage(false, 'Error exporting Excel');
        }
    };

    const filteredSubject = subjects.filter(subject => {
        const queryLowerCase = searchQuery.toLowerCase();

        return (
            // (subject.acadyear && subject.acadyear.acadyear && subject.acadyear.acadyear.toLowerCase().includes(queryLowerCase)) ||
            // (subject.group_id && subject.group_id.group_title && subject.group_id.group_title.toLowerCase().includes(queryLowerCase)) ||
            // (subject.sub_group_id && subject.sub_group_id.sub_group_title && subject.sub_group_id.sub_group_title.toLowerCase().includes(queryLowerCase)) ||
            // (subject.semester && subject.semester.toLowerCase().includes(queryLowerCase)) ||
            (subject.subject_code && subject.subject_code.toLowerCase().includes(queryLowerCase)) ||
            (subject.title_th && subject.title_th.toLowerCase().includes(queryLowerCase)) ||
            (subject.title_en && subject.title_en.toLowerCase().includes(queryLowerCase)) ||
            (subject.information && subject.information.toLowerCase().includes(queryLowerCase)) ||
            (typeof subject.credit === 'string' && subject.credit.toLowerCase().includes(queryLowerCase)) ||
            (subject.createdAt && subject.createdAt.toLowerCase().includes(queryLowerCase)) ||
            (subject.updatedAt && subject.updatedAt.toLowerCase().includes(queryLowerCase))
        );
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSubject.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const handleSearchChange = (query) => {
        setSearchQuery(query);
        // Reset pagination to page 1 when search query changes
        setCurrentPage(1);
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
                    <div className='flex flex-col justify-between items-center gap-3 mb-3 lg:flex-row'>
                        <div className="flex gap-3 w-full">
                            <Button
                                radius="sm"
                                className='max-lg:w-1/2'
                                onPress={handleExportExcel}
                                style={{ backgroundColor: '#107C41', color: 'white' }}
                                endContent={<RiFileExcel2Line width={16} height={16} />}>
                                Export to Excel
                            </Button>
                            <Button
                                radius="sm"
                                className='max-lg:w-1/2'
                                onPress={handleExportCSV}
                                style={{ backgroundColor: '#149403', color: 'white' }}
                                endContent={<TbFileImport width={16} height={16} />}>
                                Export to CSV
                            </Button>
                        </div>
                        <div className='flex max-lg:w-full'>
                            <div className='flex'>
                                <div className="flex justify-center items-center rounded-e-none py-2 px-3 text-sm text-gray-900 rounded-lg bg-gray-100">
                                    <SearchIcon width={16} height={16} />
                                </div>
                                <input
                                    type="search"
                                    id="search"
                                    className="rounded-s-none pl-0 py-2 px-4 text-sm text-gray-900 rounded-lg bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 ml-3 w-full justify-end">
                                <Button
                                    radius="sm"
                                    onPress={handleInsertModalOpen}
                                    className='max-lg:w-1/2'
                                    color="primary"
                                    endContent={<PlusIcon width={16} height={16} />}>
                                    เพิ่มวิชา
                                </Button>
                                <Button
                                    radius="sm"
                                    className='max-lg:w-1/2'
                                    onPress={handleImportModalOpen}
                                    onDataInsertXlsx={handleDataInserted}
                                    isOpen={isImportModalOpen}
                                    onClose={handleImportModalClose}
                                    style={{ backgroundColor: '#24b565', color: 'white' }}
                                    endContent={<FaRegFile width={16} height={16} />}>
                                    Import Excel
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Table
                        removeWrapper
                        onRowAction={() => { }}
                        className='overflow-x-auto'
                        aria-label="subject table">
                        <TableHeader>
                            <TableColumn>Actions</TableColumn>
                            <TableColumn>รหัสวิชา</TableColumn>
                            <TableColumn>ชื่อไทย</TableColumn>
                            <TableColumn>ชื่ออังกฤษ</TableColumn>
                            {/* <TableColumn>ปีการศึกษา</TableColumn> */}
                            {/* <TableColumn>เทอม</TableColumn> */}
                            <TableColumn>หน่วยกิต</TableColumn>
                            {/* <TableColumn>กลุ่มวิชา</TableColumn>
                            <TableColumn>กลุ่มย่อยวิชา</TableColumn> */}
                            <TableColumn>กลุ่มความเชี่ยวชาญ</TableColumn>
                            <TableColumn>รายละเอียด</TableColumn>
                            <TableColumn>วันที่สร้าง</TableColumn>
                            <TableColumn>วันที่แก้ไข</TableColumn>
                        </TableHeader>
                        {currentItems.length > 0 ? (
                            <TableBody>
                                {currentItems.map((subject, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className='relative flex items-center gap-2'>
                                                <Tooltip content="แก้ไข">
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        <EditIcon2 onClick={() => handleUpdateModalOpen(subject)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip color="danger" content="ลบ">
                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon2 onClick={() => handleDeleteSubject(subject)} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                        <TableCell>{subject.subject_code || "-"}</TableCell>
                                        <TableCell>{subject.title_th || "-"}</TableCell>
                                        <TableCell>{subject.title_en || "-"}</TableCell>
                                        {/* <TableCell>{subject.acadyear || "-"}</TableCell> */}
                                        {/* <TableCell>{subject.semester || "-"}</TableCell> */}
                                        <TableCell>{subject.credit || "-"}</TableCell>
                                        <TableCell>{subject.track || "-"}</TableCell>
                                        {/* <TableCell>
                                            {subject.group_id ?
                                                <>
                                                    {groups.map(e => (
                                                        e.id === subject.group_id &&
                                                        e.group_title
                                                    ))}
                                                </>
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {subject.sub_group_id ?
                                                <>
                                                    {subgroups.map(e => (
                                                        e.id === subject.sub_group_id &&
                                                        e.sub_group_title
                                                    ))}
                                                </>
                                                : '-'}
                                        </TableCell> */}
                                        <TableCell>{subject.information || "-"}</TableCell>
                                        {["createdAt", "updatedAt"].map(column => (
                                            <TableCell key={column}>
                                                <span>{column === "createdAt" || column === "updatedAt" ? dmy(subject[column]) : subject[column]}</span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลวิชา"}>{[]}</TableBody>
                        )}
                    </Table>
                    <Pagination
                        onChange={handlePageChange}
                        current={currentPage}
                        isCompact
                        showControls
                        loop
                        className="flex justify-center mt-3"
                        total={Math.ceil(filteredSubject.length / itemsPerPage)}
                        initialPage={1}
                    />
                </div>


                {/* Render the SubjectInsert modal */}
                <SubjectInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />
                {selectedSubjectForUpdate?.subject_id &&
                    <SubjectUpdate
                        isOpen={isUpdateModalOpen}
                        onClose={handleUpdateModalClose}
                        onUpdate={handleDataUpdated}
                        subjectId={selectedSubjectForUpdate.subject_id}
                    />
                }

                <Modal
                    // backdrop="blur"
                    isOpen={isImportModalOpen}
                    onClose={handleImportModalClose}
                    // classNames={{
                    //     backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                    // }}
                    size="4xl"
                    placement="top"
                    scrollBehavior="inside"
                >
                    <ModalContent>
                        <ModalHeader>Import Excel</ModalHeader>
                        <ModalBody>
                            <ExcelUpload onDataInsertXlsx={handleDataInserted} />
                        </ModalBody>
                        <div className='flex justify-center items-center mt-5'>
                            <Button color="primary" onClick={handleExportExcelTemplate} endContent={<FiDownload className="w-4 h-4 text-white" />}>
                                ดาวน์โหลด Template
                            </Button>
                        </div>
                        <ModalFooter>
                            <Button onClick={handleImportModalClose} color="error">
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </ContentWrap>

        </>
    );
}