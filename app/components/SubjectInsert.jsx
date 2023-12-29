"use client"

// SubjectInsert.js

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';

export default function SubjectInsert({ isOpen, onClose, onDataInserted }) {
    const [semester, setSemester] = useState('');
    const [subject_code, setSubjectCode] = useState('');
    const [title_th, setTitleTh] = useState('');
    const [title_en, setTitleEn] = useState('');
    const [information, setInformation] = useState('');
    const [cradit, setCradit] = useState('');

    const [selectedSubGroup, setSelectedSubGroup] = useState(null);
    const [subgroups, setSubGroup] = useState([]);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);

    const [selectedProgramCode, setSelectedProgramCode] = useState(null);
    const [programscodes, setProgramCode] = useState([]);

    useEffect(() => {
        const fetchSubGroups = async () => {
            try {
                const result = await axios.get(`${hostname}/api/subgroups`);
                const data = result.data.data;

                const subgroupOptions = data.map(subgroup => ({
                    value: subgroup.id,
                    label: subgroup.sub_group_title
                }));

                setSubGroup(subgroupOptions);
            } catch (error) {
                console.error('Error fetching subgroup:', error);
            }
        };
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
        const fetchProgramCodes = async () => {
            try {
                const result = await axios.get(`${hostname}/api/programcodes`);
                const data = result.data.data;

                const programcodeOptions = data.map(programcode => ({
                    value: programcode.id,
                    label: programcode.program_title
                }));

                setProgramCode(programcodeOptions);
            } catch (error) {
                console.error('Error fetching programcode:', error);
            }
        };

        fetchSubGroups();
        fetchGroups();
        fetchProgramCodes();
    }, []);

    const handleInsertSubject = async () => {
        try {
            const result = await axios.post(`${hostname}/api/subjects/insertSubject`, {
                semester: semester ? semester : null,
                subject_code: subject_code ?subject_code  : null,
                title_th: title_th ? title_th : null,
                title_en: title_en ? title_en : null,
                information: information ? information : null,
                cradit: cradit ? cradit : null,
                sub_group_id: selectedSubGroup ? selectedSubGroup.value : null,
                group_id: selectedGroup ? selectedGroup.value : null,
                program_code_id: selectedProgramCode ? selectedProgramCode.value : null,
            });
    
            console.log('Inserted subjects:', result.data.data);
    
            onDataInserted();
        } catch (error) {
            console.error('Error inserting subjects:', error);
            // Handle error if needed
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Insert New SubGroup</ModalHeader>
                <ModalBody>
                    <label htmlFor="semester">semester:</label>
                    <input
                        type="text"
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    />
                    <label htmlFor="subject_code">subject_code:</label>
                    <input
                        type="text"
                        id="subject_code"
                        value={subject_code}
                        onChange={(e) => setSubjectCode(e.target.value)}
                    />
                    <label htmlFor="title_th">title_th:</label>
                    <input
                        type="text"
                        id="title_th"
                        value={title_th}
                        onChange={(e) => setTitleTh(e.target.value)}
                    />
                    <label htmlFor="title_en">title_en:</label>
                    <input
                        type="text"
                        id="title_en"
                        value={title_en}
                        onChange={(e) => setTitleEn(e.target.value)}
                    />
                    <label htmlFor="information">information:</label>
                    <input
                        type="text"
                        id="information"
                        value={information}
                        onChange={(e) => setInformation(e.target.value)}
                    />
                    <label htmlFor="cradit">cradit:</label>
                    <input
                        type="text"
                        id="cradit"
                        value={cradit}
                        onChange={(e) => setCradit(e.target.value)}
                    />

                    <label htmlFor="group">Select Group:</label>
                    <Select
                        id="group"
                        value={selectedGroup}
                        options={groups}
                        onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                        isSearchable
                        isClearable
                    />
                    <label htmlFor="subgroup">Select SubGroup:</label>
                    <Select
                        id="subgroup"
                        value={selectedSubGroup}
                        options={subgroups}
                        onChange={(selectedOption) => setSelectedSubGroup(selectedOption)}
                        isSearchable
                        isClearable
                    />
                    <label htmlFor="programcode">Select ProgramCode:</label>
                    <Select
                        id="programcode"
                        value={selectedProgramCode}
                        options={programscodes}
                        onChange={(selectedOption) => setSelectedProgramCode(selectedOption)}
                        isSearchable
                        isClearable
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="primary" onPress={handleInsertSubject}>
                        Insert Subject
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
