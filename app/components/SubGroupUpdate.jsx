"use client"

// SubGroupUpdate.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';
import { Input } from "@nextui-org/react";
import { toast } from 'react-toastify';

export default function SubGroupUpdate({ isOpen, onClose, onUpdate, subGroupId }) {
    const [newTitle, setNewTitle] = useState('');
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
        const fetchData = async () => {
            try {
                // Fetch the subgroup details
                const subgroupResult = await axios.get(`${hostname}/api/subgroups/${subGroupId}`);
                const subgroupData = subgroupResult.data.data;

                setNewTitle(subgroupData.sub_group_title);

                // Fetch the list of groups
                const groupsResult = await axios.get(`${hostname}/api/groups`);
                const groupsData = groupsResult.data.data;

                // Map groups for react-select
                const options = groupsData.map(group => ({
                    value: group.id,
                    label: group.group_title
                }));

                setGroups(options);

                // Find the selected group based on the current subgroup's group ID
                const selectedGroup = options.find(option => option.value === subgroupData.group_id);
                setSelectedGroup(selectedGroup);
            } catch (error) {
                console.error('Error fetching subgroup details:', error);
            }
        };

        fetchData();
    }, [subGroupId]);

    const handleUpdateSubGroup = async () => {
        try {

            if (!selectedGroup) {
                showToastMessage(false, 'โปรดเลือกกลุ่มวิชา');
                return;
            }

            if (!newTitle.trim()) {
                showToastMessage(false, 'กลุ่มย่อยห้ามเป็นค่าว่าง');
                return;
            }

            await axios.post(`${hostname}/api/subgroups/updateSubGroup/${subGroupId}`, {
                sub_group_title: newTitle,
                group_id: selectedGroup.value
            });

            // Notify the parent component that data has been updated
            onUpdate();

            // Close the modal after updating
            onClose();
        } catch (error) {
            console.error('Error updating subgroup:', error);
            // Handle error if needed
            showToastMessage(false, 'กลุ่มย่อยวิชาห้ามซ้ำ');
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
                    <h2>แก้ไขกลุ่มย่อยวิชา</h2>
                    <span className='text-base font-normal'>แบบฟอร์มแก้ไขกลุ่มย่อยวิชา</span>
                </ModalHeader>
                <ModalBody>
                    <label htmlFor="group">เลือกกลุ่มวิชา</label>
                    <Select
                        id="group"
                        className='z-50'
                        value={selectedGroup}
                        options={groups}
                        placeholder='เลือกกลุ่มวิชา'
                        onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                        isSearchable
                        isClearable
                    />

                    <Input
                        className='col-span-4 mt-1'
                        type="text"
                        radius='sm'
                        variant="bordered"
                        label="กลุ่มย่อยวิชา"
                        labelPlacement="outside"
                        placeholder="กรอกกลุ่มย่อยวิชา"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />

                </ModalBody>
                <ModalFooter>
                    <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                        ยกเลิก
                    </Button>
                    <Button className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid' onPress={handleUpdateSubGroup}>
                        บันทึก
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
