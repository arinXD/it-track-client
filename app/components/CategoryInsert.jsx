"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { Input } from "@nextui-org/react";
import { toast } from 'react-toastify';
export default function CategoryInsert({ isOpen, onClose, onDataInserted }) {
    const [categoryTitle, setCategoryTitle] = useState('');

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
    const checkDuplicateCategory = async (title) => {
        try {
            const response = await axios.get(`${hostname}/api/categories/checkDuplicate/${title}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking duplicate category:', error);
            throw error;
        }
    };

    const handleInsertCategory = async () => {
        try {
            if (!categoryTitle.trim()) {
                showToastMessage(false, 'หมวดหมู่วิชาห้ามเป็นค่าว่าง');
                return;
            }

            const isDuplicate = await checkDuplicateCategory(categoryTitle);
            if (isDuplicate) {
                showToastMessage(false, 'หมวดหมู่วิชานี้มีอยู่แล้ว');
                return;
            }

            const result = await axios.post(`${hostname}/api/categories/insertCategory`, {
                category_title: categoryTitle,
            });
            
            showToastMessage(true, `เพิ่มหมวดหมู่วิชา ${categoryTitle} สำเร็จ`);
            onDataInserted();
        } catch (error) {
            showToastMessage(false, 'หมวดหมู่วิชาต้องห้ามซ้ำ');
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Clear all state values
            setCategoryTitle('');
        }
    }, [isOpen]);

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="sm"
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
                            <h2>เพิ่มหมวดหมู่วิชา</h2>
                            <span className='text-base font-normal'>แบบฟอร์มเพิ่มหมวดหมู่วิชา</span>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                className='col-span-4 my-1'
                                type="text"
                                radius='sm'
                                variant="bordered"
                                label="หมวดหมู่วิชา"
                                labelPlacement="outside"
                                placeholder="กรอกหมวดหมู่วิชา"
                                value={categoryTitle}
                                onChange={(e) => setCategoryTitle(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleInsertCategory}>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
