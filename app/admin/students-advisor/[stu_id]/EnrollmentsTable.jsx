"use client"
import { tableClass } from '@/src/util/ComponentClass'
import { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { DeleteIcon, EditIcon2, VerticalDotsIcon } from '@/app/components/icons';
import { calGrade, isNumber } from '@/src/util/grade';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import Swal from 'sweetalert2';

const swal = Swal.mixin({
    customClass: {
        confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
        cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
    },
    buttonsStyling: false
});

const EnrollmentsTable = ({ year, enrollments, callBack, showToastMessage,
    setEditEnroll, onOpenEditEnroll, onOpenDeleteEnroll }) => {
    const [selectedKeysByYear, setSelectedKeysByYear] = useState(new Set());
    const [selectEnroll, setSelectEnroll] = useState();
    const [disableDeleteBtn, setDisableDeleteBtn] = useState(true);

    useEffect(() => {
        let enrollArr
        if (selectedKeysByYear == "all") {
            enrollArr = Array.from(new Set(enrollments.map(enroll => parseInt(enroll.id))))
            setDisableDeleteBtn(false)
        } else {
            enrollArr = Array.from(new Set([...selectedKeysByYear.values()].map(id => parseInt(id))))
            if (enrollArr.length === 0) {
                setDisableDeleteBtn(true)
            } else {
                setDisableDeleteBtn(false)
            }
        }
        setSelectEnroll(enrollArr)
    }, [selectedKeysByYear])

    return (
        <div>
            <div className='bg-gray-100 border-gray-200 border-1 flex justify-between items-center p-3 mb-2 rounded-[10px]'>
                <p>ปีการศึกษา {year}</p>
            </div>
            <div className='overflow-auto'>
                <Table
                    isCompact
                    removeWrapper
                    aria-label="รายวิชาที่ลงทะเบียน"
                    checkboxesProps={{
                        classNames: {
                            wrapper: "after:bg-blue-500 after:text-background text-background",
                        },
                    }}
                >
                    <TableHeader>
                        <TableColumn className='hidden' key={"id"}>ID</TableColumn>
                        <TableColumn>รหัสวิชา</TableColumn>
                        <TableColumn>ชื่อวิชา</TableColumn>
                        <TableColumn>หน่วยกิต</TableColumn>
                        <TableColumn>เกรด</TableColumn>
                        <TableColumn>ค่าคะแนน</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"ไม่มีรายวิชาที่ลงทะเบียน"} items={enrollments}>
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell className='hidden'>{item?.id}</TableCell>
                                <TableCell>{item?.Subject?.subject_code}</TableCell>
                                <TableCell>{item?.Subject?.title_en} <br /> {item?.Subject?.title_th}</TableCell>
                                <TableCell>{item?.Subject?.credit}</TableCell>
                                <TableCell>{item?.grade || "-"}</TableCell>
                                <TableCell>{calGrade(item?.grade) == null ? "-" : isNumber(calGrade(item?.grade)) ? String(calGrade(item?.grade)) : calGrade(item?.grade)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default EnrollmentsTable