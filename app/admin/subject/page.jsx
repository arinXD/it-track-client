"use client"
// Subject.js
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, SubjectInsert, SubjectUpdate, ExcelUpload, ContentWrap, BreadCrumb } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import Swal from 'sweetalert2';
import { CSVLink } from 'react-csv';
import * as XLSX from "xlsx";

async function fetchData() {
    try {
        const groupResult = await axios.get(`${hostname}/api/groups`);
        const groups = groupResult.data.data;

        const programcodeResult = await axios.get(`${hostname}/api/programcodes`);
        const programcodes = programcodeResult.data.data;

        const subgroupResult = await axios.get(`${hostname}/api/subgroups`);
        const subgroups = subgroupResult.data.data;

        const programResult = await axios.get(`${hostname}/api/programs`);
        const programs = programResult.data.data;

        const result = await axios.get(`${hostname}/api/subjects`);
        const subjects = result.data.data;

        return { subjects, groups, programcodes, subgroups, programs }
    } catch (error) {
        console.log("fetch errpr:", error);
    }
}

export default function Subject() {
    const [subjects, setSubjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [programcodes, setProgramcodes] = useState([]);
    const [subgroups, setSubgroups] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [isInsertModalOpen, setInsertModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedSubjectForUpdate, setSelectedSupjectForUpdate] = useState(null);


    useEffect(() => {
        fetchData().then(data => {
            console.log(data);
            setSubjects(data.subjects)
            setGroups(data.groups)
            setProgramcodes(data.programcodes)
            setSubgroups(data.subgroups)
            setPrograms(data.programs)
        }).catch(err => {
            console.log("error on useeffect:", err);
        });
    }, []);

    const handleInsertModalOpen = () => {
        setInsertModalOpen(true);
    };

    const handleInsertModalClose = () => {
        setInsertModalOpen(false);
    };

    const handleUpdateModalOpen = (group) => {
        setSelectedSupjectForUpdate(group);
        setUpdateModalOpen(true);
    };

    const handleUpdateModalClose = () => {
        setSelectedSupjectForUpdate(null);
        setUpdateModalOpen(false);
    };

    const handleDataUpdated = async () => {
        // Fetch data again after updating to update the list
        const data = await fetchData();
        setSubjects(data.subjects)
        setGroups(data.groups)
        setProgramcodes(data.programcodes)
        setSubgroups(data.subgroups)
        setPrograms(data.programs)
        // Close the modal after updating
        handleUpdateModalClose();
    };

    const handleDataInserted = async () => {
        // Fetch data again after inserting to update the list
        const data = await fetchData();
        setSubjects(data.subjects)
        setGroups(data.groups)
        setProgramcodes(data.programcodes)
        setSubgroups(data.subgroups)
        setPrograms(data.programs)
        // Close the modal after inserting
        handleInsertModalClose();
    };


    const handleDeleteSubject = async (subjectId) => {
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
                await axios.delete(`${hostname}/api/subjects/deleteSubject/${subjectId}`);
                // Fetch data again after deleting to update the list
                await handleDataInserted()
                Swal.fire(
                    'Deleted!',
                    'Your Subject has been deleted.',
                    'success'
                );
            } catch (error) {
                // Handle error if needed
                console.error('Error deleting Subject:', error);
            }
        }
    };

    const handleExportCSV = () => {
        const csvData = subjects.map(subject => [
            getProgramTitle(subject.program_code_id),
            getProgramCodeTitle(subject.program_code_id),
            getGroupTitle(subject.group_id),
            getSubGroupTitle(subject.sub_group_id),
            subject.semester || "No data",
            subject.subject_code || "No data",
            subject.title_th || "No data",
            subject.title_en || "No data",
            subject.information || "No data",
            subject.cradit || "No data",
        ]);

        // Add headers to the CSV data
        const csvHeaders = [
            'Program', 'Program Code', 'Group', 'SubGroup', 'Semester', 'Subject Code',
            'Title (TH)', 'Title (EN)', 'Information', 'Credit'
        ];

        csvData.unshift(csvHeaders);

        // Trigger the CSV download
        const csvFilename = 'subjects_data.csv';
        const csvBlob = new Blob([csvData.map(row => row.join(',')).join('\n')], { type: 'text/csv' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(csvBlob);
        link.download = csvFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getProgramTitle = (programCodeId) => {
        const programCode = programcodes.find(e => e.id === programCodeId);

        if (programCode) {
            const program = programs.find(p => p.id === programCode.program_id);
            return program ? program.program_title : 'No Program';
        }

        return 'No Program';
    };

    const getProgramCodeTitle = (programCodeId) => {
        const programCode = programcodes.find(e => e.id === programCodeId);
        return programCode ? programCode.program_title : 'No ProgramCode';
    };

    const getGroupTitle = (groupId) => {
        const group = groups.find(e => e.id === groupId);
        return group ? group.group_title : 'No Group';
    };

    const getSubGroupTitle = (subGroupId) => {
        const subGroup = subgroups.find(e => e.id === subGroupId);
        return subGroup ? subGroup.sub_group_title : 'No SubGroup';
    };

    const handleExportExcel = () => {
        // Create a workbook with a worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(subjects.map(subject => ({
            Program: getProgramTitle(subject.program_code_id),
            'Program Code': getProgramCodeTitle(subject.program_code_id),
            Group: getGroupTitle(subject.group_id),
            SubGroup: getSubGroupTitle(subject.sub_group_id),
            Semester: subject.semester || "No data",
            'Subject Code': subject.subject_code || "No data",
            'Title (TH)': subject.title_th || "No data",
            'Title (EN)': subject.title_en || "No data",
            Information: subject.information || "No data",
            Credit: subject.cradit || "No data",
        })));

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Subjects');

        // Save the workbook to a file
        XLSX.writeFile(wb, 'subjects_data.xlsx');
    };


    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <h2>Subjects:</h2>
                <button onClick={handleExportCSV}>Export to CSV</button>
                <button onClick={handleExportExcel}>Export to Excel</button>
                <div>
                    {/* Render your subject data here */}
                    {subjects.map((subject, index) => (
                        <div key={index}>
                            {/* Display subject information */}
                            <p>
                                id: {subject.subject_id} <br />
                                Program: {subject.program_code_id ?
                                    <>
                                        {programcodes.map(programcode => (
                                            programs.map(program => (
                                                // เงื่อนไข
                                                (subject.program_code_id === programcode.id &&
                                                    programcode.program_id === program.id) &&
                                                // แสดงผล
                                                program.program_title
                                            ))
                                        ))}
                                    </>
                                    : 'No Program'}
                            </p>
                            <p>
                                Program Code: {subject.program_code_id ?
                                    <>
                                        {programcodes.map(e => (
                                            e.id === subject.program_code_id &&
                                            e.program_title
                                        ))}
                                    </>
                                    : 'No ProgramCode'}
                            </p>
                            <p>
                                Group: {subject.group_id ?
                                    <>
                                        {groups.map(e => (
                                            e.id === subject.group_id &&
                                            e.group_title
                                        ))}
                                    </>
                                    : 'No Group'}
                            </p>
                            <p>
                                SubGroup: {subject.sub_group_id ?
                                    <>
                                        {subgroups.map(e => (
                                            e.id === subject.sub_group_id &&
                                            e.sub_group_title
                                        ))}
                                    </>
                                    : 'No Group'}
                            </p>
                            <p>Semester: {subject.semester || "ไม่มีข้อมูล"}</p>
                            <p>Subject Code: {subject.subject_code || "ไม่มีข้อมูล"}</p>
                            <p>Title (TH): {subject.title_th || "ไม่มีข้อมูล"}</p>
                            <p>Title (EN): {subject.title_en || "ไม่มีข้อมูล"}</p>
                            <p>Information: {subject.information || "ไม่มีข้อมูล"}</p>
                            <p>Cradit: {subject.cradit || "ไม่มีข้อมูล"}</p>
                            <button onClick={() => handleUpdateModalOpen(subject)}>Update</button>
                            <button onClick={() => handleDeleteSubject(subject.subject_id)}>Delete</button>
                            <p>______________________________________________________________________</p>
                        </div>
                    ))}
                </div>
                <button onClick={handleInsertModalOpen}>Add Subject</button>
                <ExcelUpload onDataInsertXlsx={handleDataInserted} />

                {/* Render the SubjectInsert modal */}
                <SubjectInsert isOpen={isInsertModalOpen} onClose={handleInsertModalClose} onDataInserted={handleDataInserted} />
                {selectedSubjectForUpdate?.subject_id &&
                    <SubjectUpdate
                        isOpen={isUpdateModalOpen}
                        onClose={handleUpdateModalClose}
                        onUpdate={handleDataUpdated}
                        subjectId={selectedSubjectForUpdate.subject_id}
                    />
                }
            </ContentWrap>

        </>
    );
}