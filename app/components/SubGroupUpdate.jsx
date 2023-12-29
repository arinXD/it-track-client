"use client"

// SubGroupUpdate.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';

export default function SubGroupUpdate({ isOpen, onClose, onUpdate, subGroupId }) {
    const [newTitle, setNewTitle] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);

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
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Update SubGroup</ModalHeader>
                <ModalBody>
                    <label htmlFor="newTitle">New SubGroup Title:</label>
                    <input
                        type="text"
                        id="newTitle"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
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
                    <Button color="primary" onPress={handleUpdateSubGroup}>
                        Update SubGroup
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
