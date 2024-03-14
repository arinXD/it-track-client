"use client"

// SubGroupInsert.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';
import { Input } from "@nextui-org/react";
import { toast } from 'react-toastify';

export default function SubGroupInsert({ isOpen, onClose, onDataInserted }) {
    const [subGroupTitle, setSubGroupTitle] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
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
        const fetchGroups = async () => {
            try {
                const result = await axios.get(`${hostname}/api/groups`);
                const data = result.data.data;

                const groupOptions = data.map(group => ({
                    value: group.id,
                    label: group.group_title
                }));

                setGroups(groupOptions);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);

    const handleInsertSubGroup = async () => {
        try {
            // Check if a group is selected
            if (!selectedGroup) {
                showToastMessage(false, 'โปรดเลือกกลุ่มวิชา');
                return;
            }

            if (!subGroupTitle.trim()) {
                showToastMessage(false, 'กลุ่มย่อยห้ามเป็นค่าว่าง');
                return;
            }

            const result = await axios.post(`${hostname}/api/subgroups/insertSubGroup`, {
                sub_group_title: subGroupTitle,
                group_id: selectedGroup.value
            });

            // showToastMessage(true, `เพิ่มกลุ่มย่อยวิชา ${result.data.data.sub_group_title} สำเร็จ`);

            onDataInserted();
        } catch (error) {
            showToastMessage(false, 'กลุ่มย่อยวิชาซ้ำ');
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Clear all state values
            setSubGroupTitle('');
            setSelectedGroup(null);
        }
    }, [isOpen]);

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">เพิ่มกลุ่มย่อย</ModalHeader>
                <ModalBody>
                    <label htmlFor="group">กลุ่มวิชา</label>
                    <Select
                        className='z-50'
                        id="group"
                        value={selectedGroup}
                        options={groups}
                        onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                        isSearchable
                        isClearable
                    />
                    <Input
                        type="text"
                        id="subGroupTitle"
                        label="กลุ่มย่อยวิชา"
                        value={subGroupTitle}
                        onChange={(e) => setSubGroupTitle(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" onPress={handleInsertSubGroup}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
