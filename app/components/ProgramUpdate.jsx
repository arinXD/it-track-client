"use client"

// ProgramUpdate.js
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';

export default function ProgramUpdate({ isOpen, onClose, onUpdate, programId }) {
    const [program_title, setProgramTitle] = useState('');
    const [currentProgram, setCurrentProgram] = useState({});

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await axios.get(`${hostname}/api/programs/${programId}`);
                setCurrentProgram(response.data.data);
                setProgramTitle(response.data.data.program_title);
            } catch (error) {
                console.error('Error fetching program:', error);
            }
        };

        fetchProgram();
    }, [programId]);

    const handleUpdateProgram = async () => {
        try {
            await axios.post(`${hostname}/api/programs/updateProgram/${programId}`, {
                program_title: program_title,
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
                    <label htmlFor="updatedTitle">Updated Program Title:</label>
                    <input
                        type="text"
                        id="updatedTitle"
                        value={program_title}
                        onChange={(e) => setProgramTitle(e.target.value)}
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

