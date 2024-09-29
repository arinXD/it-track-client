"use client"
// GroupUpdate.js

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';  // Import the Select component
import { hostname } from '@/app/api/hostname';
import { Input } from "@nextui-org/react";

import { toast } from 'react-toastify';

import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { Empty, message } from 'antd';


export default function GroupUpdate({ isOpen, onClose, onUpdate, groupId }) {
    const [newTitle, setNewTitle] = useState('');
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
    // Fetch the current category title based on the category ID
    useEffect(() => {
        const fetchCategoryTitle = async () => {
            try {
                const URL = `/api/groups/${groupId}`;
                const option = await getOptions(URL, "GET");
                const response = await axios(option);
                const g = response.data.data;
                setNewTitle(g?.group_title);

                // Fetch categorie
                const URLcat = `/api/categories`;
                const optionsd = await getOptions(URLcat, "GET");
                const responses = await axios(optionsd);
                const cat = responses.data.data;

                // Map categories for react-select
                const options = cat.map(category => ({
                    value: category.id,
                    label: category.category_title
                }));

                setCategories(options);

                // Find the selected category based on the current group's category ID
                const selectedCategory = options.find(option => option.value === response.data.data.category_id);
                setSelectedCategory(selectedCategory);
            } catch (error) {
                // Handle error if needed
                console.error('Error fetching category title:', error);
            }
        };

        fetchCategoryTitle();
    }, [groupId]);

    const handleUpdateGroup = async () => {
        try {

            if (!selectedCategory) {
                showToastMessage(false, 'โปรดเลือกหมวดหมู่');
                return;
            }

            if (!newTitle.trim()) {
                showToastMessage(false, 'กลุ่มวิชาห้ามเป็นค่าว่าง');
                return;
            }
            const url = `/api/groups/updateGroup/${groupId}`;
            const formData = {
                group_title: newTitle,
                category_id: selectedCategory.value,
            };

            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;
            message.success(msg)

            // Notify the parent component that data has been updated
            onUpdate();

            // Close the modal after updating
            onClose();
        } catch (error) {
            // Handle error if needed
            console.error('Error updating Group:', error);
        }
    };

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
                <ModalHeader className="flex flex-col gap-1">
                    <h2>แก้ไขกลุ่มวิชา</h2>
                    <span className='text-base font-normal'>แบบฟอร์มแก้ไขกลุ่มวิชา</span>
                </ModalHeader>
                <ModalBody>
                    <label htmlFor="category">เลือกหมวดหมู๋รายวิชา</label>
                    <Select
                        className="z-50"
                        id="category"
                        value={selectedCategory}
                        options={categories}
                        onChange={(selectedOption) => setSelectedCategory(selectedOption)}
                        isSearchable
                        isClearable
                    />
                    <Input
                        className='col-span-4 my-1'
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="กลุ่มวิชา"
                        labelPlacement="outside"
                        placeholder="กรอกกลุ่มวิชา"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />

                </ModalBody>
                <ModalFooter>
                    <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleUpdateGroup}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
