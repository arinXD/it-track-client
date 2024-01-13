"use client"

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';

export default function ProgramCodeUpdate({ isOpen, onClose, onUpdate, programCodeId }) {
    const [program_code, setUpdatedTitle] = useState('');
    const [description, setDescription] = useState('');
    const [version, setVersion] = useState('');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const fetchProgramCode = async () => {
            try {
                const response = await axios.get(`${hostname}/api/programcodes/${programCodeId}`);
                setVersion(response.data.data.version);
                setUpdatedTitle(response.data.data.program_code);
                setDescription(response.data.data.desc);

                const programsResult = await axios.get(`${hostname}/api/programs`);
                const programs = programsResult.data.data;

                // Map categories for react-select
                const options = programs.map(program => ({
                    value: program.program,
                    label: program.title_th
                }));

                setPrograms(options);

                // Find the selected category based on the current group's category ID
                const selectedProgram = options.find(option => option.value === response.data.data.program);
                setSelectedProgram(selectedProgram);
            } catch (error) {
                console.error('Error fetching program code:', error);
            }
        };

        fetchProgramCode();
    }, [programCodeId]);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const result = await axios.get(`${hostname}/api/programs`);
                const data = result.data.data;
                const programOptions = data.map(program => ({
                    value: program.id,
                    label: program.program_title,
                }));
                setPrograms(programOptions);
            } catch (error) {
                console.error('Error fetching programs:', error);
            }
        };

        fetchPrograms();
    }, []);

    const handleUpdateProgramCode = async () => {
        try {
            await axios.post(`${hostname}/api/programcodes/updateProgramCode/${programCodeId}`, {
                program_code: program_code,
                desc: description,
                version: version,
                program: selectedProgram.value, // Add the selected program ID
                // Add other fields as needed
            });

            // Notify the parent component that data has been updated
            onUpdate();

            // Close the modal after updating
            onClose();
        } catch (error) {
            console.error('Error updating program code:', error);
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Update Program Code</ModalHeader>
                <ModalBody>
                    <label htmlFor="updatedTitle">Updated Program Code Title:</label>
                    <input
                        type="text"
                        id="updatedTitle"
                        value={program_code}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label htmlFor="version">Version:</label>
                    <input
                        type="text"
                        id="version"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                    />
                    <label htmlFor="program">Select Program:</label>
                    <Select
                        id="program"
                        value={selectedProgram}
                        options={programs}
                        onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                        isSearchable
                    />
                    {/* Add other form fields as needed */}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="primary" onPress={handleUpdateProgramCode}>
                        Update Program Code
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
