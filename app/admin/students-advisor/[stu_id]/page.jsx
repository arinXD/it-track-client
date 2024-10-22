"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { fetchData, fetchDataObj } from '../../action'
import { BreadCrumb } from '@/app/components'
import Image from 'next/image'
import { dmy } from '@/src/util/dateFormater'
import { Button, Input, useDisclosure } from '@nextui-org/react'
import { DeleteIcon, DeleteIcon2, EditIcon2, PlusIcon } from '@/app/components/icons'
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
import { useSession } from 'next-auth/react'
import { getCurrentUserEmail } from '@/src/util/userData'
import { insertColor } from '@/src/util/ComponentClass'
import { MdOutlinePersonOutline } from 'react-icons/md'
import { CiStar } from 'react-icons/ci'

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

    async function getStudentData() {
        const email = await getCurrentUserEmail()
        const student = await fetchDataObj(`/api/advisors/${email}/students/${stu_id}`)
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
        await getStudentData()
        await getPrograms()
        await getStudentStatuses()
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
            <ToastContainer />
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

            <BreadCrumb />

            <div>
                {
                    fetching ?
                        <div className='w-full flex justify-center h-[70vh]'>
                            <Spinner label="กำลังโหลด..." color="primary" />
                        </div>
                        :
                        Object.keys(student).length ?
                            <>
                                <div className='border p-4 rounded-tr-[10px] rounded-tl-[10px] flex flex-col justify-between items-start gap-4 md:gap-0 md:flex-row md:items-center'>
                                    <div className='flex gap-4'>
                                        <MdOutlinePersonOutline className={`text-5xl border-[${insertColor.onlyColor}] text-[${insertColor.onlyColor}] ${insertColor.bg} pointer-events-none flex-shrink-0`} />
                                        <div>
                                            <p className='font-bold text-base'>Student Information</p>
                                            <p className='text-sm text-default-600'>ข้อมูลนักศึกษา</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-white flex flex-col gap-8 p-6 border border-t-0 rounded-br-[10px] rounded-bl-[10px] md:flex-row'>
                                    <div className="w-full md:w-[30%] flex flex-col justify-center items-center">
                                        <Image
                                            className='rounded-lg'
                                            priority={true}
                                            alt='student image'
                                            width={150}
                                            height={150}
                                            src={student?.User?.image || "/image/user.png"}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = "/image/error_image.png";
                                            }}
                                        />
                                    </div>
                                    <div className='w-full md:w-[70%] flex flex-col space-y-2'>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <Input
                                                classNames={{
                                                    label: "text-black/50 text-[.9em]",
                                                    inputWrapper: ["rounded-md", "p-2"],
                                                    input: "text-[1em]"
                                                }}
                                                className='w-full text-sm max-lg:order-1 col-span-2 lg:col-span-1'
                                                type="text"
                                                label="รหัสนักศึกษา"
                                                value={student.stu_id}
                                                isReadOnly
                                                labelPlacement="outside"
                                            />
                                            <Input
                                                classNames={{
                                                    label: "text-black/50 text-[.9em]",
                                                    inputWrapper: ["rounded-md", "p-2"],
                                                    input: "text-[1em]"
                                                }}
                                                className='w-full text-sm max-lg:order-1 col-span-2 lg:col-span-1'
                                                type="text"
                                                label="อีเมล"
                                                value={student.email}
                                                isReadOnly
                                                labelPlacement="outside"
                                            />
                                            <Input
                                                classNames={{
                                                    label: "text-black/50 text-[.9em]",
                                                    inputWrapper: ["rounded-md", "p-2"],
                                                    input: "text-[1em]"
                                                }}
                                                className='w-full text-sm max-lg:order-2 col-span-2 lg:col-span-1'
                                                type="text"
                                                label="ชื่อ"
                                                value={student.first_name}
                                                isReadOnly
                                                labelPlacement="outside"
                                            />
                                            <Input
                                                classNames={{
                                                    label: "text-black/50 text-[.9em]",
                                                    inputWrapper: ["rounded-md", "p-2"],
                                                    input: "text-[1em]"
                                                }}
                                                className='w-full text-sm max-lg:order-3 col-span-2 lg:col-span-1'
                                                type="text"
                                                label="สกุล"
                                                value={student.last_name}
                                                isReadOnly
                                                labelPlacement="outside"
                                            />
                                            <Input
                                                classNames={{
                                                    label: "text-black/50 text-[.9em]",
                                                    inputWrapper: ["rounded-md", "p-2"],
                                                    input: "text-[1em]"
                                                }}
                                                className='w-full text-sm max-lg:order-3 col-span-2 lg:col-span-1'
                                                type="text"
                                                label="หลักสูตร"
                                                value={`${student?.Program?.title_th} ${student?.courses_type}`}
                                                isReadOnly
                                                labelPlacement="outside"
                                            />
                                            <Input
                                                classNames={{
                                                    label: "text-black/50 text-[.9em]",
                                                    inputWrapper: ["rounded-md", "p-2"],
                                                    input: "text-[1em]"
                                                }}
                                                className='w-full text-sm max-lg:order-3 col-span-2 lg:col-span-1'
                                                type="text"
                                                label="สถานะภาพ"
                                                value={`${student?.StudentStatus?.description} (${student?.StudentStatus?.id})`}
                                                isReadOnly
                                                labelPlacement="outside"
                                            />
                                            <Input
                                                classNames={{
                                                    label: "text-black/50 text-[.9em]",
                                                    inputWrapper: ["rounded-md", "p-2"],
                                                    input: "text-[1em]"
                                                }}
                                                className='w-full text-sm max-lg:order-3 col-span-2 lg:col-span-1'
                                                type="text"
                                                label="ปีการศึกษา"
                                                value={student?.acadyear}
                                                isReadOnly
                                                labelPlacement="outside"
                                            />
                                            <Input
                                                classNames={{
                                                    label: "text-black/50 text-[.9em]",
                                                    inputWrapper: ["rounded-md", "p-2"],
                                                    input: "text-[1em]"
                                                }}
                                                className='w-full text-sm max-lg:order-3 col-span-2 lg:col-span-1'
                                                type="text"
                                                label="GPA"
                                                value={gpa}
                                                isReadOnly
                                                labelPlacement="outside"
                                            />
                                            {
                                                student?.User?.createdAt &&
                                                <p className='text-sm text-default-500 max-md:col-span-2'>เข้าสู่ระบบเมื่อ {dmy(student?.User?.createdAt)}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4 border rounded-[10px] my-4 space-y-4'>
                                    <div className='flex gap-4'>
                                        <CiStar className={`text-5xl text-[#ffcf52] bg-[#fff5dc] pointer-events-none flex-shrink-0`} />
                                        <div>
                                            <p className='font-bold text-base'>Enrollments</p>
                                            <p className='text-sm text-default-600'>ข้อมูลการลงทะเบียน</p>
                                        </div>
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
