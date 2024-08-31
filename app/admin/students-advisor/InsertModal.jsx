"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input, Autocomplete, AutocompleteItem, RadioGroup, Radio } from "@nextui-org/react";
import { getAcadyears } from '@/src/util/academicYear';
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { message } from 'antd';
import { thinInputClass } from '@/src/util/ComponentClass';

const InsertModal = ({ }) => {
    const [programs, setPrograms] = useState([])
    const [stu_id, setStuId] = useState("")
    const [email, setEmail] = useState("")
    const [first_name, setFname] = useState("")
    const [last_name, setLname] = useState("")
    const [acadyears, setAcadyears] = useState([])
    const [acadyear, setAcadyear] = useState(null);
    const [program, setProgram] = useState(null);
    const [courses_type, setCourseType] = useState(null);
    const [inserting, setInserting] = useState(false)

    const getPrograms = useCallback(async function () {
        try {
            const option = await getOptions("/api/programs", "get")
            const programs = (await axios(option)).data.data
            setPrograms(programs)
        } catch (error) {
            setPrograms([])
        }
    }, [])

    useEffect(() => {
        getPrograms()
    }, [])

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

    const validInput = useCallback(function (formData) {
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
    }, [])

    const insertStudent = async function (event) {
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
            const option = await getOptions("/api/students", "POST", formData)
            const res = await axios(option)
            const { message: msg } = res.data
            message.success(msg)
            closeForm()
        } catch (error) {
            const { message: msg } = error.response.data
            message.success(msg)
        } finally {
            setInserting(false)
        }
    }

    const closeForm = useCallback(function () {
        setInvalid({
            stu_id: false,
            email: false,
            first_name: false,
            last_name: false,
            acadyear: false,
            program: false,
            courses_type: false,
        })
        setStuId("")
        setEmail("")
        setFname("")
        setLname("")
        setAcadyear(null)
        setProgram(null)
        setCourseType("")
    }, [])

    return (
        <section className='max-w-2xl mx-auto bg-white'>
            <form onSubmit={insertStudent} className='flex flex-col space-y-4 mt-6 border p-6 rounded-lg shadow'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-row gap-4 mt-0'>
                        <Input
                            type="text"
                            variant="bordered"
                            radius='sm'
                            label="รหัสนักศึกษา (มีขีด)"
                            placeholder="660000000-0"
                            labelPlacement="outside"
                            value={stu_id}
                            classNames={thinInputClass}
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
                            classNames={thinInputClass}
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
                            classNames={thinInputClass}
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
                            classNames={thinInputClass}
                        />
                    </div>
                    <div className='w-full flex flex-row gap-4'>
                        <Autocomplete
                            inputProps={{
                                classNames: {
                                    inputWrapper: "border-1",
                                },
                            }}
                            id='acadyear'
                            radius='sm'
                            label="ปีการศึกษา"
                            variant="bordered"
                            defaultItems={acadyears}
                            placeholder="เลือกปีการศึกษา"
                            className="w-full"
                            labelPlacement='outside'
                            selectedKey={acadyear}
                            onSelectionChange={(value) => setAcadyear(value)}
                            scrollShadowProps={{
                                isEnabled: false
                            }}
                            isInvalid={invalid.acadyear}
                        >
                            {(item) => <AutocompleteItem key={item.acadyear}>{item.acadyear}</AutocompleteItem>}
                        </Autocomplete>
                        <Autocomplete
                            inputProps={{
                                classNames: {
                                    inputWrapper: "border-1",
                                },
                            }}
                            id='program'
                            radius='sm'
                            label="หลักสูตร"
                            variant="bordered"
                            defaultItems={programs}
                            selectedKey={program}
                            onSelectionChange={(value) => setProgram(value)}
                            placeholder="เลือกหลักสูตร"
                            className="w-full"
                            labelPlacement='outside'
                            scrollShadowProps={{
                                isEnabled: false
                            }}
                            isInvalid={invalid.program}
                        >
                            {(item) => <AutocompleteItem key={item.program}>{item.program}</AutocompleteItem>}
                        </Autocomplete>
                    </div>
                    <div className='w-full'>
                        <p className='text-sm mb-2'>เลือกโครงการ</p>
                        <RadioGroup
                            isInvalid={invalid.courses_type}
                            className='flex flex-col'
                            orientation="horizontal"
                            value={courses_type}
                            onValueChange={setCourseType}
                        >
                            <Radio value="โครงการปกติ">
                                <span className='text-sm'>โครงการปกติ</span>
                            </Radio>
                            <Radio className='ms-3' value="โครงการพิเศษ">
                                <span className='text-sm'>โครงการพิเศษ</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button type='button' className='border-1 h-[16px] py-4 rounded-[5px]' color="primary" variant='bordered' onPress={closeForm}>
                        ยกเลิก
                    </Button>
                    <Button disabled={inserting} isLoading={inserting} type='submit' className='h-[16px] py-4 ms-4 rounded-[5px]' color="primary" variant='solid'>
                        เพิ่ม
                    </Button>
                </div>
            </form>
        </section>
    )
}

export default InsertModal