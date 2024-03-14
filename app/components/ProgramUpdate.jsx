"use client"

// ProgramUpdate.js
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { toast } from 'react-toastify';

export default function ProgramUpdate({ isOpen, onClose, onUpdate, programId }) {
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
    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await axios.get(`${hostname}/api/programs/${programId}`);
                setProgram(response.data.data.program);
                setProgramTitleEn(response.data.data.title_en);
                setProgramTitleTh(response.data.data.title_th);
            } catch (error) {
                console.error('Error fetching program:', error);
            }
        };

        fetchProgram();
    }, [programId]);

    const handleUpdateProgram = async () => {
        try {
            const result = await axios.put(`${hostname}/api/programs/updateProgram/${programId}`, {
                program: program,
                title_en: title_en,
                title_th: title_th,
            });

            // Notify the parent component that data has been updated
            onUpdate();

            showToastMessage(true, `อัปเดตหลักสูตร ${result.data.data.program} สำเร็จ`);
            onClose();
        } catch (error) {
            showToastMessage(false, 'หลักสูตรซ้ำ');
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">แก้ไขหลักสูตร</ModalHeader>
                <ModalBody>
                    <Input
                        isDisabled
                        type="text"
                        label="หลักสูตร"
                        id="program"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                    />

                    <Input
                        type="text"
                        label="ชื่อภาษาอังกฤษ"
                        id="title_en"
                        value={title_en}
                        onChange={(e) => setProgramTitleEn(e.target.value)}
                    />

                    <Input
                        type="text"
                        label="ชื่อภาษาไทย"
                        id="title_th"
                        value={title_th}
                        onChange={(e) => setProgramTitleTh(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" onPress={handleUpdateProgram}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

