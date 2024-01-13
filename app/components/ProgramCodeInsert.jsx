"use client"

// ProgramCodeInsert.js
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';

export default function ProgramCodeInsert({ isOpen, onClose, onDataInserted }) {
    const [program_code, setProgramTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [version, setVersion] = useState('');
    const [program_id, setProgramId] = useState('');
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`${hostname}/api/programs`);
                const data = result.data.data;
                setPrograms(data);
            } catch (error) {
                console.error('Error fetching programs:', error);
            }
        };

        fetchData();
    }, []);

    const handleInsertProgramCode = async () => {
        try {
            // Check if a program is selected
            if (!selectedProgram) {
                alert('Please select a subgroup.');
                return;
            }
    
            const result = await axios.post(`${hostname}/api/programcodes/insertProgramCode`, {
                program_code: program_code,
                desc: desc,
                version: version,
                program: selectedProgram.value 
            });
    
            console.log('Inserted program code:', result.data.data);
    
            // Notify the parent component that data has been inserted
            onDataInserted();
        } catch (error) {
            console.error('Error inserting program code:', error);
            // Handle error if needed
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Insert New Program Code</ModalHeader>
                        <ModalBody>
                            <label htmlFor="programTitle">Program Code Title:</label>
                            <input
                                type="text"
                                id="programTitle"
                                value={program_code}
                                onChange={(e) => setProgramTitle(e.target.value)}
                            />

                            <label htmlFor="codeDesc">Description:</label>
                            <input
                                type="text"
                                id="codeDesc"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />

                            <label htmlFor="codeVersion">Version:</label>
                            <input
                                type="text"
                                id="codeVersion"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                            />

                            <label htmlFor="codeProgramId">Program ID:</label>
                            <Select
                                id="codeProgramId"
                                value={selectedProgram}
                                options={programs.map(program => ({ value: program.program, label: program.title_th }))}
                                onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                                isSearchable
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={handleInsertProgramCode}>
                                Insert Program Code
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
