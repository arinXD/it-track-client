"use client"
import { getOptions } from '@/app/components/serverAction/TokenAction'
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import axios from 'axios'
import React, { useCallback, useState } from 'react'

const DeleteEnrollModal = ({ showToastMessage, callData, delIsOpen, delOnClose, enroll }) => {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = useCallback(async () => {
        setDeleting(true)
        try {
            const url = `/api/students/enrollments/single/${enroll.id}`
            const options = await getOptions(url, "delete")
            const res = await axios(options)
            const { ok, message } = res.data
            await callData()
            showToastMessage(ok, message)
            delOnClose()
        } catch (error) {
            console.log(error);
            const { ok, message } = error.response.data
            showToastMessage(ok, message)
        } finally {
            setDeleting(false)
        }
    }, [enroll])
    return (
        <>
            <Modal
                size={"sm"}
                isOpen={delIsOpen}
                onClose={delOnClose}
                classNames={{
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2>ลบรายวิชาที่ลงทะเบียน</h2>
                                <span className='text-base font-normal'>ต้องการลบการลงทะเบียนวิชา {enroll?.Subject?.subject_code} หรือไม่ ?</span>
                            </ModalHeader>
                            <ModalFooter>
                                <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={delOnClose}>
                                    ยกเลิก
                                </Button>
                                <Button
                                    onPress={handleDelete}
                                    disabled={deleting}
                                    isLoading={deleting}
                                    type='submit'
                                    className='h-[16px] py-4 ms-4'
                                    radius='sm'
                                    color="primary"
                                    variant='solid'>
                                    ลบ
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default DeleteEnrollModal