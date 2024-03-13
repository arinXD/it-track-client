"use client"
// CategoryUpdate.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { Input } from "@nextui-org/react";
import { toast } from 'react-toastify';
export default function CategoryUpdate({ isOpen, onClose, onUpdate, categoryId }) {
  const [newTitle, setNewTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
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


  const checkDuplicateCategory = async (title) => {
    try {
      const response = await axios.get(`${hostname}/api/categories/checkDuplicate/${title}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking duplicate category:', error);
      throw error;
    }
  };

  const handleUpdateCategory = async () => {
    try {

      if (!newTitle.trim()) {
        showToastMessage(false, 'หมวดหมู่วิชาห้ามเป็นค่าว่าง');
        return;
      }

      const isDuplicate = await checkDuplicateCategory(newTitle);
            if (isDuplicate) {
                showToastMessage(false, 'หมวดหมู่วิชานี้มีอยู่แล้ว');
                return;
            }

      await axios.put(`${hostname}/api/categories/updateCategory/${categoryId}`, {
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
        <ModalHeader className="flex flex-col gap-1">แก้ไขหมวดหมู่วิชา</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            id="newTitle"
            label="หมวดหมู่วิชา"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          {/* <p>Current Title: {currentTitle}</p> */}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            ยกเลิก
          </Button>
          <Button color="primary" onPress={handleUpdateCategory}>
            บันทึก
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
