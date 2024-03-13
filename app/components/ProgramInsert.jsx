"use client"

// ProgramInsert.js
import React, { useState,useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { toast } from 'react-toastify';
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

            if (!program.trim()) {
                showToastMessage(false, 'หลักสูตรห้ามเป็นค่าว่าง');
                return;
            }

            const result = await axios.post(`${hostname}/api/programs/insertProgram`, {
                program: program,
                title_en: title_en,
                title_th: title_th,
            });

            // Notify the parent component that data has been inserted
            onDataInserted();
            showToastMessage(true, `เพิ่มหลักสูตร ${result.data.data.program} สำเร็จ`);
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
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">เพิ่มหลักสูตร</ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        label="หลักสูตร"
                        id="program"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                    />
                    <Input
                        type="text"
                        id="title_en"
                        label="ชื่อภาษาอังกฤษ"
                        value={title_en}
                        onChange={(e) => setProgramTitleEn(e.target.value)}
                    />
                    <Input
                        type="text"
                        id="title_th"
                        label="ชื่อภาษาไทย"
                        value={title_th}
                        onChange={(e) => setProgramTitleTh(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" onPress={handleInsertProgram}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
