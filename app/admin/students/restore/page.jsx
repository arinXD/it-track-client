"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Autocomplete, AutocompleteItem, Link, useDisclosure, Spinner, } from "@nextui-org/react";
import { PlusIcon, VerticalDotsIcon, SearchIcon, ChevronDownIcon, DeleteIcon2 } from "@/app/components/icons";
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from "../../action";
import { Skeleton } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { inputClass, tableClass } from "@/src/util/ComponentClass";
import { capitalize } from "../../../../src/util/utils";
import { TbRestore } from "react-icons/tb";
import { getToken } from "@/app/components/serverAction/TokenAction";
import { hostname } from "@/app/api/hostname";
import axios from "axios";
import DeleteModal from "./DeleteModal";
import DeleteSelectModal from "./DeleteSelectModal";

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
function showToastMessage(ok, message) {
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
const Page = () => {

    // Modal state
    const { isOpen: delIsOpen, onOpen: delOnOpen, onClose: delOnClose } = useDisclosure();
    const { isOpen: delsIsOpen, onOpen: delsOnOpen, onClose: delsOnClose } = useDisclosure();

    // Fetching data
    async function getStudentStatuses() {
        const filterStatus = [10, 50, 62]
        let statuses = await fetchData("/api/statuses")
        statuses = statuses.filter(e => filterStatus.includes(e.id))
        setStatusOptions(statuses)
    }
    async function getStudents() {
        let students = await fetchData(`/api/students/get/restores`)
        setStudents(students);
    }

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
    const [statusFilter, setStatusFilter] = useState("all");
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
                        <Dropdown aria-label={`${stu?.stu_id} actions`}>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                onAction={
                                    (key) => {
                                        if (key == "restore") {
                                            restoreStudent(stu?.stu_id)
                                        }
                                        else if (key == "delete") {
                                            openDeleteModal(stu?.stu_id)
                                        }
                                    }
                                }
                            >
                                <DropdownItem key={"restore"}>
                                    กู้คืน
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

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button radius="sm" endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                                <Button radius="sm" endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                    <div className="flex gap-3">
                        <Button
                            radius="sm"
                            isDisabled={disableSelectDelete}
                            onPress={handleSelectDelete}
                            color="danger"
                            endContent={<DeleteIcon2 width={16} height={16} />}>
                            ลบรายการที่เลือก
                        </Button>
                        <Button
                            radius="sm"
                            isLoading={restoring}
                            isDisabled={disableSelectDelete || restoring}
                            onPress={handleSelectRestore}
                            color="default"
                            endContent={<TbRestore className="w-[18px] h-[18px]" />}>
                            กู้คืนรายการที่เลือก
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col text-small">
                    <div className="flex flex-col text-small mb-2 text-default-400">
                        <div>สถานะ: {statusFilter == "all" ?
                            statusOptions.map(s => `${s.id} ${s.description}`).join(", ") :
                            statusOptions
                                .filter(s => Array.from(statusFilter).includes(String(s.id)))
                                .map(s => `${s.id} ${s.description}`).join(", ")
                        }</div>
                        <div>คอลัมน์: {headerColumns.map(column => column.name).join(", ")}</div>
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
                <Input
                    isClearable
                    className="w-full h-fit"
                    placeholder="ค้นหานักศึกษา (รหัสนักศึกษา, อีเมล, ชื่อ)"
                    size="sm"
                    classNames={inputClass}
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                />
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

    async function restoreStudent(id) {
        try {
            const token = await getToken()
            const options = {
                url: `${hostname}/api/students/${id}/restore`,
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'authorization': `${token}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            };

            const res = await axios(options)
            const { ok, message } = res.data
            await getStudents()
            showToastMessage(ok, message)
        } catch (error) {
            console.log(error);
            const { ok, message } = error.response.data
            showToastMessage(ok, message)
        }
    }

    async function handleSelectRestore() {
        try {
            const token = await getToken()
            const options = {
                url: `${hostname}/api/students/restore/select`,
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'authorization': `${token}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                data: {
                    students: selectedStudents
                }
            };

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
    }


    function handleSelectDelete() {
        delsOnOpen()
    }

    function openDeleteModal(stuId) {
        setDelStdId(stuId)
        delOnOpen()
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
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
                            <Table
                                aria-label="Student Table"
                                checkboxesProps={{
                                    classNames: {
                                        wrapper: "after:bg-blue-500 after:text-background text-background",
                                    },
                                }}
                                classNames={tableClass}

                                bottomContent={bottomContent}
                                bottomContentPlacement="outside"

                                topContent={topContent}
                                topContentPlacement="outside"

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
                                <TableBody emptyContent={"ไม่มีข้อมูลนักศึกษา"} items={sortedItems}>
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </>
                    }
                </div>
            </ContentWrap>

        </>
    )
}

export default Page