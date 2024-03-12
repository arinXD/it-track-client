"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { fetchDataObj } from '../../action'
import { ContentWrap, Navbar, Sidebar } from '@/app/components'
import Image from 'next/image'
import { dmy } from '@/src/util/dateFormater'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { VerticalDotsIcon } from '@/app/components/icons'

export default function Page({ params }) {
    const { stu_id } = params
    const [student, setStudent] = useState({})
    const [selectedKeys, setSelectedKeys] = useState([])
    const [gpa, setGpa] = useState(0)
    const [enrollmentsByYear, setEnrollmentsByYear] = useState([])

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
        getStudentData()
    }, [])

    const tableClass = useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            td: [
                "group-data-[first=true]:first:before:rounded-none",
                "group-data-[first=true]:last:before:rounded-none",

                "group-data-[middle=true]:before:rounded-none",

                "group-data-[last=true]:first:before:rounded-none",
                "group-data-[last=true]:last:before:rounded-none",
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
                <div>
                    <h1>Student Data</h1>
                    {Object.keys(student).length ?
                        <>
                            <div className='flex gap-8'>
                                <div className="w-[30%] border-1 flex justify-center items-center">
                                    <Image
                                        priority={true}
                                        alt='student image'
                                        width={100}
                                        height={100}
                                        src={student?.User?.image || "/image/user.png"}
                                    />
                                </div>
                                <div className='w-[70%] border-1 flex flex-col space-y-3'>
                                    <h1 className='text-lg'>{student.first_name} {student.last_name}</h1>
                                    <div>
                                        <p>Email {student.email}</p>
                                        <p>นักศึกษาหลักสูตร {student?.Program?.title_th} {student?.courses_type}</p>
                                        <p>สถานะภาพ {student?.StudentStatus?.description} ({student?.StudentStatus?.id})</p>
                                        <p>GPA {gpa}</p>
                                        <p>เข้าใช้เมื่อ {dmy(student?.User?.createdAt) || "-"}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p>รายวิชาที่ลงทะเบียน</p>
                                {
                                    Object.keys(enrollmentsByYear).length &&
                                    Object.keys(enrollmentsByYear).map((year) => (
                                        <div className='my-2' key={year}>
                                            <p>ปีการศึกษา {year}</p>
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
                                                                <div className="relative flex justify-end items-center gap-2">
                                                                    <Dropdown>
                                                                        <DropdownTrigger>
                                                                            <Button isIconOnly size="sm" variant="light">
                                                                                <VerticalDotsIcon className="text-default-300" />
                                                                            </Button>
                                                                        </DropdownTrigger>
                                                                        <DropdownMenu>
                                                                            <DropdownItem href={``}>
                                                                                View
                                                                            </DropdownItem>
                                                                            <DropdownItem>Edit</DropdownItem>
                                                                            <DropdownItem>Delete</DropdownItem>
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
