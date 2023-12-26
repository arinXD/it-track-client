"use client"

// Program.js
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, ProgramInsert, ProgramUpdate } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Swal from 'sweetalert2';

async function fetchData() {
    try {
        const result = await axios.get(`${hostname}/api/programs`);
        const data = result.data.data;

        if (data.length === 0) return [{ id: 1, "program_title": "ไม่มีข้อมูล" }]
        return data;
    } catch (error) {
        console.log(error);
        return [{ "program_title": "ไม่มี" }];
    }
}

export default function Program() {
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedProgramForUpdate, setSelectedProgramForUpdate] = useState(null);
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        fetchData().then(data => setPrograms(data));
    }, []);

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleDataInserted = async () => {
        const data = await fetchData();
        setPrograms(data);
        handleInsertModalClose();
    };

    const handleUpdateModalOpen = (program) => {
        setSelectedProgramForUpdate(program);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedProgramForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async () => {
        const data = await fetchData();
        setPrograms(data);
        handleUpdateModalClose();
    };

    const handleDeleteProgram = async (programId) => {
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
                await axios.delete(`${hostname}/api/programs/deleteProgram/${programId}`);
                const data = await fetchData();
                setPrograms(data);
                Swal.fire(
                    'Deleted!',
                    'Your program has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting program:', error);
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
                    <h2>Program:</h2>
                    <div>
                        {programs.map(program => (
                            <div key={program.id}>
                                <h2 className='font-bold'>{program.program_title}</h2>
                                <button onClick={() => handleUpdateModalOpen(program)}>Update</button>
                                <button onClick={() => handleDeleteProgram(program.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleInsertModalOpen}>Add Program</button>
                </div>
            </div>

            {/* Render the ProgramInsert modal */}
            <ProgramInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />

            {/* Render the ProgramUpdate modal */}
            <ProgramUpdate
                isOpen={isUpdateModalOpen}
                onClose={handleUpdateModalClose}
                onUpdate={handleDataUpdated}
                programId={selectedProgramForUpdate ? selectedProgramForUpdate.id : null}
            />
        </>
    );
}
