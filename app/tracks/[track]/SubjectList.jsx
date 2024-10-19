"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useState } from "react";

const SubjectList = ({ subjects, careers }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalContent, setModalContent] = useState({
        title: "",
        description: ""
    });

    const handleOpen = (data) => {
        setModalContent(data);
        onOpen()
    }

    return (
        <section className="max-w-4xl mx-auto px-4 mt-10 mb-8">

            <Modal
                size={"md"}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 px-6 pb-0 font-normal">{modalContent.title}</ModalHeader>
                            <ModalBody className="px-6 pt-4 pb-6">
                                <p>{modalContent.description}</p>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div className="flex flex-col md:flex-row gap-10 md:gap-20">
                <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-semibold mb-2">วิชาประจำกลุ่มและขอบเขตความรู้</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {subjects?.map((subject, index) => (
                            <li key={index}
                                onClick={() => handleOpen({
                                    title:
                                        <div>
                                            <p className="text-lg font-bold">{subject?.title_en}</p>
                                            <p>{subject?.title_th}</p>
                                        </div>,
                                    description: subject?.information || "ไม่พบข้อมูลในขณะนี้"
                                })}
                                className="text-sm text-blue-600 cursor-pointer">
                                {subject?.title_en} - {subject?.title_th}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-semibold mb-2">โอกาสทางอาชีพ</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {careers?.map((career, index) => (
                            <li key={index}
                                onClick={() => handleOpen({
                                    title:
                                        <div>
                                            <p className="text-lg font-bold">{career?.name_en}</p>
                                            <p>{career?.name_th}</p>
                                        </div>,
                                    description: career?.desc || "ไม่พบข้อมูลในขณะนี้"
                                })}
                                className="text-sm text-blue-600 cursor-pointer">
                                {career?.name_en} - {career?.name_th}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default SubjectList