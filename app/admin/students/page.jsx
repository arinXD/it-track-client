"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Autocomplete, AutocompleteItem, Link, } from "@nextui-org/react";
import { PlusIcon, VerticalDotsIcon, SearchIcon, ChevronDownIcon } from "@/app/components/icons";
import { columns, students, statusOptions, columns2 } from "./data";
import { capitalize } from "./utils";
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'
import { getLastTenYear } from "@/src/util/academicYear";

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};
const INITIAL_VISIBLE_COLUMNS = ["stu_id", "fullName", "courses_type", "program", "acadyear", "status_code", "actions"];

const Page = () => {
    async function getStudentStatuses() {
        const filterStatus = [10, 50, 62]
        let statuses = await fetchData("/api/students/statuses")
        statuses = statuses.filter(e => filterStatus.includes(e.id))
        setStatusOptions(statuses)
    }
    async function getStudents(program = "IT", acadyear = 2564) {
        let students = await fetchData(`/api/students/programs/${program}/acadyear/${acadyear}`)
        console.log(students[0]);
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
        getStudentStatuses()
        getStudents()
        getPrograms()
    }, [])

    const acadyears = getLastTenYear()
    const [selectProgram, setSelectProgram] = useState(null)
    const [selectAcadYear, setSelectAcadYear] = useState(acadyears[0])
    const [students, setStudents] = useState([])
    const [programs, setPrograms] = useState([])

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
    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns2;

        return columns2.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...students];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((stu) =>
                stu.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                stu.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                stu.stu_id.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((stu) =>
                Array.from(statusFilter).includes(String(stu.status_code)),
            );
        }

        return filteredUsers;
    }, [students, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

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
                        <p className="text-bold text-small capitalize">{stu.first_name}</p>
                        <p className="text-bold text-small capitalize">{stu.last_name}</p>
                    </div>
                );
            case "status_code":
                return stu?.StudentStatus?.description
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem>View</DropdownItem>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue
        }
    }, []);

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
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                                {columns2.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<PlusIcon width={16} height={16} />}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {students.length} students</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
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

    const classNames = useMemo(
        () => ({
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            td: [
                // changing the rows border radius
                // first
                "group-data-[first=true]:first:before:rounded-none",
                "group-data-[first=true]:last:before:rounded-none",
                // middle
                "group-data-[middle=true]:before:rounded-none",
                // last
                "group-data-[last=true]:first:before:rounded-none",
                "group-data-[last=true]:last:before:rounded-none",
                "mb-4",
            ],
        }),
        [],
    );
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <div>
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
                            radius="lg"
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
                        classNames={classNames}

                        bottomContent={bottomContent}
                        bottomContentPlacement="outside"

                        topContent={topContent}
                        topContentPlacement="outside"

                        isCompact
                        removeWrapper
                        selectionMode="multiple"
                        sortDescriptor={sortDescriptor}
                        onSelectionChange={setSelectedKeys}
                        onSortChange={setSortDescriptor}
                        selectedKeys={selectedKeys}
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
                        <TableBody emptyContent={"No students found"} items={sortedItems}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </ContentWrap>
        </>
    )
}

export default Page