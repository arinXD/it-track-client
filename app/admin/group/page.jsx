"use client"

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, GroupInsert, GroupUpdate, ContentWrap, BreadCrumb } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Swal from 'sweetalert2';

async function fetchData() {
    try {
        const result = await axios.get(`${hostname}/api/groups`);
        const data = result.data.data;

        const groupData = await Promise.all(data.map(async group => {
            const categoryResult = await axios.get(`${hostname}/api/categories/${group.catagory_id}`);
            const categoryData = categoryResult.data.data;

            return {
                ...group,
                category: categoryData
            };
        }));

        return groupData;
    } catch (error) {
        console.log(error);
        return [{ "group_title": "ไม่มี" }];
    }
}

export default function Group() {
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedGroupForUpdate, setSelectedGroupForUpdate] = useState(null);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchData().then(data => setGroups(data));
    }, []);

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleDataInserted = async () => {
        // Fetch data again after inserting to update the list
        const data = await fetchData();
        setGroups(data);
        // Close the modal after inserting
        handleInsertModalClose();
    };


    const handleUpdateModalOpen = (group) => {
        setSelectedGroupForUpdate(group);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedGroupForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async () => {
        // Fetch data again after updating to update the list
        const data = await fetchData();
        setGroups(data);
        // Close the modal after updating
        handleUpdateModalClose();
    };

    const handleDeleteGroup = async (groupId) => {
        const { value } = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (value) {
            try {
                await axios.delete(`${hostname}/api/groups/deleteGroup/${groupId}`);
                // Fetch data again after deleting to update the list
                const data = await fetchData();
                setGroups(data); // Fix: Change setCategories to setGroups
                Swal.fire(
                    'Deleted!',
                    'Your group has been deleted.',
                    'success'
                );
            } catch (error) {
                // Handle error if needed
                console.error('Error deleting group:', error);
            }
        }
    };

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <h1>Group:</h1>
                <div>
                    {/* Render your group data here */}
                    {groups.map(group => (
                        <div key={group.id}>
                            <p>{group.category ? group.category.category_title : 'No Group'}</p>
                            <h1 className='font-bold'>{group.group_title}</h1>
                            {/* Add other group properties as needed */}
                            <button onClick={() => handleUpdateModalOpen(group)}>Update</button>
                            <button onClick={() => handleDeleteGroup(group.id)}>Delete</button>
                        </div>
                    ))}
                </div>
                <button onClick={handleInsertModalOpen}>Add Group</button>
                {/* Render the GroupInsert modal */}
                <GroupInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />

                <GroupUpdate
                    isOpen={isUpdateModalOpen}
                    onClose={handleUpdateModalClose}
                    onUpdate={handleDataUpdated}
                    groupId={selectedGroupForUpdate ? selectedGroupForUpdate.id : null}
                />
            </ContentWrap>
        </>
    );
}


