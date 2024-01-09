import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { dMyt } from '@/src/util/dateFormater'
import { Tooltip, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { PlusIcon, CheckIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon, ConfirmIcon, ClockIcon } from "@/app/components/icons";
import { Icon } from '@iconify/react';

const TrackSelectTable = ({ trackSelection, handleOpen, handleDelete, handleSelectedDel, handleStartSelect }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(trackSelection);
    const [itemsPerPage, setItemPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedKey, setSelectedKey] = useState([])

    useEffect(() => {
        setFilteredData(trackSelection)
    }, [trackSelection])

    function handleSetSelectedKey(selectedKey) {
        let allId
        if (selectedKey === "all") {
            allId = trackSelection.map(e => e.acadyear)
            setSelectedKey(allId)
        } else {
            let values = [...selectedKey.values()]
            if (values.length > 0) {
                allId = []
                values.map(e => {
                    allId.push(trackSelection[parseInt(e)].acadyear)
                })
                setSelectedKey(allId)
            } else {
                setSelectedKey([])
            }
        }
    }

    function handleSearch(query) {
        setSearchQuery(query);
        if (query) {
            const filtered = trackSelection.filter((item) =>
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(query.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(trackSelection);
        }
    }
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentData = filteredData.slice(startIndex, endIndex);
    return (
        <div className='my-[30px]'>
            <div className="flex flex-col md:flex-row justify-end gap-3 mb-3">
                <div className="flex justify-end">
                    <div className="flex justify-center items-center rounded-e-none py-2 px-3 text-sm text-gray-900 rounded-lg bg-gray-100">
                        <SearchIcon width={16} height={16} />
                    </div>
                    <input
                        type="search"
                        id="search"
                        className="rounded-s-none pl-0 py-2 px-4 text-sm text-gray-900 rounded-lg bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search..."
                        value={searchQuery}
                        style={{ width: '100%' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div className="flex md:flex-row gap-3">
                    <Button
                        className="w-1/2"
                        onPress={handleOpen}
                        color="primary"
                    >
                        Add New
                        <PlusIcon className={'w-5 h-5 text-white md:block md:w-6 md:h-6'} />
                    </Button>
                    <Button
                        className="bg-red-400 text-white w-1/2"
                        onPress={async () => {
                            await handleSelectedDel(selectedKey)
                            setSelectedKey([])
                        }}
                    >
                        Delete Select
                        {/* <Icon icon="solar:trash-bin-minimalistic-linear" className='w-5 h-5 text-white hidden md:block md:w-8 md:h-8' /> */}
                        <DeleteIcon className={'w-5 h-5 text-white md:w-8 md:h-8'} />
                    </Button>
                </div>
            </div>
            {trackSelection.length > 0 ?
                <Table
                    removeWrapper
                    selectionMode="multiple"
                    onSelectionChange={handleSetSelectedKey}
                    onRowAction={() => { }}
                    aria-label="track selection table">
                    <TableHeader>
                        <TableColumn>ปีการศึกษา</TableColumn>
                        <TableColumn>ชื่อ</TableColumn>
                        <TableColumn>สถานะ</TableColumn>
                        <TableColumn>เริ่มต้น</TableColumn>
                        <TableColumn>สิ้นสุด</TableColumn>
                        <TableColumn>Action</TableColumn>
                        <TableColumn></TableColumn>
                    </TableHeader>
                    {filteredData.length > 0 ?
                        <TableBody>
                            {filteredData.map((e, index) => (
                                <TableRow key={index}>
                                    <TableCell>{e.acadyear}</TableCell>
                                    <TableCell className="w-1/3">
                                        <Link
                                            href={`/admin/track-selection/${e.acadyear}?track_select_id=${e.id}`}
                                            // as={`/admin/track-selection/${e.id}`}
                                            className='text-blue-500'
                                        >{e.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {e.has_finished ?
                                            <Chip startContent={<CheckIcon size={18} />} color="success" variant="flat">เสร็จสิ้น</Chip>
                                            :
                                            <Chip startContent={<Icon icon="mingcute:time-fill" className='w-[1.3em] h-[1.3em]' />} color="warning" variant="flat">ดำเนินการ</Chip>
                                        }
                                    </TableCell>
                                    <TableCell>{dMyt(e.startAt)}</TableCell>
                                    <TableCell>{dMyt(e.expiredAt)}</TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2">
                                            <Tooltip content="รายละเอียด">
                                                <Link
                                                    href={`/admin/track-selection/${e.acadyear}?track_select_id=${e.id}`}
                                                    // as={`/admin/track-selection/${e.id}`}
                                                    className='focus:outline-none'>
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        {/* <EyeIcon /> */}
                                                        <Icon icon="solar:eye-linear" className='w-[22px] h-[22px]' />
                                                    </span>
                                                </Link>
                                            </Tooltip>
                                            <Tooltip content="แก้ไข">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <Icon icon="ph:pencil-simple-line" className='w-[22px] h-[22px]' />
                                                </span>
                                            </Tooltip>
                                            <Tooltip color="danger" content="ลบ">
                                                <span onClick={() => handleDelete(e.acadyear)} className="text-lg text-danger cursor-pointer active:opacity-50">
                                                    {/* <DeleteIcon2 /> */}
                                                    <Icon icon="solar:trash-bin-minimalistic-linear" className='w-[22px] h-[22px]' />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {!(e.has_finished) ?
                                            <Button onPress={() => handleStartSelect(e.id)} color="primary" variant="solid" className='h-8'>
                                                เริ่มคัดเลือก
                                            </Button>
                                            :
                                            <Button onPress={() => handleStartSelect(e.id)} color="warning" variant="solid" className='h-8 bg-amber-400'>
                                                แก้ไขสถานะ
                                            </Button>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody> :
                        <TableBody emptyContent={"ไม่มีข้อมูลคัดเลือกแทรค"}>{[]}</TableBody>}
                </Table> : <>Loading....</>
            }
        </div>
    )
}

export default TrackSelectTable