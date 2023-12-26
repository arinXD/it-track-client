"use client"
// GroupUpdate.js

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';  // Import the Select component
import { hostname } from '@/app/api/hostname';

export default function GroupUpdate({ isOpen, onClose, onUpdate, groupId }) {
    const [newTitle, setNewTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    // Fetch the current category title based on the category ID
    useEffect(() => {
        const fetchCategoryTitle = async () => {
            try {
                const response = await axios.get(`${hostname}/api/groups/${groupId}`);
                setNewTitle(response.data.data.group_title);

                // Fetch categories
                const categoriesResult = await axios.get(`${hostname}/api/categories`);
                const categoriesData = categoriesResult.data.data;

                // Map categories for react-select
                const options = categoriesData.map(category => ({
                    value: category.id,
                    label: category.category_title
                }));

                setCategories(options);

                // Find the selected category based on the current group's category ID
                const selectedCategory = options.find(option => option.value === response.data.data.catagory_id);
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
            await axios.post(`${hostname}/api/groups/updateGroup/${groupId}`, {
                group_title: newTitle,
                catagory_id: selectedCategory.value,
            });

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
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Update Group</ModalHeader>
                <ModalBody>
                    <label htmlFor="newTitle">New Group Title:</label>
                    <input
                        type="text"
                        id="newTitle"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />

                    <label htmlFor="category">Select Category:</label>
                    <Select
                        id="category"
                        value={selectedCategory}
                        options={categories}
                        onChange={(selectedOption) => setSelectedCategory(selectedOption)}
                        isSearchable
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="primary" onPress={handleUpdateGroup}>
                        Update Group
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
