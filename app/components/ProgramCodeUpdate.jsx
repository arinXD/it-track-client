"use client"

import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';

import { Input, Textarea } from "@nextui-org/react";

import { getAcadyears } from "@/src/util/academicYear";
import { toast } from 'react-toastify';

export default function ProgramCodeUpdate({ isOpen, onClose, onUpdate, programCodeId }) {
    const [program_code, setUpdatedTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [programs, setPrograms] = useState([]);

    const [selectedAcadyears, setSelectedAcadyears] = useState(null);
    const [acadyears, setAcadyears] = useState([]);

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

        const fetchProgramCode = async () => {
            try {

                const response = await axios.get(`${hostname}/api/programcodes/${programCodeId}`);
                const data = response.data?.data;
                setUpdatedTitle(data?.program_code);
                setDescription(data?.desc);

                const programsResult = await axios.get(`${hostname}/api/programs`);
                const programs = programsResult?.data?.data;

                // Map categories for react-select
                const options = programs.map(program => ({
                    value: program.program,
                    label: program.title_th
                }));
                // console.log(options);
                setPrograms(options);

                const selectedProgram = options.find(option => option.value === data?.program);
                setSelectedProgram(selectedProgram);

                const acadyearOptions = getAcadyears().map(acadyear => ({
                    value: acadyear,
                    label: acadyear
                }));
                setAcadyears(acadyearOptions);

                const selectedAcadyear = acadyearOptions.find(option => option.value === data?.version);
                setSelectedAcadyears(selectedAcadyear);
                console.log(selectedAcadyear);

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

            if (!selectedAcadyears) {
                showToastMessage(false, 'โปรดเลือกปีการศึกษา');
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
                <ModalHeader
                    className="flex flex-col gap-1"><h2>แก้ไขรหัสหลักสูตร</h2>
                    <span className='text-base font-normal'>แบบฟอร์มแก้ไขรหัสหลักสูตร</span>
                </ModalHeader>
                <ModalBody>
                    <div className='grid grid-cols-4 gap-4'>
                        <div className='col-span-2'>
                            <label htmlFor="group">หลักสูตร</label>
                            <Select
                                className='z-50'
                                id="program"
                                value={selectedProgram}
                                options={programs}
                                placeholder="เลือกหลักสูตร"
                                onChange={(selectedOption) => setSelectedProgram(selectedOption)}
                                isSearchable
                            />
                            {/* <Autocomplete
                                label="หลักสูตร"
                                variant="bordered"
                                defaultItems={programs.map(program => ({ value: program.program, label: program.title_th }))}
                                placeholder="เลือกหลักสูตร"
                                className="max-w-xs"
                                labelPlacement='outside'

                                onSelectionChange={setSelectedProgram}
                                scrollShadowProps={{
                                    isEnabled: false
                                }}
                            >
                                {programs.map(item => (
                                    <AutocompleteItem key={item.value} value={item.value}>
                                        {item.label}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete> */}
                        </div>
                        <div className='col-span-2'>
                            <label htmlFor="acadyear">ปีการศึกษา</label>
                            <Select
                                className='z-40'
                                id="acadyear"
                                value={selectedAcadyears}
                                options={acadyears}
                                placeholder="เลือกปีการศึกษา"
                                onChange={(selectedOption) => setSelectedAcadyears(selectedOption)}
                                isSearchable
                                isClearable
                            />
                            {/* <Autocomplete
                                label="ปีการศึกษา"
                                variant="bordered"
                                defaultItems={acadyears}
                                placeholder="เลือกปีการศึกษา"
                                className="max-w-xs"
                                labelPlacement='outside'
                                defaultSelectedKey={selectedAcadyears?.acadyear}
                                onSelectionChange={setSelectedAcadyears}
                                scrollShadowProps={{
                                    isEnabled: false
                                }}
                            >
                                {(item) => (
                                    <AutocompleteItem key={item.acadyear} value={item.acadyear}>
                                        {item.acadyear}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete> */}
                        </div>
                    </div>

                    <Input
                        disabled
                        className='col-span-4'
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="รหัสหลักสูตร"
                        labelPlacement="outside"
                        placeholder="กรอกรหัสหลักสูตร"
                        value={program_code}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />

                    <Textarea
                        className='col-span-4'
                        label="คำอธิบาย"
                        variant="bordered"
                        placeholder="เพิ่มคำอธิบาย"
                        value={description}
                        disableAnimation
                        disableAutosize
                        labelPlacement='outside'
                        classNames={{
                            base: "",
                            input: "resize-y min-h-[40px]",
                        }}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                </ModalBody>
                <ModalFooter>
                    <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleUpdateProgramCode}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
