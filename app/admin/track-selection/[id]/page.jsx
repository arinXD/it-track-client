"use client"
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchDataObj } from '../../action'
import React, { useState, useEffect, useReducer, useRef } from 'react'
import { Tooltip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,Pagination } from "@nextui-org/react";
import { EditIcon2, EyeIcon, DeleteIcon2 } from "@/app/components/icons";
import { dMy } from '@/src/util/dateFormater'
import Link from 'next/link';
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import axios from 'axios';
import { getToken } from '@/app/components/serverAction/TokenAction';
import { hostname } from '@/app/api/hostname';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, usePathname } from 'next/navigation'

function displayNull(string) {
    if (string) return string
    return "-"
}

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

const Page = ({ params }) => {
    const [trackSelect, setTrackSelect] = useState({})

    const [starting, setStarting] = useState(false)
    const [updating, setUpdating] = useState(false)

    const [title, setTitle] = useState("")
    const [startAt, setStartAt] = useState("")
    const [expiredAt, setExpiredAt] = useState("")
    const [hasFinished, setHasFinished] = useState("")

    const [valueChange, setValueChange] = useState(false)

    async function getTrackSelection(id) {
        try {
            const trackSelect = await fetchDataObj(`/api/tracks/selects/${id}/subjects/students`)
            return trackSelect
        } catch (err) {
            return {}
        }
    }

    async function initTrackSelect(id) {
        try {
            const result = await getTrackSelection(id)
            result.startAt = format(new Date(result?.startAt), 'yyyy-MM-dd HH:mm')
            result.expiredAt = format(new Date(result?.expiredAt), 'yyyy-MM-dd HH:mm')
            setTrackSelect(result)
        } catch (err) {
            console.error("Error on init func:", err);
        }
    }

    const { id } = params
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        initTrackSelect(id)
        setLoading(false)
    }, []);

    useEffect(() => {
        if (Object.keys(trackSelect).length > 0) {
            setTitle(trackSelect.title)
            setStartAt(format(new Date(trackSelect?.startAt), 'yyyy-MM-dd HH:mm'))
            setExpiredAt(format(new Date(trackSelect?.expiredAt), 'yyyy-MM-dd HH:mm'))
            setHasFinished(trackSelect.has_finished)
        }
    }, [trackSelect]);

    async function handleUpdate() {
        Swal.fire({
            text: `ต้องการแก้ไขข้อมูลการคัดแทรคปีการศึกษา ${trackSelect.acadyear} หรือไม่`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setUpdating(true)
                const token = await getToken()
                const options = {
                    url: `${hostname}/api/tracks/selects/${id}`,
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "authorization": `${token}`,
                    },
                    data: {
                        title,
                        startAt,
                        expiredAt,
                        has_finished: hasFinished,
                    }
                };
                try {
                    const result = await axios(options)
                    const { ok, message } = result.data
                    showToastMessage(ok, message)
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                } catch (error) {
                    showToastMessage(false, "message")
                } finally {
                    setUpdating(false)
                }
            }
        });
    }

    async function handleStartSelect({ id, hasFinished }) {
        Swal.fire({
            text: `ต้องการ${hasFinished ? "เปิดการคัดเลือก" : "ปิดการคัดเลือก"}หรือไม่?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setStarting(true)
                const token = await getToken()
                const options = {
                    url: `${hostname}/api/tracks/selects/selected/${id}`,
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "authorization": `${token}`,
                    },
                };
                try {
                    const result = await axios(options)
                    const { ok, message } = result.data
                    showToastMessage(ok, message)
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                } catch (error) {
                    showToastMessage(false, "message")
                } finally {
                    setStarting(false)
                }
            }
        });
    }

    function isDefaultValueChange(newValue) {
        const changeCount = Object.keys(newValue).filter(stateKey => {
            return newValue[stateKey] !== trackSelect[stateKey];
        });
        return changeCount.length > 0;
    }

    async function handleValueChange(newValue) {
        const state = {
            title,
            startAt,
            expiredAt,
            has_finished: hasFinished
        }
        const newState = { ...state, ...newValue }

        const isChange = isDefaultValueChange(newState);

        if (isChange) {
            setValueChange(true)
        } else {
            setValueChange(false)
        }
    }

    async function handleUnsave() {
        setTitle(trackSelect.title)
        setStartAt(trackSelect.startAt)
        setExpiredAt(trackSelect.expiredAt)
        setHasFinished(trackSelect.has_finished)
        setValueChange(false)
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                {!trackSelect ?
                    <p>No data</p>
                    :
                    <div>
                        <ToastContainer />
                        {loading ?
                            <>
                                <p>Loading...</p>
                            </>
                            :
                            Object.keys(trackSelect).length > 0 ?
                                <div className='space-y-8 mt-6'>
                                    <h1 className='font-bold text-2xl'>
                                        {title}
                                    </h1>
                                    <div className='my-4 flex flex-row gap-4 w-full'>
                                        <div className='space-y-3 border-1 rounded-md p-3 w-[50%]'>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <span className='inline-block w-[18%] text-end'>ปีการศึกษา: </span>
                                                <input
                                                    type='number'
                                                    readOnly
                                                    value={trackSelect.acadyear}
                                                    className='select-none w-[82%] border-1 px-2 py-1.5 rounded-md border-gray-300' />
                                            </div>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <span className='inline-block w-[18%] text-end'>เริ่มต้น: </span>
                                                <input
                                                    type='datetime-local'
                                                    required
                                                    className='w-[82%] border-1 px-2 py-1.5 rounded-md border-gray-300'
                                                    value={startAt}
                                                    onChange={(e) => {
                                                        setStartAt(e.target.value)
                                                        handleValueChange({ startAt: e.target.value })
                                                    }} />
                                            </div>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <span className='inline-block w-[18%] text-end'>สิ้นสุด: </span>
                                                <input
                                                    type='datetime-local'
                                                    required
                                                    className='w-[82%] border-1 px-2 py-1.5 rounded-md border-gray-300'
                                                    value={expiredAt}
                                                    onChange={(e) => {
                                                        setExpiredAt(e.target.value)
                                                        handleValueChange({ expiredAt: e.target.value })
                                                    }} />
                                            </div>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <span className='inline-block w-[18%] text-end'>สถานะ: </span>
                                                <input
                                                    type="radio"
                                                    name='hasFinished'
                                                    value={false}
                                                    className='cursor-pointer'
                                                    checked={(!hasFinished)}
                                                    onChange={() => {
                                                        setHasFinished(false)
                                                        handleValueChange({ has_finished: false })
                                                    }} />
                                                <span>กำลังดำเนินการ</span>
                                                <input
                                                    type="radio"
                                                    name='hasFinished'
                                                    value={true}
                                                    className='cursor-pointer'
                                                    checked={hasFinished}
                                                    onChange={() => {
                                                        setHasFinished(true)
                                                        handleValueChange({ has_finished: true })
                                                    }} />
                                                <span>สิ้นสุด</span>
                                            </div>
                                        </div>
                                        <div className='w-[50%] flex flex-col justify-between'>
                                            <div>
                                                {!(trackSelect.has_finished) ?
                                                    <Button size='md'
                                                        isLoading={starting}
                                                        onPress={() => handleStartSelect({ id: trackSelect.id, hasFinished: trackSelect.has_finished })}
                                                        color="default" variant="bordered" className='w-full'>
                                                        {starting ? "ปิดการคัดเลือก..." : "ปิดการคัดเลือก"}
                                                    </Button>
                                                    :
                                                    <Button size='md'
                                                        isLoading={starting}
                                                        onPress={() => handleStartSelect({ id: trackSelect.id, hasFinished: trackSelect.has_finished })}
                                                        color="default" variant="bordered" className='w-full'>
                                                        {starting ? "เปิดการคัดเลือก..." : "เปิดการคัดเลือก"}
                                                    </Button>}
                                            </div>
                                            <Button startContent={""}
                                                size='md'
                                                onPress={""}
                                                color="danger" variant="solid"
                                                className='w-full bg-red-600'>
                                                ลบ
                                            </Button>
                                            <div className="block">
                                                <div className='flex flex-col gap-3'>
                                                    <Button
                                                        isLoading={updating}
                                                        disabled={!valueChange}
                                                        onClick={handleUpdate}
                                                        className={`w-full h-[40px] px-[16px] rounded-[12px] text-white ${!valueChange ? "bg-indigo-200" : "bg-indigo-500 hover:bg-indigo-600"}`}>
                                                        {updating ? "ยืนยันการแก้ไข..." : "ยืนยันการแก้ไข"}
                                                    </Button>
                                                    <Button
                                                        disabled={!valueChange}
                                                        onClick={handleUnsave}
                                                        className={`w-full h-[40px] px-[16px] rounded-[12px] ${!valueChange ? "bg-gray-200 text-gray-400" : "bg-gray-400 hover:bg-gray-500"}`}>
                                                        ยกเลิกการแก้ไข
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className='mb-1'>วิชาที่ใช้ในการคัดเลือก</h2>
                                        {trackSelect?.Subjects &&
                                            <Table
                                                isStriped
                                                removeWrapper
                                                selectionMode="multiple"
                                                // onSelectionChange={setSelectedKeys}
                                                onRowAction={() => { }}
                                                aria-label="track selection subjects table">
                                                <TableHeader>
                                                    <TableColumn className='blue'></TableColumn>
                                                    <TableColumn className='blue'>รหัสวิชา</TableColumn>
                                                    <TableColumn className='blue'>ชื่อวิชา EN</TableColumn>
                                                    <TableColumn className='blue'>ชื่อวิชา TH</TableColumn>
                                                    <TableColumn className='blue'>หน่วยกิต</TableColumn>
                                                </TableHeader>
                                                {trackSelect?.Subjects.length > 0 ?
                                                    <TableBody>
                                                        {trackSelect?.Subjects.map(subj => (
                                                            <TableRow key={subj.subject_code}>
                                                                <TableCell className=''>
                                                                    <Tooltip color="danger" content="ลบ">
                                                                        <span onClick={() => { }} className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                            <DeleteIcon2 />
                                                                        </span>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>{subj.subject_code}</TableCell>
                                                                <TableCell className="w-1/3">{subj.title_en}</TableCell>
                                                                <TableCell className="w-1/3">{subj.title_th}</TableCell>
                                                                <TableCell className='text-center'>{subj.credit}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody> :
                                                    <TableBody emptyContent={"ไม่มีวิชาที่ใช้ในการคัดเลือก"}>{[]}</TableBody>}
                                            </Table>
                                        }
                                    </div>
                                    <div>
                                        <h2 className='mb-1'>รายชื่อนักศึกษา</h2>
                                        {trackSelect?.Selections &&
                                            <Table
                                                isStriped
                                                removeWrapper
                                                selectionMode="multiple"
                                                // onSelectionChange={setSelectedKeys}
                                                onRowAction={() => { }}
                                                aria-label="track selection table">
                                                <TableHeader>
                                                    <TableColumn className='blue'></TableColumn>
                                                    <TableColumn className='blue'>No.</TableColumn>
                                                    <TableColumn className='blue'>รหัสนักศึกษา</TableColumn>
                                                    <TableColumn className='blue'>แทรคที่ได้</TableColumn>
                                                    <TableColumn className='blue'>เลือกลำดับ 1</TableColumn>
                                                    <TableColumn className='blue'>เลือกลำดับ 2</TableColumn>
                                                    <TableColumn className='blue'>เลือกลำดับ 3</TableColumn>
                                                    <TableColumn className='blue'>วันที่ยืนยัน</TableColumn>
                                                </TableHeader>
                                                {trackSelect?.Selections.length > 0 ?
                                                    <TableBody>
                                                        {trackSelect?.Selections.map((select, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    <div className="relative flex items-center gap-3 w-fit">
                                                                        <Tooltip content="รายละเอียด">
                                                                            <Link href={``} className='focus:outline-none'>
                                                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                                                    <EyeIcon />
                                                                                </span>
                                                                            </Link>
                                                                        </Tooltip>
                                                                        <Tooltip content="แก้ไข">
                                                                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                                                <EditIcon2 />
                                                                            </span>
                                                                        </Tooltip>
                                                                        <Tooltip color="danger" content="ลบ">
                                                                            <span onClick={() => { }} className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                                <DeleteIcon2 />
                                                                            </span>
                                                                        </Tooltip>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>{select.stu_id}</TableCell>
                                                                <TableCell>
                                                                    {select.result ? select.result : "รอการคัดเลือก"}
                                                                </TableCell>
                                                                <TableCell>{displayNull(select.track_order_1)}</TableCell>
                                                                <TableCell>{displayNull(select.track_order_2)}</TableCell>
                                                                <TableCell>{displayNull(select.track_order_3)}</TableCell>
                                                                <TableCell>{dMy(select.updatedAt)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody> :
                                                    <TableBody emptyContent={"ไม่มีรายชื่อนักศึกษา"}>{[]}</TableBody>}
                                            </Table>
                                        }
                                    </div>
                                </div>
                                :
                                <>
                                    <p>ไม่มีข้อมูลคัดเลือกแทรค</p>
                                </>
                        }

                    </div>
                }
            </ContentWrap>
        </>
    )
}

export default Page

// function generateYearsArray() {
//     const currentYear = new Date().getFullYear();
//     const startYear = 1999;
//     const yearsArray = [];

//     for (let year = currentYear; year >= startYear; year--) {
//         const newYear = year + 543
//         yearsArray.push(newYear.toString());
//     }

//     return yearsArray;
// }
// const acadyearsArray = generateYearsArray()