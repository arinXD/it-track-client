"use client"
import { getOptions } from '@/app/components/serverAction/TokenAction'
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import axios from 'axios'
import React, { useCallback, useState } from 'react'

const DeleteModal = ({ callData, delIsOpen, delOnClose, stuId }) => {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = useCallback(async function () {
        setDeleting(true)
        try {
            const option = await getOptions(`/api/students/${stuId}`, "DELETE")
            const res = await axios(option)
            const { message: msg } = res.data
            await callData()
            message.success(msg)
            delOnClose()
        } catch (error) {
            console.log(error);
            const { message: msg } = error.response.data
            message.warning(msg)
        } finally {
            setDeleting(false)
        }
    }, [stuId])

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
                                <h2>ลบรายชื่อนักศึกษา</h2>
                                <span className='text-base font-normal'>ต้องการลบรายชื่อนักศึกษา รหัส {stuId} หรือไม่ ?</span>
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

export default DeleteModal