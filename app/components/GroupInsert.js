"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';

export default function GroupInsert({ isOpen, onClose, onDataInserted }) {
    const [groupTitle, setGroupTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);

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
                alert('Please select a category.');
                return;
            }

            const result = await axios.post(`${hostname}/api/groups/insertGroup`, {
                group_title: groupTitle,
                catagory_id: selectedCategory.value // Assuming 'value' property contains the ID
            });

            console.log('Inserted group:', result.data.data);

            // Notify the parent component that data has been inserted
            onDataInserted();

            // Close the modal after inserting
            onClose();
        } catch (error) {
            console.error('Error inserting group:', error);
            // Handle error if needed
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Insert New Group</ModalHeader>
                        <ModalBody>
                            <label htmlFor="groupTitle">Group Title:</label>
                            <input
                                type="text"
                                id="groupTitle"
                                value={groupTitle}
                                onChange={(e) => setGroupTitle(e.target.value)}
                            />

                            <label htmlFor="category">Select Category:</label>
                            <Select
                                id="category"
                                value={selectedCategory}
                                options={categories.map(category => ({ value: category.id, label: category.category_title }))}
                                onChange={(selectedOption) => setSelectedCategory(selectedOption)}
                                isSearchable
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={handleInsertGroup}>
                                Insert Group
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
