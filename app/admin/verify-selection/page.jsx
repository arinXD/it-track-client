"use client"

import { useCallback, useEffect, useState, useMemo } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import Swal from 'sweetalert2';
import { fetchData } from '../action'
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { useDisclosure } from "@nextui-org/react";
import { getAcadyears } from '@/src/util/academicYear';
import Link from 'next/link'
import { Input, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Tooltip, Chip, Pagination, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
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
import { simpleDMY, simpleDMYHM } from '@/src/util/simpleDateFormatter'
import { IoMdEye } from "react-icons/io";
import { Empty } from "antd";
import { capitalize } from "@/src/util/utils";

const Page = () => {

    const INITIAL_VISIBLE_COLUMNS = useMemo(() => (
        ["fullName", "email", "courses_type", "program", "status_code", "term", "acadyear", "status", "actions"]
    ), []);

    const columns = useMemo(() => ([
        { name: "ชื่อ-สกุล", uid: "fullName" },
        { name: "อีเมล", uid: "email" },
        { name: "โครงการ", uid: "courses_type" },
        { name: "หลักสูตร", uid: "program" },
        { name: "สถานะภาพ", uid: "status_code" },
        { name: "ขอยืนจบ(เทอม)", uid: "term" },
        { name: "ปีการศึกษาขอยืนจบ", uid: "acadyear" },
        { name: "สถานะคำร้อง", uid: "status" },
        { name: "ACTIONS", uid: "actions" }

    ]), []);

    const [verify, setVerify] = useState([]);
    const [verifyAdmin, setVerifyByAdmin] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    //state fillter
    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const [programsOptions, setPrograms] = useState([])
    const [programFilter, setProgramFilter] = useState(["CS", "IT", "GIS"]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [statusFilter, setStatusFilter] = useState(["10", "50", "62"]);

    const [activeTab, setActiveTab] = useState("new");

    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));

    ///////////////////////////////////////////////////
    const callApproveByTeacher = useCallback(async () => {
        try {
            const URL = `/api/verifies/approve/teacher`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const data = response.data.data;

            const filteredData = data.filter((verifies) => {
                const teacherEmail = verifies.Student.Advisor?.email;
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

            console.log(data);

            setVerifyByAdmin(data);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, []);

    const getStudentStatuses = useCallback(async function () {
        try {
            const URL = `/api/statuses`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const statuses = response.data.data;
            console.log(statuses);

            setStatusOptions(statuses)
        } catch (err) {
            setStatusOptions([])
        }
    }, [])

    const getPrograms = useCallback(async function () {
        try {
            const programs = await fetchData(`/api/programs`)
            console.log(programs);

            setPrograms(programs)
        } catch (error) {
            setPrograms([])
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
        getPrograms()
    }, [session, callApproveByTeacher, callApproveByAdmin, getStudentStatuses, getPrograms]);

    const onSearchChange = useCallback((value) => {
        setFilterValue(value);
        setCurrentPage(1); // Reset to first page when search changes
    }, []);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing rows per page
    }, []);

    const handleTabChange = (key) => {
        setActiveTab(key);
        setCurrentPage(1);
    };

    const applySearchFilter = (verifies) => {
        // Shallow copy of verifies
        let filteredUsers = [...verifies];

        // Apply text search filter (filterValue)
        filteredUsers = filteredUsers.filter(verify => {
            const nameMatch = `${verify?.Student?.first_name} ${verify?.Student?.last_name}`.toLowerCase().includes(filterValue.toLowerCase());
            const emailMatch = verify?.Student?.email?.toLowerCase().includes(filterValue.toLowerCase());
            const coursesTypeMatch = verify?.Student?.courses_type?.toLowerCase().includes(filterValue.toLowerCase());
            const programMatch = verify?.Student?.program?.toLowerCase().includes(filterValue.toLowerCase());
            const studentStatusMatch = verify?.Student?.StudentStatus?.description?.toLowerCase().includes(filterValue.toLowerCase());
            const termMatch = verify?.term?.toLowerCase().includes(filterValue.toLowerCase());

            return nameMatch || emailMatch || coursesTypeMatch || programMatch || studentStatusMatch || termMatch;
        });

        // Apply status filter if it's not set to 'all' or if not all statuses are selected
        if (statusFilter.length > 0 && statusFilter.length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((verify) =>
                statusFilter.includes(String(verify?.Student?.status_code))
            );
        }

        if (programFilter.length > 0 && programFilter.length !== programsOptions.length) {
            filteredUsers = filteredUsers.filter((verify) =>
                programFilter.includes(String(verify?.Student?.program))
            );
        }

        return filteredUsers;
    };

    const getFilteredData = (tabIndex) => {
        const baseData = session?.user?.role === 'teacher' ? verify : verifyAdmin;
        const filteredData = applySearchFilter(baseData);

        switch (tabIndex) {
            case 0: // New requests
                return filteredData.filter(v => session?.user?.role === 'admin' ? v.status === 2 : v.status === 1);
            case 1: // Approved requests
                return filteredData.filter(v => session?.user?.role === 'admin' ? v.status === 3 : v.status === 2 || v.status === 3);
            case 2: // Waiting for student input
                return filteredData.filter(v => v.status === 0);
            default:
                return [];
        }
    };

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

    const removeProgramFilter = useCallback((program) => {
        setProgramFilter((prev) => {
            const newProgramFilter = [...prev]
            const index = newProgramFilter.indexOf(String(program));
            if (index > -1) {
                newProgramFilter.splice(index, 1)
            }
            return newProgramFilter
        });
    }, [])

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const renderCell = (verifies, column) => {
        switch (column.uid) {
            case "fullName":
                return `${verifies?.Student?.first_name} ${verifies?.Student?.last_name}`;
            case "email":
                return verifies?.Student?.email;
            case "courses_type":
                return verifies?.Student?.courses_type;
            case "program":
                return verifies?.Student?.program;
            case "status_code":
                return verifies?.Student?.StudentStatus?.description;
            case "term":
                return verifies?.term;
            case "acadyear":
                return verifies?.acadyear;
            case "status":

                const getStatusStyle = (status) => {
                    switch (status) {
                        case 1:
                            return { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500', label: 'รอการอนุมัติ' };
                        case 2:
                            return { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500', label: 'รอการอนุมัติ' };
                        case 3:
                            return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'อนุมัติ' };
                        case 0:
                        default:
                            return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'รอคำร้องจากนักศึกษา' };
                    }
                };

                const statusStyle = getStatusStyle(verifies?.status);
                return (
                    <div className={`inline-flex items-center ${statusStyle.bg} ${statusStyle.text} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                        <span className={`w-3 h-3 inline-block ${statusStyle.dot} rounded-full mr-2`}></span>
                        {statusStyle.label}
                    </div>
                );
            case "actions":
                return (
                    <Link href={`/admin/verify-selection/${verifies?.stu_id}`} target="_blank">
                        <Tooltip
                            content={`รายละเอียดของ ${verifies?.Student.first_name} ${verifies?.Student.last_name} (${verifies?.stu_id})`}
                            placement="left-start"
                        >
                            <Button
                                size='sm'
                                isIconOnly
                                aria-label="รายละเอียด"
                                className='p-2 bg-blue-200'
                            >
                                <IoMdEye className="w-5 h-5 text-blue-600" />
                            </Button>
                        </Tooltip>
                    </Link>
                );
            default:
                return null;
        }
    };

    const renderTable = (data) => {
        const totalItems = data.length;
        const lastItemIndex = currentPage * rowsPerPage;
        const firstItemIndex = lastItemIndex - rowsPerPage;
        const currentItems = data.slice(firstItemIndex, lastItemIndex);

        return (
            <>
                <div className="flex justify-between items-center mt-4">
                    <span>นักศึกษาทั้งหมด <span className='font-bold'>{totalItems} </span> คน</span>
                    <div className="flex items-center">
                        <label className="flex items-center">
                            Rows per page:
                            <select
                                className="bg-transparent outline-none ml-2"
                                onChange={onRowsPerPageChange}
                                value={rowsPerPage}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                            </select>
                        </label>
                    </div>
                </div>
                <Table aria-label="Verification Table" className='mt-5'>
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={column.uid === "actions" ? "center" : "start"}
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        emptyContent={
                            <Empty
                                className='my-4'
                                description={
                                    <span className='text-gray-300'>ไม่มีข้อมูลนักศึกษา</span>
                                }
                            />
                        }
                    >
                        {currentItems.map((verifies) => (
                            <TableRow key={verifies?.id}>
                                {headerColumns.map(column => (
                                    <TableCell key={column.uid}>
                                        {renderCell(verifies, column)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination
                    className='flex justify-center items-center mt-3'
                    isCompact
                    showControls
                    showShadow
                    total={Math.ceil(totalItems / rowsPerPage)}
                    page={currentPage}
                    onChange={setCurrentPage}
                />
            </>
        );
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
                            <div className='border p-4 rounded-[10px] w-full'>
                                <div className='flex justify-between items-center gap-4 flex-wrap'>
                                    <div className='flex justify-center items-center gap-4 flex-wrap'>
                                        <Dropdown>
                                            <DropdownTrigger className="hidden sm:flex">
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-100 text-blue-500"
                                                    radius="sm"
                                                    endContent={<ChevronDownIcon className="text-small" />}
                                                    variant="flat">
                                                    คอลัมน์
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                disallowEmptySelection
                                                aria-label="Table Columns"
                                                closeOnSelect={false}
                                                selectedKeys={visibleColumns}
                                                selectionMode="multiple"
                                                onSelectionChange={setVisibleColumns}
                                            >
                                                {columns.map((column) => (
                                                    <DropdownItem key={column.uid} className="capitalize">
                                                        {capitalize(column.name)}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </Dropdown>
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
                                        <Dropdown>
                                            <DropdownTrigger className="flex">
                                                <Button
                                                    size="sm"
                                                    radius="sm"
                                                    className="bg-blue-100 text-blue-500"
                                                    endContent={<ChevronDownIcon className="text-small" />}
                                                    variant="flat">
                                                    หลักสูตร
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                disallowEmptySelection
                                                aria-label="Table Columns"
                                                closeOnSelect={false}
                                                selectedKeys={programFilter}
                                                selectionMode="multiple"
                                                onSelectionChange={setProgramFilter}
                                                className="h-full overflow-y-auto"
                                            >
                                                {programsOptions.map((program, index) => (
                                                    <DropdownItem key={program.program} className="capitalize">
                                                        {program.title_th} {program.program}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                    <div className="flex gap-4 flex-wrap items-center">
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
                            </div>
                            <div className='border p-4 rounded-[10px] w-full mt-3'>
                                <div className="flex flex-col text-small mb-2 text-default-400 gap-2">
                                    <div>
                                        <p className="mb-1">สถานะ:</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {statusFilter == "all" ?
                                                statusOptions.map(s => (
                                                    <Chip
                                                        key={s.id}
                                                        size="sm"
                                                        radius="sm"
                                                        className="bg-gray-200 text-gray-600"
                                                        onClose={() => removeStatusFilter(s.id)}
                                                    >
                                                        {`${s.description} (${s.id})`}
                                                    </Chip>
                                                ))
                                                :
                                                statusOptions
                                                    .filter(s => Array.from(statusFilter).includes(String(s.id)))
                                                    .map(s => (
                                                        <Chip
                                                            key={s.id}
                                                            size="sm"
                                                            radius="sm"
                                                            className="bg-gray-200 text-gray-600"
                                                            onClose={() => removeStatusFilter(s.id)}
                                                        >
                                                            {`${s.description} (${s.id})`}
                                                        </Chip>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-1">หลักสูตร:</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {programFilter === "all" ? (
                                                programsOptions.map((s, index) => (
                                                    <Chip
                                                        key={s.program}
                                                        size="sm"
                                                        radius="sm"
                                                        className="bg-gray-200 text-gray-600"
                                                        onClose={() => removeProgramFilter(s.program)}
                                                    >
                                                        {`${s.title_th} (${s.program})`}
                                                    </Chip>
                                                ))
                                            ) : (
                                                programsOptions
                                                    .filter((s) => Array.from(programFilter).includes(String(s.program)))
                                                    .map((s, index) => (
                                                        <Chip
                                                            key={s.program}
                                                            size="sm"
                                                            radius="sm"
                                                            className="bg-gray-200 text-gray-600"
                                                            onClose={() => removeProgramFilter(s.program)}
                                                        >
                                                            {`${s.title_th} (${s.program})`}
                                                        </Chip>
                                                    ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Tabs
                                aria-label="Options"
                                color="primary"
                                size="md"
                                selectedKey={activeTab}
                                onSelectionChange={handleTabChange}
                                className='mt-3'
                            >
                                <Tab
                                    key="new"
                                    title={
                                        <div className="flex items-center space-x-2">
                                            <VscArchive />
                                            <span>คำร้องใหม่</span>
                                        </div>
                                    }
                                >
                                    <div className="border border-gray-300 rounded-md p-5 shadow-sm">
                                        <h1 className="text-2xl font-semibold">คำร้องอนุมัติจบการศึกษา</h1>
                                        {renderTable(getFilteredData(0))}
                                    </div>
                                </Tab>
                                <Tab
                                    key="approved"
                                    title={
                                        <div className="flex items-center space-x-2">
                                            <VscCheckAll />
                                            <span>คำร้องที่อนุมัติ</span>
                                        </div>
                                    }
                                >
                                    <div className="border border-gray-300 rounded-md p-5 shadow-sm">
                                        <h1 className="text-2xl font-semibold">คำร้องที่อนุมัติจบการศึกษา</h1>
                                        {renderTable(getFilteredData(1))}
                                    </div>
                                </Tab>
                                <Tab
                                    key="waiting"
                                    title={
                                        <div className="flex items-center space-x-2">
                                            <VscHistory />
                                            <span>รอนักศึกษากรอกแบบฟอร์มอีกครั้ง</span>
                                        </div>
                                    }
                                >
                                    <div className="border border-gray-300 rounded-md p-5 shadow-sm">
                                        <h1 className="text-2xl font-semibold">รอคำร้องจากนักศึกษา</h1>
                                        {renderTable(getFilteredData(2))}
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