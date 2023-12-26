"use client"

// subgroup.js
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, SubGroupInsert, SubGroupUpdate } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Swal from 'sweetalert2';

async function fetchData() {
    try {
        const result = await axios.get(`${hostname}/api/subgroups`);
        const data = result.data.data;

        const subGroupData = await Promise.all(data.map(async subgroup => {
            const groupResult = await axios.get(`${hostname}/api/groups/${subgroup.group_id}`);
            const groupData = groupResult.data.data;

            // Fetch category details for each group
            const categoryResult = await axios.get(`${hostname}/api/categories/${groupData.catagory_id}`);
            const categoryData = categoryResult.data.data;

            return {
                ...subgroup,
                group: groupData,
                category: categoryData
            };
        }));

        return subGroupData;
    } catch (error) {
        console.log(error);
        return [{ "sub_group_title": "ไม่มี" }];
    }
}

export default function SubGroup() {
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedSubGroupForUpdate, setSelectedSubGroupForUpdate] = useState(null);
    const [subGroups, setSubGroups] = useState([]);

    useEffect(() => {
        fetchData().then(data => setSubGroups(data));
    }, []);

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleDataInserted = async () => {
        const data = await fetchData();
        setSubGroups(data);
        handleInsertModalClose();
    };

    const handleUpdateModalOpen = (subgroup) => {
        setSelectedSubGroupForUpdate(subgroup);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedSubGroupForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async () => {
        const data = await fetchData();
        setSubGroups(data);
        handleUpdateModalClose();
    };

    const handleDeleteSubGroup = async (subgroupId) => {
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
                await axios.delete(`${hostname}/api/subgroups/deleteSubGroup/${subgroupId}`);
                // Fetch data again after deleting to update the list
                const data = await fetchData();
                setSubGroups(data);

                Swal.fire(
                    'Deleted!',
                    'Your subgroup has been deleted.',
                    'success'
                );
            } catch (error) {
                // Handle error if needed
                console.error('Error deleting subgroup:', error);
            }
        }
    };

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='mt-16'>
                <div className='p-8 sm:ml-72'>
                    <h1>SubGroup:</h1>
                    <div>
                        {subGroups.map(subgroup => (
                            <div key={subgroup.id}>
                                <p>{subgroup.category ? subgroup.category.category_title : 'No Category'}</p>
                                <p>{subgroup.group ? subgroup.group.group_title : 'No SubGroup'}</p>
                                <h1 className='font-bold'>{subgroup.sub_group_title}</h1>
                                <button onClick={() => handleUpdateModalOpen(subgroup)}>Update</button>
                                <button onClick={() => handleDeleteSubGroup(subgroup.id)}>Delete</button>
                                {/* Add other subgroup properties as needed */}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleInsertModalOpen}>Add SubGroup</button>
                </div>
            </div>

            {/* Render the SubGroupInsert modal */}
            <SubGroupInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />

            {/* Render the SubGroupUpdate modal */}
            <SubGroupUpdate
                isOpen={isUpdateModalOpen}
                onClose={handleUpdateModalClose}
                onUpdate={handleDataUpdated}
                subGroupId={selectedSubGroupForUpdate ? selectedSubGroupForUpdate.id : null}
            />
        </>
    );
}
