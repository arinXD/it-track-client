"use client"
import { DeleteIcon2, EditIcon2, PlusIcon } from "@/app/components/icons";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { Button, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import InsertTeacherModal from "./InsertTeacherModal";
import EditTeacherModal from "./EditTeacherModal";
import { Empty, Image, message } from "antd";
import Swal from "sweetalert2";

const TeacherTrack = ({ track }) => {
    const [fetching, setFetching] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [disableSelectDelete, setDisableSelectDelete] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedTeachers, setSelectedTeachers] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
    const [emptyTeachers, setEmptyTeachers] = useState([]);

    const [teacherEditData, setTeacherEditData] = useState({});

    // Paging
    const pages = useMemo(() => (Math.ceil(teachers.length / rowsPerPage)), [teachers, rowsPerPage]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return teachers.slice(start, end);
    }, [page, teachers, rowsPerPage]);

    const getEmptyTeachers = useCallback(async () => {
        const option = await getOptions("/api/teachers/tracks/empty/teachers", "get")
        try {
            const data = (await axios(option)).data?.data
            setEmptyTeachers(data)
        } catch (error) {
            setEmptyTeachers([])
        }
    }, [])

    const getTeachers = useCallback(async () => {
        setFetching(true)
        const URL = `/api/teachers/tracks/${track}`
        const option = await getOptions(URL, "GET")
        try {
            const res = await axios(option)
            const teachers = res.data.data
            setTeachers(teachers)
        } catch (error) {
            setTeachers([])
        } finally {
            setFetching(false)
        }

    }, [])

    const initData = useCallback(async () => {
        await Promise.all([getTeachers(), getEmptyTeachers()])
    }, [])

    useEffect(() => {
        initData()
    }, [])

    // Multiple deleted
    useEffect(() => {
        let teacher
        if (selectedKeys == "all") {
            teacher = items.map(e => e?.TeacherTrack?.id)
            setDisableSelectDelete(false)
        } else {
            teacher = [...selectedKeys.values()].map(id => parseInt(id))
            if (teacher.length === 0) {
                setDisableSelectDelete(true)
            } else {
                setDisableSelectDelete(false)
            }
        }
        setSelectedTeachers(teacher)
    }, [selectedKeys])

    const handleDelete = useCallback(async (selectedTeachers) => {
        const swal = Swal.mixin({
            customClass: {
                confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
                cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
            },
            buttonsStyling: false
        });
        const { value } = await swal.fire({
            text: `ต้องการลบข้อมูลอาจารย์หรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        });

        if (value) {
            const URL = '/api/teachers/tracks'
            const option = await getOptions(URL, "DELETE", selectedTeachers)
            try {
                await axios(option)
                await initData()
                message.success("ลบข้อมูลสำเร็จ")
            } catch (error) {
                console.log(error);
                message.success("ลบข้อมูลไม่สำเร็จ")
            } finally {
                setSelectedKeys([])
            }
        }
    }, [])

    const handleEditTeacher = useCallback((teacherData) => {
        setTeacherEditData(teacherData)
        onOpenEdit()
    }, [])

    const bottomContent = useMemo(() => {
        return (
            teachers?.length > 0 ?
                <div className="w-full py-2 px-2 flex justify-between items-center">
                    <span className="w-[30%] text-small text-default-400">
                        {selectedKeys === "all"
                            ? "เลือกทั้งหมด"
                            : `เลือก ${selectedKeys.size || 0} ใน ${teachers.length}`}
                    </span>
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                </div>
                :
                undefined
        );
    }, [selectedKeys, teachers, page, pages]);

    return (
        <div className="border-1 p-4 rounded-[10px] h-full w-full">
            <InsertTeacherModal
                emptyTeachers={emptyTeachers}
                fn={initData}
                track={track}
                isOpen={isOpen}
                onClose={onClose} />

            <EditTeacherModal
                teacher={teacherEditData}
                fn={initData}
                isOpen={isOpenEdit}
                onClose={onCloseEdit} />

            <div className='flex flex-row flex-wrap gap-2 justify-between items-center rounded-md mb-4'>
                <p className="text-sm">คณาจารย์ประจำแทร็ก</p>
                <div className="flex gap-4">
                    <Button
                        size="sm"
                        className='bg-[#edf8f7] text-[#46bcaa]'
                        radius="sm"
                        color="default"
                        onPress={() => {
                            onOpen()
                        }}
                        startContent={<PlusIcon className="w-5 h-5" />}>
                        เพิ่ม
                    </Button>
                    <Button
                        radius="sm"
                        size="sm"
                        isDisabled={disableSelectDelete}
                        onPress={() => handleDelete(selectedTeachers)}
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
                    <div className="w-full h-fit overflow-x-scroll">
                        <Table
                            aria-label="teachers tracks table"
                            checkboxesProps={{
                                classNames: {
                                    wrapper: "after:bg-blue-500 after:text-background text-background",
                                },
                            }}
                            isCompact
                            removeWrapper
                            selectionMode="multiple"

                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                            onRowAction={() => { }}
                        >
                            <TableHeader>
                                <TableColumn className="w-1/2 text-center">รูป</TableColumn>
                                <TableColumn className="w-1/2">ชื่ออาจารย์</TableColumn>
                                <TableColumn align="center" className="w-1/2">Actions</TableColumn>
                            </TableHeader>
                            <TableBody
                                emptyContent={
                                    <Empty
                                        className='my-6'
                                        description={
                                            <span className='text-gray-300'>ไม่มีข้อมูลคณาจารย์</span>
                                        } />
                                }
                                items={items}>
                                {(item) => (
                                    <TableRow key={item?.TeacherTrack?.id}>
                                        <TableCell>
                                            <div className="w-full flex justify-center p-2">
                                                <Image
                                                    width={80}
                                                    height={80}
                                                    src={item?.TeacherTrack?.image || ""}
                                                    fallback="/image/error_image.png"
                                                    className="rounded-md object-cover "
                                                    alt={item.name} />
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.prefix}{item.name} {item.surname}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center items-center">
                                                <Tooltip content="แก้ไข">
                                                    <Button
                                                        size="sm"
                                                        radius="sm"
                                                        isIconOnly
                                                        color='warning'
                                                        onClick={() => handleEditTeacher(item)}
                                                        aria-label="Edit">
                                                        <EditIcon2 className="w-5 h-5 text-yellow-600" />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
            }
            {bottomContent}
        </div>
    )
}

export default TeacherTrack