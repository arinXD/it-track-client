"use client"

// ProgramInsert.js
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';

export default function ProgramInsert({ isOpen, onClose, onDataInserted }) {
    const [program, setProgram] = useState('');
    const [title_en, setProgramTitleEn] = useState('');
    const [title_th, setProgramTitleTh] = useState('');

    const handleInsertProgram = async () => {
        try {
            await axios.post(`${hostname}/api/programs/insertProgram`, {
                program: program,
                title_en: title_en,
                title_th: title_th,
            });

            // Notify the parent component that data has been inserted
            onDataInserted();

            // Close the modal after inserting
            onClose();
        } catch (error) {
            // Handle error if needed
            console.error('Error inserting program:', error);
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Add Program</ModalHeader>
                <ModalBody>
                    <label htmlFor="program">Program:</label>
                    <input
                        type="text"
                        id="program"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                    />
                    <label htmlFor="title_en">Title EN:</label>
                    <input
                        type="text"
                        id="title_en"
                        value={title_en}
                        onChange={(e) => setProgramTitleEn(e.target.value)}
                    />
                    <label htmlFor="title_th">Title TH:</label>
                    <input
                        type="text"
                        id="title_th"
                        value={title_th}
                        onChange={(e) => setProgramTitleTh(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="primary" onPress={handleInsertProgram}>
                        Add Program
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
