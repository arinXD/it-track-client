"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { SearchIcon } from "@/app/components/icons";
import { minimalTableClass, tableClass, thinInputClass } from '@/src/util/ComponentClass';
import { calGrade, floorGpa } from '@/src/util/grade';
import { isNumber } from '../../../../src/util/grade';
import { Empty } from 'antd';

const StudentTrackTable = ({ studentData, track, title = true, trackSubj }) => {
    const displayNull = useCallback(function (string) {
        return string ? string === "Web and Mobile" ? "Web" : string : "-"
    }, [])
    const initColumns = useMemo(() => [
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
            name: "ผลลัพธ์",
            uid: "result",
            sortable: true
        },
    ], [])
    const subjects = trackSubj.map(subj => {
        return {
            name: subj.subject_code,
            uid: subj.subject_code,
        }
    })
    const columns = [...initColumns.slice(0, 3), ...subjects, ...initColumns.slice(3, initColumns.length)];
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

    const filteredItems = useMemo(() => {
        let filteredUsers
        if (studentData?.students?.length) {
            filteredUsers = students.map(student => {
                const grade = []
                let totalScore = 0
                student?.SelectionDetails?.forEach(element => {
                    const g = {}
                    g[element?.Subject?.subject_code] = element.grade
                    grade.push(g)
                    const gradeValue = calGrade(element.grade)
                    if (isNumber(gradeValue)) totalScore += gradeValue * 3
                });
                const score = floorGpa(totalScore / 12)
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
                    result: student.result ? displayNull(student.result) : "รอการคัดเลือก",
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

    const bottomContent = useMemo(() => {
        if (!sortedItems.length) {
            return null
        }
        return (
            <div className="py-2 flex justify-between items-center">
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
            <h2 id={`${track.toLowerCase()}-students`} className='my-4 text-default-900 text-small'>
                {title && <> รายชื่อนักศึกษาแทร็ก {track} จำนวน {studentData?.students?.length} คน </>}
                {studentData?.normal > 0 && <>โครงการปกติ {studentData?.normal} คน</>}
                {studentData?.vip > 0 && <>โครงการพิเศษ {studentData?.vip} คน</>}
            </h2>
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-end">
                    <Input
                        isClearable
                        className="w-[50%] h-fit"
                        classNames={thinInputClass}
                        placeholder="ค้นหานักศึกษา (รหัสนักศึกษา, ชื่อ, โครงการ, แทร็ก)"
                        size="sm"
                        radius='sm'
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
                            <option value={studentData?.students?.length || 150}>ทั้งหมด</option>
                        </select>
                    </label>
                </div>
            </div>
            <Table
                aria-label={`Student Track Table`}
                removeWrapper

                bottomContent={bottomContent}
                bottomContentPlacement="outside"

                // selectionMode="multiple"
                classNames={{
                    ...minimalTableClass,
                    wrapper: "w-full",
                    td: [
                        "border-b"
                    ]
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
                {/* sortedItems */}
                <TableBody
                    emptyContent={
                        <Empty
                            className='my-4'
                            description={
                                <span className='text-gray-300'>ไม่พบข้อมูลนักศึกษา</span>
                            }
                        />
                    }
                    items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.stuId}>
                            <TableCell className='w-1/6'>{item?.stuId}</TableCell>
                            <TableCell className='w-1/6'>{item?.fullName}</TableCell>
                            <TableCell>{item?.coursesType}</TableCell>
                            {
                                item.grade.map((g, index) => (
                                    <TableCell key={index}>
                                        {g[subjects[index].uid] || "-"}
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
        </div>
    )
}

export default StudentTrackTable