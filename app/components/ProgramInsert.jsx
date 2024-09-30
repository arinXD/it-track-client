"use client"

// ProgramInsert.js
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { toast } from 'react-toastify';

import { Empty, message } from 'antd';
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'

export default function ProgramInsert({ isOpen, onClose, onDataInserted }) {
    const [program, setProgram] = useState('');
    const [title_en, setProgramTitleEn] = useState('');
    const [title_th, setProgramTitleTh] = useState('');
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
    const handleInsertProgram = async () => {
        try {

            const programPattern = /^[A-Za-zก-๙0-9\s]+$/; // Regular Expression สำหรับภาษาอังกฤษ ภาษาไทย ตัวเลข และช่องว่าง
            if (!program.trim()) {
                showToastMessage(false, 'หลักสูตรห้ามเป็นค่าว่าง');
                return;
            } else if (!programPattern.test(program.trim())) {
                showToastMessage(false, 'หลักสูตรต้องประกอบด้วยตัวอักษรภาษาไทย, ภาษาอังกฤษ, และตัวเลขเท่านั้น');
                return;
            }

            const englishPattern = /^[A-Za-z\s]+$/;
            if (!title_en.trim()) {
                showToastMessage(false, 'ชื่ออังกฤษห้ามเป็นค่าว่าง');
                return;
            } else if (!englishPattern.test(title_en.trim())) {
                showToastMessage(false, 'ชื่ออังกฤษต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น');
                return;
            }

            const thaiPattern = /^[ก-๙\s]+$/;
            if (!title_th.trim()) {
                showToastMessage(false, 'ชื่อไทยห้ามเป็นค่าว่าง');
                return;
            } else if (!thaiPattern.test(title_th.trim())) {
                showToastMessage(false, 'ชื่อไทยต้องเป็นตัวอักษรภาษาไทยเท่านั้น');
                return;
            }

            const url = `/api/programs/insertProgram`;
            const formData = {
                program: program,
                title_en: title_en,
                title_th: title_th,
            };

            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;
            message.success(msg)

            // Notify the parent component that data has been inserted
            onDataInserted();
            onClose();
        } catch (error) {
            // Handle error if needed
            showToastMessage(false, 'หลักสูตรซ้ำ');
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Clear all state values
            setProgram('');
            setProgramTitleEn('');
            setProgramTitleTh('');
        }
    }, [isOpen]);

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="md"
            isOpen={isOpen}
            onClose={onClose}
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
                <ModalHeader className="flex flex-col gap-1">
                    <h2>เพิ่มหลักสูตร</h2>
                    <span className='text-base font-normal'>แบบฟอร์มเพิ่มหลักสูตร</span>
                </ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="หลักสูตร"
                        labelPlacement="outside"
                        placeholder="กรอกหลักสูตร"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                    />
                    <Input
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="ชื่อภาษาไทย"
                        labelPlacement="outside"
                        placeholder="กรอกชื่อภาษาไทย"
                        value={title_th}
                        onChange={(e) => setProgramTitleTh(e.target.value)}
                    />
                    <Input
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="ชื่อภาษาอังกฤษ"
                        labelPlacement="outside"
                        placeholder="กรอกชื่อภาษาอังกฤษ"
                        value={title_en}
                        onChange={(e) => setProgramTitleEn(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleInsertProgram}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
