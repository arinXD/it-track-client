"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Autocomplete, AutocompleteItem, Link, useDisclosure, } from "@nextui-org/react";
import { PlusIcon, VerticalDotsIcon, SearchIcon, ChevronDownIcon, DeleteIcon2 } from "@/app/components/icons";
import { capitalize } from "@/src/util/utils";
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'
import { getAcadyears } from "@/src/util/academicYear";
import InsertModal from "./InsertModal";
import { Skeleton } from "@nextui-org/react";
import DeleteModal from "./DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbRestore } from "react-icons/tb";
import DeleteSelectModal from "./DeleteSelectModal";
import { tableClass } from "@/src/util/tableClass";

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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: delIsOpen, onOpen: delOnOpen, onClose: delOnClose } = useDisclosure();
    const { isOpen: delsIsOpen, onOpen: delsOnOpen, onClose: delsOnClose } = useDisclosure();

    // Fetching data
    async function getStudentStatuses() {
        const filterStatus = [10, 50, 62]
        let statuses = await fetchData("/api/statuses")
        statuses = statuses.filter(e => filterStatus.includes(e.id))
        setStatusOptions(statuses)
    }
    async function getStudents(program = "IT", acadyear = 2564) {
        let students = await fetchData(`/api/students/programs/${program}/acadyear/${acadyear}`)
        students.sort((a, b) => {
            const order = {
                "โครงการปกติ": 1,
                "โครงการพิเศษ": 2
            };
            return order[a.courses_type] - order[b.courses_type];
        });

        setStudents(students);
    }
    async function getPrograms() {
        const programs = await fetchData(`/api/programs`)
        setPrograms(programs)
    }

    useEffect(() => {
        async function init() {
            setFetching(true)
            await getStudentStatuses()
            await getStudents()
            await getPrograms()
            setFetching(false)
        }
        init()
    }, [])

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

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%] h-fit"
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button radius="sm" endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
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
                                    Columns
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
                        <Button
                            radius="sm"
                            onPress={() => onOpen()}
                            color="primary"
                            endContent={<PlusIcon width={16} height={16} />}>
                            เพิ่มรายชื่อนักศึกษา
                        </Button>
                        <Button
                            radius="sm"
                            isDisabled={disableSelectDelete}
                            onPress={handleSelectDelete}
                            color="danger"
                            endContent={<DeleteIcon2 width={16} height={16} />}>
                            ลบรายการที่เลือก
                        </Button>
                        <Link href="/admin/students/restore">
                            <Button
                                radius="sm"
                                color="default"
                                endContent={<TbRestore className="w-[18px] h-[18px]" />}>
                                รายการที่ถูกลบ
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">นักศึกษาทั้งหมด {students.length} คน</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
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
        selectedStudents
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
            students = sortedItems.map(e => parseInt(e.stu_id))
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
                <div>
                    <ToastContainer />
                    {fetching ?
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-[40%] rounded-lg" />
                            <div className="flex gap-5">
                                <Skeleton className="h-10 w-[50%] rounded-lg" />
                                <Skeleton className="h-10 w-[50%] rounded-lg" />
                            </div>
                            <div className="pt-5 space-y-3">
                                <Skeleton className="h-4 w-full rounded-lg" />
                                <Skeleton className="h-2 w-full rounded-lg" />
                                <Skeleton className="h-2 w-full rounded-lg" />
                                <Skeleton className="h-2 w-full rounded-lg" />
                                <Skeleton className="h-2 w-full rounded-lg" />
                                <Skeleton className="h-2 w-full rounded-lg" />
                                <Skeleton className="h-2 w-full rounded-lg" />
                            </div>
                        </div>
                        :
                        <>

                            <div className="flex gap-3 items-center mb-4">
                                <select onInput={() => setSelectProgram(event.target.value)} defaultValue="" id="" className="px-2 pe-3 py-1 border-1 rounded-lg">
                                    <option value="" disabled hidden>หลักสูตร</option>
                                    {programs?.length && programs.map((program) => (
                                        <option key={program.program} value={program.program}>
                                            {program.title_th} {program.program}
                                        </option>
                                    ))}
                                </select>
                                <select onInput={() => setSelectAcadYear(event.target.value)} defaultValue="" id="" className="px-2 pe-3 py-1 border-1 rounded-lg">
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
                                    size="md"
                                    variant="solid"
                                    className="bg-gray-200"
                                    startContent={<SearchIcon />}
                                >
                                    ค้นหา
                                </Button>
                            </div>
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

            <InsertModal
                showToastMessage={showToastMessage}
                getStudents={getStudents}
                programs={programs}
                isOpen={isOpen}
                onClose={onClose} />
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
        </>
    )
}

export default Page