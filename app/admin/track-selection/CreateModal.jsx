import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Textarea, Select, SelectItem } from "@nextui-org/react";
import { Icon } from '@iconify/react';
import { getCurrentDate } from '@/src/util/dateFormater';
import { inputClass } from '@/src/util/ComponentClass';

const defaultSubj = ["SC361002", "SC361003", "SC361004", "SC361005"]
const currentDateTime = new Date()

export default function CreateModal({ acadyear, subjects, handleSubmit, isOpen, onClose }) {
    const [title, setTitle] = useState("")
    const [acadValue, setAcadValue] = useState("")
    const [startValue, setStartValue] = useState(format(currentDateTime, 'yyyy-MM-dd HH:mm'));
    const [expiredValue, setExpiredValue] = useState(format(currentDateTime, 'yyyy-MM-dd HH:mm'))
    const [trackSubj, setTrackSubj] = useState([])

    const [searchSubj, setSearchSubj] = useState("")
    const [filterSubj, setFilterSubj] = useState([])

    useEffect(() => {
        setFilterSubj(subjects)
    }, [subjects])

    useEffect(() => {
        if (acadyear[0]) {
            setAcadValue(acadyear[0].toString())
        }
    }, [acadyear])

    useEffect(() => {
        let data = []
        for (const subj of subjects) {
            if (defaultSubj.includes(subj.subject_code)) {
                data.push(subj)
            }
        }
        setTrackSubj(data)
    }, [subjects])

    useEffect(() => {
        setTitle(`การคัดเลือกความเชี่ยวชาญ วิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ ปีการศึกษา ${acadyear[0]}`)
    }, [acadyear])

    useEffect(() => {
        if (searchSubj) {
            const data = subjects.filter(e =>
                e.subject_code?.includes(searchSubj.toUpperCase()) ||
                e.title_en?.includes(searchSubj.toUpperCase()) ||
                e.title_th?.includes(searchSubj.toUpperCase()))
            setFilterSubj(data)
            return
        }
        setFilterSubj(subjects)
    }, [searchSubj])

    function handleSelectionChange(e) {
        const newAcad = e.target.value.toString()
        setAcadValue((prevVale) => {
            setTitle(prvTitle => {
                if (prevVale) {
                    return prvTitle.replace(prevVale, newAcad);
                } else {
                    return prvTitle + " " + newAcad
                }
            })
            return newAcad
        });
    }

    function addSubj(subj) {
        setTrackSubj((prevState) => {
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
                    subject_code: subj.subject_code,
                    title_th: subj.title_th,
                    title_en: subj.title_en
                }
                data.push(result)
            }
            return data
        })
    }

    function delSubj(subject_code) {
        const data = trackSubj.filter(element => element.subject_code !== subject_code)
        setTrackSubj(data)
    }
    function createAcad(e) {
        e.preventDefault();
        const formData = {
            acadyear: acadValue,
            title: title,
            startAt: startValue,
            expiredAt: expiredValue,
            trackSubj: trackSubj.map((sbj) => sbj.subject_code),
        }
        handleSubmit(formData)
    }
    return (
        <Modal
            size={"3xl"}
            isOpen={isOpen}
            onClose={onClose}
            isDismissable={false}
            placement={"top-center"}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <form onSubmit={createAcad}>
                            <ModalHeader className="flex flex-col gap-1">เพิ่มการคัดเลือกแทรค</ModalHeader>
                            <ModalBody>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex flex-col gap-3'>
                                        <Select
                                            isRequired
                                            label="ปีการศึกษา"
                                            labelPlacement="outside"
                                            placeholder="เลือกปีการศึกษา"
                                            selectedKeys={[acadValue]}
                                            radius={"sm"}
                                            name={"acadyear"}
                                            disabledKeys={[""]}
                                            scrollShadowProps={{
                                                isEnabled: false
                                            }}
                                            onChange={handleSelectionChange}
                                        >
                                            <SelectItem key={""} value={""}>
                                                เลือกปีการศึกษา
                                            </SelectItem>
                                            {acadyear.map((acad) => (
                                                <SelectItem key={acad.toString()} value={acad.toString()}>
                                                    {acad.toString()}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Textarea
                                            isRequired
                                            radius={"sm"}
                                            label="title"
                                            labelPlacement="outside"
                                            placeholder=""
                                            name="title"
                                            onChange={(e) => setTitle(e.target.value)}
                                            value={title}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <Input
                                            type='datetime-local'
                                            label="เริ่มต้น (เดือน/วัน/ปี)"
                                            isRequired
                                            radius={"sm"}
                                            value={startValue}
                                            labelPlacement="outside"
                                            name="startAt"
                                            onChange={(e) => {
                                                setStartValue(e.target.value)
                                            }}
                                            min={getCurrentDate()}
                                        />
                                        <Input
                                            type='datetime-local'
                                            isRequired
                                            radius={"sm"}
                                            label="สิ้นสุด (เดือน/วัน/ปี)"
                                            value={expiredValue}
                                            labelPlacement="outside"
                                            name="expiredAt"
                                            onChange={(e) => {
                                                setExpiredValue(e.target.value)
                                            }}
                                            min={startValue}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-row gap-3 mt-3'>
                                    <div className='w-1/2 flex flex-col'>
                                        <p>วิชาที่ใช้ในการคัดเลือก</p>
                                        <ul className='h-[210px] overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                            {trackSubj.length > 0 ?
                                                trackSubj.map((sbj, index) => (
                                                    <li key={index} className='bg-gray-100 rounded-md relative p-1 gap-2 border-1 border-b-gray-300'>
                                                        <input
                                                            readOnly
                                                            className='bg-gray-100 block focus:outline-none font-bold'
                                                            type="text"
                                                            name="trackSubj[]"
                                                            value={sbj.subject_code} />
                                                        <p className='flex flex-col text-sm'>
                                                            <span>{sbj.title_th}</span>
                                                        </p>
                                                        <Icon onClick={() => delSubj(sbj.subject_code)} icon="lets-icons:dell-duotone" className="absolute top-1 right-1 w-6 h-6 cursor-pointer active:scale-95 hover:opacity-80" />
                                                    </li>
                                                ))
                                                :
                                                <li>ยังไม่มีวิชาในการคัดเลือก</li>}
                                        </ul>
                                    </div>
                                    <div className='w-1/2'>
                                        <p>ค้นหาวิชาเพื่อเพิ่ม</p>
                                        <div className='flex flex-col'>
                                            <input
                                                className='rounded-md border-1 w-full px-2 focus:outline-none mb-1'
                                                type="search"
                                                value={searchSubj}
                                                onChange={(e) => setSearchSubj(e.target.value)}
                                                placeholder='ค้นหาวิชา' />

                                            <ul className='rounded-md border-1 h-[180px] overflow-y-auto p-2 flex flex-col gap-1'>
                                                {filterSubj.map((subject, index) => (
                                                    !(trackSubj.map(z => z.subject_code).includes(subject.subject_code)) &&
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
                                <Button
                                    type='button'
                                    className='border-1 py-4'
                                    radius='sm'
                                    color="primary"
                                    variant='bordered'
                                    onPress={onClose}>
                                    ยกเลิก
                                </Button>
                                <Button
                                    className='py-4 ms-4'
                                    radius='sm'
                                    color="primary"
                                    variant='solid'
                                    type="submit"
                                    onPress={onClose}>
                                    เพิ่ม
                                </Button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}