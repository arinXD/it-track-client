"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { fetchData, fetchDataObj } from '../../action'
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import Image from 'next/image'
import { dmy } from '@/src/util/dateFormater'
import { Button, useDisclosure } from '@nextui-org/react'
import { DeleteIcon2, EditIcon2, PlusIcon } from '@/app/components/icons'
import { Spinner } from "@nextui-org/react";
import Link from 'next/link'
import EditModal from './EditModal'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EnrollmentsTable from './EnrollmentsTable'
import { floorGpa, calGrade, isNumber } from '@/src/util/grade'
import InsertEnrollmentForm from './InsertEnrollmentForm'
import EditEnrollmentForm from './EditEnrollmentForm'
import DeleteEnrollModal from './DeleteEnrollModal'
import DeleteModal from '../DeleteModal'

export default function Page({ params }) {

    const showToastMessage = useCallback((ok, message) => {
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
    }, [])

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: delIsOpen, onOpen: delOnOpen, onClose: delOnClose } = useDisclosure();
    const { isOpen: isOpenEnroll, onOpen: onOpenEnroll, onClose: onCloseEnroll } = useDisclosure();
    const { isOpen: isOpenEditEnroll, onOpen: onOpenEditEnroll, onClose: onCloseEditEnroll } = useDisclosure();
    const { isOpen: isOpenDeleteEnroll, onOpen: onOpenDeleteEnroll, onClose: onCloseDeleteEnroll } = useDisclosure();

    const searchParams = useSearchParams()
    const editMode = searchParams.get('edit') || "0"
    const [student, setStudent] = useState({})

    const { stu_id } = params
    const [gpa, setGpa] = useState(0)
    const [enrollmentsByYear, setEnrollmentsByYear] = useState([])
    const [fetching, setFetching] = useState(true)
    const [programs, setPrograms] = useState([])
    const [status, setStatus] = useState([])
    const [updateData, setUpdateData] = useState({})

    const [editEnroll, setEditEnroll] = useState({});

    useEffect(() => {
        if (fetching == false && Object.keys(student).length == 0) {
            // setTimeout(() => {
            //     window.location.href = "/admin/students"
            // }, 1500)
        }
    }, [fetching, student])

    async function getStudentData() {
        const student = await fetchDataObj(`/api/students/${stu_id}`)
        setStudent(student)
        if (student?.Enrollments?.length) {
            let enrollments = student?.Enrollments
            // หา GPA
            setGpa(getGpa(enrollments))

            // เรียงลำดับใหม่ DESC 
            enrollments.sort((a, b) => {
                const gradeA = calGrade(a.grade);
                const gradeB = calGrade(b.grade);

                const isSpecialGrade = (grade) => ["I", "P", "R", "S", "T", "U", "W",].includes(grade);
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
        let statuses = await fetchData("/api/statuses")
        setStatus(statuses)
    }

    function getGpa(enrollments) {
        if (enrollments.length == 0) return 0
        let sumGrade = 0
        let sumCredit = 0
        for (const enrollment of enrollments) {
            const grade = calGrade(enrollment?.grade)
            if (grade == undefined || !isNumber(grade)) {
                continue
            }
            const credit = enrollment?.Subject?.credit || 0
            sumGrade += grade * credit
            sumCredit += credit
        }
        return floorGpa(sumGrade / sumCredit)
    }

    async function initData() {
        setFetching(true)
        // await getStudentData()
        // await getPrograms()
        // await getStudentStatuses()
        setFetching(false)
    }

    useEffect(() => {
        initData()
    }, [])

    useEffect(() => {
        if (editMode == "1" && Object.keys(student).length && Object.keys(programs).length && Object.keys(status).length) {
            handleEdit()
        } else {
            onClose()
        }
    }, [editMode, student, programs, status])

    function handleEdit() {
        const updatedStudent = { ...student };
        delete updatedStudent.Enrollments;
        setUpdateData(updatedStudent);
        onOpen();
    }

    return (
        <>
            <EditModal
                status={status}
                programs={programs}
                showToastMessage={showToastMessage}
                getStudentData={getStudentData}
                student={updateData}
                isOpen={isOpen}
                onClose={onClose} />
            <DeleteModal
                showToastMessage={showToastMessage}
                callData={initData}
                delIsOpen={delIsOpen}
                delOnClose={delOnClose}
                stuId={stu_id} />
            <InsertEnrollmentForm
                showToastMessage={showToastMessage}
                isOpen={isOpenEnroll}
                student={student}
                callBack={initData}
                onClose={onCloseEnroll} />
            <EditEnrollmentForm
                showToastMessage={showToastMessage}
                isOpen={isOpenEditEnroll}
                student={student}
                callBack={initData}

                enroll={editEnroll}
                onClose={onCloseEditEnroll} />

            <DeleteEnrollModal
                showToastMessage={showToastMessage}
                callData={initData}
                delIsOpen={isOpenDeleteEnroll}
                delOnClose={onCloseDeleteEnroll}
                enroll={editEnroll} />

            <div>
                {
                    fetching ?
                        <div className='w-full flex justify-center h-[70vh]'>
                            <Spinner label="กำลังโหลด..." color="primary" />
                        </div>
                        :
                        Object.keys(student).length ?
                            <>
                                <div className='bg-gray-100 border-gray-200 border-1 p-3 flex flex-row justify-between items-center rounded-md'>
                                    <h1>ข้อมูลของนักศึกษา</h1>
                                    <div className='flex flex-2 gap-3'>
                                        <Button
                                            type='button'
                                            className=''
                                            radius='sm'
                                            size='sm'
                                            color="default"
                                            variant='solid'
                                            startContent={<EditIcon2 className={"w-5 h-5"} />}
                                            onPress={handleEdit}>
                                            แก้ไขรายชื่อนักศึกษา
                                        </Button>
                                        <Button
                                            type='button'
                                            className=''
                                            radius='sm'
                                            size='sm'
                                            color="default"
                                            startContent={<DeleteIcon2 className={"w-5 h-5"} />}
                                            variant='solid'
                                            onPress={delOnOpen}>
                                            ลบรายชื่อนักศึกษา
                                        </Button>
                                    </div>
                                </div>
                                <div className='flex gap-8 py-6'>
                                    <div className="w-[30%] flex flex-col justify-center items-center">
                                        <Image
                                            className='rounded-lg'
                                            priority={true}
                                            alt='student image'
                                            width={150}
                                            height={150}
                                            src={student?.User?.image || "/image/user.png"}
                                        />
                                    </div>
                                    <div className='w-[70%] flex flex-col space-y-2'>
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
                                            <p>
                                                ปีการศึกษา: <span className='ms-1'>{student?.acadyear} </span>
                                                {student?.acadyear_desc && <span className='text-xs'>({student?.acadyear_desc})</span>}
                                            </p>
                                            <p>GPA: <span className='ms-1'>{gpa}</span></p>
                                            {
                                                student?.User?.createdAt &&
                                                <p>เข้าใช้เมื่อ {dmy(student?.User?.createdAt) || "-"}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='my-3 space-y-3'>
                                    <div className='flex gap-3 items-center'>
                                        <p>รายวิชาที่ลงทะเบียน</p>
                                        <Button
                                            type='button'
                                            className=''
                                            radius='sm'
                                            size='sm'
                                            color="default"
                                            variant='solid'
                                            startContent={<PlusIcon width={4} height={4} />}
                                            onPress={onOpenEnroll}>
                                            เพิ่มรายวิชาที่ลงทะเบียน
                                        </Button>
                                    </div>
                                    {
                                        Object.keys(enrollmentsByYear).length == 0 ?
                                            <>ไม่มีรายวิชาที่ลงทะเบียน</>
                                            :
                                            Object.keys(enrollmentsByYear).map((year) => (
                                                <EnrollmentsTable
                                                    key={year}
                                                    year={year}
                                                    callBack={initData}
                                                    enrollments={enrollmentsByYear[year]}
                                                    showToastMessage={showToastMessage}

                                                    onOpenEditEnroll={onOpenEditEnroll}
                                                    onOpenDeleteEnroll={onOpenDeleteEnroll}
                                                    setEditEnroll={setEditEnroll}
                                                />
                                            ))
                                    }
                                </div>
                            </>
                            :
                            <>ไม่พบข้อมูลนักศึกษา</>
                }
            </div>
        </>
    )
}
