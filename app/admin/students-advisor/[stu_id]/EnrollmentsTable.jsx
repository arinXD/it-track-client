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

    const deletedEnroll = useCallback(async (selectEnroll) => {
        swal.fire({
            text: `ต้องการลบรายการที่เลือกหรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ลบ",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = "/api/students/enrollments/multiple"
                const options = await getOptions(url, "delete", selectEnroll)
                try {
                    const res = await axios(options)
                    const { ok, message } = res.data
                    showToastMessage(ok, message)
                    callBack()
                } catch (error) {
                    const { ok, message } = error?.response?.data
                    showToastMessage(ok, message)
                }
            } else {
                return
            }
        });
    }, [])

    const editEnrollment = useCallback((enroll) => {
        setEditEnroll(enroll)
        onOpenEditEnroll()
    }, [])
    const deleteEnroll = useCallback((enroll) => {
        setEditEnroll(enroll)
        onOpenDeleteEnroll()
    }, [])

    return (
        <div>
            <div className='bg-gray-100 border-gray-200 border-1 flex justify-between items-center p-3 mb-2 rounded-[10px]'>
                <p>ปีการศึกษา {year}</p>
                <div className={`${disableDeleteBtn ? "cursor-no-drop" : ""}`}>
                    <Button
                        isDisabled={disableDeleteBtn}
                        type='button'
                        className="bg-red-400"
                        radius='sm'
                        size='sm'
                        color="danger"
                        variant='solid'
                        startContent={<DeleteIcon className="w-4 h-4" />}
                        onPress={() => deletedEnroll(selectEnroll)}>
                        ลบ
                    </Button>
                </div>
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
                    selectionMode="multiple"
                    selectedKeys={selectedKeysByYear}
                    onSelectionChange={setSelectedKeysByYear}
                >
                    <TableHeader>
                        <TableColumn className='hidden' key={"id"}>ID</TableColumn>
                        <TableColumn>รหัสวิชา</TableColumn>
                        <TableColumn>ชื่อวิชา</TableColumn>
                        <TableColumn>หน่วยกิต</TableColumn>
                        <TableColumn>เกรด</TableColumn>
                        <TableColumn>เกรด</TableColumn>
                        <TableColumn className='text-center'>Action</TableColumn>
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
                                <TableCell>
                                    <div className="relative flex justify-center items-center gap-2">
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button isIconOnly size="sm" variant="light">
                                                    <VerticalDotsIcon className="text-default-300" />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                aria-label="Action event enroll"
                                                onAction={(key) => {
                                                    if (key == "edit") editEnrollment(item);
                                                    else deleteEnroll(item)
                                                }}
                                            >
                                                <DropdownItem key={"edit"}>
                                                    แก้ไข
                                                </DropdownItem>
                                                <DropdownItem key="delete" className="text-danger" color="danger">
                                                    ลบ
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default EnrollmentsTable