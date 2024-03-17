"use client"

// ProgramCodeInsert.js
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';
import { Input, Textarea } from "@nextui-org/react";

import { getAcadyears } from "@/src/util/academicYear";

import { toast } from 'react-toastify';
export default function ProgramCodeInsert({ isOpen, onClose, onDataInserted }) {
    const [program_code, setProgramTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [version, setVersion] = useState('');
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);

    const [acadyears, setAcadYear] = useState([]);
    const [selectedAcadYear, setSelectedAcadYear] = useState(null);

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
        const fetchData = async () => {
            try {
                const result = await axios.get(`${hostname}/api/programs`);
                const data = result.data.data;
                setPrograms(data);
            } catch (error) {
                console.error('Error fetching programs:', error);
            }
        };
        const acadyearOptions = getAcadyears().map(acadyear => ({
            value: acadyear,
            label: acadyear
        }));

        setAcadYear(acadyearOptions);
        fetchData();
    }, []);

    const handleInsertProgramCode = async () => {
        try {

            if (!program_code.trim()) {
                showToastMessage(false, 'รหัสหลักสูตรห้ามเป็นค่าว่าง');
                return;
            }

            if (!selectedProgram) {
                showToastMessage(false, 'โปรดเลือกหลักสูตร');
                return;
            }

            if (!selectedAcadYear) {
                showToastMessage(false, 'โปรดเลือกปีการศึกษา');
                return;
            }

            if (program_code < 0 || version < 0) {
                showToastMessage(false, 'รหัสหลักสูตรต้องเป็นเลขบวกเท่านั้น');
                return;
            }

            const result = await axios.post(`${hostname}/api/programcodes/insertProgramCode`, {
                program_code: program_code,
                desc: desc,
                version: selectedAcadYear.value,
                program: selectedProgram.value
            });
            showToastMessage(true, `เพิ่มรหัสหลักสูตร ${program_code} สำเร็จ`);
            onDataInserted();
        } catch (error) {
            showToastMessage(false, 'รหัสหลักสูตรต้องห้ามซ้ำ');
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Clear all state values
            setProgramTitle('');
            setDesc('');
            setSelectedProgram(null);
            setSelectedAcadYear(null);

        }
    }, [isOpen]);

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="2xl"
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                body: "py-6",
                backdrop: "bg-[#292f46]/50 backdrop-opacity-10",
                base: "border-gray-300",
                header: "border-b-[1.5px] border-gray-300",
                footer: "border-t-[1.5px] border-gray-300",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2>เพิ่มรหัสหลักสูตร</h2>
                            <span className='text-base font-normal'>แบบฟอร์มเพิ่มรหัสหลักสูตร</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className='grid grid-cols-4 gap-4'>
                                <div className='col-span-2'>
                                    <label htmlFor="group">หลักสูตร</label>
                                    <Select
                                        className='z-50 active:outline-black'
                                        id="codeProgramId"
                                        value={selectedProgram}
                                        options={programs.map(program => ({ value: program.program, label: program.title_th }))}
                                        onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                                        isSearchable
                                        placeholder="เลือกหลักสูตร"
                                        isClearable
                                    />
                                </div>
                                <div className='col-span-2'>
                                    <label htmlFor="acadyear">ปีการศึกษา</label>
                                    <Select
                                        className='z-40'
                                        id="acadyear"
                                        value={selectedAcadYear}
                                        options={acadyears}
                                        placeholder="เลือกปีการศึกษา"
                                        onChange={(selectedOption) => setSelectedAcadYear(selectedOption)}
                                        isSearchable
                                        isClearable
                                    />
                                </div>
                            </div>

                            <Input
                                className='col-span-4 mt-1'
                                type="text"
                                radius='sm'
                                variant="bordered"
                                label="หลักสูตร"
                                labelPlacement="outside"
                                placeholder="กรอกหลักสูตร"
                                value={program_code}
                                onChange={(e) => setProgramTitle(e.target.value)}
                            />

                            <Textarea
                                className='col-span-4'
                                label="คำอธิบาย"
                                variant="bordered"
                                placeholder="เพิ่มคำอธิบาย"
                                value={desc}
                                disableAnimation
                                disableAutosize
                                labelPlacement='outside'
                                classNames={{
                                    base: "",
                                    input: "resize-y min-h-[40px]",
                                }}
                                onChange={(e) => setDesc(e.target.value)}
                            />

                        </ModalBody>
                        <ModalFooter>
                            <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleInsertProgramCode}>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
