import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Tooltip, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Input } from "@nextui-org/react";
import { PlusIcon, CheckIcon, DeleteIcon2, SearchIcon } from "@/app/components/icons";
import { Icon } from '@iconify/react';
import { Loading } from '@/app/components';
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { simpleDMYHM } from '@/src/util/simpleDateFormatter';
import { Empty } from 'antd';
import { inputClass, minimalTableClass } from '@/src/util/ComponentClass';

const TrackSelectTable = ({ loading, trackSelection, handleOpen,
    handleDelete, handleStartSelect, swal, callTrackSelection, showToastMessage }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [deleting, setDeleting] = useState(false);
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
                values.map(id => {
                    allId.push(filteredData.filter(data => data.id === id)[0]?.acadyear)
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

    const handleSelectedDel = useCallback(async function (selectedTrackSelect) {
        console.log(selectedTrackSelect);

        if (selectedTrackSelect.length == 0) return
        swal.fire({
            text: `ต้องการลบการคัดแทร็กปีการศึกษา ${selectedTrackSelect.join(", ")} หรือไม่ ?`,
            icon: "question",
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
    }, [])

    return (
        <div className='my-[30px]'>
            <div className='border p-4 rounded-[10px] w-full'>
                <div className="flex gap-4">
                    <Button
                        radius='sm'
                        size='sm'
                        onPress={handleOpen}
                        className='bg-[#edf8f7] text-[#46bcaa] border border-[#46bcaa]'
                        startContent={<PlusIcon className="w-5 h-5" />}>
                        เพิ่มการคัดเลือกแทร็ก
                    </Button>
                    <Button
                        isDisabled={disableDeleteBtn || deleting}
                        isLoading={deleting}
                        radius='sm'
                        size='sm'
                        onPress={() => handleSelectedDel(selectedTrackSelect)}
                        color='danger'
                        className='bg-red-400'
                        startContent={<DeleteIcon2 className="w-5 h-5" />}>
                        ลบ
                    </Button>
                </div>
                <Input
                    isClearable
                    className="w-full h-fit my-4"
                    placeholder="ค้นหาการคัดเลือกแทร็ก"
                    size="sm"
                    classNames={inputClass}
                    startContent={<SearchIcon />}
                    value={searchQuery}
                    onClear={() => onClear()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {
                    loading ?
                        <div className='w-fit mx-auto mt-14'>
                            <Loading />
                        </div>
                        :
                        <Table
                            checkboxesProps={{
                                classNames: {
                                    wrapper: "after:bg-blue-500 after:text-background text-background",
                                },
                            }}
                            classNames={minimalTableClass}
                            isStriped
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
                            <TableBody
                                isLoading={loading}
                                loadingContent={<Spinner />}
                                emptyContent={
                                    <Empty
                                        className='my-4 w-1/'
                                        description={
                                            <span className='text-gray-300'>ไม่มีข้อมูลคัดเลือกแทร็ก</span>
                                        }
                                    />
                                }
                                items={filteredData}
                            >
                                {(item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {!(item.has_finished) ?
                                                <Button
                                                    size='sm'
                                                    onPress={() => handleStartSelect({ id: item.id, hasFinished: item.has_finished })}
                                                    color="warning" variant="solid" className='bg-amber-400'>
                                                    ปิดการคัดเลือก
                                                </Button>
                                                :
                                                <Button
                                                    size='sm'
                                                    onPress={() => handleStartSelect({ id: item.id, hasFinished: item.has_finished })}
                                                    color="primary" variant="solid" className=''>
                                                    เปิดการคัดเลือก
                                                </Button>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative flex items-center gap-4">
                                                <Tooltip color="danger" content="ลบ">
                                                    <span onClick={() => handleDelete(item.acadyear)} className="text-lg text-danger cursor-pointer active:opacity-50">
                                                        <DeleteIcon2 />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>

                                        <TableCell>{item.acadyear}</TableCell>

                                        <TableCell className="w-1/3">
                                            <Link
                                                href={`/admin/track-selection/${item.acadyear}`}
                                                className='text-blue-500'
                                            >{item.title}
                                            </Link>
                                        </TableCell>

                                        <TableCell>
                                            {item.has_finished ?
                                                <Chip startContent={<CheckIcon size={18} />} color="success" variant="flat">เสร็จสิ้น</Chip>
                                                :
                                                <Chip startContent={<Icon icon="mingcute:time-fill" className='w-[1.3em] h-[1.3em]' />} color="warning" variant="flat">กำลังดำเนินการ</Chip>
                                            }
                                        </TableCell>

                                        <TableCell>{simpleDMYHM(item.startAt)}</TableCell>
                                        <TableCell>{simpleDMYHM(item.expiredAt)}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                }
            </div>
        </div >
    )
}

export default TrackSelectTable