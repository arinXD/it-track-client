"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Textarea, Select, SelectItem } from "@nextui-org/react";
import { Icon } from '@iconify/react';
import { getCurrentDate } from '@/src/util/dateFormater';
import { thinInputClass } from '@/src/util/ComponentClass';
import { Empty } from 'antd';

export default function CreateModal({ acadyear, subjects, handleSubmit, isOpen, onClose }) {
    const defaultSubj = useMemo(() => ["SC361002", "SC361003", "SC361004", "SC361005"], [])
    const currentDateTime = useMemo(() => {
        const date = new Date();
        date.setHours(12);
        date.setMinutes(0);
        return date;
    }, []);

    const [title, setTitle] = useState("")
    const [acadValue, setAcadValue] = useState("")
    const [startValue, setStartValue] = useState(format(currentDateTime, 'yyyy-MM-dd\'T\'HH:mm'));
    const [expiredValue, setExpiredValue] = useState("")
    const [announcementDate, setAnnouncementDate] = useState("");
    const [trackSubj, setTrackSubj] = useState([])
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const nextWeek = new Date(currentDateTime);
        nextWeek.setDate(nextWeek.getDate() + 7);
        setExpiredValue(format(nextWeek, 'yyyy-MM-dd\'T\'HH:mm'));

        const twoWeeksLater = new Date(currentDateTime);
        twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
        setAnnouncementDate(format(twoWeeksLater, 'yyyy-MM-dd\'T\'HH:mm'));
    }, [currentDateTime]);

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

    const handleSelectionChange = useCallback(function (e) {
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
    }, [])

    const addSubj = useCallback(function (subj) {
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
    }, [])

    const delSubj = useCallback(function (subject_code) {
        const data = trackSubj.filter(element => element.subject_code !== subject_code)
        setTrackSubj(data)
    }, [trackSubj])

    const createAcad = useCallback(async function (e) {
        setSubmitting(true)
        e.preventDefault();
        const formData = {
            acadyear: acadValue,
            title: title,
            startAt: startValue,
            expiredAt: expiredValue,
            announcementDate,
            trackSubj: trackSubj.map((sbj) => sbj.subject_code),
        }
        await handleSubmit(formData)
        setSubmitting(false)
    }, [
        acadValue,
        title,
        startValue,
        expiredValue,
        trackSubj,
        announcementDate
    ])

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
                            <ModalHeader className="flex flex-col gap-1">เพิ่มการคัดเลือกแทร็ก</ModalHeader>
                            <ModalBody>
                                <div className='grid grid-cols-2 gap-6'>
                                    <div className='flex flex-col gap-3'>
                                        <Select
                                            isRequired
                                            label="ปีการศึกษา"
                                            labelPlacement="outside"
                                            placeholder="เลือกปีการศึกษา"
                                            radius='sm'
                                            variant='bordered'
                                            classNames={thinInputClass}
                                            name={"acadyear"}
                                            disabledKeys={[""]}
                                            scrollShadowProps={{
                                                isEnabled: false
                                            }}
                                            selectedKeys={[acadValue]}
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
                                            label="หัวเรื่อง"
                                            labelPlacement="outside"
                                            placeholder=""
                                            name="title"
                                            onChange={(e) => setTitle(e.target.value)}
                                            value={title}
                                            variant='bordered'
                                            classNames={thinInputClass}
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
                                            variant='bordered'
                                            classNames={thinInputClass}
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
                                            variant='bordered'
                                            classNames={thinInputClass}
                                        />
                                        <Input
                                            id='announcementDate'
                                            type='datetime-local'
                                            label="วันประกาศผล"
                                            radius='sm'
                                            placeholder="วันประกาศผล"
                                            labelPlacement="outside"
                                            value={announcementDate || null}
                                            onChange={(e) => {
                                                setAnnouncementDate(e.target.value)
                                            }}
                                            min={expiredValue}
                                            variant='bordered'
                                            classNames={thinInputClass}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6 mt-2">
                                    <div className="w-full md:w-1/2">
                                        <h3 className="text-normal font-semibold mb-2">วิชาที่ใช้ในการคัดเลือก {trackSubj.length} วิชา</h3>
                                        <div className="h-[234px] overflow-y-auto border border-gray-200 rounded-lg shadow-sm">
                                            {trackSubj.length > 0 ? (
                                                <ul className="divide-y divide-gray-200">
                                                    {trackSubj.map((sbj, index) => (
                                                        <li key={index} className="p-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{sbj.subject_code}</p>
                                                                    <p className="text-sm text-gray-600">{sbj.title_th}</p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => delSubj(sbj.subject_code)}
                                                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                                                >
                                                                    <Icon icon="heroicons-outline:trash" className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Empty
                                                        description={
                                                            <span className='text-default-300'>ยังไม่มีวิชาที่เลือก</span>
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2">
                                        <h3 className="text-normal font-semibold mb-2">ค้นหาวิชาเพื่อเพิ่ม</h3>
                                        <div className="mb-3">
                                            <input
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                type="search"
                                                value={searchSubj}
                                                onChange={(e) => setSearchSubj(e.target.value)}
                                                placeholder="ค้นหาวิชา"
                                            />
                                        </div>
                                        <div className="h-[180px] overflow-y-auto border border-gray-200 rounded-lg shadow-sm">
                                            <ul className="divide-y divide-gray-200">
                                                {filterSubj.map((subject, index) => (
                                                    !trackSubj.map(z => z.subject_code).includes(subject.subject_code) && (
                                                        <li
                                                            key={index}
                                                            onClick={() => addSubj(subject)}
                                                            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out"
                                                        >
                                                            <p className="font-medium text-gray-900">{subject.subject_code}</p>
                                                            <p className="text-sm text-gray-600">{subject.title_en}</p>
                                                            <p className="text-sm text-gray-500">{subject.title_th}</p>
                                                        </li>
                                                    )
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
                                    isDisabled={submitting}
                                    isLoading={submitting}
                                    className='py-4 ms-4'
                                    radius='sm'
                                    color="primary"
                                    variant='solid'
                                    type="submit"
                                >
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