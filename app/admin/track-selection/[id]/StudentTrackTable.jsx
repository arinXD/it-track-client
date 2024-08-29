"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, useDisclosure } from "@nextui-org/react";
import { DeleteIcon2, EditIcon2, PlusIcon, SearchIcon } from "@/app/components/icons";
import { deleteColor, insertColor, minimalTableClass, SELECT_STYLE, tableClass, thinInputClass } from '@/src/util/ComponentClass';
import { calGrade, floorGpa } from '@/src/util/grade';
import { isNumber } from '../../../../src/util/grade';
import { Empty, message } from 'antd';
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { swal } from '@/src/util/sweetyAlert';
import InsertModal from './InsertModal';
import EditModal from './EditModal';

const StudentTrackTable = ({
    cb = async () => { }, acadyear = 0, tracks = [], isManagable = false,
    studentData, track, title = true, trackSubj
}) => {
    const displayNull = useCallback(function (string) {
        return string ? string === "Web and Mobile" ? "Web" : string : "-"
    }, [])
    const initColumns = useMemo(() => [
        {
            name: "Actions",
            uid: "actions",
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
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "coursesType",
        direction: "ascending",
    });
    const columns = [...initColumns.slice(0, 4), ...subjects, ...initColumns.slice(4, initColumns.length)];
    const students = studentData?.students
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(new Set(columns.map(column => column.uid)));
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [disableSelectDelete, setDisableSelectDelete] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [deleting, setDeleting] = useState(false);

    const [selectionId, setSelectionId] = useState(null);

    const { isOpen: isInsertOpen, onOpen: onInsertOpen, onClose: onInsertClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

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
                    id: student?.id,
                    action: student.id,
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
            <div className="py-2 flex justify-center items-center">
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
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    useEffect(() => {
        let sl
        if (selectedKeys == "all") {
            sl = sortedItems.map(e => parseInt(e.id))
            setDisableSelectDelete(false)
        } else {
            sl = [...selectedKeys.values()].map(id => id)
            sl = sortedItems.map(item => {
                if (sl.includes(item.stuId)) return item.id
            }).filter(e => e)
            if (sl.length === 0) {
                setDisableSelectDelete(true)
            } else {
                setDisableSelectDelete(false)
            }
        }
        setSelectedRecords(sl)
    }, [selectedKeys])

    const handleDeleted = useCallback((ids) => {
        swal.fire({
            text: `ต้องการลบข้อมูลหรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeleting(true)
                const options = await getOptions("/api/selections/multiple", 'DELETE', ids)
                axios(options)
                    .then(async result => {
                        const { message: msg } = result.data
                        message.success(msg)
                        setSelectedKeys([])
                        await cb(acadyear)
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        setDeleting(false)
                    })
            }
        });
    }, [cb, acadyear])

    const handleEdit = useCallback((id) => {
        setSelectionId(id)
        onEditOpen()
    }, [])

    return (
        <div>
            {isManagable &&
                <>
                    <InsertModal
                        acadyear={acadyear}
                        cb={cb}
                        isOpen={isInsertOpen}
                        onClose={onInsertClose}
                        tracks={tracks}
                    />

                    <EditModal
                        cb={cb}
                        id={selectionId}
                        isOpen={isEditOpen}
                        onClose={onEditClose}
                        tracks={tracks}
                    />
                </>
            }
            <h2 id={`${track.toLowerCase()}-students`} className='my-4 text-default-900 text-small'>
                {title && <> รายชื่อนักศึกษาแทร็ก {track} จำนวน {studentData?.students?.length} คน </>}
            </h2>
            <div className="flex justify-between items-center mb-4">
                <span className="text-default-400 text-small">
                    {studentData?.normal > 0 && <>โครงการปกติ {studentData?.normal} คน</>}
                    {studentData?.vip > 0 && <>โครงการพิเศษ {studentData?.vip} คน</>}
                </span>
                <div className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                        style={{
                            ...SELECT_STYLE,
                            height: "32px",
                            backgroundPositionY: "2px",
                        }}
                        className="ms-2 px-2 pe-3 py-1 border-1 rounded-lg text-sm"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value={studentData?.students?.length}>ทั้งหมด</option>
                    </select>
                </div>
            </div>
            <div className='flex gap-4'>
                <Input
                    isClearable
                    className="w-full h-fit mb-4"
                    classNames={thinInputClass}
                    placeholder="ค้นหานักศึกษา (รหัสนักศึกษา, ชื่อ, โครงการ, แทร็ก)"
                    size="sm"
                    radius='sm'
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                />
                {isManagable &&
                    <div className="flex gap-4">
                        <Button
                            size="sm"
                            className={insertColor.color}
                            radius="sm"
                            onClick={onInsertOpen}
                            startContent={<PlusIcon className="w-5 h-5" />}>
                            เพิ่มข้อมูล
                        </Button>
                        <div className={disableSelectDelete ? "cursor-not-allowed" : ""}>
                            <Button
                                radius="sm"
                                size="sm"
                                isLoading={deleting}
                                isDisabled={disableSelectDelete}
                                onPress={() => handleDeleted(selectedRecords)}
                                color="danger"
                                className={deleteColor.color}
                                startContent={<DeleteIcon2 className="w-5 h-5" />}>
                                ลบรายการที่เลือก
                            </Button>
                        </div>
                    </div>
                }
            </div>
            <Table
                selectionMode={isManagable ? "multiple" : "none"}
                classNames={{
                    ...minimalTableClass,
                    wrapper: "w-full overflow-x-auto",
                }}
                aria-label={`Student Track Table`}
                removeWrapper
                className='overflow-x-auto'
                isStriped
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
                sortDescriptor={sortDescriptor}
                onRowAction={() => { }}>
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            className={(column.uid === 'actions' && !isManagable) && "hidden"}
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
                            <TableCell className={`w-1/6 text-center ${!isManagable && "hidden"}`}>
                                <Button
                                    size='sm'
                                    color='warning'
                                    isIconOnly
                                    aria-label="แก้ไข"
                                    className='p-2'
                                    isDisabled={!isManagable}
                                    onClick={() => handleEdit(item?.id)}
                                >
                                    <EditIcon2 className="w-5 h-5 text-yellow-600" />
                                </Button>
                            </TableCell>
                            <TableCell className='w-1/6'>{item?.stuId}</TableCell>
                            <TableCell className='w-1/6'>{item?.fullName}</TableCell>
                            <TableCell>{item?.coursesType}</TableCell>
                            {
                                item.grade.map((g, index) => (
                                    <TableCell key={index}>
                                        {g[subjects[index]?.uid] || "-"}
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
            {bottomContent}
        </div>
    )
}

export default StudentTrackTable