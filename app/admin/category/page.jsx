"use client"

import { useState, useEffect } from 'react';
import { Navbar, Sidebar, CategoryInsert, CategoryUpdate, ContentWrap, BreadCrumb } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Swal from 'sweetalert2';

async function fetchData() {
    try {
        const result = await axios.get(`${hostname}/api/categories`);
        const data = result.data.data;

        if (data.length === 0) return [{ id: 1, "category_title": "ไม่มีข้อมูล" }]
        return data;
    } catch (error) {
        console.log(error);
        return [{ "category_title": "ไม่มี" }];
    }
}

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchData();
                setCategories(data);
            } catch (error) {
                // Handle error if needed
                console.error('Error fetching data:', error);
            }
        };

        getData();
    }, []);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleDataInserted = async () => {
        // Fetch data again after inserting to update the list
        const data = await fetchData();
        setCategories(data);
        // Close the modal after inserting
        handleModalClose();
    };

    const handleDeleteCategory = async (categoryId) => {
        // Show a confirmation dialog using SweetAlert2
        const { value } = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        // If the user clicks on "Yes, delete it!", proceed with deletion
        if (value) {
            try {
                await axios.delete(`${hostname}/api/categories/deleteCategory/${categoryId}`);
                // Fetch data again after deleting to update the list
                const data = await fetchData();
                setCategories(data);
                Swal.fire(
                    'Deleted!',
                    'Your category has been deleted.',
                    'success'
                );
            } catch (error) {
                // Handle error if needed
                console.error('Error deleting category:', error);
            }
        }
    };

    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');

    const handleUpdateModalOpen = (categoryId, categoryTitle) => {
        setSelectedCategoryId(categoryId);
        setSelectedCategoryTitle(categoryTitle);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async (categoryId) => {
        // Fetch data again after updating to update the list
        const data = await fetchData();
        setCategories(data);
    };


    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb/>
                <h1>Category:</h1>
                <div>
                    {/* Render your category data here */}
                    {categories.map(category => (
                        <div key={category.id}>
                            <p>{category.category_title}</p>
                            {/* Add other category properties as needed */}

                            <button onClick={() => handleUpdateModalOpen(category.id, category.category_title)}>Update</button>
                            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                        </div>
                    ))}
                </div>
                <button onClick={handleModalOpen}>Add Category</button>
                <CategoryInsert isOpen={isModalOpen} onClose={handleModalClose} onDataInserted={handleDataInserted} />

                <CategoryUpdate
                    isOpen={isUpdateModalOpen}
                    onClose={handleUpdateModalClose}
                    onUpdate={handleDataUpdated}
                    categoryId={selectedCategoryId}
                    currentTitle={selectedCategoryTitle}
                />
            </ContentWrap>

        </>
    );
}
