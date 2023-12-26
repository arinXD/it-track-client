"use client"

import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, ProgramCodeInsert, ProgramCodeUpdate } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Swal from 'sweetalert2';

export default function ProgramCode() {
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedProgramCodeForUpdate, setSelectedProgramCodeForUpdate] = useState(null);
    const [programCodes, setProgramCodes] = useState([]);

    useEffect(() => {
        fetchData().then(data => setProgramCodes(data));
    }, []);

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleUpdateModalOpen = (programCode) => {
        setSelectedProgramCodeForUpdate(programCode);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedProgramCodeForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataInserted = async () => {
        // Fetch data again after inserting to update the list
        const data = await fetchData();
        setProgramCodes(data);
        // Close the modal after inserting
        handleInsertModalClose();
    };

    const handleDataUpdated = async () => {
        // Fetch data again after updating to update the list
        const data = await fetchData();
        setProgramCodes(data);
        // Close the modal after updating
        handleUpdateModalClose();
    };

    const handleDeleteProgramCode = async (programCodeId) => {
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
                await axios.delete(`${hostname}/api/programcodes/deleteProgramCode/${programCodeId}`);
                const data = await fetchData();
                setProgramCodes(data); 
                Swal.fire(
                    'Deleted!',
                    'Your programcode has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting programcode:', error);
            }
        }
    };


    async function fetchData() {
        try {
            const result = await axios.get(`${hostname}/api/programcodes`);
            const data = result.data.data;

            const programcodeData = await Promise.all(data.map(async programcode => {
                const programResult = await axios.get(`${hostname}/api/programs/${programcode.program_id}`);
                const programData = programResult.data.data;

                return {
                    ...programcode,
                    program: programData
                };
            }));

            return programcodeData;
        } catch (error) {
            console.log(error);
            return [{ "program_title": "ไม่มี" }];
        }
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='mt-16'>
                <div className='p-8 sm:ml-72'>
                    <h2>ProgramCode:</h2>
                    <div>
                        {/* Render your program code data here */}
                        {programCodes.map(programcode => (
                            <div key={programcode.id}>
                                <p>โปรแกรม {programcode.program ? programcode.program.program_title : 'No Program'}</p>
                                <h2 className='font-bold'>{programcode.program_title}</h2>
                                <h2 className='font-bold'>{programcode.desc}</h2>
                                <h2 className='font-bold'>{programcode.version}</h2>
                                {/* Display other program code properties as needed */}
                                <button onClick={() => handleUpdateModalOpen(programcode)}>Update</button>
                                <button onClick={() => handleDeleteProgramCode(programcode.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleInsertModalOpen}>Add Program Code</button>
                </div>
            </div>

            {/* Render the ProgramCodeInsert modal */}
            <ProgramCodeInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />

            {/* Render the ProgramCodeUpdate modal */}
            <ProgramCodeUpdate
                isOpen={isUpdateModalOpen}
                onClose={handleUpdateModalClose}
                onUpdate={handleDataUpdated}
                programCodeId={selectedProgramCodeForUpdate ? selectedProgramCodeForUpdate.id : null}
            />
        </>
    );
}