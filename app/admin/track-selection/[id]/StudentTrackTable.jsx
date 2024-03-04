"use client"
import React, { useEffect, useState } from 'react'
import { Input, Tooltip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { EyeIcon, SearchIcon } from "@/app/components/icons";
import Link from 'next/link';
import { dMy } from '@/src/util/dateFormater'

function displayNull(string) {
    if (string) return string
    return "-"
}
const columns = [{
    name: "",
    uid: "action",
},
{
    name: "No.",
    uid: "no",
    sortable: true
},
{
    name: "รหัสนักศึกษา",
    uid: "stuId",
    sortable: true
},
{
    name: "ชื่อ - สกุล",
    uid: "fullName",
    sortable: true
},
{
    name: "โครงการ",
    uid: "coursesType",
    sortable: true
},
{
    name: "แทรคที่ได้",
    uid: "result"
},
{
    name: "เลือกลำดับ 1",
    uid: "track_order_1",
    sortable: true
},
{
    name: "เลือกลำดับ 2",
    uid: "track_order_2",
    sortable: true
},
{
    name: "เลือกลำดับ 3",
    uid: "track_order_3",
    sortable: true
},
{
    name: "วันที่ยืนยัน",
    uid: "updatedAt",
    sortable: true
},
];
const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};
const INITIAL_VISIBLE_COLUMNS = columns.map(column => column.uid);

const StudentTrackTable = ({ studentData, track }) => {
    const students = studentData?.students
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "no",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers
        if (studentData?.students?.length) {
            let counter = 0;
            filteredUsers = students.map(student => {
                return {
                    action: student.stu_id,
                    no: ++counter,
                    stuId: student.stu_id,
                    fullName: `${student?.Student?.first_name} ${student?.Student?.last_name}`,
                    coursesType: student?.Student?.courses_type,
                    result: student.result ? student.result : "รอการคัดเลือก",
                    track_order_1: displayNull(student.track_order_1),
                    track_order_2: displayNull(student.track_order_2),
                    track_order_3: displayNull(student.track_order_3),
                    updatedAt: dMy(student.updatedAt),
                }
            })

        }

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) => {
                if (
                    user.no.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.stuId.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.fullName.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.coursesType.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.result.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.updatedAt.toLowerCase().includes(filterValue.toLowerCase())
                ) return user

            }
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            );
        }

        return filteredUsers;
    }, [students, filterValue, statusFilter]);

    const [pages, setPages] = useState(0)

    const items = React.useMemo(() => {
        if (filteredItems?.length) {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return filteredItems.slice(start, end);
        } else {
            return []
        }
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    useEffect(() => {
        if (filteredItems?.length) {
            setPages(Math.ceil(filteredItems.length / rowsPerPage))
        }
    }, [filteredItems, rowsPerPage])


    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
        if (!sortedItems.length) {
            return null
        }
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
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
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="border border-gray-500 rounded-md outline-none ms-3 px-1 text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
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
        students?.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        if (!sortedItems.length) {
            return null
        }
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow={false}
                    color="primary"
                    page={page}
                    total={pages}
                    loop
                    initialPage={1}
                    boundaries={3}
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

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case "action":
                return (
                    <div className="relative flex items-center gap-3 w-fit">
                        <Tooltip content="รายละเอียด">
                            <Link href={`#${cellValue}`} className='focus:outline-none'>
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <EyeIcon />
                                </span>
                            </Link>
                        </Tooltip>
                    </div>
                )
            default:
                return cellValue;
        }
    }, []);

    return (
        <div>
            <h2 id={`${track.toLowerCase()}-students`} className='mb-3 text-default-900 text-small'>
                รายชื่อนักศึกษาแทรค {track} จำนวน {studentData?.students?.length} คน
                {studentData?.normal > 0 && <>โครงการปกติ {studentData?.normal} คน</>}
                {studentData?.vip > 0 && <>โครงการพิเศษ {studentData?.vip} คน</>}
            </h2>
            {studentData &&
                <Table
                    aria-label={`Student Track Table`}
                    isStriped
                    removeWrapper
                    topContent={topContent}
                    topContentPlacement="outside"
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    selectionMode="multiple"
                    classNames={{
                        wrapper: "max-h-[382px]",
                    }}
                    // onSelectionChange={setSelectedKeys}
                    onSortChange={setSortDescriptor}
                    sortDescriptor={sortDescriptor}
                    onRowAction={() => { }}>
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent={"ไม่มีรายชื่อนักศึกษา"} items={sortedItems}>
                        {(item) => (
                            <TableRow key={item.stuId}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            }
        </div>
    )
}

export default StudentTrackTable
