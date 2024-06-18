"use client"
import { DeleteIcon2, PlusIcon } from "@/app/components/icons";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { Empty, message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import InsertSubjectModal from "./InsertSubjectModal";
import Swal from "sweetalert2";

const TrackSubject = ({ track }) => {
    const [fetching, setFetching] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [disableSelectDelete, setDisableSelectDelete] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectSubjects, setSelectSubjects] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleting, setDeleting] = useState(false);

    const getSubjects = useCallback(async () => {
        setFetching(true)
        const URL = `/api/subjects/tracks/${track}`
        const option = await getOptions(URL, "GET")
        try {
            const res = await axios(option)
            const teachers = res.data.data
            setSubjects(teachers)
        } catch (error) {
            setSubjects([])
        } finally {
            setFetching(false)
        }

    }, [])

    const swal = useCallback(Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
            cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
        },
        buttonsStyling: false
    }), [])

    const handleSelectDelete = useCallback(async (selectSubjects) => {
        const { value } = await swal.fire({
            text: `ต้องการลบวิชาภายในแทร็กหรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        });

        if (value) {
            const formData = selectSubjects
            const url = `/api/subjects/tracks/${track}`
            const option = await getOptions(url, "DELETE", formData)
            try {
                setDeleting(true)
                const res = await axios(option)
                const { message: successMesg } = res.data
                message.success(successMesg)
                getSubjects()
            } catch (error) {
                console.log(error);
                const errMessage = error.response.data.message
                message.error(errMessage)
            } finally {
                setDeleting(false)
                setSelectedKeys([])
            }
        }

    }, [])

    useEffect(() => {
        getSubjects()
    }, [])

    useEffect(() => {
        let subject
        if (selectedKeys == "all") {
            subject = subjects.map(e => e.subject_id)
            setDisableSelectDelete(false)
        } else {
            subject = [...selectedKeys.values()].map(e => parseInt(e))
            if (subject.length === 0) {
                setDisableSelectDelete(true)
            } else {
                setDisableSelectDelete(false)
            }
        }
        setSelectSubjects(subject)
    }, [selectedKeys, subjects])

    return (
        <div className="border rounded-[10px] p-4 h-full w-full">
            <InsertSubjectModal
                isOpen={isOpen}
                onClose={onClose}
                track={track}
                callBack={getSubjects}
            />
            <div className='flex flex-row justify-between items-center rounded-md mb-4'>
                <p className="text-sm">รายวิชาประจำแทร็ก</p>
                <div className="flex gap-4">
                    <Button
                        size="sm"
                        className='bg-[#edf8f7] text-[#46bcaa]'
                        radius="sm"
                        color="default"
                        onPress={onOpen}
                        startContent={<PlusIcon className="w-5 h-5" />}>
                        เพิ่มวิชา
                    </Button>
                    <Button
                        radius="sm"
                        size="sm"
                        isDisabled={disableSelectDelete || deleting}
                        isLoading={deleting}
                        onPress={() => handleSelectDelete(selectSubjects)}
                        color='danger'
                        className='bg-red-400'
                        startContent={<DeleteIcon2 className="w-5 h-5" />}>
                        ลบ
                    </Button>
                </div>
            </div>
            {
                fetching ?
                    <div className='w-full flex justify-center my-6'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div> :
                    <div>
                        {subjects && Object.keys(subjects).length > 0 ?
                            <Table
                                aria-label="track subject table"
                                checkboxesProps={{
                                    classNames: {
                                        wrapper: "after:bg-blue-500 after:text-background text-background",
                                    },
                                }}
                                classNames={{
                                    th: ["bg-[#F6F6F6]", "text-black", "last:text-center"],
                                    td: [
                                        // first
                                        "group-data-[first=true]:first:before:rounded-none",
                                        "group-data-[first=true]:last:before:rounded-none",
                                        // middle
                                        "group-data-[middle=true]:before:rounded-none",
                                        // last
                                        "group-data-[last=true]:first:before:rounded-none",
                                        "group-data-[last=true]:last:before:rounded-none",
                                        "mb-4",
                                    ],
                                }}
                                isStriped
                                removeWrapper
                                selectionMode="multiple"
                                selectedKeys={selectedKeys}
                                onSelectionChange={setSelectedKeys}
                            >
                                <TableHeader>
                                    <TableColumn style={{ display: "none" }}>ID</TableColumn>
                                    <TableColumn>รหัสวิชา</TableColumn>
                                    <TableColumn>ชื่อวิชา (EN)</TableColumn>
                                    <TableColumn>ชื่อวิชา (TH)</TableColumn>
                                    <TableColumn className="text-center">หน่วยกิต</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent={"ไม่มีข้อมูลรายวิชา"} items={subjects}>
                                    {(item) => (
                                        <TableRow key={item.subject_id}>
                                            <TableCell style={{ display: "none" }}>{item.subject_id}</TableCell>
                                            <TableCell>{item?.subject_code}</TableCell>
                                            <TableCell>{item?.title_en}</TableCell>
                                            <TableCell>{item?.title_th}</TableCell>
                                            <TableCell className="text-center">{item?.credit}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            :
                            <Empty
                                className='my-6'
                                description={
                                    <span className='text-gray-300'>ไม่มีข้อมูลวิชา</span>
                                } />
                        }
                    </div>
            }
        </div>
    )
}

export default TrackSubject