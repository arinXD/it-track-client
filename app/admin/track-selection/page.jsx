"use client"
import React, { useEffect, useState } from 'react'
import TrackSelectTable from './components/TrackSelectTable';
import { format } from 'date-fns';
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Textarea, Select, SelectItem } from "@nextui-org/react";
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'
import { Icon } from '@iconify/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { getToken } from '@/app/components/serverAction/TokenAction'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

const defaultSubj = ["SC361002", "SC361003", "SC361004", "SC361005"]

const Page = () => {
    const showToastMessage = (ok, message) => {
        if (ok) {
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.warning(message, {
                position: toast.POSITION.TOP_RIGHT,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const [trackSelection, setTrackSelection] = useState([])
    const [acadyear, setAcadyear] = useState([])
    const [subjects, setSubjects] = useState([])

    const [selectedKey, setSelectedKey] = useState([])
    const [title, setTitle] = useState("")
    const [acadValue, setAcadValue] = useState("")
    const [startValue, setStartValue] = useState("");
    const [expiredValue, setExpiredValue] = useState("")
    const [trackSubj, setTrackSubj] = useState([])

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchSubj, setSearchSubj] = useState("")
    const [filterSubj, setFilterSubj] = useState([])

    async function callData() {
        let data = await fetchData("/api/tracks/selects")
        const acadData = await fetchData("/api/acadyear")
        let subjData = await fetchData("/api/subjects")
        subjData = subjData.filter(element => element.subject_code.includes('SC') || element.subject_code.includes('CP'))
        data = data.map(e => {
            let status = !e.has_finished ? "กำลังดำเนินการ" : "สิ้นสุด";
            return { ...e, has_finished: status };
        })
        setTrackSelection(data)
        setAcadyear(acadData)
        setSubjects(subjData)
        setFilterSubj(subjData)
    }

    useEffect(() => {
        const currentDateTime = new Date();
        const formattedDateTime = format(currentDateTime, 'yyyy-MM-dd HH:mm');
        setStartValue(formattedDateTime)
        setExpiredValue(formattedDateTime)
    }, [])

    useEffect(() => {
        if (acadyear[0]) {
            setAcadValue(acadyear[0].acadyear.toString())
        }
    }, [acadyear])

    useEffect(() => {
        callData()
    }, [])

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
        setTitle(`การคัดเลือกความเชี่ยวชาญ วิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ ปีการศึกษา ${acadyear[0]?.acadyear}`)
    }, [acadyear])

    useEffect(() => {
        if (searchSubj) {
            const data = subjects.filter(e =>
                e.subject_code.includes(searchSubj.toUpperCase()) ||
                e.title_en.includes(searchSubj.toUpperCase()) ||
                e.title_th.includes(searchSubj.toUpperCase()))
            setFilterSubj(data)
            return
        }
        setFilterSubj(subjects)
    }, [searchSubj])

    function handleOpen() {
        onOpen()
    }

    function handleSelectionChange(e) {
        const newAcad = e.target.value.toString()
        setAcadValue((prevVale) => {
            setTitle(prvTitle => {
                return prvTitle.replace(prevVale, newAcad);
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

    async function handleSubmit(e) {
        e.preventDefault();
        const token = await getToken()
        const formData = {
            acadyear: acadValue,
            title: title,
            startAt: startValue,
            expiredAt: expiredValue,
            trackSubj: trackSubj.map((sbj) => sbj.subject_code),
        }
        try {
            const options = {
                url: `${hostname}/api/tracks/selects`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    "authorization": `${token}`,
                },
                data: formData
            };
            const result = await axios(options)
            const { ok, message } = result.data
            await callData()
            showToastMessage(ok, message)
            return
        } catch (error) {
            const message = error?.response?.data?.message
            showToastMessage(false, message)
            return
        }
    }

    async function handleDelete(acadyear) {
        Swal.fire({
            // title: `ต้องการลบปีการศึกษา ${e["acadyear"]} หรือไม่ ?`,
            text: `ต้องการลบการคัดแทรคปีการศึกษา ${acadyear} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = await getToken()
                const options = {
                    url: `${hostname}/api/tracks/selects/${acadyear}`,
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "authorization": `${token}`,
                    },
                };
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        showToastMessage(ok, message)
                        await callData()
                    })
                    .catch(error => {
                        const message = error.response.data.message
                        showToastMessage(false, message)
                    })
            }
        });
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <ToastContainer />
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
                                <form onSubmit={handleSubmit}>
                                    <ModalHeader className="flex flex-col gap-1">เพิ่มการคัดเลือกแทรค</ModalHeader>
                                    <ModalBody>
                                        <div className='grid grid-cols-2 gap-1'>
                                            <div className='flex flex-col gap-3'>
                                                <Select
                                                    isRequired
                                                    label="ปีการศึกษา"
                                                    labelPlacement="outside"
                                                    placeholder="เลือกปีการศึกษา"
                                                    selectedKeys={[acadValue]}
                                                    className="max-w-xs"
                                                    radius={"sm"}
                                                    name={"acadyear"}
                                                    disabledKeys={[""]}
                                                    onChange={handleSelectionChange}
                                                >
                                                    <SelectItem key={""} value={""}>
                                                        เลือกปีการศึกษา
                                                    </SelectItem>
                                                    {acadyear.map((acad) => (
                                                        <SelectItem key={acad.acadyear.toString()} value={acad.acadyear.toString()}>
                                                            {acad.acadyear.toString()}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                <Textarea
                                                    isRequired
                                                    radius={"sm"}
                                                    label="title"
                                                    labelPlacement="outside"
                                                    placeholder=""
                                                    className="max-w-xs"
                                                    name="title"
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    value={title}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-3'>
                                                <Input
                                                    isRequired
                                                    radius={"sm"}
                                                    label="เริ่มต้น"
                                                    value={startValue}
                                                    labelPlacement="outside"
                                                    type="datetime-local"
                                                    className="max-w-xs"
                                                    name="startAt"
                                                    onChange={(e) => {
                                                        setStartValue(e.target.value)
                                                    }}
                                                />
                                                <Input
                                                    isRequired
                                                    radius={"sm"}
                                                    label="สิ้นสุด"
                                                    value={expiredValue}
                                                    labelPlacement="outside"
                                                    type="datetime-local"
                                                    className="max-w-xs"
                                                    name="expiredAt"
                                                    onChange={(e) => {
                                                        setExpiredValue(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-row gap-1 mt-3'>
                                            <ul className='h-[210px] w-1/2 overflow-y-auto flex flex-col gap-1 p-2 border-1'>
                                                <p>วิชาที่ใช้ในการคัดเลือก</p>
                                                {trackSubj.length > 0 ?
                                                    trackSubj.map((sbj, index) => (
                                                        <li key={index} className='relative p-1 gap-2 border-1 border-b-gray-300 rounded-sm'>
                                                            <input
                                                                readOnly
                                                                className='block focus:outline-none font-bold'
                                                                type="text"
                                                                name="trackSubj[]"
                                                                value={sbj.subject_code} />
                                                            <p className='flex flex-col text-sm'>
                                                                <span>{sbj.title_en}</span>
                                                            </p>
                                                            <Icon onClick={() => delSubj(sbj.subject_code)} icon="lets-icons:dell-duotone" className="absolute top-1 right-1 w-6 h-6 cursor-pointer active:scale-95 hover:opacity-80" />
                                                        </li>
                                                    ))
                                                    :
                                                    <li>ยังไม่มีวิชาในการคัดเลือก</li>}
                                            </ul>
                                            <div className='w-1/2'>
                                                <input
                                                    className='border-1 w-full px-2 focus:outline-none mb-1'
                                                    type="search"
                                                    value={searchSubj}
                                                    onChange={(e) => setSearchSubj(e.target.value)}
                                                    placeholder='ค้นหาวิชา' />

                                                <ul className='border-1 h-[180px] overflow-y-auto p-2 flex flex-col gap-1'>
                                                    {filterSubj.map((subject, index) => (
                                                        !(trackSubj.map(z => z.subject_code).includes(subject.subject_code)) &&
                                                        <li onClick={() => addSubj(subject)} key={index} className='flex flex-row gap-2 p-1 border-1 border-b-gray-300 cursor-pointer'>
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
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" type="button" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" type="submit" onPress={onClose}>
                                            Action
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <TrackSelectTable
                    handleDelete={handleDelete}
                    handleOpen={handleOpen}
                    trackSelection={trackSelection}
                    setSelectedKey={setSelectedKey}
                />
            </ContentWrap>
        </>
    )
}

export default Page