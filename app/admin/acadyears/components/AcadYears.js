"use client"
import React, { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import AdminTable from './AdminTable'
// import AOS from 'aos';
// import 'aos/dist/aos.css';
import TextField from '@mui/material/TextField';
import { createAcadYear } from './action';
import { useFormState } from 'react-dom'

const AcadYears = ({ data }) => {
    const initialState = {
        message: null,
    }

    const [state, formAction] = useFormState(createAcadYear, initialState)
    const currentYear = new Date().getFullYear() + 543;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const url = usePathname();
    // useEffect(() => {
    //     AOS.init();
    // }, []);
    return (
        <div>
            <AdminTable onOpen={onOpen} data={data} pathname={url} />
            {/* <div data-aos="fade-up">
                <AdminTable onOpen={onOpen} data={data} pathname={url} />
            </div> */}
            <>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">เพิ่มปีการศึกษา</ModalHeader>
                                <form action={formAction}>
                                    <ModalBody>
                                        <p>
                                            {state?.message}
                                        </p>
                                        <TextField
                                            name="acadyear"
                                            defaultValue={currentYear}
                                            label="Number"
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
                                            state.message = ""
                                            onClose()
                                        }}>
                                            Close
                                        </Button>
                                        <Button type='submit' color="primary">
                                            Action
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