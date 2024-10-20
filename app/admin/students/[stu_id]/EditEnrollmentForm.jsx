"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spinner } from "@nextui-org/react";
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { getAcadyears } from '@/src/util/academicYear';
import { getGrades } from '@/src/util/grade';
import Swal from 'sweetalert2';
import { SELECT_STYLE } from '@/src/util/ComponentClass';

const swal = Swal.mixin({
    customClass: {
        confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
        cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
    },
    buttonsStyling: false
});

const EditEnrollmentForm = ({ showToastMessage, isOpen, onClose, student, callBack,
    enroll, }) => {
    const acadyears = getAcadyears().map(acad => String(acad))
    const grades = getGrades()
    const subject = enroll?.Subject
    const enrollYear = enroll?.enroll_year
    const grade = enroll?.grade

    const [inserting, setInserting] = useState(false);

    const createEnroll = useCallback(async (options) => {
        try {
            setInserting(true)
            const res = await axios(options)
            const { ok, message } = res.data
            showToastMessage(ok, message)
            callBack()
            onClose()
        } catch (error) {
            console.log(error);
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
        const url = `/api/students/enrollments`
        const options = await getOptions(url, "POST", formData)
        swal.fire({
            text: `ต้องการเปลี่ยนแปลงเกรดวิชานี้หรือไม่ ?`,
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
                onClose()
                return
            }
        });

    }, [enroll])

    return (
        <>
            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                size={"3xl"}
                isOpen={isOpen}
                onClose={onClose}
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
                                <h2>แก้ไขการลงทะเบียนเรียนของนักศึกษา</h2>
                                <span className='text-base font-normal'>แบบฟอร์มแก้ไขการลงทะเบียนเรียนของนักศึกษา</span>
                            </ModalHeader>
                            <ModalBody>
                                <div className='mb-3 space-y-2'>
                                    {
                                        Object.keys(student) == 0 ? undefined :
                                            <>
                                                <p className='text-sm font-bold'>ข้อมูลนักศึกษา</p>
                                                <p>
                                                    {student?.stu_id} {student?.first_name} {student?.last_name} {student?.Program?.title_th} ({student?.courses_type})
                                                </p>
                                            </>
                                    }
                                </div>

                                <hr />

                                <div className='my-3 space-y-2'>
                                    {
                                        Object.keys(subject) == 0 ? undefined :
                                            <>
                                                <p className='text-sm font-bold'>ข้อมูลนักศึกษา</p>
                                                <p>
                                                    {subject?.subject_code} <span>{subject?.title_en}</span> <span>{subject?.title_th}</span> {subject?.credit} หน่วยกิต
                                                </p>
                                            </>
                                    }
                                </div>

                                <hr />

                                <div className='mt-3 flex flex-row gap-6 items-end'>
                                    <div className='flex flex-col w-[50%]'>
                                        <label className='text-xs mb-0.5'>ปีการศึกษา</label>
                                        <select
                                            defaultValue={enrollYear}
                                            id="select-acadyear"
                                            className="border-1 text-sm rounded-lg block w-full p-2.5"
                                            style={SELECT_STYLE}
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
                                            defaultValue={grade}
                                            style={SELECT_STYLE}
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
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
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

export default EditEnrollmentForm