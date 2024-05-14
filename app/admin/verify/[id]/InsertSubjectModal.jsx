"use client"

import { useCallback, useEffect, useState, useMemo } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { fetchData, fetchDataObj } from '../../action'
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';
import { Input, Textarea } from "@nextui-org/react";
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction';
import { getAcadyears } from "@/src/util/academicYear";
import { toast } from 'react-toastify';
import { Empty, message } from 'antd';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";


export default function InsertSubjectModal({ isOpen, onClose, onDataInserted, verify_id }) {
    const [subjects, setSubjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [subgroups, setSubgroups] = useState([]);
    // const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedSubgroup, setSelectedSubgroup] = useState(null);

    const [searchSubj, setSearchSubj] = useState("")
    const [verifySubj, setVerifySubj] = useState([])
    const [filterSubj, setFilterSubj] = useState([])

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
                // const result = await fetchDataObj(`/api/subjects`);

                // const subjectsOptions = result.map(subject => ({
                //     value: subject.subject_id,
                //     label: subject.subject_code + " " + subject.title_th,
                // }));

                // setSubjects(subjectsOptions);
                const url = `/api/subjects`
                const option = await getOptions(url, "GET")
                try {
                    const res = await axios(option)
                    const filterSubjects = res.data.data
                    setSubjects(filterSubjects)
                } catch (error) {
                    setSubjects([])
                    return
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchSubjects();
        fetchCategories();
    }, []);

    useEffect(() => setFilterSubj(subjects), [subjects])

    useEffect(() => {
        if (searchSubj) {
            const data = subjects.filter(e => {
                if (e.subject_code?.toLowerCase()?.includes(searchSubj.toLowerCase()) ||
                    e.title_en?.toLowerCase()?.includes(searchSubj.toLowerCase()) ||
                    e.title_th?.toLowerCase()?.includes(searchSubj.toLowerCase())) {
                    return e
                }
            })
            setFilterSubj(data)
            return
        }
        setFilterSubj(subjects)
    }, [searchSubj])

    const addSubj = useCallback(function (subj) {
        setVerifySubj((prevState) => {
            const data = [...prevState];
            let status = false
            for (const e of data) {
                if (e[subj.subject_code] === subj.subject_code) {
                    status = true
                    break
                }
            }
            if (!status) {
                let result = {
                    subject_id: subj.subject_id,
                    subject_code: subj.subject_code,
                    title_th: subj.title_th,
                    title_en: subj.title_en
                }
                data.push(result)
            }
            return data
        })
    }, [])

    // useEffect(() => setDisabledInsertBtn(verifySubj.length == 0), [verifySubj])

    const delSubj = useCallback(function (subject_code) {
        const data = verifySubj.filter(element => element.subject_code !== subject_code)
        setVerifySubj(data)
    }, [verifySubj])

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
            // setSelectedSubject(null);
        }
    }, [isOpen]);

    const handleSubmit = useCallback(async function (verifySubj) {
        try {

            const subData = verifySubj.map(subject => subject.subject_id)

            if (subData.length === 0) {
                showToastMessage(false, 'โปรดเลือกวิชา');
                return;
            }

            if (!selectedGroup) {
                showToastMessage(false, 'โปรดเลือกกลุ่มวิชา');
                return;
            }

            let formData;
            if (selectedSubgroup) {
                formData = {
                    verify_id: verify_id,
                    subjects: subData,
                    sub_group_id: selectedSubgroup.value
                };
            } else {
                formData = {
                    verify_id: verify_id,
                    subjects: subData,
                    group_id: selectedGroup.value
                };
            }

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

            setVerifySubj([])
            onClose()
            onDataInserted();
            showToastMessage(ok, message);
        } catch (error) {
            const message = error?.response?.data?.message;
            showToastMessage(false, message);
        }
    }, [selectedGroup, selectedSubgroup]);

    // const createForm = useCallback(function (e ,verifySubj) {
    //     e.preventDefault();

    //     if (!selectedGroup) {
    //         showToastMessage(false, 'โปรดเลือกกลุ่มวิชา');
    //         return;
    //     }

    //     const subData = verifySubj.map(subject => subject.subject_id)
    //     let formData;
    //     if (selectedSubgroup) {
    //         formData = {
    //             verify_id: verify_id,
    //             subjects: subData,
    //             sub_group_id: selectedSubgroup.value
    //         };
    //     } else {
    //         formData = {
    //             verify_id: verify_id,
    //             subjects: subData,
    //             group_id: selectedGroup.value
    //         };
    //     }
    //     console.log(formData);

    //     handleSubmit(formData);
    // }, [ selectedGroup, selectedSubgroup]);

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="2xl"
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
                    <div>
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
                                {/* <div className='col-span-4'>
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
                                </div> */}
                            </div>
                            <div className='flex flex-row gap-3'>
                                <div className='w-1/2 flex flex-col'>
                                    <p>วิชาที่ต้องการจะเพิ่ม {verifySubj.length == 0 ? undefined : <>({verifySubj.length} วิชา)</>}</p>
                                    <ul className='h-[210px] overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                        {verifySubj.length > 0 ?
                                            verifySubj.map((sbj, index) => (
                                                <li key={index} className='bg-gray-100 rounded-md relative p-1 gap-2 border-1 border-b-gray-300'>
                                                    <input
                                                        readOnly
                                                        className='bg-gray-100 block focus:outline-none font-bold'
                                                        type="text"
                                                        name="verifySubj[]"
                                                        value={sbj.subject_code} />
                                                    <p className='flex flex-col text-sm'>
                                                        <span>{sbj.title_th}</span>
                                                    </p>
                                                    <IoIosCloseCircle onClick={() => delSubj(sbj.subject_code)} className="absolute top-1 right-1 w-5 h-5 cursor-pointer active:scale-95 hover:opacity-75" />
                                                </li>
                                            ))
                                            :
                                            <li className='flex justify-center items-center h-full'>
                                                <Empty />
                                            </li>}
                                    </ul>
                                </div>
                                <div className='w-1/2'>
                                    <p>ค้นหาวิชาที่ต้องการ</p>
                                    <div className='flex flex-col'>
                                        <div className='flex flex-row relative'>
                                            <IoSearchOutline className='absolute left-3.5 top-[25%]' />
                                            <input
                                                className='ps-10 py-1 rounded-md border-1 w-full px-2 focus:outline-none mb-1 focus:border-blue-500'
                                                type="search"
                                                value={searchSubj}
                                                onChange={(e) => setSearchSubj(e.target.value)}
                                                placeholder='รหัสวิชา ชื่อวิชา' />
                                        </div>
                                        <ul className='rounded-md border-1 h-[180px] overflow-y-auto p-2 flex flex-col gap-1'>
                                            {filterSubj.map((subject, index) => (
                                                !(verifySubj.map(z => z.subject_code).includes(subject.subject_code)) &&
                                                <li onClick={() => addSubj(subject)} key={index} className='bg-gray-100 rounded-md flex flex-row gap-2 p-1 border-1 border-b-gray-300 cursor-pointer'>
                                                    <strong className='block'>{subject.subject_code}</strong>
                                                    <p className='flex flex-col text-sm'>
                                                        <span>{subject.title_en}</span>
                                                        <span>{subject.title_th}</span>
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button type='submit' onClick={() => handleSubmit(verifySubj)} className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid'>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </div>
                )}
            </ModalContent>
        </Modal>
    )
}

