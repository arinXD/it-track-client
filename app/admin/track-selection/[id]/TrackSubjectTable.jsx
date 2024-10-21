"use client"
import { DeleteIcon2, PlusIcon } from '@/app/components/icons'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import { insertColor, minimalTableClass } from '@/src/util/ComponentClass'
import { swal } from '@/src/util/sweetyAlert'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@nextui-org/react'
import { Empty, message } from 'antd'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

const TrackSubjectTable = ({
    cb = async () => { }, onOpen, trackId, trackSubj, acadyear, setRendering
}) => {
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState();
    const [disableDeleteBtn, setDisableDeleteBtn] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let selectedValue = []
        if (selectedKeys == "all") {
            selectedValue = trackSubj.map(subj => subj.subject_code)
        } else {
            selectedValue = [...selectedKeys.values()]
        }
        setSelectedSubject(selectedValue)
        setDisableDeleteBtn(selectedValue.length == 0)
    }, [selectedKeys])


    const deleteSubjectsInTrack = useCallback(async (trackId, ids) => {
        try {
            setIsDeleting(true)
            setRendering(true)
            const option = await getOptions(`/api/tracks/subjects/${trackId}`, "DELETE", ids)
            await axios(option)
            await cb(acadyear)
            setSelectedKeys([])
        } catch (error) {
            console.log(error);
            message.error("ไม่สามารถลบวิชาได้ ลองใหม่อีกครั้ง")
        } finally {
            setIsDeleting(false)
            setRendering(false)
        }
    }, [acadyear])

    const handleDelete = useCallback(async (trackId, ids) => {
        swal.fire({
            text: `ต้องการลบคำร้องหรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteSubjectsInTrack(trackId, ids)
            }
        });

    }, [])

    return (
        <div className='border p-4 rounded-[10px] w-full'>
            <div className='flex flex-row justify-between items-center rounded-md mb-3'>
                <h2 className='text-small text-default-900'>วิชาที่ใช้ในการคัดเลือก</h2>
                <div className='flex flex-col gap-2 md:flex-row'>
                    <Button
                        radius='sm'
                        size='sm'
                        color='default'
                        startContent={<PlusIcon className="w-5 h-5" />}
                        onClick={onOpen}
                        className={`bg-gray-300 ${insertColor.color}`}>
                        เพิ่มวิขา
                    </Button>
                    <div className={`${disableDeleteBtn ? "cursor-not-allowed" : ""} max-md:w-full`}>
                        <Button
                            isDisabled={disableDeleteBtn || isDeleting}
                            isLoading={isDeleting}
                            radius='sm'
                            size='sm'
                            color='danger'
                            startContent={<DeleteIcon2 className="w-5 h-5" />}
                            onClick={() => handleDelete(trackId, selectedSubject)}
                            className='bg-red-400 max-md:w-full'>
                            ลบวิชา
                        </Button>
                    </div>
                </div>
            </div>
            {trackSubj &&
                <Table
                    className='overflow-x-auto'
                    classNames={minimalTableClass}
                    removeWrapper
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    onRowAction={() => { }}
                    aria-label="track selection subjects table">
                    <TableHeader>
                        <TableColumn>Actions</TableColumn>
                        <TableColumn>รหัสวิชา</TableColumn>
                        <TableColumn>ชื่อวิชา EN</TableColumn>
                        <TableColumn>ชื่อวิชา TH</TableColumn>
                        <TableColumn>หน่วยกิต</TableColumn>
                    </TableHeader>
                    {trackSubj.length > 0 ?
                        <TableBody>
                            {trackSubj.map(subj => (
                                <TableRow key={subj.subject_code}>
                                    <TableCell className=''>
                                        <Tooltip color="danger" content="ลบ">
                                            <span
                                                onClick={() => handleDelete(trackId, [subj.subject_code])}
                                                className="text-lg text-danger cursor-pointer active:opacity-50">
                                                <DeleteIcon2 />
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className=''>{subj.subject_code}</TableCell>
                                    <TableCell className="w-1/3">{subj.title_en}</TableCell>
                                    <TableCell className="w-1/3">{subj.title_th}</TableCell>
                                    <TableCell className='text-center'>{subj.credit}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody> :
                        <TableBody emptyContent={
                            <Empty
                                description={
                                    <span className='text-default-300'>ไม่มีวิชาที่ใช้ในการคัดเลือก</span>
                                }
                            />
                        }>{[]}</TableBody>}
                </Table>
            }
        </div>
    )
}

export default TrackSubjectTable