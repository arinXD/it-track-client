"use client"

// SubGroupInsert.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';
import { Input } from "@nextui-org/react";

export default function SubGroupInsert({ isOpen, onClose, onDataInserted }) {
    const [subGroupTitle, setSubGroupTitle] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);

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
                alert('Please select a subgroup.');
                return;
            }

            const result = await axios.post(`${hostname}/api/subgroups/insertSubGroup`, {
                sub_group_title: subGroupTitle,
                group_id: selectedGroup.value
            });

            console.log('Inserted subgroup:', result.data.data);

            onDataInserted();
        } catch (error) {
            console.error('Error inserting subgroup:', error);
            // Handle error if needed
        }
    };

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
