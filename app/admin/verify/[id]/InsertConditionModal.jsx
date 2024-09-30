"use client"

import { useCallback, useEffect, useState, useMemo } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { fetchData, fetchDataObj } from '../../action'
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';
import { Input, Textarea, Switch, Tabs, Tab, Link, Card, CardBody, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction';
import { getAcadyears } from "@/src/util/academicYear";
import { toast } from 'react-toastify';
import { Empty, message } from 'antd';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { Checkbox } from "@nextui-org/checkbox";
import { tableClass } from '@/src/util/ComponentClass'


export default function InsertConditionModal({ isOpen, onClose, verify_id, onDataInserted, group }) {

    const [conditions, setConditions] = useState([]);
    const [conditionSubgroup, setConditionSubgroup] = useState([]);
    const [conditionCategory, setConditionCategory] = useState([]);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [subgroups, setSubgroups] = useState([]);
    const [selectedSubgroup, setSelectedSubgroup] = useState(null);

    const [credit, setCredit] = useState('');
    const [dec, setDec] = useState('');

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

    const fetchCategory = useCallback(async (verifyId) => {
        // console.log(verifyId);
        try {
            const url = `/api/condition/category/${verifyId}`;
            const option = await getOptions(url, "GET");
            try {
                const res = await axios(option);
                // console.log(res);
                const filterConditions = res.data.data;
                setConditionCategory(filterConditions);
            } catch (error) {
                setConditionCategory([]);
                return;
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, []);

    console.log(conditionCategory);


    const fetchConditions = useCallback(async (verifyId) => {
        // console.log(verifyId);
        try {
            const url = `/api/condition/${verifyId}`;
            const option = await getOptions(url, "GET");
            try {
                const res = await axios(option);
                // console.log(res);
                const filterConditions = res.data.data;
                setConditions(filterConditions);
            } catch (error) {
                setConditions([]);
                return;
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, []);

    const fetchConditionSubgroups = useCallback(async (verifyId) => {
        // console.log(verifyId);
        try {
            const url = `/api/condition/subgroup/${verifyId}`;
            const option = await getOptions(url, "GET");
            try {
                const res = await axios(option);
                // console.log(res);
                const filterConditions = res.data.data;
                setConditionSubgroup(filterConditions);
            } catch (error) {
                setConditionSubgroup([]);
                return;
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, []);

    const fetchCategories = async () => {
        try {
            const URLProgram = `/api/categories`;
            const options = await getOptions(URLProgram, "GET");
            const responses = await axios(options);
            const result = responses.data.data;

            const categoriesOptions = result.map(category => ({
                value: category.id,
                label: category.category_title,
            }));

            // console.log(categoriesOptions);
            setCategories(categoriesOptions);
            // setDefaultCategories(categoriesOptions);

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategoryChange = async selectedOption => {
        setSelectedCategory(selectedOption);
        setSelectedGroup(null);
        setSelectedSubgroup(null);

        try {
            const URL = `/api/categories/${selectedOption?.value}/groups`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const result = response.data.data;

            const groupsOptions = result.map(group => ({
                value: group.id,
                label: group.group_title,
                Group: group
            }));
            setGroups(groupsOptions);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleGroupChange = async selectedOption => {
        setSelectedGroup(selectedOption);
        setSelectedSubgroup(null);

        try {
            const URL = `/api/groups/${selectedOption?.value}/subgroups`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const result = response.data.data;

            const subgroupsOptions = result.map(subgroup => ({
                value: subgroup.id,
                label: subgroup.sub_group_title,
            }));
            setSubgroups(subgroupsOptions);
        } catch (error) {
            console.error('Error fetching subgroups:', error);
        }
    };

    const handleSubGroupChange = async selectedOption => {
        setSelectedSubgroup(selectedOption);
    };

    useEffect(() => {
        fetchCategories()
        if (verify_id) fetchConditions(verify_id);
        if (verify_id) fetchConditionSubgroups(verify_id);
        if (verify_id) fetchCategory(verify_id);
    }, [verify_id, fetchConditions, fetchConditionSubgroups, fetchCategory]);

    useEffect(() => {
        if (isOpen) {
            setSelectedGroup(null);
            setSelectedSubgroup(null);
            setSelectedCategory(null);
            setCredit("");
            setDec("");
        }
    }, [isOpen]);

    const handleSubmit = useCallback(async function () {
        try {

            if (!selectedCategory) {
                showToastMessage(false, "โปรดเลือกหมวดหมู่วิชา");
                return;
            }

            if (!credit.trim()) {
                showToastMessage(false, "โปรดกรอกหน่วยกิตอย่างน้อย");
                return;
            }

            let formData;
            let url = "/api/condition/category/:verify_id";

            if (selectedSubgroup) {
                formData = {
                    verify_id: verify_id,
                    credit: credit,
                    dec: dec,
                    sub_group_id: selectedSubgroup.value
                };
            } else if (selectedGroup) {
                formData = {
                    verify_id: verify_id,
                    credit: credit,
                    dec: dec,
                    group_id: selectedGroup.value
                }
            } else {
                formData = {
                    verify_id: verify_id,
                    credit: credit,
                    dec: dec,
                    category_id: selectedCategory.value
                }
            }


            if (selectedSubgroup) {
                url = "/api/condition/subgroup/:verify_id";
                formData.verify_id = verify_id;
                formData.credit = credit;
                formData.dec = dec;
                formData.sub_group_id = selectedSubgroup.value;
            } else if (selectedGroup) {
                url = "/api/condition/group/:verify_id";
                formData.verify_id = verify_id;
                formData.credit = credit;
                formData.dec = dec;
                formData.group_id = selectedGroup.value;
            } else {
                formData.verify_id = verify_id;
                formData.credit = credit;
                formData.dec = dec;
                formData.category_id = selectedCategory.value;
            }

            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message } = result.data;

            showToastMessage(ok, message);

            fetchConditions(verify_id);
            fetchConditionSubgroups(verify_id);
            fetchCategory(verify_id);

            setSelectedGroup(null);
            setSelectedCategory(null);
            setSelectedSubgroup(null);
            setCredit("")
            setDec("")
        } catch (error) {
            const message = error?.response?.data?.message;
            showToastMessage(false, message);
        }
    }, [selectedGroup, selectedSubgroup, selectedCategory, dec, credit]);

    ////////////////////////////////////////////////////////////////////////////////////

    const delCondition = async (gs) => {
        try {
            const url = `/api/condition/group/${gs}`;
            const options = await getOptions(url, 'DELETE');
            const result = await axios(options);
            const { ok, message } = result.data;

            showToastMessage(ok, message);
            fetchConditions(verify_id);
        } catch (error) {
            const message = error?.response?.data?.message || "An error occurred";
            showToastMessage(false, message);
        }
    };

    const delConditionSubgroup = async (gs) => {
        // console.log(`Deleting GroupSubject with id: ${gs}`);
        try {
            const url = `/api/condition/subgroup/${gs}`;
            const options = await getOptions(url, 'DELETE');
            const result = await axios(options);
            const { ok, message } = result.data;

            showToastMessage(ok, message);
            fetchConditionSubgroups(verify_id);
        } catch (error) {
            const message = error?.response?.data?.message || "An error occurred";
            showToastMessage(false, message);
        }
    };

    const delConditionCategory = async (gs) => {
        // console.log(`Deleting GroupSubject with id: ${gs}`);
        try {
            const url = `/api/condition/category/${gs}`;
            const options = await getOptions(url, 'DELETE');
            const result = await axios(options);
            const { ok, message } = result.data;

            showToastMessage(ok, message);
            fetchCategory(verify_id);
        } catch (error) {
            const message = error?.response?.data?.message || "An error occurred";
            showToastMessage(false, message);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////

    return (
        <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="5xl"
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
                            <h2>เพิ่มเงื่อนไขแบบฟอร์มตรวจสอบจบ</h2>
                            <span className='text-base font-normal'>เงื่อนไขแบบฟอร์มตรวจสอบจบ</span>
                        </ModalHeader>
                        <ModalBody>

                            <div className='grid grid-cols-4 gap-6 max-sm:grid-cols-4'>
                                <ul className='col-span-2 h-[210px] overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                    <p className='py-1'>เงื่อนไขหมวดหมู่วิชา</p>
                                    {conditionCategory.length > 0 ?
                                        conditionCategory.map((sbj, index) => (
                                            <li key={index} className='bg-gray-100 rounded-md p-1 gap-2 border-1 border-b-gray-300'>
                                                <div className='flex flex-row justify-between'>
                                                    <div className='bg-gray-100 focus:outline-none font-bold'>
                                                        {sbj.Categorie.category_title}
                                                    </div>
                                                    <div>
                                                        <IoIosCloseCircle onClick={() => delConditionCategory(sbj.id)} className="w-5 h-5 cursor-pointer active:scale-95 hover:opacity-75" />
                                                    </div>
                                                </div>
                                                <p className='flex flex-row justify-between text-sm mt-3'>
                                                    <span>หน่วยกิตอย่างน้อย {sbj.credit}</span>
                                                    <span>{sbj.dec ? sbj.dec : "ไม่มีข้อมูล"}</span>
                                                </p>
                                            </li>
                                        ))
                                        :
                                        <>
                                            <Empty
                                                description={"ไม่มีเงื่อนไขหมวดหมู่วิชา"}
                                            />
                                        </>
                                    }
                                </ul>

                                <ul className='col-span-2 h-[210px] overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                    <p className='py-1'>เงื่อนไขกลุ่มวิชา</p>
                                    {conditions.length > 0 ?
                                        conditions.map((sbj, index) => (
                                            <li key={index} className='bg-gray-100 rounded-md p-1 gap-2 border-1 border-b-gray-300'>
                                                <div className='flex flex-row justify-between'>
                                                    <div className='bg-gray-100 focus:outline-none font-bold'>
                                                        {sbj.Group.group_title}
                                                    </div>
                                                    <div>
                                                        <IoIosCloseCircle onClick={() => delCondition(sbj.id)} className="w-5 h-5 cursor-pointer active:scale-95 hover:opacity-75" />
                                                    </div>
                                                </div>
                                                <p className='flex flex-row justify-between text-sm mt-3'>
                                                    <span>หน่วยกิตอย่างน้อย {sbj.credit}</span>
                                                    <span>{sbj.dec ? sbj.dec : "ไม่มีข้อมูล"}</span>
                                                </p>
                                            </li>
                                        ))
                                        :
                                        <>
                                            <Empty
                                                description={"ไม่มีเงื่อนไขกลุ่มวิชา"}
                                            />
                                        </>
                                    }
                                </ul>

                                <ul className='col-span-2 h-full overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                    <p className='py-1'>เงื่อนไขกลุ่มย่อยวิชา</p>
                                    {conditionSubgroup.length > 0 ?
                                        conditionSubgroup.map((sbj, index) => (
                                            <li key={index} className='bg-gray-100 rounded-md  p-1 gap-2 border-1 border-b-gray-300'>
                                                <div className='flex flex-row justify-between'>
                                                    <div className='bg-gray-100 focus:outline-none font-bold'>
                                                        {sbj.SubGroup.sub_group_title}
                                                    </div>
                                                    <div>
                                                        <IoIosCloseCircle onClick={() => delConditionSubgroup(sbj.id)} className=" w-5 h-5 cursor-pointer active:scale-95 hover:opacity-75" />
                                                    </div>
                                                </div>
                                                <p className='flex flex-row justify-between text-sm mt-3'>
                                                    <span>หน่วยกิตอย่างน้อย {sbj.credit}</span>
                                                    <span>{sbj.dec ? sbj.dec : "ไม่มีข้อมูล"}</span>
                                                </p>
                                            </li>
                                        ))
                                        :
                                        <>
                                            <Empty
                                                description={"ไม่มีเงื่อนไขกลุ่มย่อยวิชา"}
                                                className='my-auto pb-3'
                                            />
                                        </>

                                    }
                                </ul>
                                <div className='col-span-2'>
                                    <div className='col-span-4'>
                                        <label htmlFor="categories" className='pb-1'>หมวดหมู่วิชา</label>
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
                                    {selectedCategory && groups.length > 0 && (
                                        <>
                                            <div className='col-span-4 my-4'>
                                                <label htmlFor="group" className='pb-1'>กลุ่มวิชา</label>
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
                                            {selectedGroup && subgroups.length > 0 && (
                                                <>
                                                    <div className='col-span-4'>
                                                        <label htmlFor="subgroup" className='pb-1'>กลุ่มรองวิชา</label>
                                                        <Select
                                                            className='z-30'
                                                            value={selectedSubgroup}
                                                            options={subgroups}
                                                            onChange={handleSubGroupChange}
                                                            isSearchable
                                                            placeholder="เลือกกลุ่มรองวิชา"
                                                            isClearable
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                    <Input
                                        className='col-span-4 py-5'
                                        type="number"
                                        radius='sm'
                                        variant="bordered"
                                        label="หน่วยกิตที่กำหนดเป็นอย่างน้อย"
                                        labelPlacement="outside"
                                        placeholder="กรอกหน่วยกิต"
                                        value={credit}
                                        onChange={(e) => setCredit(e.target.value)}
                                    />
                                    <Input
                                        className='col-span-4 mt-1'
                                        type="text"
                                        radius='sm'
                                        variant="bordered"
                                        label="คำอธิบาย"
                                        labelPlacement="outside"
                                        placeholder="กรอกคำอธิบาย"
                                        value={dec}
                                        onChange={(e) => setDec(e.target.value)}
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button type='submit' onClick={() => handleSubmit()} className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid'>
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </div>
                )}
            </ModalContent>
        </Modal>
    )
}