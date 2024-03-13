"use client"
import { hostname } from '@/app/api/hostname'
import { getToken } from '@/app/components/serverAction/TokenAction'
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import axios from 'axios'
import React, { useState } from 'react'

const DeleteModal = ({ showToastMessage, callData, delIsOpen, delOnClose, stuId }) => {
    const [deleting, setDeleting] = useState(false)

    async function handleDelete() {
        setDeleting(true)
        try {
            const token = await getToken()
            const options = {
                url: `${hostname}/api/students/${stuId}/force`,
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'authorization': `${token}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            };

            const res = await axios(options)
            const { ok, message } = res.data
            await callData()
            await showToastMessage(ok, message)
            delOnClose()
        } catch (error) {
            console.log(error);
            const { ok, message } = error.response.data
            showToastMessage(ok, message)
        } finally {
            setDeleting(false)
        }
    }
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