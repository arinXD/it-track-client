"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Link, useDisclosure } from "@nextui-org/react";
import { PlusIcon, VerticalDotsIcon, SearchIcon, ChevronDownIcon, DeleteIcon2 } from "@/app/components/icons";
import { capitalize } from "@/src/util/utils";
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'
import { getAcadyears } from "@/src/util/academicYear";
import InsertModal from "./InsertModal";
import DeleteModal from "./DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbRestore } from "react-icons/tb";
import DeleteSelectModal from "./DeleteSelectModal";
import { deleteColor, insertColor, minimalTableClass, restoreColor, thinInputClass } from "@/src/util/ComponentClass";
import { RiFileExcel2Fill } from "react-icons/ri";
import { SiGoogleforms } from "react-icons/si";
import InsertExcelModal from "../../components/InsertExcelModal";
import { getToken } from "@/app/components/serverAction/TokenAction";
import { hostname } from "@/app/api/hostname";
import InsertEnrollmentForm from "./InsertEnrollmentForm";
import { Empty } from "antd";

const Page = () => {

    const showToastMessage = useCallback(function (ok, message) {
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
    }, [])

    const INITIAL_VISIBLE_COLUMNS = useMemo(() => (
        ["stu_id", "fullName", "courses_type", "program", "acadyear", "status_code", "actions"]
    ), [])
    const columns = useMemo(() => ([{
        name: "ID",
        uid: "id",
        sortable: true
    },
    {
        name: "รหัสนักศึกษา",
        uid: "stu_id",
        sortable: true
    },
    {
        name: "ชื่อ-สกุล",
        uid: "fullName",
        sortable: true
    },
    {
        name: "โครงการ",
        uid: "courses_type",
        sortable: true
    },
    {
        name: "หลักสูตร",
        uid: "program"
    },
    {
        name: "ปีการศึกษา",
        uid: "acadyear",
    },
    {
        name: "สถานะภาพ",
        uid: "status_code",
        sortable: true
    },
    {
        name: "ACTIONS",
        uid: "actions"
    },
    ]), [])

    // Modal state
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: delIsOpen, onOpen: delOnOpen, onClose: delOnClose } = useDisclosure();
    const { isOpen: isOpenEnroll, onOpen: onOpenEnroll, onClose: onCloseEnroll } = useDisclosure();
    const { isOpen: delsIsOpen, onOpen: delsOnOpen, onClose: delsOnClose } = useDisclosure();
    const { isOpen: studentExcelIsOpen, onOpen: studentExcelOnOpen, onClose: studentExcelOnClose } = useDisclosure();
    const { isOpen: enrollExcelIsOpen, onOpen: enrollExcelOnOpen, onClose: enrollExcelOnClose } = useDisclosure();

    // State
    const [fetching, setFetching] = useState(true)
    const acadyears = getAcadyears()
    const [selectProgram, setSelectProgram] = useState(null)
    const [selectAcadYear, setSelectAcadYear] = useState(acadyears[0])
    const [students, setStudents] = useState([])
    const [programs, setPrograms] = useState([])
    const [delStdId, setDelStdId] = useState(null)
    const [disableSelectDelete, setDisableSelectDelete] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState([])
    const [statusOptions, setStatusOptions] = useState([])
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState(["10", "50", "62"]);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const hasSearchFilter = Boolean(filterValue)

    // Fetching data
    const getStudentStatuses = useCallback(async function () {
        const filterStatus = []
        try {
            let statuses = await fetchData("/api/statuses")
            statuses = statuses.filter(e => !filterStatus.includes(e.id))
            setStatusOptions(statuses)
        } catch (err) {
            setStatusOptions([])
        }
    }, [])

    const getStudents = useCallback(async function (program = selectProgram, acadyear = selectAcadYear) {
        localStorage.setItem("search-students", JSON.stringify({ program, acadyear }))
        try {
            let students = await fetchData(`/api/students/programs/${program}/acadyear/${acadyear}`)
            students.sort((a, b) => {
                const order = {
                    "โครงการปกติ": 1,
                    "โครงการพิเศษ": 2
                };
                return order[a.courses_type] - order[b.courses_type];
            });
            setStudents(students);
        } catch (error) {
            setStudents([]);
        }
    }, [selectProgram, selectAcadYear])

    const getPrograms = useCallback(async function () {
        try {
            const programs = await fetchData(`/api/programs`)
            setPrograms(programs)
        } catch (error) {
            setPrograms([])
        }
    }, [])

    const initData = useCallback(async function () {
        setFetching(true)
        await getPrograms()
        await getStudentStatuses()
        const searchItem = localStorage.getItem("search-students")
        if (searchItem) {
            const { program, acadyear } = JSON.parse(searchItem)
            setSelectProgram(program)
            setSelectAcadYear(acadyear)
            document.querySelector('#selectProgram').value = program
            document.querySelector('#selectAcadyear').value = acadyear
            await getStudents(program, acadyear)
        }
        setFetching(false)
    }, [])

    useEffect(() => {
        initData()
    }, [])

    // Init column
    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    // Filtering handle
    const filteredItems = useMemo(() => {
        let filteredUsers = [...students];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((stu) =>
                stu.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                stu.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                stu.stu_id.toLowerCase().includes(filterValue.toLowerCase()) ||
                stu.email.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((stu) =>
                Array.from(statusFilter).includes(String(stu.status_code)),
            );
        }

        return filteredUsers;
    }, [students, filterValue, statusFilter]);

    // Paging
    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    // Sorting data
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    // Display table body
    const renderCell = useCallback((stu, columnKey) => {
        const cellValue = stu[columnKey];

        switch (columnKey) {
            case "stu_id":
                return (
                    <div className="my-3">
                        <User
                            avatarProps={{ src: stu?.User?.image || "/image/user.png" }}
                            description={(
                                <Link className="ms-2" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${stu.email}&authuser=1`} size="sm" isExternal>
                                    {stu.email}
                                </Link>
                            )
                            }
                            name={(<p className="ms-2">{cellValue}</p>)}
                        />
                    </div>
                );
            case "fullName":
                return (
                    <div className="flex flex-row gap-2">
                        <p className="w-full text-bold text-small capitalize">{stu.first_name}</p>
                        <p className="w-full text-bold text-small capitalize">{stu.last_name}</p>
                    </div>
                );
            case "status_code":
                return stu?.StudentStatus?.description
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                onAction={
                                    (key) => {
                                        if (key == "delete") {
                                            openDeleteModal(stu?.stu_id)
                                        }
                                    }
                                }
                            >
                                <DropdownItem href={`/admin/students/${stu?.stu_id}`}>
                                    รายละเอียด
                                </DropdownItem>
                                <DropdownItem href={`/admin/students/${stu?.stu_id}?edit=1`}>
                                    แก้ไข
                                </DropdownItem>
                                <DropdownItem key="delete" className="text-danger" color="danger">
                                    ลบ
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue
        }
    }, []);

    // Pagination handle
    const onNextPage = useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    // Searching handle
    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const handleSelectDelete = useCallback(function () {
        delsOnOpen()
    }, [])

    const openDeleteModal = useCallback(function (stuId) {
        setDelStdId(stuId)
        delOnOpen()
    }, [])

    // Multiple deleted
    useEffect(() => {
        let students
        if (selectedKeys == "all") {
            students = sortedItems.map(e => parseInt(e.id))
            setDisableSelectDelete(false)
        } else {
            students = [...selectedKeys.values()].map(id => parseInt(id))
            if (students.length === 0) {
                setDisableSelectDelete(true)
            } else {
                setDisableSelectDelete(false)
            }
        }
        setSelectedStudents(students)
    }, [selectedKeys])

    const insertStudentExcel = useCallback(async function (formattedData) {
        // add required column
        if (formattedData.every(row =>
            row.stu_id != null &&
            row.email != null &&
            row.first_name != null &&
            row.last_name != null &&
            row.program != null
        )) {

            const token = await getToken()
            const options = {
                url: `${hostname}/api/students/excel`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    "authorization": `${token}`,
                },
            };

            return { status: true, options }
        } else {
            return { status: false, options: {} }
        }
    }, [])

    const insertEnrollmentExcel = useCallback(async function (formattedData) {
        // add required column
        if (formattedData.every(row =>
            row.stu_id != null &&
            row.subject_code != null &&
            row.enroll_year != null
        )) {

            const token = await getToken()
            const options = {
                url: `${hostname}/api/students/enrollments/excel`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    "authorization": `${token}`,
                },
            };

            return { status: true, options }
        } else {
            return { status: false, options: {} }
        }
    }, [])

    const removeStatusFilter = (id) => {
        setStatusFilter((prev) => {
            const newStatusFilter = [...prev]
            const index = newStatusFilter.indexOf(String(id));
            if (index > -1) {
                newStatusFilter.splice(index, 1)
            }
            return newStatusFilter
        });
    };

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-2">
                {
                    students.length > 0 &&
                    <div className="flex flex-col text-small">
                        <div className="flex flex-col text-small mb-2 text-default-400 gap-2">
                            <div>
                                <p className="mb-1">สถานะ:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {statusFilter == "all" ?
                                        statusOptions.map(s => (
                                            <Chip
                                                size="sm"
                                                radius="sm"
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
                                                    size="sm"
                                                    radius="sm"
                                                    onClose={() => removeStatusFilter(s.id)}
                                                >
                                                    {`${s.description} (${s.id})`}
                                                </Chip>
                                            ))
                                    }
                                </div>
                            </div>
                            <div>
                                <p className="mb-1">คอลัมน์: </p>
                                <div className="flex gap-2 flex-wrap">
                                    {headerColumns.map(column => (
                                        <Chip
                                            size="sm"
                                            radius="sm"
                                        >
                                            {column.name}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-default-400 text-small">นักศึกษาทั้งหมด {students.length} คน</span>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    id="rowPerPage"
                                    className="ms-2 border-1 rounded-md bg-transparent outline-none text-default-400 text-small"
                                    onChange={onRowsPerPageChange}
                                >
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="150">150</option>
                                    <option value={students?.length}>ทั้งหมด</option>
                                </select>
                            </label>
                        </div>
                    </div>
                }
                <div className='flex flex-row justify-between items-center gap-4'>
                    <Input
                        isClearable
                        className="w-[100%]"
                        placeholder="รหัสนักศึกษา, อีเมล, ชื่อ"
                        size="sm"
                        radius="sm"
                        classNames={thinInputClass}
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-4">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    size="sm"
                                    className={insertColor.color}
                                    radius="sm"
                                    startContent={<PlusIcon className="w-5 h-5" />}>
                                    เพิ่มข้อมูล
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                variant="faded"
                                aria-label="Dropdown menu"
                                onAction={(key) => {
                                    if (key == "add-student") onOpen()
                                    else if (key == "add-students-excel") studentExcelOnOpen()
                                    else if (key == "add-enrollment-excel") enrollExcelOnOpen()
                                    else if (key == "add-enrollment") onOpenEnroll()
                                }}
                            >
                                <DropdownItem
                                    key="add-student"
                                    description="เพิ่มรายชื่อนักศึกษาผ่านแบบฟอร์ม"
                                    startContent={<SiGoogleforms className="w-5 h-5 text-green-600" />}
                                >
                                    เพิ่มรายชื่อนักศึกษา
                                </DropdownItem>
                                <DropdownItem
                                    key="add-enrollment"
                                    description="เพิ่มรายวิชาที่ลงทะเบียนผ่านแบบฟอร์ม"
                                    startContent={<SiGoogleforms className="w-5 h-5 text-green-600" />}
                                >
                                    เพิ่มรายวิชาที่ลงทะเบียน
                                </DropdownItem>
                                <DropdownItem
                                    key="add-students-excel"
                                    description="เพิ่มรายชื่อนักศึกษาผ่านไฟล์ excel"
                                    startContent={<RiFileExcel2Fill className="w-5 h-5 text-green-600" />}
                                >
                                    เพิ่มรายชื่อนักศึกษา
                                </DropdownItem>
                                <DropdownItem
                                    key="add-enrollment-excel"
                                    description="เพิ่มรายวิชาที่ลงทะเบียนผ่านไฟล์ excel"
                                    startContent={<RiFileExcel2Fill className="w-5 h-5 text-green-600" />}
                                >
                                    เพิ่มรายวิชาที่ลงทะเบียน
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Link href="/admin/students/restore">
                            <Button
                                size="sm"
                                radius="sm"
                                className={restoreColor.color}
                                startContent={<TbRestore className="w-4 h-4" />}>
                                รายการที่ถูกลบ
                            </Button>
                        </Link>
                        <div className={disableSelectDelete ? "cursor-not-allowed" : ""}>
                            <Button
                                radius="sm"
                                size="sm"
                                isDisabled={disableSelectDelete}
                                onPress={handleSelectDelete}
                                color="danger"
                                className={deleteColor.color}
                                startContent={<DeleteIcon2 className="w-5 h-5" />}>
                                ลบรายการที่เลือก
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        students.length,
        onSearchChange,
        hasSearchFilter,
        fetching,
        selectedStudents,
    ]);

    const bottomContent = useMemo(() => {
        return (
            Object.keys(students).length > 0 ?
                <div className="py-2 px-2 flex justify-between items-center">
                    <span className="w-[30%] text-small text-default-400">
                        {selectedKeys === "all"
                            ? "All items selected"
                            : `${selectedKeys.size} of ${filteredItems.length} selected`}
                    </span>
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                    <div className="hidden sm:flex w-[30%] justify-end gap-2">
                        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                            Previous
                        </Button>
                        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                            Next
                        </Button>
                    </div>
                </div>
                :
                undefined
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const selectStyle = useMemo(() => ({
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        background: 'white',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: '99%',
        backgroundPositionY: '2px',
        border: '1px solid #dfdfdf',
        paddingRight: '1.7rem'
    }), [])

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />

                <InsertModal
                    showToastMessage={showToastMessage}
                    getStudents={getStudents}
                    programs={programs}
                    isOpen={isOpen}
                    onClose={onClose} />

                <InsertEnrollmentForm
                    showToastMessage={showToastMessage}
                    isOpen={isOpenEnroll}
                    onClose={onCloseEnroll} />

                <DeleteModal
                    showToastMessage={showToastMessage}
                    callData={getStudents}
                    delIsOpen={delIsOpen}
                    delOnClose={delOnClose}
                    stuId={delStdId} />
                <DeleteSelectModal
                    setDisableSelectDelete={setDisableSelectDelete}
                    setSelectedStudents={setSelectedStudents}
                    showToastMessage={showToastMessage}
                    getStudents={getStudents}
                    delIsOpen={delsIsOpen}
                    delOnClose={delsOnClose}
                    stuIdList={selectedStudents} />

                {/* students data */}
                <InsertExcelModal
                    title={"เพิ่มรายชื่อนักศึกษาผ่านไฟล์ Exel"}
                    templateFileName={"students_template"}
                    headers={[
                        { required: true, label: "stu_id" },
                        { required: true, label: "email" },
                        { required: true, label: "first_name" },
                        { required: true, label: "last_name" },
                        { required: true, label: "program" },
                        { label: "acadyear" },
                        { label: "courses_type" },
                        { label: "status_code" },
                    ]}
                    hook={insertStudentExcel}
                    callData={initData}
                    studentExcelIsOpen={studentExcelIsOpen}
                    studentExcelOnClose={studentExcelOnClose}
                />

                {/* enrollments data */}
                <InsertExcelModal
                    title={"เพิ่มการลงทะเบียนของนักศึกษาผ่านไฟล์ Exel"}
                    templateFileName={"enrollments_template"}
                    headers={[
                        { required: true, label: "stu_id" },
                        { required: true, label: "subject_code" },
                        { required: true, label: "enroll_year" },
                        { label: "grade" },
                    ]}
                    hook={insertEnrollmentExcel}
                    callData={() => { }}
                    studentExcelIsOpen={enrollExcelIsOpen}
                    studentExcelOnClose={enrollExcelOnClose}
                />

                <div>
                    <ToastContainer />
                    {/* {fetching ?
                        <div className='w-full flex justify-center h-[70vh]'>
                            <Spinner label="กำลังโหลด..." color="primary" />
                        </div>
                        : */}
                    <>
                        <div className='border p-4 rounded-[10px] w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 flex-wrap'>
                            <div className="flex gap-4 flex-wrap">
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
                            </div>
                            <div className="flex gap-4 items-center flex-wrap">
                                <span className="text-sm ">ค้นหานักศึกษา</span>
                                <select
                                    name="select-program"
                                    id="selectProgram"
                                    onInput={() => setSelectProgram(event.target.value)}
                                    defaultValue=""
                                    style={{
                                        height: "32px",
                                        ...selectStyle
                                    }}
                                    className="px-2 pe-3 py-1 border-1 rounded-lg text-sm "
                                >
                                    <option value="" disabled hidden>หลักสูตร</option>
                                    {programs?.length && programs.map((program) => (
                                        <option key={program.program} value={program.program}>
                                            {program.title_th} {program.program}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="select-acadyear"
                                    id="selectAcadyear"
                                    onInput={() => setSelectAcadYear(event.target.value)}
                                    defaultValue=""
                                    style={{
                                        height: "32px",
                                        ...selectStyle
                                    }}
                                    className="px-2 pe-3 py-1 border-1 rounded-lg text-sm"
                                >
                                    <option value="" disabled hidden>ปีการศึกษา</option>
                                    {acadyears.map((acadyear) => (
                                        <option key={acadyear} value={acadyear}>
                                            {acadyear}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    onClick={() => getStudents(selectProgram, selectAcadYear)}
                                    radius="sm"
                                    size="sm"
                                    variant="solid"
                                    className="bg-blue-100 text-blue-500"
                                    startContent={<SearchIcon />}
                                >
                                    ค้นหา
                                </Button>
                            </div>
                        </div>
                        <div className="border p-4 rounded-[10px] w-full">
                            <Table
                                aria-label="Student Table"
                                checkboxesProps={{
                                    classNames: {
                                        wrapper: "after:bg-blue-500 after:text-background text-background",
                                    },
                                }}
                                classNames={minimalTableClass}

                                topContent={topContent}
                                topContentPlacement="outside"

                                bottomContent={bottomContent}
                                bottomContentPlacement="outside"

                                isCompact
                                removeWrapper
                                selectionMode="multiple"
                                sortDescriptor={sortDescriptor}
                                onSortChange={setSortDescriptor}
                                selectedKeys={selectedKeys}
                                onSelectionChange={setSelectedKeys}
                            >
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
                                        />}
                                    items={sortedItems}>
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                    {/* } */}
                </div>
            </ContentWrap>
        </>
    )
}

export default Page