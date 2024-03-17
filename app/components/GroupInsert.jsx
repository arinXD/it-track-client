"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';
import { Input } from "@nextui-org/react";
import { toast } from 'react-toastify';

export default function GroupInsert({ isOpen, onClose, onDataInserted }) {
    const [groupTitle, setGroupTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
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
        const fetchData = async () => {
            try {
                const result = await axios.get(`${hostname}/api/categories`);
                const data = result.data.data;
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchData();
    }, []);


    const handleInsertGroup = async () => {
        try {
            // Check if a category is selected
            if (!selectedCategory) {
                showToastMessage(false, 'โปรดเลือกหมวดหมู่');
                return;
            }

            if (!groupTitle.trim()) {
                showToastMessage(false, 'กลุ่มวิชาห้ามเป็นค่าว่าง');
                return;
            }

            const result = await axios.post(`${hostname}/api/groups/insertGroup`, {
                group_title: groupTitle,
                category_id: selectedCategory.value // Assuming 'value' property contains the ID
            });

            console.log('Inserted group:', result.data.data);

            onDataInserted();

            showToastMessage(true, `เพิ่มกลุ่มวิชา ${groupTitle} สำเร็จ`);
            onClose();
        } catch (error) {
            showToastMessage(false, 'กลุ่มวิชาต้องห้ามซ้ำ');
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Clear all state values
            setGroupTitle('');
            setSelectedCategory(null);
        }
    }, [isOpen]);

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="md"
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
                            <h2>เพิ่มกลุ่มวิชา</h2>
                            <span className='text-base font-normal'>แบบฟอร์มเพิ่มกลุ่มวิชา</span>
                        </ModalHeader>
                        <ModalBody>
                            <label htmlFor="category">เลือกหมวดหมู๋รายวิชา</label>
                            <Select
                                className="z-50"
                                id="category"
                                value={selectedCategory}
                                options={categories.map(category => ({ value: category.id, label: category.category_title }))}
                                onChange={(selectedOption) => setSelectedCategory(selectedOption)}
                                isSearchable
                                isClearable
                            />
                            <Input
                                className='col-span-4 mt-1'
                                type="text"
                                radius='sm'
                                variant="bordered"
                                label="กลุ่มวิชา"
                                labelPlacement="outside"
                                placeholder="กรอกกลุ่มวิชา"
                                value={groupTitle}
                                onChange={(e) => setGroupTitle(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleInsertGroup}>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
