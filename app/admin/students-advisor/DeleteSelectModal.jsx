"use client"
import { getOptions } from '@/app/components/serverAction/TokenAction'
import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { message } from 'antd'
import axios from 'axios'
import React, { useCallback, useState } from 'react'

const DeleteSelectModal = ({ setSelectedKeys, setDisableSelectDelete, setSelectedStudents, getStudents, delIsOpen, delOnClose, stuIdList }) => {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = useCallback(async function () {
        setDeleting(true)
        try {
            const option = await getOptions("/api/students/multiple/delete", "DELETE", {
                students: stuIdList
            })
            const res = await axios(option)
            const { message: msg } = res.data
            await getStudents()
            message.success(msg)
            setSelectedStudents([])
            setDisableSelectDelete(true)
            setSelectedKeys([])
            delOnClose()
        } catch (error) {
            console.log(error);
            const { message: msg } = error.response.data
            message.warning(msg)
        } finally {
            setDeleting(false)
        }
    }, [stuIdList])
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
                                <span className='text-base font-normal'>ต้องการลบรายการที่เลือกหรือไม่ ?</span>
                            </ModalHeader>
                            <ModalFooter>
                                <Button
                                    type='button'
                                    className='border-1 h-[16px] py-4'
                                    radius='sm'
                                    color="primary"
                                    variant='bordered'
                                    onPress={delOnClose}>
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

export default DeleteSelectModal