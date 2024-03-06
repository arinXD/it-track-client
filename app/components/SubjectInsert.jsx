"use client"

// SubjectInsert.js

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';

import { fetchData } from '../admin/action'
import { Input, Textarea } from "@nextui-org/react";

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
        const fetchAcadYear = async () => {
            try {
                const acadyears = await fetchData("/api/acadyear")

                const acadyearOptions = acadyears.map(acadyear => ({
                    value: acadyear.acadyear,
                    label: acadyear.acadyear
                }));

                setAcadYear(acadyearOptions);
            } catch (error) {
                console.error('Error fetching acadyears:', error);
            }
        };

        fetchSubGroups();
        fetchGroups();
        fetchAcadYear();
    }, []);

    const handleInsertSubject = async () => {
        try {
            const result = await axios.post(`${hostname}/api/subjects/insertSubject`, {
                semester: semester ? semester : null,
                subject_code: subject_code ? subject_code : null,
                title_th: title_th ? title_th : null,
                title_en: title_en ? title_en : null,
                information: information ? information : null,
                credit: credit ? credit : null,
                sub_group_id: selectedSubGroup ? selectedSubGroup.value : null,
                group_id: selectedGroup ? selectedGroup.value : null,
                acadyear: selectedAcadYear ? selectedAcadYear.value : null,
            });

            console.log('Inserted subjects:', result.data.data);

            onDataInserted();
        } catch (error) {
            console.error('Error inserting subjects:', error);
            // Handle error if needed
        }
    };

    return (
        <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">เพิ่มวิชา</ModalHeader>
                <ModalBody className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor="group">กลุ่มรายวิชา</label>
                        <Select
                            className='z-50'
                            id="group"
                            value={selectedGroup}
                            options={groups}
                            onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                            isSearchable
                            isClearable
                        />
                    </div>
                    <div>
                        <label htmlFor="subgroup">กลุ่มย่อย</label>
                        <Select
                            className='z-50'
                            id="subgroup"
                            value={selectedSubGroup}
                            options={subgroups}
                            onChange={(selectedOption) => setSelectedSubGroup(selectedOption)}
                            isSearchable
                            isClearable
                        />
                    </div>
                    <div>
                        <label htmlFor="acadyear">Select Acadyear:</label>
                        <Select
                            className='z-40'
                            id="acadyear"
                            value={selectedAcadYear}
                            options={acadyears}
                            onChange={(selectedOption) => setSelectedAcadYear(selectedOption)}
                            isSearchable
                            isClearable
                        />
                    </div>

                    <Input
                        className='col-span-2'
                        type="text"
                        id="title_th"
                        label="ชื่อภาษาไทย"
                        value={title_th}
                        onChange={(e) => setTitleTh(e.target.value)}
                    />

                    <Input
                        className='col-span-2'
                        type="text"
                        id="title_en"
                        label="ชื่อภาษาอังกฤษ"
                        value={title_en}
                        onChange={(e) => setTitleEn(e.target.value)}
                    />
                    <Input
                        type="text"
                        id="semester"
                        label="เทอม"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    />

                    <Input
                        type="text"
                        id="subject_code"
                        label="รหัสวิชา"
                        value={subject_code}
                        onChange={(e) => setSubjectCode(e.target.value)}
                    />


                    <Textarea
                        id="information"
                        label="รายละเอียด"
                        variant="bordered"
                        placeholder="เพิ่มรายละเอียด"
                        value={information}
                        disableAnimation
                        disableAutosize
                        classNames={{
                            base: "max-w-xs",
                            input: "resize-y min-h-[40px]",
                        }}
                        onChange={(e) => setInformation(e.target.value)}
                    />

                    <Input
                        type="text"
                        id="credit"
                        label="หน่วยกิต"
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                    />

                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" onPress={handleInsertSubject}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
