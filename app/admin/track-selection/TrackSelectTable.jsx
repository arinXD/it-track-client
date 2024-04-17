import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { dMyt } from '@/src/util/dateFormater'
import { Tooltip, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { PlusIcon, CheckIcon, DeleteIcon2, SearchIcon } from "@/app/components/icons";
import { Icon } from '@iconify/react';
import { Loading } from '@/app/components';
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';

const TrackSelectTable = ({ loading, trackSelection, handleOpen,
    handleDelete, handleStartSelect, swal, callTrackSelection, showToastMessage }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(trackSelection);
    const [selectedKey, setSelectedKey] = useState([])
    const [disableDeleteBtn, setDisableDeleteBtn] = useState(true);
    const [selectedTrackSelect, setSelectedTrackSelect] = useState([]);

    useEffect(() => {
        setFilteredData(trackSelection)
    }, [trackSelection])

    useEffect(() => {
        let allId
        if (selectedKey === "all") {
            allId = filteredData.map(e => e.acadyear)
            setSelectedTrackSelect(allId)
            setDisableDeleteBtn(false)
        } else {
            let values = [...selectedKey.values()]
            if (values.length > 0) {
                allId = []
                values.map(e => {
                    allId.push(filteredData[parseInt(e)]?.acadyear)
                })
                setSelectedTrackSelect(allId)
                setDisableDeleteBtn(false)
            } else {
                setSelectedTrackSelect([])
                setDisableDeleteBtn(true)
            }
        }
    }, [selectedKey, filteredData])

    const handleSearch = useCallback(function (query) {
        setSearchQuery(query);
        if (query) {
            const filtered = trackSelection.filter((item) => {
                return Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(query.toLowerCase())
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(trackSelection);
        }
    }, [trackSelection])

    const handleSelectedDel = useCallback(async function () {
        if (selectedTrackSelect.length == 0) return
        swal.fire({
            text: `ต้องการลบการคัดแทรคปีการศึกษา ${selectedTrackSelect.join(", ")} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = "/api/tracks/selects/del/selected"
                const data = {
                    acadArr: selectedTrackSelect
                }
                const options = await getOptions(url, "DELETE", data)
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        showToastMessage(ok, message)
                        callTrackSelection()
                        setSelectedKey([])
                    })
                    .catch(error => {
                        const message = error.response.data.message
                        showToastMessage(false, message)
                    })
            }
        });
    }, [selectedTrackSelect])

    return (
        <div className='my-[30px]'>
            <div className='bg-gray-100 border-gray-200 border-1 p-2 flex flex-row justify-between items-center rounded-md mb-4'>
                <div className="flex justify-end w-[50%]">
                    <div className="border-1 border-e-0 flex justify-center items-center rounded-e-none py-2 px-3 text-sm text-black rounded-lg bg-white">
                        <SearchIcon width={16} height={16} />
                    </div>
                    <input
                        type="search"
                        id="search"
                        className="border-1 border-s-0 rounded-s-none pl-0 py-2 px-4 text-sm text-black rounded-lg bg-white focus:outline-none"
                        placeholder="ค้นหาจาก ชื่อ, ปีการศึกษา"
                        value={searchQuery}
                        style={{ width: '100%' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div className="flex md:flex-row gap-2">
                    <Button
                        radius="sm"
                        size='sm'
                        className='bg-gray-300'
                        onPress={handleOpen}
                        color="default"
                        startContent={<PlusIcon className="w-5 h-5" />}>
                        เพิ่มการคัดเลือกแทรค
                    </Button>
                    <div className={`${disableDeleteBtn ? "cursor-not-allowed" : ""}`}>
                        <Button
                            radius="sm"
                            className='bg-gray-300'
                            size='sm'
                            isDisabled={disableDeleteBtn}
                            onPress={handleSelectedDel}
                            color="default"
                            startContent={<DeleteIcon2 className="w-5 h-5" />}>
                            ลบรายการที่เลือก
                        </Button>
                    </div>
                </div>
            </div>
            {
                loading ?
                    <div className='w-fit mx-auto mt-14'>
                        <Loading />
                    </div>
                    :
                    <Table
                        removeWrapper
                        selectionMode="multiple"
                        selectedKeys={selectedKey}
                        onSelectionChange={setSelectedKey}
                        onRowAction={() => { }}
                        aria-label="track selection table">
                        <TableHeader>
                            <TableColumn></TableColumn>
                            <TableColumn></TableColumn>
                            <TableColumn>ปีการศึกษา</TableColumn>
                            <TableColumn>ชื่อ</TableColumn>
                            <TableColumn>สถานะ</TableColumn>
                            <TableColumn>เริ่มต้น</TableColumn>
                            <TableColumn>สิ้นสุด</TableColumn>
                        </TableHeader>
                        {filteredData.length > 0 ?
                            <TableBody>
                                {filteredData.map((e, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {!(e.has_finished) ?
                                                <Button
                                                    size='sm'
                                                    onPress={() => handleStartSelect({ id: e.id, hasFinished: e.has_finished })}
                                                    color="warning" variant="solid" className='bg-amber-400'>
                                                    ปิดการคัดเลือก
                                                </Button>
                                                :
                                                <Button
                                                    size='sm'
                                                    onPress={() => handleStartSelect({ id: e.id, hasFinished: e.has_finished })}
                                                    color="primary" variant="solid" className=''>
                                                    เปิดการคัดเลือก
                                                </Button>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative flex items-center gap-4">
                                                <Tooltip color="danger" content="ลบ">
                                                    <span onClick={() => handleDelete(e.acadyear)} className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon2 />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>

                                        <TableCell>{e.acadyear}</TableCell>

                                        <TableCell className="w-1/3">
                                            <Link
                                                href={`/admin/track-selection/${e.acadyear}`}
                                                className='text-blue-500'
                                            >{e.title}
                                            </Link>
                                        </TableCell>

                                        <TableCell>
                                            {e.has_finished ?
                                                <Chip startContent={<CheckIcon size={18} />} color="success" variant="flat">เสร็จสิ้น</Chip>
                                                :
                                                <Chip startContent={<Icon icon="mingcute:time-fill" className='w-[1.3em] h-[1.3em]' />} color="warning" variant="flat">กำลังดำเนินการ</Chip>
                                            }
                                        </TableCell>

                                        <TableCell>{dMyt(e.startAt)}</TableCell>
                                        <TableCell>{dMyt(e.expiredAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody> :
                            <TableBody emptyContent={"ไม่มีข้อมูลคัดเลือกแทรค"}>{[]}</TableBody>}
                    </Table>
            }
        </div >
    )
}

export default TrackSelectTable