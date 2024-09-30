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

import { Empty, message } from 'antd';
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'

import { toast } from 'react-toastify';

export default function SubjectInsert({ isOpen, onClose, onDataInserted }) {
    const [subject_code, setSubjectCode] = useState('');
    const [title_th, setTitleTh] = useState('');
    const [title_en, setTitleEn] = useState('');
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
        if (isOpen) {
            setSubjectCode('');
            setTitleTh('');
            setTitleEn('');
            setInformation('');
            setCredit('');
            // setSelectedTrack(null);
        }
    }, [isOpen]);

    const checkDuplicate = async (subject_code) => {
        try {
            const URL = `/api/subjects/getSubjectByCode/${subject_code}`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking duplicate:', error);
            throw error;
        }
    };

    const handleInsertSubject = async () => {
        try {
            // ตรวจสอบว่า credit ต้องเป็นเลขบวกเท่านั้น
            if (credit < 0) {
                showToastMessage(false, 'หน่วยกิตต้องเป็นเลขบวกเท่านั้น');
                return;
            }

            const subjectCodePattern = /^[A-Za-z0-9\s]+$/; // Regular Expression สำหรับตัวอักษรภาษาอังกฤษ ตัวเลข และช่องว่าง
    
            if (!subjectCodePattern.test(subject_code.trim())) {
                showToastMessage(false, 'รหัสวิชาต้องประกอบด้วยตัวอักษรภาษาอังกฤษ ตัวเลข และช่องว่างเท่านั้น');
                return;
            }
    
            // ทำการลบช่องว่างออกจาก subject_code
            const trimmedSubjectCode = subject_code.replace(/\s/g, '');
    
            // ตรวจสอบว่ามีการซ้ำของรหัสวิชาหรือไม่
            const isDuplicate = await checkDuplicate(trimmedSubjectCode);
            if (isDuplicate) {
                showToastMessage(false, 'วิชานี้มีอยู่แล้ว');
                return;
            }
    
            // ตรวจสอบ title_en
            const englishPattern = /^[A-Za-z\s]+$/;
            if (!title_en.trim()) {
                showToastMessage(false, 'ชื่ออังกฤษห้ามเป็นค่าว่าง');
                return;
            } else if (!englishPattern.test(title_en.trim())) {
                showToastMessage(false, 'ชื่ออังกฤษต้องเป็นตัวอักษรภาษาอังกฤษเท่านั้น');
                return;
            }
    
            // ตรวจสอบ title_th
            const thaiPattern = /^[ก-๙\s]+$/;
            if (!title_th.trim()) {
                showToastMessage(false, 'ชื่อไทยห้ามเป็นค่าว่าง');
                return;
            } else if (!thaiPattern.test(title_th.trim())) {
                showToastMessage(false, 'ชื่อไทยต้องเป็นตัวอักษรภาษาไทยเท่านั้น');
                return;
            }
    
            // ส่งข้อมูลไปยัง API
            const url = `/api/subjects/insertSubject`;
            const formData = {
                subject_code: trimmedSubjectCode || null,
                title_th: title_th || null,
                title_en: title_en || null,
                information: information || null,
                credit: credit || null,
            };
    
            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;
    
            onDataInserted();
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
                <ModalBody className='grid grid-cols-8 gap-4'>
                    <Input
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

                    <Input
                        className='col-span-8'
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
                        className='col-span-8'
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
                    <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleInsertSubject}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
