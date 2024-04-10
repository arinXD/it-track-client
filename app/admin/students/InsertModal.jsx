"use client"
import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Autocomplete, AutocompleteItem, RadioGroup, Radio } from "@nextui-org/react";
import { getAcadyears } from '@/src/util/academicYear';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { getToken } from '@/app/components/serverAction/TokenAction';

const InsertModal = ({ showToastMessage, getStudents, programs, isOpen, onClose }) => {
    const [stu_id, setStuId] = useState(null)
    const [email, setEmail] = useState(null)
    const [first_name, setFname] = useState(null)
    const [last_name, setLname] = useState(null)
    const [acadyears, setAcadyears] = useState([])
    const [acadyear, setAcadyear] = useState(null);
    const [program, setProgram] = useState(null);
    const [courses_type, setCourseType] = useState(null);
    const [inserting, setInserting] = useState(false)

    const [invalid, setInvalid] = useState({
        stu_id: false,
        email: false,
        first_name: false,
        last_name: false,
        acadyear: false,
        program: false,
        courses_type: false,
    })

    useEffect(() => {
        const acads = getAcadyears();
        const result = acads.map(acad => ({
            acadyear: String(acad)
        }));
        setAcadyears(result)
    }, [])

    function validInput(formData) {
        let bool = true;
        const updatedInvalid = {};
        Object.keys(formData).forEach(key => {
            if (!formData[key]) {
                updatedInvalid[key] = true;
                bool = false;
            } else {
                if (key == "stu_id") {
                    const stuIdRegex = /^\d{9}-\d$/;
                    if (!stuIdRegex.test(formData[key])) {
                        updatedInvalid[key] = true;
                        bool = false;
                    } else {
                        updatedInvalid[key] = false;
                    }
                } else {
                    updatedInvalid[key] = false;
                }
            }
        });
        setInvalid(prev => ({
            ...prev,
            ...updatedInvalid
        }));

        return bool;
    }

    async function insertStudent(event) {
        setInserting(true)
        event.preventDefault()
        const formData = {
            stu_id,
            email,
            first_name,
            last_name,
            acadyear,
            program,
            courses_type,
        }
        if (!validInput(formData)) {
            setInserting(false)
            return
        }

        try {
            const token = await getToken()
            const options = {
                url: `${hostname}/api/students`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'authorization': `${token}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                data: formData
            };

            const res = await axios(options)
            const { ok, message } = res.data
            showToastMessage(ok, message)
            getStudents()
            closeForm()
        } catch (error) {
            const { ok, message } = error.response.data
            showToastMessage(ok, message)
        } finally {
            setInserting(false)
        }
    }

    function closeForm() {
        setInvalid({
            stu_id: false,
            email: false,
            first_name: false,
            last_name: false,
            acadyear: false,
            program: false,
            courses_type: false,
        })
        setStuId(null)
        setEmail(null)
        setFname(null)
        setLname(null)
        setAcadyear(null)
        setProgram(null)
        setCourseType(null)
        onClose()
    }

    return (
        <>
            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                size={"2xl"}
                isOpen={isOpen}
                onClose={closeForm}
                classNames={{
                    body: "py-6",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-10",
                    base: "border-gray-300",
                    header: "border-b-[1.5px] border-gray-300",
                    footer: "border-t-[1.5px] border-gray-300",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={insertStudent} className=''>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h2>เพิ่มรายชื่อนักศึกษา</h2>
                                    <span className='text-base font-normal'>แบบฟอร์มเพิ่มรายชื่อนักศึกษา</span>
                                </ModalHeader>
                                <ModalBody>
                                    <div className='flex flex-row gap-4 mt-0'>
                                        <Input
                                            type="text"
                                            variant="bordered"
                                            radius='sm'
                                            label="รหัสนักศึกษา (มีขีด)"
                                            placeholder="660000000-0"
                                            labelPlacement="outside"
                                            value={stu_id}
                                            onValueChange={setStuId}
                                            isInvalid={invalid.stu_id}
                                        />
                                        <Input
                                            type="email"
                                            variant="bordered"
                                            radius='sm'
                                            label="อีเมล"
                                            labelPlacement="outside"
                                            placeholder="กรอกอีเมล"
                                            value={email}
                                            onValueChange={setEmail}
                                            isInvalid={invalid.email}
                                        />
                                    </div>
                                    <div className='flex flex-row gap-4'>
                                        <Input
                                            type="text"
                                            radius='sm'
                                            variant="bordered"
                                            label="ชื่อ"
                                            labelPlacement="outside"
                                            placeholder="กรอกชื่อ"
                                            value={first_name}
                                            onValueChange={setFname}
                                            isInvalid={invalid.first_name}
                                        />
                                        <Input
                                            type="text"
                                            variant="bordered"
                                            radius='sm'
                                            label="นามสกุล"
                                            placeholder="กรอกนามสกุล"
                                            labelPlacement="outside"
                                            value={last_name}
                                            onValueChange={setLname}
                                            isInvalid={invalid.last_name}
                                        />
                                    </div>
                                    <div className='flex flex-row gap-4'>
                                        <Autocomplete
                                            label="ปีการศึกษา"
                                            variant="bordered"
                                            defaultItems={acadyears}
                                            placeholder="เลือกปีการศึกษา"
                                            className="max-w-xs"
                                            labelPlacement='outside'
                                            onSelectionChange={setAcadyear}
                                            scrollShadowProps={{
                                                isEnabled: false
                                            }}
                                            isInvalid={invalid.acadyear}
                                        >
                                            {(item) => <AutocompleteItem key={item.acadyear}>{item.acadyear}</AutocompleteItem>}
                                        </Autocomplete>
                                        <Autocomplete
                                            label="หลักสูตร"
                                            variant="bordered"
                                            defaultItems={programs}
                                            placeholder="เลือกหลักสูตร"
                                            className="max-w-xs"
                                            labelPlacement='outside'
                                            onSelectionChange={setProgram}
                                            scrollShadowProps={{
                                                isEnabled: false
                                            }}
                                            isInvalid={invalid.program}
                                        >
                                            {(item) => <AutocompleteItem key={item.program}>{item.program}</AutocompleteItem>}
                                        </Autocomplete>
                                    </div>
                                    <div>
                                        <p className='text-sm mb-2'>เลือกโครงการ</p>
                                        <RadioGroup
                                            isInvalid={invalid.courses_type}
                                            className='flex flex-col'
                                            orientation="horizontal"
                                            value={courses_type}
                                            onValueChange={setCourseType}
                                        >
                                            <Radio value="โครงการปกติ">โครงการปกติ</Radio>
                                            <Radio className='ms-3' value="โครงการพิเศษ">โครงการพิเศษ</Radio>
                                        </RadioGroup>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={closeForm}>
                                        ยกเลิก
                                    </Button>
                                    <Button disabled={inserting} isLoading={inserting} type='submit' className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid'>
                                        เพิ่ม
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default InsertModal