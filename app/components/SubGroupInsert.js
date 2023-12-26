"use client"

// SubGroupInsert.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';

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
                <ModalHeader className="flex flex-col gap-1">Insert New SubGroup</ModalHeader>
                <ModalBody>
                    <label htmlFor="subGroupTitle">SubGroup Title:</label>
                    <input
                        type="text"
                        id="subGroupTitle"
                        value={subGroupTitle}
                        onChange={(e) => setSubGroupTitle(e.target.value)}
                    />

                    <label htmlFor="group">Select Group:</label>
                    <Select
                        id="group"
                        value={selectedGroup}
                        options={groups}
                        onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                        isSearchable
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="primary" onPress={handleInsertSubGroup}>
                        Insert SubGroup
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
