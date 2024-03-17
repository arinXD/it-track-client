"use client"

// SubjectInsert.js

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';

import { fetchData } from '../admin/action'
import { Input, Textarea } from "@nextui-org/react";

import { getAcadyears } from "@/src/util/academicYear";

import { toast } from 'react-toastify';

export default function SubjectInsert({ isOpen, onClose, onDataInserted }) {
    const [semester, setSemester] = useState('');
    const [subject_code, setSubjectCode] = useState('');
    const [title_th, setTitleTh] = useState('');
    const [title_en, setTitleEn] = useState('');
    const [information, setInformation] = useState('');
    const [credit, setCredit] = useState('');

    const [selectedSubGroup, setSelectedSubGroup] = useState(null);
    const [subgroups, setSubGroup] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);

    const [selectedAcadYear, setSelectedAcadYear] = useState(null);
    const [acadyears, setAcadYear] = useState([]);

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
        const fetchSubGroups = async () => {
            try {
                const result = await axios.get(`${hostname}/api/subgroups`);
                const data = result.data.data;

                const subgroupOptions = data.map(subgroup => ({
                    value: subgroup.id,
                    label: subgroup.sub_group_title
                }));

                setSubGroup(subgroupOptions);
            } catch (error) {
                console.error('Error fetching subgroup:', error);
            }
        };
        const fetchGroups = async () => {
            try {
                const result = await axios.get(`${hostname}/api/groups`);
                const data = result.data.data;

                const groupOptions = data.map(group => ({
                    value: group.id,
                    label: group.group_title
                }));

                setGroups(groupOptions);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };


        const acadyearOptions = getAcadyears().map(acadyear => ({
            value: acadyear,
            label: acadyear
        }));

        setAcadYear(acadyearOptions);

        fetchSubGroups();
        fetchGroups();
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Clear all state values
            setSemester('');
            setSubjectCode('');
            setTitleTh('');
            setTitleEn('');
            setInformation('');
            setCredit('');
            setSelectedSubGroup(null);
            setSelectedGroup(null);
            setSelectedAcadYear(null);
        }
    }, [isOpen]);

    const handleInsertSubject = async () => {
        try {

            if (semester < 0 || credit < 0) {
                showToastMessage(false, 'เทอมหรือหน่วยกิตต้องเป็นเลขบวกเท่านั้น');
                return;
            }

            if (!subject_code.trim()) {
                showToastMessage(false, 'รหัสวิชาห้ามเป็นค่าว่าง');
                return;
            }

            const result = await axios.post(`${hostname}/api/subjects/insertSubject`, {
                subject_code: subject_code ? subject_code : null,
                title_th: title_th ? title_th : null,
                title_en: title_en ? title_en : null,
                information: information ? information : null,
                semester: semester ? semester : null,
                credit: credit ? credit : null,
                sub_group_id: selectedSubGroup ? selectedSubGroup.value : null,
                group_id: selectedGroup ? selectedGroup.value : null,
                acadyear: selectedAcadYear ? selectedAcadYear.value : null,
            });

            onDataInserted();
            showToastMessage(true, `เพิ่มวิชา ${result.data.data.subject_code} สำเร็จ`);
        } catch (error) {
            console.error('Error inserting subjects:', error);
            showToastMessage(false, 'รหัสวิชาซ้ำ');

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
                <ModalHeader className="flex flex-col gap-1">
                    <h2>เพิ่มวิชา</h2>
                    <span className='text-base font-normal'>แบบฟอร์มเพิ่มวิชา</span>
                </ModalHeader>
                <ModalBody className='grid grid-cols-9 gap-4'>
                    <div className='col-span-3'>
                        <label htmlFor="group">กลุ่มวิชา</label>
                        <Select
                            className='z-50'
                            id="group"
                            placeholder="เลือกกลุ่มยวิชา"
                            value={selectedGroup}
                            options={groups}
                            onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                            isSearchable
                            isClearable
                        />
                    </div>
                    <div className='col-span-3'>
                        <label htmlFor="subgroup">กลุ่มย่อย</label>
                        <Select
                            className='z-50'
                            id="subgroup"
                            placeholder="เลือกกลุ่มย่อยวิชา"
                            value={selectedSubGroup}
                            options={subgroups}
                            onChange={(selectedOption) => setSelectedSubGroup(selectedOption)}
                            isSearchable
                            isClearable
                        />
                    </div >
                    <div className='col-span-3'>
                        <label htmlFor="acadyear">ปีการศึกษา</label>
                        <Select
                            className='z-40'
                            id="acadyear"
                            placeholder="เลือกปีการศึกษา"
                            value={selectedAcadYear}
                            options={acadyears}
                            onChange={(selectedOption) => setSelectedAcadYear(selectedOption)}
                            isSearchable
                            isClearable
                        />
                    </div>

                    <Input
                        className='col-span-3'
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="รหัสวิชา"
                        labelPlacement="outside"
                        placeholder="รหัสวิชา"
                        value={subject_code}
                        onChange={(e) => setSubjectCode(e.target.value)}
                    />
                    
                    <Input
                        className='col-span-3'
                        type="number"
                        radius='sm'
                        variant="bordered"
                        label="หน่วยกิต"
                        labelPlacement="outside"
                        placeholder="กรอกหน่วยกิต"
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                    />

                    <Input
                        className='col-span-3'
                        type="number"
                        radius='sm'
                        variant="bordered"
                        label="เทอม"
                        labelPlacement="outside"
                        placeholder="กรอกเทอม"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    />
                    <Input
                        className='col-span-9'
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="ชื่อภาษาไทย"
                        labelPlacement="outside"
                        placeholder="กรอกชื่อภาษาไทย"
                        value={title_th}
                        onChange={(e) => setTitleTh(e.target.value)}
                    />

                    <Input
                        className='col-span-9'
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="ชื่อภาษาอังกฤษ"
                        labelPlacement="outside"
                        placeholder="กรอกชื่อภาษาอังกฤษ"
                        value={title_en}
                        onChange={(e) => setTitleEn(e.target.value)}
                    />

                    <Textarea
                        className='col-span-9'
                        id="information"
                        label="รายละเอียด"
                        variant="bordered"
                        placeholder="เพิ่มรายละเอียด"
                        labelPlacement='outside'
                        value={information}
                        disableAnimation
                        disableAutosize
                        classNames={{
                            base: "",
                            input: "resize-y min-h-[40px]",
                        }}
                        onChange={(e) => setInformation(e.target.value)}
                    />


                </ModalBody>
                <ModalFooter>
                    <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleInsertSubject}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
