"use client"

import { useCallback, useEffect, useState, useMemo } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { fetchData, fetchDataObj } from '../action'
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';
import { Input, Textarea, Switch } from "@nextui-org/react";
import { getAcadyears } from "@/src/util/academicYear";
import { toast } from 'react-toastify';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { Checkbox } from "@nextui-org/checkbox";

import { Empty, message } from 'antd';
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'

export default function InsertSemi({ isOpen, onClose, onDataInserted }) {
    const [subgroups, setSubgroups] = useState([]);
    const [selectedSubgroup, setSelectedSubgroup] = useState(null);
    const [semisubGroupTitle, setSemiSubGroupTitle] = useState('');

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
        const fetchSub = async () => {
            try {
                const URL = `/api/subgroups`;
                const option = await getOptions(URL, "GET");
                const response = await axios(option);
                const sg = response.data.data;

                const sub = sg.map(category => ({
                    value: category.id,
                    label: category.sub_group_title,
                }));

                // console.log(categoriesOptions);
                setSubgroups(sub);

            } catch (error) {
                console.error('Error fetching Sub:', error);
            }
        };
        fetchSub();
    }, [])

    useEffect(() => {
        if (isOpen) {
            setSemiSubGroupTitle('');
            setSelectedSubgroup(null);
        }
    }, [isOpen]);

    const handleSubmit = useCallback(async function (formData) {
        try {
            const url = "/api/semisubgroups";
            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message } = result.data;

            onDataInserted();
            showToastMessage(ok, message);
        } catch (error) {
            const message = error?.response?.data?.message;
            showToastMessage(false, message);
        }
    }, []);

    const checkDuplicateSemi = async (title) => {
        try {
            const URL = `/api/semisubgroups/checkDuplicate/${title}`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking duplicate semi:', error);
            throw error;
        }
    };

    const createForm = useCallback(async function (e) {
        e.preventDefault();


        if (!semisubGroupTitle.trim()) {
            showToastMessage(false, "กลุ่มรองวิชาต้องไม่เป็นค่าว่าง");
            return;
        }

        if (!selectedSubgroup) {
            showToastMessage(false, "โปรดเลือกกลุ่มย่อยวิชา");
            return;
        }

        const isDuplicate = await checkDuplicateSemi(semisubGroupTitle);
        if (isDuplicate) {
            showToastMessage(false, 'กลุ่มรองวิชานี้มีอยู่แล้ว');
            return;
        }

        const formData = {
            semi_sub_group_title: semisubGroupTitle,
            sub_group_id: selectedSubgroup.value,
        }
        handleSubmit(formData);
    }, [
        semisubGroupTitle,
        selectedSubgroup,
    ]);

    return (
        <>
            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                size="md"
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
                                <h2>เพิ่มกลุ่มรองวิชา</h2>
                                <span className='text-base font-normal'>แบบฟอร์มเพิ่มกลุ่มรองวิชา</span>
                            </ModalHeader>
                            <ModalBody>
                                <label htmlFor="group">กลุ่มย่อยวิชา</label>
                                <Select
                                    className='z-50'
                                    id="group"
                                    value={selectedSubgroup}
                                    options={subgroups}
                                    onChange={(selectedOption) => setSelectedSubgroup(selectedOption)}
                                    isSearchable
                                    placeholder='เลือกกลุ่มย่อยวิชา'
                                    isClearable
                                />
                                <Input
                                    className='col-span-4 mt-1'
                                    type="text"
                                    radius='sm'
                                    variant="bordered"
                                    label="กลุ่มรองวิชา"
                                    labelPlacement="outside"
                                    placeholder="กรอกกลุ่มรองวิชาวิชา"
                                    value={semisubGroupTitle}
                                    onChange={(e) => setSemiSubGroupTitle(e.target.value)}
                                />
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
        </>
    )
}