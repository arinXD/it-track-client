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
    // const [semester, setSemester] = useState('');
    const [subject_code, setSubjectCode] = useState('');
    const [title_th, setNewTitleTH] = useState('');
    const [title_en, setNewTitleEN] = useState('');
    const [information, setInformation] = useState('');
    const [credit, setCredit] = useState('');

    const [selectedTrack, setSelectedTrack] = useState(null);
    const [tracks, setTracks] = useState([]);

    // const [selectedGroup, setSelectedGroup] = useState(null);
    // const [groups, setGroups] = useState([]);

    // const [selectedSubGroup, setSelectedSubGroup] = useState(null);
    // const [subgroups, setSupGroups] = useState([]);

    // const [selectedAcadyears, setSelectedAcadyears] = useState(null);
    // const [acadyears, setAcadyears] = useState([]);


    const showToastMessage = (ok, message) => {
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
    };

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                // Fetch the subject details
                const subjectResult = await axios.get(`${hostname}/api/subjects/${subjectId}`);
                const subjectData = subjectResult.data.data;

                // setSemester(subjectData.semester ?? '');
                setSubjectCode(subjectData.subject_code ?? '');
                setNewTitleTH(subjectData.title_th ?? '');
                setNewTitleEN(subjectData.title_en ?? '');
                setInformation(subjectData.information ?? '');
                setCredit(subjectData.credit ?? '');

                const trackResult = await axios.get(`${hostname}/api/tracks`);
                const tracks = trackResult.data.data;

                const optionsTrack = tracks.map((track) => ({
                    value: track.track,
                    label: track.title_th
                }));
                setTracks(optionsTrack);

                const selectedTrack = optionsTrack.find(option => option.value === subjectData.track);
                setSelectedTrack(selectedTrack);

                // const acadyearOptions = getAcadyears().map(acadyear => ({
                //     value: acadyear,
                //     label: acadyear
                // }));
                // setAcadyears(acadyearOptions);

                // const selectedAcadyear = acadyearOptions.find(option => option.value === subjectData.acadyear);
                // setSelectedAcadyears(selectedAcadyear);

                // // Fetch the list of groups
                // const groupResult = await axios.get(`${hostname}/api/groups`);
                // const groups = groupResult.data.data;

                // const subgroupResult = await axios.get(`${hostname}/api/subgroups`);
                // const subgroups = subgroupResult.data.data;

                // const optionsGroups = groups.map((group) => ({
                //     value: group.id,
                //     label: group.group_title
                // }));
                // setGroups(optionsGroups);
                // const selectedGroup = optionsGroups.find(option => option.value === subjectData.group_id);
                // setSelectedGroup(selectedGroup);

                // const optionsSubGroups = subgroups.map((subgroup) => ({
                //     value: subgroup.id,
                //     label: subgroup.sub_group_title
                // }));
                // setSupGroups(optionsSubGroups);
                // const selectedSupGroup = optionsSubGroups.find(option => option.value === subjectData.sub_group_id);
                // setSelectedSubGroup(selectedSupGroup);

            } catch (error) {
                console.error('Error fetching subject details:', error);
            }
        };

        fetchDatas();
    }, [subjectId]);

    const handleUpdateSubject = async () => {
        try {

            if (credit < 0) {
                showToastMessage(false, 'หน่วยกิตต้องเป็นเลขบวกเท่านั้น');
                return;
            }

            if (!subject_code.trim()) {
                showToastMessage(false, 'รหัสวิชาห้ามเป็นค่าว่าง');
                return;
            }

            await axios.post(`${hostname}/api/subjects/updateSubject/${subjectId}`, {
                // semester: semester ? semester : null,
                subject_code: subject_code ? subject_code : null,
                title_th: title_th ? title_th : null,
                title_en: title_en ? title_en : null,
                information: information ? information : null,
                credit: credit ? credit : null,
                track: selectedTrack ? selectedTrack.value : null,
                // sub_group_id: selectedSubGroup ? selectedSubGroup.value : null,
                // group_id: selectedGroup ? selectedGroup.value : null,
                // acadyear: selectedAcadyears ? selectedAcadyears.value : null,
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
                    <h2>แก้ไขวิชา</h2>
                    <span className='text-base font-normal'>แบบฟอร์มแก้ไขวิชา</span>
                </ModalHeader>
                <ModalBody className='grid grid-cols-9 gap-4'>
                    {/* <div className='col-span-3'>
                        <label htmlFor="group">กลุ่มวิชา</label>
                        <Select
                            className='z-50'
                            id="group"
                            value={selectedGroup}
                            placeholder="เลือกกลุ่มยวิชา"
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
                            placeholder="เลือกกลุ่มย่อยวิชา"
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
                            placeholder="เลือกปีการศึกษา"
                            options={acadyears}
                            onChange={(selectedOption) => setSelectedAcadyears(selectedOption)}
                            isSearchable
                            isClearable
                        />
                    </div> */}
                    <Input
                        disabled
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
                        className='col-span-2'
                        type="number"
                        radius='sm'
                        variant="bordered"
                        label="หน่วยกิต"
                        labelPlacement="outside"
                        placeholder="กรอกหน่วยกิต"
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                    />

                    <div className='group flex flex-col w-full group relative justify-end data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_10px)] col-span-4'>
                        <label className='absolute pointer-events-none origin-top-left subpixel-antialiased block  will-change-auto !duration-200 !ease-out motion-reduce:transition-none transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-foreground group-data-[filled-within=true]:pointer-events-auto pb-0 z-20 
                         group-data-[filled-within=true]:left-0 text-foreground-800 top-0 text-small group-data-[filled-within=true]:-translate-y-[calc(100%_+_theme(fontSize.small)/2_+_20px)] pe-2 max-w-full text-ellipsis overflow-hidden' htmlFor="track">แทร็ก</label>
                        <Select
                            className='w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none text-small z-40'
                            id="track"
                            placeholder="เลือกแทร็ก"
                            value={selectedTrack}
                            options={tracks}
                            onChange={(selectedOption) => setSelectedTrack(selectedOption)}
                            isSearchable
                            isClearable
                        />
                    </div>
                    {/* <Input
                        className='col-span-3'
                        type="number"
                        radius='sm'
                        variant="bordered"
                        label="เทอม"
                        labelPlacement="outside"
                        placeholder="กรอกเทอม"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    /> */}

                    <Input
                        className='col-span-9'
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="ชื่อภาษาไทย"
                        labelPlacement="outside"
                        placeholder="กรอกชื่อภาษาไทย"
                        value={title_th}
                        onChange={(e) => setNewTitleTH(e.target.value)}
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
                        onChange={(e) => setNewTitleEN(e.target.value)}
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
                    <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleUpdateSubject}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
