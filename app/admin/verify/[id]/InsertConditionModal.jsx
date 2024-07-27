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
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);

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

    useEffect(() => {
        if (verify_id) fetchConditions(verify_id);
        if (verify_id) fetchConditionSubgroups(verify_id);
    }, [verify_id, fetchConditions, fetchConditionSubgroups]);

    // console.log(conditionSubgroup);
    useEffect(() => {
        const page = group.map(groups => ({
            value: groups.id,
            label: groups.group_title,
            subgroup: groups.sub_group_titles || []
        }));
        setGroups(page);
    }, [group]);

    useEffect(() => {
        if (selectedGroup) {
            const groupData = groups.find(g => g.value === selectedGroup.value);
            if (groupData) {
                setSubgroups(groupData.subgroup || []);
            }
        } else {
            setSubgroups([]);
        }
    }, [selectedGroup, groups]);

    useEffect(() => {
        if (isOpen) {
            setSelectedGroup(null);
            setSelectedSubgroup(null);
            setCredit("");
            setDec("");
        }
    }, [isOpen]);

    const handleSubmit = useCallback(async function () {
        try {

            if (!selectedGroup) {
                showToastMessage(false, "โปรดเลือกกลุ่มวิชา");
                return;
            }

            if (!credit.trim()) {
                showToastMessage(false, "โปรดกรอกหน่วยกิตอย่างน้อย");
                return;
            }

            let formData;
            let url = "/api/condition/group/:verify_id";

            if (selectedSubgroup) {
                formData = {
                    verify_id: verify_id,
                    credit: credit,
                    dec: dec,
                    sub_group_id: selectedSubgroup.value
                };
            } else {
                formData = {
                    verify_id: verify_id,
                    credit: credit,
                    dec: dec,
                    group_id: selectedGroup.value
                };
            }


            if (selectedSubgroup) {
                url = "/api/condition/subgroup/:verify_id";
                formData.verify_id = verify_id;
                formData.credit = credit;
                formData.dec = dec;
                formData.sub_group_id = selectedSubgroup.value;
            } else {
                formData.verify_id = verify_id;
                formData.credit = credit;
                formData.dec = dec;
                formData.group_id = selectedGroup.value;
            }

            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message } = result.data;

            showToastMessage(ok, message);

            fetchConditions(verify_id);
            fetchConditionSubgroups(verify_id);
            // onDataInserted();
            setSelectedGroup(null);
            setSelectedSubgroup(null);
            setCredit("")
            setDec("")
        } catch (error) {
            const message = error?.response?.data?.message;
            showToastMessage(false, message);
        }
    }, [selectedGroup, selectedSubgroup, dec, credit]);

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
                            <div className='grid grid-cols-3 gap-6 max-md:grid-cols-1'>
                                <ul className='col-span-1 h-full overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                    <p className='py-1'>เงื่อนไขกลุ่มวิชา</p>
                                    {conditions.length > 0 ?
                                        conditions.map((sbj, index) => (
                                            <li key={index} className='bg-gray-100 rounded-md relative p-1 gap-2 border-1 border-b-gray-300'>
                                                <input
                                                    readOnly
                                                    className='bg-gray-100 block focus:outline-none font-bold'
                                                    type="text"
                                                    value={sbj.Group.group_title} />
                                                <p className='flex flex-row justify-between text-sm mt-3'>
                                                    <span>หน่วยกิตอย่างน้อย {sbj.credit}</span>
                                                    <span>{sbj.dec ? sbj.dec : "ไม่มีข้อมูล"}</span>
                                                </p>
                                                <IoIosCloseCircle onClick={() => delCondition(sbj.id)} className="absolute top-1 right-1 w-5 h-5 cursor-pointer active:scale-95 hover:opacity-75" />
                                            </li>

                                        ))
                                        :
                                        <li className='flex justify-center items-center h-full'>
                                            <Empty />
                                        </li>
                                    }
                                </ul>

                                <ul className='col-span-1 h-full overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                    <p className='py-1'>เงื่อนไขกลุ่มย่อยวิชา</p>
                                    {conditionSubgroup.length > 0 ?
                                        conditionSubgroup.map((sbj, index) => (
                                            <li key={index} className='bg-gray-100 rounded-md relative p-1 gap-2 border-1 border-b-gray-300'>
                                                <input
                                                    readOnly
                                                    className='bg-gray-100 block focus:outline-none font-bold'
                                                    type="text"
                                                    value={sbj.SubGroup.sub_group_title} />
                                                <p className='flex flex-row justify-between text-sm mt-3'>
                                                    <span>หน่วยกิตอย่างน้อย {sbj.credit}</span>
                                                    <span>{sbj.dec ? sbj.dec : "ไม่มีข้อมูล"}</span>
                                                </p>
                                                <IoIosCloseCircle onClick={() => delConditionSubgroup(sbj.id)} className="absolute top-1 right-1 w-5 h-5 cursor-pointer active:scale-95 hover:opacity-75" />
                                            </li>

                                        ))
                                        :
                                        <li className='flex justify-center items-center h-full'>
                                            <Empty />
                                        </li>
                                    }
                                </ul>
                                <div className='col-span-1'>
                                    <label htmlFor="category" className='text-sm'>เลือกกลุ่มวิชา</label>
                                    <Select
                                        className="z-50 mt-2 mb-3"
                                        id="group"
                                        value={selectedGroup}
                                        options={groups}
                                        onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                                        isSearchable
                                        isClearable
                                    />
                                    {subgroups.length > 0 && (
                                        <>
                                            <label htmlFor="subgroup" className='text-sm'>เลือกหมวดหมู่ย่อย</label>
                                            <Select
                                                className="z-40 mt-2"
                                                id="subgroup"
                                                value={selectedSubgroup}
                                                options={subgroups}
                                                onChange={(selectedOption) => setSelectedSubgroup(selectedOption)}
                                                isSearchable
                                                isClearable
                                            />
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