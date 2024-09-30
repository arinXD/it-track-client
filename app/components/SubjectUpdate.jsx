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

import { Empty, message } from 'antd';
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'

export default function SubjectUpdate({ isOpen, onClose, onUpdate, subjectId }) {
    // const [semester, setSemester] = useState('');
    const [subject_code, setSubjectCode] = useState('');
    const [title_th, setNewTitleTH] = useState('');
    const [title_en, setNewTitleEN] = useState('');
    const [information, setInformation] = useState('');
    const [credit, setCredit] = useState('');

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
                const URL = `/api/subjects/${subjectId}`;
                const option = await getOptions(URL, "GET");
                const response = await axios(option);
                const sub = response.data.data;

                setSubjectCode(sub.subject_code ?? '');
                setNewTitleTH(sub.title_th ?? '');
                setNewTitleEN(sub.title_en ?? '');
                setInformation(sub.information ?? '');
                setCredit(sub.credit ?? '');

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

            const subjectCodePattern = /^[A-Za-z0-9\s]+$/; // Regular Expression สำหรับตัวอักษรภาษาอังกฤษ ตัวเลข และช่องว่าง
    
            if (!subjectCodePattern.test(subject_code.trim())) {
                showToastMessage(false, 'รหัสวิชาต้องประกอบด้วยตัวอักษรภาษาอังกฤษ ตัวเลข และช่องว่างเท่านั้น');
                return;
            }

            const englishPattern = /^[A-Za-z\s]+$/;
            if (!title_en.trim()) {
                showToastMessage(false, 'ชื่ออังกฤษห้ามเป็นค่าว่าง');
                return;
            } else if (!englishPattern.test(title_en.trim())) {
                showToastMessage(false, 'ชื่ออังกฤษต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น');
                return;
            }

            const thaiPattern = /^[ก-๙\s]+$/;
            if (!title_th.trim()) {
                showToastMessage(false, 'ชื่อไทยห้ามเป็นค่าว่าง');
                return;
            } else if (!thaiPattern.test(title_th.trim())) {
                showToastMessage(false, 'ชื่อไทยต้องเป็นตัวอักษรภาษาไทยเท่านั้น');
                return;
            }
            const trimmedSubjectCode = subject_code.replace(/\s/g, '');

            const url = `/api/subjects/updateSubject/${subjectId}}`;

            const formData = {
                subject_code: trimmedSubjectCode ? trimmedSubjectCode : null,
                title_th: title_th ? title_th : null,
                title_en: title_en ? title_en : null,
                information: information ? information : null,
                credit: credit ? credit : null,
            };

            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;
            message.success(msg)

            onUpdate();
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
                <ModalBody className='grid grid-cols-8 gap-4'>
                    <Input
                        disabled
                        className='col-span-4'
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
                        className='col-span-4'
                        type="number"
                        radius='sm'
                        variant="bordered"
                        label="หน่วยกิต"
                        labelPlacement="outside"
                        placeholder="กรอกหน่วยกิต"
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                    />

                    {/* <div className='group flex flex-col w-full group relative justify-end data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_10px)] col-span-4'>
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
                    </div> */}
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
                        className='col-span-8'
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
                        className='col-span-8'
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
                        className='col-span-8'
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
