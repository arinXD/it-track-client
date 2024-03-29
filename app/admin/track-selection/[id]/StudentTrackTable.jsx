"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Tooltip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { EyeIcon, SearchIcon } from "@/app/components/icons";
import Link from 'next/link';
import { dMy } from '@/src/util/dateFormater'
import { tableClass } from '@/src/util/tableClass';

function displayNull(string) {
    if (string) return string
    return "-"
}
const initColumns = [
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
        name: "เกรด",
        uid: "score",
        sortable: true
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
        name: "result",
        uid: "result",
        sortable: true
    },
];

const StudentTrackTable = ({ studentData, track, title = true, trackSubj }) => {
    const subjects = trackSubj.map(subj => {
        return {
            name: subj.subject_code,
            uid: subj.subject_code,
        }
    })
    // const columns = [...initColumns, ...subjects]
    const columns = [...initColumns.slice(0, 4), ...subjects, ...initColumns.slice(4, initColumns.length)];
    const students = studentData?.students
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(columns.map(column => column.uid)));
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "coursesType",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    function convertGrade(grade) {
        const grades = {
            "A": 4,
            "B+": 3.5,
            "B": 3,
            "C+": 2.5,
            "C": 2,
            "D+": 1.5,
            "D": 1,
            "F": 0,
        }
        return grades[grade] || 0
    }

    const filteredItems = useMemo(() => {
        let filteredUsers
        if (studentData?.students?.length) {
            let counter = 0;
            filteredUsers = students.map(student => {
                const grade = []
                let totalScore = 0
                student?.SelectionDetails?.forEach(element => {
                    const g = {}
                    g[element.subject_code] = element.grade
                    grade.push(g)
                    totalScore += convertGrade(element.grade)
                });
                const score = (totalScore / (grade.length || 1)).toFixed(2)
                return {
                    action: student.stu_id,
                    stuId: student.stu_id,
                    fullName: `${student?.Student?.first_name} ${student?.Student?.last_name}`,
                    coursesType: student?.Student?.courses_type,
                    grade: grade,
                    score: score,
                    track_order_1: displayNull(student.track_order_1),
                    track_order_2: displayNull(student.track_order_2),
                    track_order_3: displayNull(student.track_order_3),
                    result: student.result ? student.result : "รอการคัดเลือก",
                }
            })

        }

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) => {
                if (
                    user.stuId?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.fullName?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.coursesType?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    user.result?.toLowerCase().includes(filterValue.toLowerCase())
                ) return user

            }
            );
        }
        return filteredUsers;
    }, [students, filterValue]);

    const [pages, setPages] = useState(0)

    const items = useMemo(() => {
        if (filteredItems?.length) {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            
            return filteredItems.slice(start, end);
        } else {
            return []
        }
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
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
                            <option value="10">10</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="150">150</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        visibleColumns,
        onRowsPerPageChange,
        students?.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
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

    return (
        <div>
            <h2 id={`${track.toLowerCase()}-students`} className='mb-3 text-default-900 text-small'>
                {title && <> รายชื่อนักศึกษาแทรค {track} จำนวน {studentData?.students?.length} คน</>}
                {studentData?.normal > 0 && <>โครงการปกติ {studentData?.normal} คน</>}
                {studentData?.vip > 0 && <>โครงการพิเศษ {studentData?.vip} คน</>}
            </h2>
            {studentData &&
                <Table
                    aria-label={`Student Track Table`}
                    removeWrapper

                    topContent={topContent}
                    topContentPlacement="outside"

                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"

                    // selectionMode="multiple"
                    classNames={{ ...tableClass, wrapper: "w-full", }}
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
                    {/* sortedItems */}
                    <TableBody emptyContent={"ไม่มีรายชื่อนักศึกษา"} items={sortedItems}>
                        {(item) => (
                            <TableRow key={item.stuId}>
                                <TableCell>{item?.stuId}</TableCell>
                                <TableCell>{item?.fullName}</TableCell>
                                <TableCell>{item?.coursesType}</TableCell>
                                {
                                    item.grade.map((g, index) => (
                                        <TableCell key={index}>
                                            {g[subjects[index].uid]}
                                        </TableCell>
                                    ))
                                }
                                <TableCell>{item?.score}</TableCell>
                                <TableCell>{item?.track_order_1}</TableCell>
                                <TableCell>{item?.track_order_2}</TableCell>
                                <TableCell>{item?.track_order_3}</TableCell>
                                <TableCell>{item?.result}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            }
        </div>
    )
}

export default StudentTrackTable
