"use client"

// ProgramInsert.js
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';

export default function ProgramInsert({ isOpen, onClose, onDataInserted }) {
    const [program_title, setProgramTitle] = useState('');

    const handleInsertProgram = async () => {
        try {
            await axios.post(`${hostname}/api/programs/insertProgram`, {
                program_title: program_title,
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
                    <label htmlFor="programTitle">Program Title:</label>
                    <input
                        type="text"
                        id="programTitle"
                        value={program_title}
                        onChange={(e) => setProgramTitle(e.target.value)}
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
