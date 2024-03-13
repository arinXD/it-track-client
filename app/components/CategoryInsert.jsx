"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState,useEffect } from 'react';
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
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">เพิ่มหมวดหมู่วิชา</ModalHeader>
                        <ModalBody>
                            <Input
                                type="text"
                                id="categoryTitle"
                                label="หมวดหมู่วิชา"
                                value={categoryTitle}
                                onChange={(e) => setCategoryTitle(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button color="primary" onPress={handleInsertCategory}>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
