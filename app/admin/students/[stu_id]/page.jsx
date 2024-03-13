"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { fetchData, fetchDataObj } from '../../action'
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import Image from 'next/image'
import { dmy } from '@/src/util/dateFormater'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'
import { DeleteIcon, DeleteIcon2, EditIcon2, VerticalDotsIcon } from '@/app/components/icons'
import { Spinner } from "@nextui-org/react";
import { tableClass } from '@/src/util/tableClass'
import Link from 'next/link'
import EditModal from './EditModal'
import { useSearchParams } from 'next/navigation'

export default function Page({ params }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const searchParams = useSearchParams()
    const editMode = searchParams.get('edit') || "0"

    useEffect(() => {
        if (editMode == "1") {
            onOpen()
        }
    }, [editMode])

    const { stu_id } = params
    const [student, setStudent] = useState({})
    const [selectedKeys, setSelectedKeys] = useState([])
    const [gpa, setGpa] = useState(0)
    const [enrollmentsByYear, setEnrollmentsByYear] = useState([])
    const [fetching, setFetching] = useState(true)
    const [programs, setPrograms] = useState([])
    const [status, setStatus] = useState([])
    const [updateData, setUpdateData] = useState({})

    async function getStudentData() {
        const student = await fetchDataObj(`/api/students/${stu_id}`)
        setStudent(student)
        if (student?.Enrollments?.length) {
            let enrollments = student?.Enrollments
            // หา GPA
            setGpa(calGpa(enrollments))

            // เรียงลำดับใหม่ DESC 
            enrollments.sort((a, b) => {
                const gradeA = calGrade(a.grade);
                const gradeB = calGrade(b.grade);

                const isSpecialGrade = (grade) => ["W", "S", "U", "I"].includes(grade);

                if (gradeA == null && gradeB == null) {
                    return 0;
                } else if (gradeA == null) {
                    return 1; // B
                } else if (gradeB == null) {
                    return -1; // A
                } else if (!isSpecialGrade(a.grade) && isSpecialGrade(b.grade)) {
                    return -1; // Normal grade is higher than special grade
                } else if (isSpecialGrade(a.grade) && !isSpecialGrade(b.grade)) {
                    return 1; // Special grade is lower than normal grade
                }
                return gradeB - gradeA;
            });
            const enrollmentsByYear = {}
            enrollments.forEach(enrollment => {
                const year = enrollment.enroll_year
                if (!enrollmentsByYear[year]) {
                    enrollmentsByYear[year] = []
                }
                enrollmentsByYear[year].push(enrollment)
            });
            setEnrollmentsByYear(enrollmentsByYear)
        }
    }

    async function getPrograms() {
        const programs = await fetchData(`/api/programs`)
        setPrograms(programs)
    }

    async function getStudentStatuses() {
        const filterStatus = [10, 50, 62]
        let statuses = await fetchData("/api/statuses")
        statuses = statuses.filter(e => filterStatus.includes(e.id))
        setStatus(statuses)
    }

    function calGrade(grade) {
        const grades = {
            "A": 4,
            "B+": 3.5,
            "B": 3,
            "C+": 2.5,
            "C": 2,
            "D+": 1.5,
            "D": 1,
            "F": 0,
            "W": "ถอน",
            "S": "ผ่าน",
            "U": "ไม่ผ่าน",
            "I": "ไม่สามารถเข้ารับการวัดผล",
        }
        return grades[grade] !== undefined ? grades[grade] : null
    }
    function calGpa(enrollments) {
        if (enrollments.length == 0) return 0
        let sumGrade = 0
        let sumCredit = 0
        for (const enrollment of enrollments) {
            const grade = calGrade(enrollment?.grade)
            if (!grade || !isNumber(grade)) continue
            const credit = enrollment?.Subject?.credit || 0
            sumGrade += grade * credit
            sumCredit += credit
        }
        return parseFloat(sumGrade / sumCredit).toFixed(2)
    }

    function isNumber(number) {
        return typeof number == "number"
    }

    useEffect(() => {
        setFetching(true)
        getStudentData()
        getPrograms()
        getStudentStatuses()
        setFetching(false)
    }, [])

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

    // Acadyear
    

    function handleEdit() {
        const updatedStudent = { ...student };
        delete updatedStudent.Enrollments;
        setUpdateData(updatedStudent);
        onOpen();
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <EditModal
                    status={status}
                    programs={programs}
                    showToastMessage={showToastMessage}
                    getStudentData={getStudentData}
                    student={updateData}
                    isOpen={isOpen}
                    onClose={onClose} />
                <div>
                    {
                        fetching ?
                            <div className='w-full flex justify-center h-[70vh]'>
                                <Spinner label="กำลังโหลด..." color="primary" />
                            </div>
                            :
                            Object.keys(student).length ?
                                <>
                                    <div className='flex gap-8 py-6'>
                                        <div className="w-[30%] flex flex-col justify-center items-center">
                                            <Image
                                                priority={true}
                                                alt='student image'
                                                width={100}
                                                height={100}
                                                src={student?.User?.image || "/image/user.png"}
                                            />
                                        </div>
                                        <div className='w-[70%] flex flex-col space-y-2'>
                                            <div className='flex flex-2 gap-3 mb-2'>
                                                <Button
                                                    type='button'
                                                    className=''
                                                    radius='sm'
                                                    color="primary"
                                                    variant='solid'
                                                    startContent={<EditIcon2 />}
                                                    onPress={handleEdit}>
                                                    แก้ไขรายชื่อนักศึกษา
                                                </Button>
                                                <Button
                                                    type='button'
                                                    className=''
                                                    radius='sm'
                                                    color="primary"
                                                    startContent={<DeleteIcon2 />}
                                                    variant='solid'>
                                                    ลบรายชื่อนักศึกษา
                                                </Button>
                                            </div>
                                            <h1 className='text-lg'>{student.first_name} {student.last_name}</h1>
                                            <div className='space-y-1'>
                                                <p>
                                                    อีเมล:
                                                    <Link className='text-blue-500 ms-2' target='_blank' href={`https://mail.google.com/mail/?view=cm&fs=1&to=${student.email}&authuser=1`} >
                                                        {student.email}
                                                    </Link>
                                                </p>
                                                <p>นักศึกษาหลักสูตร {student?.Program?.title_th} {student?.courses_type}</p>
                                                <p>สถานะภาพ: <span className='ms-1'>{student?.StudentStatus?.description} ({student?.StudentStatus?.id})</span></p>
                                                <p>GPA: <span className='ms-1'>{gpa}</span></p>
                                                {
                                                    student?.User?.createdAt &&
                                                    <p>เข้าใช้เมื่อ {dmy(student?.User?.createdAt) || "-"}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='my-5 space-y-3'>
                                        <p>รายวิชาที่ลงทะเบียน</p>
                                        {
                                            Object.keys(enrollmentsByYear).length == 0 ?
                                                <>ไม่มีรายวิชาที่ลงทะเบียน</>
                                                :
                                                Object.keys(enrollmentsByYear).map((year) => (
                                                    <div key={year}>
                                                        <p className='mb-2'>ปีการศึกษา {year}</p>
                                                        <Table
                                                            isCompact
                                                            removeWrapper
                                                            aria-label="รายวิชาที่ลงทะเบียน"
                                                            checkboxesProps={{
                                                                classNames: {
                                                                    wrapper: "after:bg-blue-500 after:text-background text-background",
                                                                },
                                                            }}
                                                            classNames={tableClass}
                                                            // selectedKeys={selectedKeys}
                                                            selectionMode="multiple"
                                                            onSelectionChange={setSelectedKeys}
                                                        >
                                                            <TableHeader>
                                                                <TableColumn>รหัสวิชา</TableColumn>
                                                                <TableColumn>ชื่อวิชา</TableColumn>
                                                                <TableColumn>หน่วยกิต</TableColumn>
                                                                <TableColumn>เกรด</TableColumn>
                                                                <TableColumn>เกรด</TableColumn>
                                                                <TableColumn align="center">Action</TableColumn>
                                                            </TableHeader>
                                                            <TableBody emptyContent={"ไม่มีรายวิชาที่ลงทะเบียน"} items={enrollmentsByYear[year] || []}>
                                                                {(item) => (
                                                                    <TableRow key={item.id}>
                                                                        <TableCell>{item?.subject_code}</TableCell>
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
                                                                                    <DropdownMenu>
                                                                                        <DropdownItem>Edit</DropdownItem>
                                                                                        <DropdownItem key="delete" className="text-danger" color="danger">
                                                                                            Delete
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
                                                ))
                                        }
                                    </div>
                                </>
                                :
                                <>ไม่พบข้อมูลนักศึกษา</>
                    }
                </div>
            </ContentWrap>
        </>
    )
}
