"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { SearchIcon } from '@/app/components/icons';
import { getAcadyears } from '@/src/util/academicYear';
import { getGrades } from '@/src/util/grade';
import Swal from 'sweetalert2';

const swal = Swal.mixin({
    customClass: {
        confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
        cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
    },
    buttonsStyling: false
});

const inputClass = {
    label: "text-black/50",
    input: [
        "text-sm",
        "bg-transparent",
        "text-black/90",
        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
    ],
    innerWrapper: [
        "bg-transparent",
    ],
    inputWrapper: [
        "h-[18px]",
        "hover:bg-white",
        "border-1",
        "bg-white",
        "group-data-[focused=true]:bg-default-200/50",
        "!cursor-text",
    ],
}

const InsertEnrollmentForm = ({ showToastMessage, isOpen, onClose, student, callBack }) => {
    const [studentData, setStudentData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);
    const acadyears = getAcadyears().map(acad => String(acad))
    const grades = getGrades()

    const [inserting, setInserting] = useState(false);
    const [searchingSubject, setSearchingSubject] = useState(false);
    const [searchSubject, setSearchSubject] = useState("");
    const [subject, setSubject] = useState({});

    const findEnroll = useCallback(async (formData) => {
        const url = `/api/students/enrollments/${formData.stu_id}/${formData.subject_id}/${formData.enroll_year}`
        const options = await getOptions(url)
        try {
            const res = await axios(options)
            const data = res.data.data
            return data
        } catch (error) {
            return {}
        }
    }, [])

    const createEnroll = useCallback(async (options) => {
        try {
            setInserting(true)
            const res = await axios(options)
            const { ok, message } = res.data
            showToastMessage(ok, message)
            callBack()
            closeForm()
        } catch (error) {
            const { ok, message } = error.response.data
            showToastMessage(ok, message)
        } finally {
            setInserting(false)
        }
    }, [])

    const insertEnroll = useCallback(async (stu_id, subject_id) => {
        const formData = {
            stu_id,
            subject_id,
            enroll_year: document.querySelector("#select-acadyear").value,
            grade: document.querySelector("#select-grade").value,
        }
        const enroll = await findEnroll(formData)
        const url = `/api/students/enrollments`
        const options = await getOptions(url, "POST", formData)
        if (enroll && Object.keys(enroll).length > 0) {
            swal.fire({
                text: `นักศึกษามีเกรดวิชานี้แล้วต้องการเปลี่ยนแปลงหรือไม่ ?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "เปลี่ยนแปลง",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // บันทึกใหม่
                    formData.id = enroll.id
                    formData.replace = true
                    options.data = formData
                    createEnroll(options)
                } else {
                    closeForm()
                    return
                }
            });
        } else {
            createEnroll(options)
        }
    }, [])


    const fetchSubjects = useCallback(async (subject) => {
        if (searchingSubject) return
        if (!subject) {
            setSubjectData([])
            return
        }
        const url = `/api/subjects/find/${subject}`
        const options = await getOptions(url);
        try {
            setSearchingSubject(true)
            const res = await axios(options)
            setSubjectData(res.data.data)
        } catch (error) {
            setSubjectData([])
        } finally {
            setSearchingSubject(false)
        }
    }, [])

    function closeForm() {
        setStudentData([])
        setSubjectData([])
        setSubject({})
        setSearchSubject("")
        onClose()
    }

    function selectSubject(subject) {
        setSubject(subject)
        setSubjectData([])
    }

    return (
        <>
            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                size={"3xl"}
                isOpen={isOpen}
                onClose={closeForm}
                classNames={{
                    body: "p-5",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-10",
                    base: "border-gray-300",
                    header: "border-b-[1.5px] border-gray-300",
                    footer: "border-t-[1.5px] border-gray-300",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2>เพิ่มการลงทะเบียนเรียนของนักศึกษา</h2>
                                <span className='text-base font-normal'>แบบฟอร์มเพิ่มการลงทะเบียนเรียนของนักศึกษา</span>
                            </ModalHeader>
                            <ModalBody>
                                <div
                                    style={{
                                        boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"
                                    }}
                                    className='mb-3 space-y-2 rounded-md p-2'>
                                    <div>
                                        {
                                            Object.keys(student) == 0 || studentData?.length != 0 ? undefined :
                                                <div>
                                                    <p className='text-sm font-bold'>ข้อมูลนักศึกษา</p>
                                                    <p>
                                                        {student?.stu_id} {student?.first_name} {student?.last_name} {student?.Program?.title_th} ({student?.courses_type})
                                                    </p>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div
                                    style={{
                                        boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"
                                    }}
                                    className='mb-3 space-y-2 rounded-md p-2'>
                                    <div className='flex flex-row gap-3 justify-start items-end'>
                                        <Input
                                            label="ค้นหาวิชา"
                                            labelPlacement='outside'
                                            isClearable
                                            className="w-full"
                                            placeholder="รหัสวิชา, ชื่อวิชา"
                                            size="sm"
                                            classNames={inputClass}
                                            startContent={<SearchIcon />}
                                            value={searchSubject}
                                            onValueChange={setSearchSubject}
                                            onKeyDown={e => (e.code === 'Enter' || e.code === 'NumpadEnter') && fetchSubjects(searchSubject)}
                                        />
                                        <Button
                                            onClick={() => fetchSubjects(searchSubject)}
                                            radius="sm"
                                            size="md"
                                            variant="solid"
                                            className="bg-gray-200 h-[32px]"
                                            startContent={<SearchIcon className="w-5 h-5" />}>
                                            ค้นหา
                                        </Button>
                                    </div>
                                    <div>
                                        {
                                            Object.keys(subject) == 0 || subjectData?.length != 0 ? undefined :
                                                <>
                                                    <div>
                                                        <p className='text-sm font-bold'>ข้อมูลนักศึกษา</p>
                                                        <p>
                                                            {subject?.subject_code} <span>{subject?.title_en}</span> <span>{subject?.title_th}</span> {subject?.credit} หน่วยกิต
                                                        </p>
                                                    </div>
                                                </>
                                        }
                                        {subjectData?.length == 0 ? undefined :
                                            searchingSubject ?
                                                <div className='w-full flex justify-center'>
                                                    <Spinner label="กำลังโหลด..." color="primary" />
                                                </div>
                                                :
                                                <div className='h-[150px] overflow-y-auto border-1'>
                                                    <table className='w-[100%]'>
                                                        <thead>
                                                            <tr className='border-b-1'>
                                                                <th className='px-2 py-1 text-start'>รหัสวิชา</th>
                                                                <th className='px-2 py-1 text-start'>ชื่อวิชา</th>
                                                                <th className='px-2 py-1 text-start'>หน่วยกิต</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className=''>
                                                            {subjectData.map(subject => (
                                                                <tr
                                                                    onClick={() => selectSubject(subject)}
                                                                    key={subject?.subject_code}
                                                                    className='cursor-pointer border-b-1 w-full hover:bg-gray-200'
                                                                >
                                                                    <td className='px-2 py-1 text-start'>{subject?.subject_code}</td>
                                                                    <td className='px-2 py-1 text-start'>
                                                                        <div className='flex flex-col'>
                                                                            <span>{subject?.title_en}</span>
                                                                            <span>{subject?.title_th}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className='px-2 py-1 text-start'>{subject?.credit}</td>
                                                                </tr>
                                                            ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div className='flex flex-row gap-3 items-end'>
                                    <div className='flex flex-col w-[50%]'>
                                        <label className='text-xs mb-0.5'>ปีการศึกษา</label>
                                        <select
                                            defaultValue={""}
                                            id="select-acadyear"
                                            className="border-1 text-sm rounded-lg block w-full p-2.5"
                                            style={{
                                                lineHeight: "40px",
                                                height: "40px",
                                            }}
                                        >
                                            <option value="" className='' disabled hidden>เลือกปีการศึกษา</option>
                                            {acadyears.map(acadyear => (
                                                <option key={acadyear} value={acadyear}>{acadyear}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='flex flex-col w-[50%]'>
                                        <label className='text-xs mb-0.5'>เกรด</label>
                                        <select
                                            id="select-grade"
                                            defaultValue={""}
                                            className="border-1 text-sm rounded-lg block w-full p-2.5">
                                            <option value="" className='' disabled hidden>เลือกเกรด</option>
                                            {
                                                Object.keys(grades).map(type => (
                                                    <optgroup
                                                        key={type}
                                                        label={grades[type].lable}
                                                    >
                                                        {grades[type].grades.map(grade => (
                                                            <option key={grade.grade} value={grade.grade}>
                                                                {grade.grade} ({grade.meaning})
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))
                                            }
                                        </select>
                                        {/* <label className='text-xs mb-0.5'>เกรด</label>
                                        <select
                                            defaultValue={""}
                                            id=""
                                            className='border-1 w-full rounded-lg px-1'
                                            style={{
                                                lineHeight: "40px",
                                                height: "40px",
                                            }}
                                        >
                                            <option value="" className='' disabled hidden>เลือกเกรด</option>
                                            {grades.map(gradeType => (
                                                
                                            ))}
                                        </select> */}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={closeForm}>
                                    ยกเลิก
                                </Button>
                                <Button
                                    onPress={() => insertEnroll(student?.stu_id, subject?.subject_id)}
                                    isDisabled={inserting}
                                    isLoading={inserting}
                                    type='submit'
                                    className='h-[16px] py-4 ms-4'
                                    radius='sm'
                                    color="primary"
                                    variant='solid'>
                                    เพิ่ม
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}

export default InsertEnrollmentForm