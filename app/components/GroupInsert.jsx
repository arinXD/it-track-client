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

            // Close the modal after inserting
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
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">เพิ่มกลุ่มรายวิชา</ModalHeader>
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
                                type="text"
                                id="groupTitle"
                                label="กลุ่มรายวิชา"
                                value={groupTitle}
                                onChange={(e) => setGroupTitle(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button color="primary" onPress={handleInsertGroup}>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
