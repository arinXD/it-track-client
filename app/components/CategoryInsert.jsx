"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useState } from 'react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';

export default function CategoryInsert({ isOpen, onClose, onDataInserted }) {
    const [categoryTitle, setCategoryTitle] = useState('');

    const handleInsertCategory = async () => {
        try {
            const result = await axios.post(`${hostname}/api/categories/insertCategory`, {
                category_title: categoryTitle,
            });

            console.log('Inserted category:', result.data.data);

            // Notify the parent component that data has been inserted
            onDataInserted();
        } catch (error) {
            console.error('Error inserting category:', error);
            // Handle error if needed
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Insert New Category</ModalHeader>
                        <ModalBody>
                            <label htmlFor="categoryTitle">Category Title:</label>
                            <input
                                type="text"
                                id="categoryTitle"
                                value={categoryTitle}
                                onChange={(e) => setCategoryTitle(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={handleInsertCategory}>
                                Insert Category
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
