"use client"

// SubjectUpdate.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { hostname } from '@/app/api/hostname';

export default function SubjectUpdate({ isOpen, onClose, onUpdate, subjectId }) {
    const [semester, setSemester] = useState('');
    const [subject_code, setSubjectCode] = useState('');
    const [title_th, setNewTitleTH] = useState('');
    const [title_en, setNewTitleEN] = useState('');
    const [information, setInformation] = useState('');
    const [cradit, setCradit] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedSubGroup, setSelectedSubGroup] = useState(null);
    const [subgroups, setSupGroups] = useState([]);
    const [selectedProgramCode, setSelectedProgramCode] = useState(null);
    const [programcodes, setProgramCode] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the subject details
                const subjectResult = await axios.get(`${hostname}/api/subjects/${subjectId}`);
                const subjectData = subjectResult.data.data;
                console.log(subjectData);

                setSemester(subjectData.semester);
                setSubjectCode(subjectData.subject_code);
                setNewTitleTH(subjectData.title_th);
                setNewTitleEN(subjectData.title_en);
                setInformation(subjectData.information);
                setCradit(subjectData.cradit);

                // Fetch the list of groups
                const groupResult = await axios.get(`${hostname}/api/groups`);
                const groups = groupResult.data.data;

                const subgroupResult = await axios.get(`${hostname}/api/subgroups`);
                const subgroups = subgroupResult.data.data;

                const programcodeResult = await axios.get(`${hostname}/api/programcodes`);
                const programcodes = programcodeResult.data.data;
                // Map groups for react-select
                const optionsGroups = groups.map((group) => ({
                    value: group.id,
                    label: group.group_title
                }));
                setGroups(optionsGroups);
                const selectedGroup = optionsGroups.find(option => option.value === subjectData.group_id);
                setSelectedGroup(selectedGroup);


                const optionsSubGroups = subgroups.map((subgroup) => ({
                    value: subgroup.id,
                    label: subgroup.sub_group_title
                }));
                setSupGroups(optionsSubGroups);
                const selectedSupGroup = optionsSubGroups.find(option => option.value === subjectData.sub_group_id);
                setSelectedSubGroup(selectedSupGroup);

                // Corrected variable names
                const optionsProgramCodes = programcodes.map((programcode) => ({
                    value: programcode.id,
                    label: programcode.program_title
                }));
                setProgramCode(optionsProgramCodes);
                const selectedProgramCode = optionsProgramCodes.find(option => option.value === subjectData.program_code_id);
                setSelectedProgramCode(selectedProgramCode);

            } catch (error) {
                console.error('Error fetching subject details:', error);
            }
        };

        fetchData();
    }, [subjectId]);

    const handleUpdateSubject = async () => {
        try {
            await axios.post(`${hostname}/api/subjects/updateSubject/${subjectId}`, {
                semester: semester ? semester : null,
                subject_code: subject_code ? subject_code : null,
                title_th: title_th ? title_th : null,
                title_en: title_en ? title_en : null,
                information: information ? information : null,
                cradit: cradit ? cradit : null,
                sub_group_id: selectedSubGroup ? selectedSubGroup.value : null,
                group_id: selectedGroup ? selectedGroup.value : null,
                program_code_id: selectedProgramCode ? selectedProgramCode.value : null,
            });

            // Notify the parent component that data has been updated
            onUpdate();

            // Close the modal after updating
            onClose();
        } catch (error) {
            console.error('Error updating subject:', error);
            // Handle error if needed
        }
    };

    return (
        <Modal size="sm" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Update Subject</ModalHeader>
                <ModalBody>
                    <label htmlFor="semester">New Subject semester:</label>
                    <input
                        type="text"
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    />
                    <label htmlFor="subject_code">New Subject subject_code:</label>
                    <input
                        type="text"
                        id="subject_code"
                        value={subject_code}
                        onChange={(e) => setSubjectCode(e.target.value)}
                    />
                    <label htmlFor="title_th">New Subject title_th:</label>
                    <input
                        type="text"
                        id="title_th"
                        value={title_th}
                        onChange={(e) => setNewTitleTH(e.target.value)}
                    />
                    <label htmlFor="title_en">New Subject title_en:</label>
                    <input
                        type="text"
                        id="title_en"
                        value={title_en}
                        onChange={(e) => setNewTitleEN(e.target.value)}
                    />
                    <label htmlFor="information">New Subject information:</label>
                    <input
                        type="text"
                        id="information"
                        value={information}
                        onChange={(e) => setInformation(e.target.value)}
                    />
                    <label htmlFor="cradit">New Subject cradit:</label>
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
                        options={programcodes}
                        onChange={(selectedOption) => setSelectedProgramCode(selectedOption)}
                        isSearchable
                        isClearable
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                    <Button color="primary" onPress={handleUpdateSubject}>
                        Update Subject
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
