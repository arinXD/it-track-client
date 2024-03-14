"use client"

// SubjectUpdate.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';
import { fetchData } from '../admin/action'
import { Input, Textarea } from "@nextui-org/react";
import { toast } from 'react-toastify';
import { getAcadyears } from "@/src/util/academicYear";

export default function SubjectUpdate({ isOpen, onClose, onUpdate, subjectId }) {
    const [semester, setSemester] = useState('');
    const [subject_code, setSubjectCode] = useState('');
    const [title_th, setNewTitleTH] = useState('');
    const [title_en, setNewTitleEN] = useState('');
    const [information, setInformation] = useState('');
    const [credit, setCredit] = useState('');

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);

    const [selectedSubGroup, setSelectedSubGroup] = useState(null);
    const [subgroups, setSupGroups] = useState([]);

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
        const fetchDatas = async () => {
            try {
                // Fetch the subject details
                const subjectResult = await axios.get(`${hostname}/api/subjects/${subjectId}`);
                const subjectData = subjectResult.data.data;
                console.log(subjectData);

                setSemester(subjectData.semester ?? '');
                setSubjectCode(subjectData.subject_code ?? '');
                setNewTitleTH(subjectData.title_th ?? '');
                setNewTitleEN(subjectData.title_en ?? '');
                setInformation(subjectData.information ?? '');
                setCredit(subjectData.credit ?? '');

                const acadyearOptions = getAcadyears().map(acadyear => ({
                    value: acadyear,
                    label: acadyear
                }));
                setAcadyears(acadyearOptions);

                const selectedAcadyear = acadyearOptions.find(option => option.value === subjectData.acadyear);
                setSelectedAcadyears(selectedAcadyear);

                // Fetch the list of groups
                const groupResult = await axios.get(`${hostname}/api/groups`);
                const groups = groupResult.data.data;

                const subgroupResult = await axios.get(`${hostname}/api/subgroups`);
                const subgroups = subgroupResult.data.data;

                const optionsGroups = groups.map((group) => ({
                    value: group.id,
                    label: group.group_title
                }));
                setGroups(optionsGroups);
                const selectedGroup = optionsGroups.find(option => option.value === subjectData.group_id);
                setSelectedGroup(selectedGroup);

                const optionsSubGroups = subgroups.map((subgroup) => ({
                    value: subgroup.id,
                    label: subgroup.sub_group_title
                }));
                setSupGroups(optionsSubGroups);
                const selectedSupGroup = optionsSubGroups.find(option => option.value === subjectData.sub_group_id);
                setSelectedSubGroup(selectedSupGroup);

            } catch (error) {
                console.error('Error fetching subject details:', error);
            }
        };

        fetchDatas();
    }, [subjectId]);

    const handleUpdateSubject = async () => {
        try {

            if (semester < 0 || credit < 0) {
                showToastMessage(false, 'เทอมหรือหน่วยกิตต้องเป็นเลขบวกเท่านั้น');
                return;
            }

            await axios.post(`${hostname}/api/subjects/updateSubject/${subjectId}`, {
                semester: semester ? semester : null,
                subject_code: subject_code ? subject_code : null,
                title_th: title_th ? title_th : null,
                title_en: title_en ? title_en : null,
                information: information ? information : null,
                credit: credit ? credit : null,
                sub_group_id: selectedSubGroup ? selectedSubGroup.value : null,
                group_id: selectedGroup ? selectedGroup.value : null,
                acadyear: selectedAcadyears ? selectedAcadyears.value : null,
            });

            // Notify the parent component that data has been updated
            onUpdate();

            // Close the modal after updating
            onClose();
        } catch (error) {
            console.error('Error updating subject:', error);
            // Handle error if needed
        }
    };

    return (
        <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">แก้ไขวิชา</ModalHeader>
                <ModalBody className='grid grid-cols-9 gap-4'>
                    <div className='col-span-3'>
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
                    <div className='col-span-3'>
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
                    <div className='col-span-3'>
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
                    <Input
                        disabled
                        className='col-span-3'
                        type="text"
                        id="subject_code"
                        label="รหัสวิชา"
                        value={subject_code}
                        onChange={(e) => setSubjectCode(e.target.value)}
                    />

                    <Input
                        className='col-span-3'
                        type="number"
                        id="credit"
                        label="หน่วยกิต"
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                    />
                    <Input
                        className='col-span-3'
                        type="text"
                        id="semester"
                        label="เทอม"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    />

                    <Input
                        className='col-span-9'
                        type="text"
                        id="title_th"
                        label="ชื่อภาษาไทย"
                        value={title_th}
                        onChange={(e) => setNewTitleTH(e.target.value)}
                    />

                    <Input
                        className='col-span-9'
                        type="text"
                        id="title_en"
                        label="ชื่อภาษาอังกฤษ"
                        value={title_en}
                        onChange={(e) => setNewTitleEN(e.target.value)}
                    />

                    <Textarea
                        className='col-span-9'
                        id="information"
                        label="รายละเอียด"
                        variant="bordered"
                        placeholder="เพิ่มรายละเอียด"
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
                    <Button color="danger" variant="light" onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" onPress={handleUpdateSubject}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
