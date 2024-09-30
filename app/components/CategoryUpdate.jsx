"use client"
// CategoryUpdate.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { Input } from "@nextui-org/react";
import { toast } from 'react-toastify';
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { Empty, message } from 'antd';

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
        const URL = `/api/categories/${categoryId}`;
        const option = await getOptions(URL, "GET");
        const response = await axios(option);
        const cat = response.data.data;
        setNewTitle(cat?.category_title);
      } catch (error) {
        // Handle error if needed
        console.error('Error fetching category title:', error);
      }
    };

    fetchCategoryTitle();
  }, [categoryId]);


  const checkDuplicateCategory = async (title) => {
    try {
      const URL = `/api/categories/checkDuplicate/${title}`;
      const option = await getOptions(URL, "GET");
      const response = await axios(option);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking duplicate category:', error);
      throw error;
    }
  };

  const handleUpdateCategory = async () => {
    try {

      const isDuplicate = await checkDuplicateCategory(newTitle);
      if (isDuplicate) {
        showToastMessage(false, 'หมวดหมู่วิชานี้มีอยู่แล้ว');
        return;
      }

      const programPattern = /^[A-Za-zก-๙0-9\s]+$/; // Regular Expression สำหรับภาษาอังกฤษ ภาษาไทย ตัวเลข และช่องว่าง
      if (!newTitle.trim()) {
        showToastMessage(false, 'หมวดหมู่วิชาห้ามเป็นค่าว่าง');
        return;
      } else if (!programPattern.test(newTitle.trim())) {
        showToastMessage(false, 'หมวดหมู่วิชาต้องประกอบด้วยตัวอักษรภาษาไทย, ภาษาอังกฤษ, และตัวเลขเท่านั้น');
        return;
      }

      const url = `/api/categories/updateCategory/${categoryId}`;

      const formData = {
        category_title: newTitle
      };

      const options = await getOptions(url, "PUT", formData);
      const result = await axios(options);
      const { ok, message: msg } = result.data;
      message.success(msg)

      onUpdate();

      // Close the modal after updating
      onClose();
    } catch (error) {
      // Handle error if needed
      console.error('Error updating category:', error);
    }
  };

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
        <ModalHeader className="flex flex-col gap-1">
          <h2>แก้ไขหมวดหมู่วิชา</h2>
          <span className='text-base font-normal'>แบบฟอร์มแก้ไขหมวดหมู่วิชา</span>
        </ModalHeader>
        <ModalBody>
          <Input
            type="text"
            radius='sm'
            variant="bordered"
            label="หมวดหมู่วิชา"
            labelPlacement="outside"
            placeholder="กรอกหมวดหมู่วิชา"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          {/* <p>Current Title: {currentTitle}</p> */}
        </ModalBody>
        <ModalFooter>
          <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
            ยกเลิก
          </Button>
          <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleUpdateCategory}>
            บันทึก
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
