"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';
import { Input, Textarea } from "@nextui-org/react";
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction';
import { getAcadyears } from "@/src/util/academicYear";
import { toast } from 'react-toastify';

export default function InsertVerify({ isOpen, onClose, onDataInserted }) {
    const [verify, setVerify] = useState('');
    const [title, setTitle] = useState('');
    const [mainAtLeast, setMainAtLeast] = useState('');
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    
    const [acadyears, setAcadYear] = useState([]);
    const [selectedAcadYear, setSelectedAcadYear] = useState(null);
    const [acadValue, setAcadValue] = useState('');
    const [proValue, setProValue] = useState('');
    const [lastValue, setLastValue] = useState('');

    const [existingData, setExistingData] = useState([]);

    const showToastMessage = useCallback((ok, message) => {
        toast[ok ? 'success' : 'warning'](message, {
            position: toast.POSITION.TOP_RIGHT,
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`${hostname}/api/programs`);
                const data = result.data.data;
                
                const veri = await axios.get(`${hostname}/api/verify`);
                setExistingData(veri.data.data);

                const programOptions = data.map(program => ({
                    value: program.program,
                    label: program.title_th
                }));

                setPrograms(programOptions);

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

    useEffect(() => {
        if (isOpen) {
            setSelectedAcadYear(acadyears[0]);
            setSelectedProgram(programs[0]);
            setProValue(programs[0]?.value); 
            setAcadValue(acadyears[0]?.value);
            setVerify('');
            setLastValue(acadyears[0]?.value?.toString().slice(-2));
            setTitle(`B.Sc. ${programs[0]?.value || ''} ${acadyears[0]?.value || ''} ตรวจสอบการสำเร็จการศึกษา (รหัส ${acadyears[0]?.value?.toString().slice(-2) || ''} เป็นต้นไป)`);
        }
    }, [isOpen, acadyears, programs]);
    
    const handleSelectionChange = useCallback(function (selectedOption) {
        if (selectedOption) {
            const newAcad = selectedOption.value.toString();
            const lastAcad = selectedOption.value.toString().slice(-2);
            setAcadValue(newAcad);
            setLastValue(lastAcad);
            setTitle(prevTitle => {
                if (prevTitle.includes(acadValue)) {
                    prevTitle = prevTitle.replace(new RegExp(acadValue, 'g'), newAcad);
                    prevTitle = prevTitle.replace(new RegExp(lastValue, 'g'), lastAcad);
                    console.log(prevTitle);
                    return prevTitle;
                } else {
                    return prevTitle + " " + newAcad;
                }
            });
        }
    }, [acadValue , lastValue]);
    
    const handleProSelectionChange = useCallback(function (selectedOption) {
        if (selectedOption) {
            const newPro = selectedOption.value.toString();
            setProValue(newPro);
            setTitle(prevTitle => {
                if (prevTitle.includes(proValue)) {
                    return prevTitle.replace(proValue, newPro);
                } else {
                    return prevTitle + " " + newPro;
                }
            });
        }
    }, [proValue]);

    const checkDuplicates = useCallback(() => {
        if (existingData.some(item => item.program === selectedProgram.value && item.acadyear === selectedAcadYear.value)) {
            showToastMessage(false, "โปรดเลือกหลักสูตรและปีการศึกษาที่ไม่ซ้ำกับข้อมูลที่มีอยู่แล้ว");
            return true;
        }
        return false;
    }, [existingData, selectedProgram, selectedAcadYear]);

    const handleSubmit = useCallback(async function (formData) {
        try {
            const url = "/api/verify";
            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message } = result.data;

            onDataInserted();
            showToastMessage(ok, message);
        } catch (error) {
            const message = error?.response?.data?.message;
            showToastMessage(false, message);
        }
    }, []);

    const createForm = useCallback(function (e) {
        e.preventDefault();

        const englishRegex = /^[A-Za-z0-9\s-]+$/;

        if (!verify.trim()) {
            showToastMessage(false, "รหัสแบบฟอร์มต้องไม่เป็นค่าว่าง");
            return;
        }
        if(!englishRegex.test(verify)){
            showToastMessage(false, "ต้องเป็นภาษาอังกฤษเท่านั้น");
            return;
        }

        if(!selectedAcadYear){
            showToastMessage(false, "โปรดเลือกปีการศึกษา");
            return;
        }

        if(!selectedProgram){
            showToastMessage(false, "โปรดเลือกหลักสูตร");
            return;
        }

        if(!title.trim()){
            showToastMessage(false, "ชื่อแบบฟอร์มต้องไม่เป็นค่าว่าง");
            return;
        }

        if (checkDuplicates()) return;

        const formData = {
            verify: verify,
            title: title,
            main_at_least : mainAtLeast,
            acadyear: selectedAcadYear.value,
            program: selectedProgram.value,
        }
        handleSubmit(formData);
    }, [
        verify,
        title,
        selectedAcadYear,
        selectedProgram,
        mainAtLeast,
        checkDuplicates
    ]);

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
                    <form onSubmit={createForm}>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2>เพิ่มแบบฟอร์มตรวจสอบจบ</h2>
                            <span className='text-base font-normal'>แบบฟอร์มตรวจสอบจบ</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className='grid grid-cols-4 gap-4'>
                                <div className='col-span-2'>
                                    <label htmlFor="group">หลักสูตร</label>
                                    <Select
                                        className='z-50 active:outline-black'
                                        id="codeProgramId"
                                        value={selectedProgram}
                                        options={programs}
                                        onChange={(selectedOption) => {
                                            setSelectedProgram(selectedOption);
                                            handleProSelectionChange(selectedOption);
                                        }}
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
                                        onChange={(selectedOption) => {
                                            setSelectedAcadYear(selectedOption);
                                            handleSelectionChange(selectedOption);
                                        }}
                                        isSearchable
                                        isClearable
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-4 mt-1 gap-4'>
                                <Input
                                    className='col-span-2 '
                                    type="text"
                                    radius='sm'
                                    variant="bordered"
                                    label="รหัสแบบฟอร์ม"
                                    labelPlacement="outside"
                                    placeholder="กรอกรหัสแบบฟอร์ม"
                                    value={verify}
                                    onChange={(e) => setVerify(e.target.value)}
                                />
                                <Input
                                    className='col-span-2 '
                                    type="number"
                                    radius='sm'
                                    variant="bordered"
                                    label="เงื่อนไขหน่วยกิตขั้นต่ำ"
                                    labelPlacement="outside"
                                    placeholder="กรอกหน่วยกิต"
                                    value={mainAtLeast}
                                    onChange={(e) => setMainAtLeast(e.target.value)}
                                />
                            </div>

                            <Textarea
                                className='col-span-4'
                                label="ชื่อแบบฟอร์ม"
                                variant="bordered"
                                placeholder="กรอกชื่อแบบฟอร์ม"
                                value={title}
                                disableAnimation
                                disableAutosize
                                labelPlacement='outside'
                                classNames={{
                                    base: "",
                                    input: "resize-y min-h-[40px]",
                                }}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                        </ModalBody>
                        <ModalFooter>
                            <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button type='submit' className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid'>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}
