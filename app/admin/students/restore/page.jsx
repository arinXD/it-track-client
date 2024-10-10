"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, User, Pagination, Link, useDisclosure, Spinner, Chip, Tooltip, } from "@nextui-org/react";
import { VerticalDotsIcon, SearchIcon, ChevronDownIcon, DeleteIcon2, DeleteIcon, EditIcon2 } from "@/app/components/icons";
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from "../../action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteColor, inputClass, minimalTableClass, restoreColor, tableClass, thinInputClass } from "@/src/util/ComponentClass";
import { capitalize } from "../../../../src/util/utils";
import { TbRestore } from "react-icons/tb";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import DeleteModal from "./DeleteModal";
import DeleteSelectModal from "./DeleteSelectModal";
import { Empty } from "antd";

const INITIAL_VISIBLE_COLUMNS = ["stu_id", "fullName", "courses_type", "program", "acadyear", "status_code", "actions"];
const columns = [{
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
];

const Page = () => {

    const showToastMessage = useCallback((ok, message) => {
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

    // Modal state
    const { isOpen: delIsOpen, onOpen: delOnOpen, onClose: delOnClose } = useDisclosure();
    const { isOpen: delsIsOpen, onOpen: delsOnOpen, onClose: delsOnClose } = useDisclosure();

    // Fetching data
    const getStudentStatuses = useCallback(async function () {
        try {
            const statuses = await fetchData("/api/statuses")
            setStatusOptions(statuses)
        } catch (err) {
            setStatusOptions([])
        }
    }, [])

    const getStudents = useCallback(async function () {
        let students = await fetchData(`/api/students/get/restores`)
        setStudents(students);
    }, [])

    useEffect(() => {
        async function init() {
            setFetching(true)
            await getStudents()
            await getStudentStatuses()
            setFetching(false)
        }
        init()
    }, [])

    // State
    const [fetching, setFetching] = useState(true)
    const [students, setStudents] = useState([])
    const [disableSelectDelete, setDisableSelectDelete] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState([])
    const [delStdId, setDelStdId] = useState(null)
    const [restoring, setRestoring] = useState(false)

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
    const hasSearchFilter = Boolean(filterValue);

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
                stu.acadyear.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
                stu.courses_type.toLowerCase().includes(filterValue.toLowerCase()) ||
                stu.program.toLowerCase().includes(filterValue.toLowerCase()) ||
                stu?.StudentStatus?.description.toLowerCase().includes(filterValue.toLowerCase()) ||
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
                        <Tooltip
                            content="แก้ไข"
                        >
                            <Button
                                size='sm'
                                isIconOnly
                                aria-label="แก้ไข"
                                className={restoreColor.color}
                                onClick={() => restoreStudent(stu?.stu_id)}
                            >
                                <TbRestore className="w-4 h-4" />
                            </Button>
                        </Tooltip>

                        <Tooltip
                            content="ลบ"
                        >
                            <Button
                                onPress={() => openDeleteModal(stu?.stu_id)}
                                size='sm'
                                color='danger'
                                isIconOnly
                                aria-label="ลบ"
                                className={deleteColor.color}
                            >
                                <DeleteIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
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

    const restoreStudent = useCallback(async function (id) {
        try {
            const url = `/api/students/${id}/restore`
            const options = await getOptions(url, "PUT")
            const res = await axios(options)
            const { ok, message } = res.data
            await getStudents()
            showToastMessage(ok, message)
        } catch (error) {
            console.log(error);
            const { ok, message } = error.response.data
            showToastMessage(ok, message)
        }
    }, [])

    const handleSelectRestore = useCallback(async function () {
        try {
            const data = { students: selectedStudents }
            const url = "/api/students/restore/select"
            const options = await getOptions(url, "PUT", data)

            const res = await axios(options)
            const { ok, message } = res.data
            await getStudents()
            showToastMessage(ok, message)
        } catch (error) {
            console.log(error);
            const { ok, message } = error.response.data
            showToastMessage(ok, message)
        } finally {
            setSelectedKeys([])
        }
    }, [selectedStudents])

    const handleSelectDelete = useCallback(function () {
        delsOnOpen()
    }, [])

    const openDeleteModal = useCallback(function (stuId) {
        setDelStdId(stuId)
        delOnOpen()
    }, [])

    const removeStatusFilter = useCallback((id) => {
        setStatusFilter((prev) => {
            const newStatusFilter = [...prev]
            console.log(id, newStatusFilter);
            const index = newStatusFilter.indexOf(String(id));
            if (index > -1) {
                newStatusFilter.splice(index, 1)
            }
            return newStatusFilter
        });
    }, [])

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
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
                                <p className="mb-1">คอลัมน์: </p>
                                <div className="flex gap-2 flex-wrap">
                                    {headerColumns.map(column => (
                                        <Chip
                                            key={column.name}
                                            size="sm"
                                            radius="sm"
                                            className="bg-gray-200 text-gray-600"
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
                                Rows per page
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
                        className="w-full h-fit"
                        placeholder="ค้นหานักศึกษา (รหัสนักศึกษา, อีเมล, ชื่อ)"
                        size="sm"
                        classNames={thinInputClass}
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-4">
                        <div className={disableSelectDelete ? "cursor-not-allowed" : ""}>
                            <Button
                                radius="sm"
                                size="sm"
                                className={restoreColor.color}
                                isLoading={restoring}
                                isDisabled={disableSelectDelete || restoring}
                                onPress={handleSelectRestore}
                                startContent={<TbRestore className="w-4 h-4" />}>
                                กู้คืนรายการที่เลือก
                            </Button>
                        </div>
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
                            : `${selectedKeys.size || 0} of ${filteredItems.length} selected`}
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

    return (
        <>
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
                stuIdList={selectedStudents}
                setSelectedKeys={setSelectedKeys} />
            <div>
                <ToastContainer />
                {fetching ?
                    <div className='w-full flex justify-center h-[70vh]'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    <>
                        <div className='border p-4 rounded-[10px] w-full flex flex-row justify-between items-center gap-4 mb-4'>
                            <div className="flex gap-4">
                                <Dropdown>
                                    <DropdownTrigger className="hidden sm:flex">
                                        <Button
                                            size="sm"
                                            className="bg-blue-100 text-blue-500"
                                            radius="sm"
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
                                            radius="sm"
                                            size="sm"
                                            className="bg-blue-100 text-blue-500"
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
                                                <span className='text-gray-300'>ไม่มีข้อมูลนักศึกษาที่ถูกลบ</span>
                                            }
                                        />
                                    }
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
                }
            </div>
        </>
    )
}

export default Page