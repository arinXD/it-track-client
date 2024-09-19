import { hostname } from '@/app/api/hostname'
import { getToken } from '@/app/components/serverAction/TokenAction'
import { getAcadyears } from '@/src/util/academicYear'
import { Autocomplete, AutocompleteItem, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup } from '@nextui-org/react'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'

const EditModal = ({ status, programs, showToastMessage, getStudentData, student, isOpen, onClose, }) => {
    const [stu_id, setStuId] = useState("")
    const [email, setEmail] = useState("")
    const [first_name, setFname] = useState("")
    const [last_name, setLname] = useState("")
    const [acadyears, setAcadyears] = useState([])
    const [acadyear, setAcadyear] = useState("");
    const [program, setProgram] = useState("");
    const [courses_type, setCourseType] = useState("");
    const [status_code, setStatusCode] = useState("");
    const [desc, setDesc] = useState(null);
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        setStuId(student.stu_id)
        setEmail(student.email)
        setFname(student.first_name)
        setLname(student.last_name)
        setProgram(student.program);
        setAcadyear(student.acadyear);
        setCourseType(student.courses_type)
        setStatusCode(student.status_code)
        setDesc(student.acadyear_desc)
    }, [student])

    const [invalid, setInvalid] = useState({
        stu_id: false,
        email: false,
        first_name: false,
        last_name: false,
        acadyear: false,
        program: false,
        courses_type: false,
        status_code: false
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
            if (!formData[key] && key !== "acadyear_desc") {
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

    // Acadyear
    const AutoCompleteAcadyear = useMemo(() => {
        return (
            <section className='flex flex-col w-full'>
                <Autocomplete
                    label="ปีการศึกษา"
                    variant="bordered"
                    defaultItems={acadyears}
                    placeholder="เลือกปีการศึกษา"
                    className="max-w-xs"
                    labelPlacement='outside'
                    defaultSelectedKey={String(student.acadyear)}
                    onSelectionChange={setAcadyear}
                    scrollShadowProps={{
                        isEnabled: false
                    }}
                    isInvalid={invalid.acadyear}
                >
                    {(item) => <AutocompleteItem key={item.acadyear}>{item.acadyear}</AutocompleteItem>}
                </Autocomplete>
                <div className='ms-1 flex text-xs mt-2 gap-2'>
                    <label htmlFor="">หมายเหตุ</label>
                    <input
                        className='border-b-black border-b focus:outline-none w-[81%]'
                        type="text"
                        name="desc"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)} />
                </div>
            </section>
        );
    }, [student, invalid, desc]);

    // Program
    const AutoCompleteProgram = useMemo(() => {
        return (
            <Autocomplete
                label="หลักสูตร"
                variant="bordered"
                defaultItems={programs}
                placeholder="เลือกหลักสูตร"
                className="max-w-xs"
                labelPlacement='outside'
                defaultSelectedKey={student.program}
                onSelectionChange={setProgram}
                scrollShadowProps={{
                    isEnabled: false
                }}
                isInvalid={invalid.program}
            >
                {(item) => <AutocompleteItem key={item.program}>{item.program}</AutocompleteItem>}
            </Autocomplete>
        );
    }, [student, invalid]);

    // Status
    const AutoCompleteStatus = useMemo(() => {
        return (
            <Autocomplete
                label="สถานะภาพ"
                variant="bordered"
                defaultItems={status}
                placeholder="เลือกสถานะภาพ"
                className="max-w-xs"
                labelPlacement='outside'
                defaultSelectedKey={String(student.status_code)}
                onSelectionChange={setStatusCode}
                scrollShadowProps={{
                    isEnabled: false
                }}
                isInvalid={invalid.status_code}
                allowsCustomValue={true}
            >
                {(item) =>
                    <AutocompleteItem key={String(item.id)}>
                        {String(item.id)}
                    </AutocompleteItem>}
            </Autocomplete>
        );
    }, [student, invalid]);

    async function editStudent(event) {
        setEditing(true)
        event.preventDefault()

        const formData = {
            email,
            first_name,
            last_name,
            courses_type,
            program,
            acadyear,
            status_code,
            acadyear_desc: desc
        }
        if (!validInput(formData)) {
            setEditing(false)
            return
        }

        try {
            const token = await getToken()
            console.log(formData);
            const options = {
                url: `${hostname}/api/students/${stu_id}`,
                method: 'PUT',
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
            const url = new URL(window.location.href)
            url.search = ""
            setTimeout(() => {
                window.location.href = url
            }, 1500)
            // getStudentData()
        } catch (error) {
            console.error(error);
            const { ok, message } = error?.response?.data
            showToastMessage(ok, message)
        } finally {
            setEditing(false)
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
                            <form onSubmit={editStudent} className=''>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h2>แก้ไขรายชื่อนักศึกษา</h2>
                                    <span className='text-base font-normal'>แบบฟอร์มแก้ไขรายชื่อนักศึกษา</span>
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
                                            isReadOnly={true}
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
                                        {AutoCompleteAcadyear}
                                        {AutoCompleteProgram}
                                    </div>
                                    <div className='flex flex-row gap-4'>
                                        <div className='w-[100%]'>
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
                                        {AutoCompleteStatus}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={closeForm}>
                                        ยกเลิก
                                    </Button>
                                    <Button disabled={editing} isLoading={editing} type='submit' className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid'>
                                        แก้ไข
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

export default EditModal