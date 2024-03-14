"use client"

import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';

import { Input, Textarea } from "@nextui-org/react";

import { getAcadyears } from "@/src/util/academicYear";

export default function ProgramCodeUpdate({ isOpen, onClose, onUpdate, programCodeId }) {
    const [program_code, setUpdatedTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [programs, setPrograms] = useState([]);

    const [selectedAcadyears, setSelectedAcadyears] = useState(null);
    const [acadyears, setAcadyears] = useState([]);
    useEffect(() => {

        const fetchProgramCode = async () => {
            try {
                const response = await axios.get(`${hostname}/api/programcodes/${programCodeId}`);
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

                const acadyearOptions = getAcadyears().map(acadyear => ({
                    value: acadyear,
                    label: acadyear
                }));

                setAcadyears(acadyearOptions);

                const selectedAcadyear = acadyearOptions.find(option => option.value === response.data.data.version);
                setSelectedAcadyears(selectedAcadyear);

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

            if (!selectedProgram) {
                showToastMessage(false, 'โปรดเลือกหลักสูตร');
                return;
            }

            await axios.post(`${hostname}/api/programcodes/updateProgramCode/${programCodeId}`, {
                program_code: program_code,
                desc: description,
                version: selectedAcadyears.value,
                program: selectedProgram.value,

            });

            onUpdate();

            onClose();
        } catch (error) {
            console.error('Error updating program code:', error);
            showToastMessage(false, 'รหัสหลักสูตรห้ามซ้ำ');
        }
    };

    return (
        <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">แก้ไขรหัสหลักสูตร</ModalHeader>
                <ModalBody>
                    <div className='grid grid-cols-4 gap-4'>
                        <div className='col-span-2'>
                            <label htmlFor="group">หลักสูตร</label>
                            <Select
                                className='z-50'
                                id="program"
                                value={selectedProgram}
                                options={programs}
                                onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                                isSearchable
                            />
                        </div>
                        <div className='col-span-2'>
                            <label htmlFor="acadyear">ปีการศึกษา</label>
                            <Select
                                className='z-40'
                                id="acadyear"
                                value={selectedAcadyears}
                                options={acadyears}
                                onChange={(selectedOption) => setSelectedAcadyears(selectedOption)}
                                isSearchable
                                isClearable
                            />
                        </div>
                    </div>

                    <Input
                        className='col-span-4 my-1'
                        type="text"
                        disabled
                        id="updatedTitle"
                        label="รหัสหลักสูตร"
                        value={program_code}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />

                    <Textarea
                        className='col-span-4'
                        label="คำอธิบาย"
                        variant="bordered"
                        placeholder="เพิ่มรายละเอียด"
                        value={description}
                        disableAnimation
                        disableAutosize
                        classNames={{
                            base: "",
                            input: "resize-y min-h-[40px]",
                        }}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" onPress={handleUpdateProgramCode}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
