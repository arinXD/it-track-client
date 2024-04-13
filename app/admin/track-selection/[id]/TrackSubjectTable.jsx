"use client"
import { DeleteIcon2, PlusIcon } from '@/app/components/icons'
import { tableClass } from '@/src/util/ComponentClass'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd } from '@nextui-org/react'
import { useEffect, useState } from 'react'

const TrackSubjectTable = ({ trackSubj, swal, showToastMessage, onOpen,
    trackId, }) => {
    // const [selectedKeys, setSelectedKeys] = useState([]);
    // const [selectedSubject, setSelectedSubject] = useState();
    // const [disableDeleteBtn, setDisableDeleteBtn] = useState(true);
    // const [isDeleting, setIsDeleting] = useState(false);

    // useEffect(() => {
    //     let selectedValue = []
    //     if (selectedKeys == "all") {
    //         selectedValue = trackSubj.map(subj => subj.subject_code)
    //     } else {
    //         selectedValue = [...selectedKeys.values()]
    //     }
    //     setDisableDeleteBtn(selectedValue.length == 0)
    // }, [selectedKeys])

    return (
        <div>
            <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-md mb-3'>
                <h2 className='text-small text-default-900'>วิชาที่ใช้ในการคัดเลือก</h2>
                {/* <div className='flex gap-2'>
                    <Button
                        radius='sm'
                        size='sm'
                        color='default'
                        startContent={<PlusIcon className="w-5 h-5" />}
                        onClick={onOpen}
                        className='bg-gray-300'>
                        เพิ่มวิขา
                    </Button>
                    <div className={disableDeleteBtn ? "cursor-not-allowed" : ""}>
                        <Button
                            isDisabled={disableDeleteBtn || isDeleting}
                            radius='sm'
                            size='sm'
                            color='default'
                            startContent={<DeleteIcon2 className="w-5 h-5" />}
                            onClick={onOpen}
                            className='bg-gray-300'>
                            ลบวิชา
                        </Button>
                    </div>
                </div> */}
            </div>
            {trackSubj &&
                <Table
                    classNames={tableClass}
                    removeWrapper
                    // selectionMode="multiple"
                    // selectedKeys={selectedKeys}
                    // onSelectionChange={setSelectedKeys}
                    onRowAction={() => { }}
                    aria-label="track selection subjects table">
                    <TableHeader>
                        <TableColumn>รหัสวิชา</TableColumn>
                        <TableColumn>ชื่อวิชา EN</TableColumn>
                        <TableColumn>ชื่อวิชา TH</TableColumn>
                        <TableColumn>หน่วยกิต</TableColumn>
                    </TableHeader>
                    {trackSubj.length > 0 ?
                        <TableBody>
                            {trackSubj.map(subj => (
                                <TableRow key={subj.subject_code}>
                                    <TableCell className=''>{subj.subject_code}</TableCell>
                                    <TableCell className="w-1/3">{subj.title_en}</TableCell>
                                    <TableCell className="w-1/3">{subj.title_th}</TableCell>
                                    <TableCell>{subj.credit}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody> :
                        <TableBody emptyContent={"ไม่มีวิชาที่ใช้ในการคัดเลือก"}>{[]}</TableBody>}
                </Table>
            }
        </div>
    )
}

export default TrackSubjectTable