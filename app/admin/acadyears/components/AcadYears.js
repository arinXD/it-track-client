"use client"
import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import AdminTable from './AdminTable'
import AOS from 'aos';
import 'aos/dist/aos.css';
import TextField from '@mui/material/TextField';
import { createAcadYear, updateAcadYear } from './action';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AcadYears = ({ data }) => {
    const url = usePathname();
    const currentYear = new Date().getFullYear() + 543;
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onOpenChange: onOpenCreateChange } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenUpdateChange } = useDisclosure();
    const [updateData, setUpdateData] = useState(0)

    const callUpdate = (data) => {
        setUpdateData(data)
    }

    const showToastMessage = (ok, message) => {
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

    useEffect(() => {
        AOS.init();
    }, []);
    return (
        <div>
            <ToastContainer />
            <div data-aos="fade-up">
                <AdminTable
                    onOpenCreate={onOpenCreate}
                    onOpenUpdate={onOpenUpdate}
                    callUpdate={callUpdate}
                    data={data}
                    showToastMessage={showToastMessage}
                />
            </div>
            <>
                {/* update modal */}
                <Modal isOpen={isOpenUpdate} onOpenChange={onOpenUpdateChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">แก้ไขปีการศึกษา</ModalHeader>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const { ok, message } = await updateAcadYear(new FormData(e.target));
                                        showToastMessage(ok, message)
                                        onClose();
                                    }}
                                >
                                    <ModalBody>
                                        <input
                                            type="hidden"
                                            name="oldAcadyear"
                                            value={updateData}
                                            readOnly />
                                        <TextField
                                            name="newAcadyear"
                                            defaultValue={updateData}
                                            label="ปีการศึกษา"
                                            type="number"
                                            variant="outlined"
                                            inputProps={{
                                                min: 1,
                                                max: 9999,
                                            }}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={() => {
                                            onClose()
                                        }}>
                                            ยกเลิก
                                        </Button>
                                        <Button type='submit' color="primary">
                                            บันทึก
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                {/* create modal */}
                <Modal isOpen={isOpenCreate} onOpenChange={onOpenCreateChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">เพิ่มปีการศึกษา</ModalHeader>
                                <form
                                    //  action={createAcadYear}
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const { ok, message } = await createAcadYear(new FormData(e.target));
                                        showToastMessage(ok, message)
                                        onClose();
                                    }}
                                >
                                    <ModalBody>
                                        <TextField
                                            name="acadyear"
                                            defaultValue={currentYear}
                                            label="ปีการศึกษา"
                                            type="number"
                                            variant="outlined"
                                            inputProps={{
                                                min: 1,
                                                max: 9999,
                                            }}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={() => {
                                            onClose()
                                        }}>
                                            ยกเลิก
                                        </Button>
                                        <Button type='submit' color="primary">
                                            บันทึก
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        </div>

    )
}

export default AcadYears