"use client"
// CategoryUpdate.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';

export default function CategoryUpdate({ isOpen, onClose, onUpdate, categoryId }) {
  const [newTitle, setNewTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  useEffect(() => {
    const fetchCategoryTitle = async () => {
      try {
        const response = await axios.get(`${hostname}/api/categories/${categoryId}`);
        setNewTitle(response.data.data.category_title); // Set the newTitle as well
      } catch (error) {
        // Handle error if needed
        console.error('Error fetching category title:', error);
      }
    };

    fetchCategoryTitle();
  }, [categoryId]);

  const handleUpdateCategory = async () => {
    try {
      await axios.post(`${hostname}/api/categories/updateCategory/${categoryId}`, {
        category_title: newTitle,
      });

      // Notify the parent component that data has been updated
      onUpdate();

      // Close the modal after updating
      onClose();
    } catch (error) {
      // Handle error if needed
      console.error('Error updating category:', error);
    }
  };

  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Update Category</ModalHeader>
        <ModalBody>
          <label htmlFor="newTitle">New Category Title:</label>
          <input
            type="text"
            id="newTitle"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          {/* <p>Current Title: {currentTitle}</p> */}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleUpdateCategory}>
            Update Category
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
