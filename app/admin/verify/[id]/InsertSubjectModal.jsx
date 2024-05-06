"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { fetchData, fetchDataObj } from '../../action'
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';
import { Input, Textarea } from "@nextui-org/react";
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction';
import { getAcadyears } from "@/src/util/academicYear";
import { toast } from 'react-toastify';


export default function InsertSubjectModal({ isOpen, onClose, onDataInserted,verify_id }) {
    const [subjects, setSubjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [subgroups, setSubgroups] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedSubgroup, setSelectedSubgroup] = useState(null);

    const showToastMessage = useCallback((ok, message) => {
        toast[ok ? 'success' : 'warning'](message, {
            position: toast.POSITION.TOP_RIGHT,
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await fetchDataObj(`/api/categories`);

                const categoriesOptions = result.map(category => ({
                    value: category.id,
                    label: category.category_title,
                }));

                setCategories(categoriesOptions);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        const fetchSubjects = async () => {
            try {
                const result = await fetchDataObj(`/api/subjects`);

                const subjectsOptions = result.map(subject => ({
                    value: subject.subject_id,
                    label: subject.subject_code + " " + subject.title_th,
                }));

                setSubjects(subjectsOptions);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchSubjects();
        fetchCategories();
    }, []);

    const handleCategoryChange = async selectedOption => {
        setSelectedCategory(selectedOption);
        setSelectedGroup(null);
        setSelectedSubgroup(null);

        try {
            const result = await fetchDataObj(`/api/categories/${selectedOption?.value}/groups`);
            const groupsOptions = result.map(group => ({
                value: group.id,
                label: group.group_title,
                Group: group
            }));
            setGroups(groupsOptions);
            console.log(groupsOptions);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleGroupChange = async selectedOption => {
        setSelectedGroup(selectedOption);
        setSelectedSubgroup(null);

        try {
            const result = await fetchDataObj(`/api/groups/${selectedOption?.value}/subgroups`);
            const subgroupsOptions = result.map(subgroup => ({
                value: subgroup.id,
                label: subgroup.sub_group_title,
            }));
            setSubgroups(subgroupsOptions);
            console.log(subgroupsOptions);
        } catch (error) {
            console.error('Error fetching subgroups:', error);
        }
    };


    const handleSubgroupChange = selectedOption => {
        setSelectedSubgroup(selectedOption);
    };

    useEffect(() => {
        if (isOpen) {
            setSelectedCategory(null);
            setSelectedGroup(null);
            setSelectedSubgroup(null);
            setSelectedSubject(null);
        }
    }, [isOpen]);

    // console.log('selectedSubject:', selectedSubject);
    // console.log('selectedCategory:', selectedCategory);
    // console.log('selectedGroup:', selectedGroup);
    // console.log('selectedSubgroup:', selectedSubgroup);

    const handleSubmit = useCallback(async function (formData) {
        try {
            let url = "/api/verify/group";

            if (selectedSubgroup) {
                url = "/api/verify/subgroup";
                formData.verify_id = verify_id;
                formData.sub_group_id = selectedSubgroup.value;
            } else {
                formData.verify_id = verify_id;
                formData.group_id = selectedGroup.value;
            }

            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message } = result.data;

            onDataInserted();
            showToastMessage(ok, message);
        } catch (error) {
            const message = error?.response?.data?.message;
            showToastMessage(false, message);
        }
    }, [selectedGroup, selectedSubgroup]);

    const createForm = useCallback(function (e) {
        e.preventDefault();

        let formData;
        if (selectedSubgroup) {
            formData = {
                verify_id: verify_id,
                subject_id: selectedSubject.value,
                sub_group_id: selectedSubgroup.value
            };
        } else {
            formData = {
                verify_id: verify_id,
                subject_id: selectedSubject.value,
                group_id: selectedGroup.value
            };
        }

        handleSubmit(formData);
    }, [selectedSubject, selectedGroup, selectedSubgroup]);

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="lg"
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                body: "py-6",
                backdrop: "bg-[#292f46]/50 backdrop-opacity-10",
                base: "border-gray-300",
                header: "border-b-[1.5px] border-gray-300",
                footer: "border-t-[1.5px] border-gray-300",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}>
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={createForm}>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2>เพิ่มแบบฟอร์มตรวจสอบจบ</h2>
                            <span className='text-base font-normal'>แบบฟอร์มตรวจสอบจบ</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className='grid grid-cols-4 gap-4'>
                                <div className='col-span-4'>
                                    <label htmlFor="group">หมวดหมู่วิชา</label>
                                    <Select
                                        className='z-50 active:outline-black'
                                        value={selectedCategory}
                                        options={categories}
                                        onChange={handleCategoryChange}
                                        isSearchable
                                        placeholder="เลือกหมวดหมู่วิชา"
                                        isClearable
                                    />
                                </div>
                                {selectedCategory && (
                                    <>
                                        <div className='col-span-4'>
                                            <label htmlFor="group">กลุ่มวิชา</label>
                                            <Select
                                                value={selectedGroup}
                                                className='z-40'
                                                options={groups}
                                                onChange={handleGroupChange}
                                                isSearchable
                                                placeholder="เลือกกลุ่มวิชา"
                                                isClearable
                                            />
                                        </div>
                                        {selectedGroup && (
                                            <div className='col-span-4'>
                                                <label htmlFor="subgroup">กลุ่มรองวิชา</label>
                                                <Select
                                                    className='z-30'
                                                    value={selectedSubgroup}
                                                    options={subgroups}
                                                    onChange={handleSubgroupChange}
                                                    isSearchable
                                                    placeholder="เลือกกลุ่มรองวิชา"
                                                    isClearable
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className='col-span-4'>
                                    <label htmlFor="acadyear">วิชา</label>
                                    <Select
                                        className='z-20'
                                        value={selectedSubject}
                                        options={subjects}
                                        placeholder="เลือกวิชา"
                                        onChange={(selectedOption) => {
                                            setSelectedSubject(selectedOption);
                                        }}
                                        isSearchable
                                        isClearable
                                    />
                                </div>
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button type='submit' className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid'>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    )
}

