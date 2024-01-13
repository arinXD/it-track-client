"use client"

// ProgramUpdate.js
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';

export default function ProgramUpdate({ isOpen, onClose, onUpdate, programId }) {
    const [program, setProgram] = useState('');
    const [title_en, setProgramTitleEn] = useState('');
    const [title_th, setProgramTitleTh] = useState('');

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
            await axios.put(`${hostname}/api/programs/updateProgram/${programId}`, {
                program: program,
                title_en: title_en,
                title_th: title_th,
            });

            // Notify the parent component that data has been updated
            onUpdate();

            // Close the modal after updating
            onClose();
        } catch (error) {
            console.error('Error updating program:', error);
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Update Program</ModalHeader>
                <ModalBody>
                    <label htmlFor="program">Updated Program Title:</label>
                    <input
                        type="text"
                        id="program"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                    />
                    <label htmlFor="title_en">Updated Title EN:</label>
                    <input
                        type="text"
                        id="title_en"
                        value={title_en}
                        onChange={(e) => setProgramTitleEn(e.target.value)}
                    />
                    <label htmlFor="title_th">Updated Title TH:</label>
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
                    <Button color="primary" onPress={handleUpdateProgram}>
                        Update Program
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

