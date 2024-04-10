import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'
import InsertExcelForm from './InsertExcelForm'

const InsertExcelModal = ({ title, headers, hook, studentExcelIsOpen, studentExcelOnClose, callData, templateFileName }) => {
    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={studentExcelIsOpen}
            onClose={studentExcelOnClose}
            size="4xl"
            placement="top"
            scrollBehavior="inside"
            classNames={{
                body: "py-6",
                backdrop: "bg-[#292f46]/50 backdrop-opacity-10",
                base: "border-gray-300",
                header: "border-b-[1.5px] border-gray-300",
                footer: "border-t-[1.5px] border-gray-300",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
        >
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <InsertExcelForm
                        headers={headers}
                        templateFileName={templateFileName}
                        hook={hook}
                        callData={callData}
                        closeModal={studentExcelOnClose} />
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="bordered"
                        onClick={studentExcelOnClose}
                        color="error">
                        ยกเลิก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default InsertExcelModal