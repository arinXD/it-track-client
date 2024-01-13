"use client"
import React, { useState, useEffect } from 'react'
import { Tooltip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { EditIcon, EditIcon2, EyeIcon, DeleteIcon2 } from "@/app/components/icons";
import { dmyt, dMy } from '@/src/util/dateFormater'
import Link from 'next/link';
import { Icon } from '@iconify/react';
import "./style.css"

function displayNull(string) {
    if (string) return string
    return "-"
}

const TrackSelectDetail = ({ trackSelect }) => {
    const [confirmEdit, setConfirmEdit] = useState(false)
    const [acadyear, setAcadyear] = useState("")
    const [startAt, setStartAd] = useState("")
    const [expiredAt, setExpiredAt] = useState("")
    const [hasFinished, setHasFinished] = useState(false)

    useEffect(() => {
        setAcadyear(trackSelect?.acadyear.toString())
        setStartAd(trackSelect.startAt)
        setExpiredAt(trackSelect.expiredAt)
        setHasFinished(trackSelect.has_finished)
    }, [trackSelect])
    return (
        <div>
            {Object.keys(trackSelect).length > 0 ?
                <>
                    <h1 className='font-bold text-2xl my-3'>
                        {trackSelect.title}
                    </h1>
                    <div className='my-4 flex flex-row gap-10'>
                        <div className='relative border-1 rounded-md p-3 w-fit'>
                            <div
                                className="absolute top-0 -right-10">
                                {!confirmEdit ?
                                    <div onClick={() => setConfirmEdit(!confirmEdit)}
                                        className='border-gray-300 cursor-pointer border-1 p-1 rounded-md'>
                                        <Icon icon="tdesign:edit" className='text-gray-400 w-6 h-6' />
                                    </div>
                                    :
                                    <div className='flex flex-col gap-1'>
                                        <div onClick={() => setConfirmEdit(!confirmEdit)}
                                            className="border-green-500 cursor-pointer border-1.5 p-1 rounded-md">
                                            <Icon icon="material-symbols:check" className='text-green-500 w-6 h-6' />
                                        </div>
                                        <div onClick={() => setConfirmEdit(!confirmEdit)}
                                            className="border-red-500 cursor-pointer border-1.5 p-1 rounded-md">
                                            <Icon icon="iconoir:cancel" className='text-red-500 w-6 h-6' />
                                        </div>
                                    </div>
                                }
                            </div>
                            <p>
                                <span className='inline-block w-[90px] me-1'>ปีการศึกษา: </span>
                                <span>
                                    {confirmEdit ?
                                        <input type='text'
                                            className='border-1'
                                            value={acadyear}
                                            onChange={(e) => setAcadyear(e.target.value)} />
                                        :
                                        acadyear
                                    }
                                </span>
                            </p>
                            <p>
                                <span className='inline-block w-[90px] me-1'>เริ่มต้น: </span>
                                <span>{confirmEdit ?
                                    <input type='datetime-local'
                                        className='border-1'
                                        value={startAt}
                                        onChange={(e) => setStartAd(e.target.value)} />
                                    :
                                    startAt && dmyt(startAt)
                                }</span>
                            </p>
                            <p>
                                <span className='inline-block w-[90px] me-1'>สิ้นสุด: </span>
                                <span>{confirmEdit ?
                                    <input type='datetime-local'
                                        className='border-1'
                                        value={expiredAt}
                                        onChange={(e) => setExpiredAt(e.target.value)} />
                                    :
                                    expiredAt && dmyt(expiredAt)
                                }</span>
                            </p>
                            <p>
                                <span className='inline-block w-[90px] me-1'>สถานะ: </span>
                                {confirmEdit ?
                                    <input type='text'
                                        className='border-1'
                                        value={hasFinished}
                                        onChange={(e) => setHasFinished(e.target.value)} />
                                    :
                                    !(hasFinished) ? "กำลังดำเนินการ" : "สิ้นสุด"
                                }
                            </p>
                        </div>
                        <div>
                            {!(trackSelect.has_finished) ?
                                <Button size='sm' onPress={() => handleStartSelect(e.id)} color="primary" variant="solid" className=''>
                                    เริ่มคัดเลือก
                                </Button>
                                :
                                <Button size='sm' onPress={() => handleStartSelect(e.id)} color="warning" variant="solid" className='bg-amber-400'>
                                    แก้ไขสถานะ
                                </Button>}
                        </div>
                    </div>
                    <div className='my-3'>
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
                    <div className='mb-3'>
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
                </>
                :
                <>
                    <p>Loading...</p>
                </>
            }
        </div>
    )
}

export default TrackSelectDetail