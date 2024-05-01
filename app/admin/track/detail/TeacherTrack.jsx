"use client"

import { DeleteIcon2, EditIcon2, PlusIcon } from "@/app/components/icons";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { Button, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import InsertTeacherModal from "./InsertTeacherModal";
import EditTeacherModal from "./EditTeacherModal";

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

    // Paging
    const pages = useMemo(() => (Math.ceil(teachers.length / rowsPerPage)), [teachers, rowsPerPage]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return teachers.slice(start, end);
    }, [page, teachers, rowsPerPage]);

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

    // Pagination handle
    const onNextPage = useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${teachers.length} selected`}
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
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, teachers, page, pages]);

    useEffect(() => {
        getTeachers()
    }, [])

    // Multiple deleted
    useEffect(() => {
        let teacher
        if (selectedKeys == "all") {
            teacher = items.map(e => e.id)
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

    const handleDelete = useCallback((selectedTeachers) => {
        console.log("del", selectedTeachers);
    }, [])

    const [editName, setEditName] = useState("");
    const [editImage, setEditImage] = useState("");

    const handleEditTeacher = (image, teacherName) => {
        setEditName(teacherName)
        setEditImage(image)
        onOpenEdit()
    }

    return (
        <div>
            <InsertTeacherModal
                getTeachers={getTeachers}
                track={track}
                isOpen={isOpen}
                onClose={onClose} />

            <EditTeacherModal
                editName={editName}
                src={editImage}
                getTeachers={getTeachers}
                isOpen={isOpenEdit}
                onClose={onCloseEdit} />

            <div className='bg-gray-100 border-gray-200 border-1 p-2 flex flex-row justify-between items-end rounded-md mb-4'>
                <p>คณาจารย์ประจำแทรค</p>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="bg-gray-300"
                        radius="sm"
                        color="default"
                        onPress={() => {
                            onOpen()
                            setmodalTitle("แบบฟอร์มเพิ่มคณาจารย์ประจำแทรค")
                        }}
                        startContent={<PlusIcon className="w-5 h-5" />}>
                        เพิ่มรายชื่อ
                    </Button>
                    <Button
                        radius="sm"
                        size="sm"
                        isDisabled={disableSelectDelete}
                        onPress={() => handleDelete(selectedTeachers)}
                        color="default"
                        className="bg-gray-300"
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
                        <Table
                            aria-label="teachers tracks table"
                            checkboxesProps={{
                                classNames: {
                                    wrapper: "after:bg-blue-500 after:text-background text-background",
                                },
                            }}

                            bottomContent={bottomContent}
                            bottomContentPlacement="outside"

                            isCompact
                            removeWrapper
                            selectionMode="multiple"

                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                        >
                            <TableHeader>
                                <TableColumn style={{ display: "none" }}>ID</TableColumn>
                                <TableColumn className="w-1/2 text-center">รูป</TableColumn>
                                <TableColumn className="w-1/2">ชื่ออาจารย์</TableColumn>
                                <TableColumn align="center" className="w-1/2">Actions</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"ไม่มีข้อมูลอาจารย์"} items={items}>
                                {(item) => (
                                    <TableRow key={item.id}>
                                        <TableCell style={{ display: "none" }}>{item.id}</TableCell>
                                        <TableCell className="w-1/2">
                                            <div className="w-full flex justify-center p-2">
                                                <img
                                                    width={120}
                                                    height={120}
                                                    src={item.image || "/image/user.png"}
                                                    className=""
                                                    alt={item.teacherName} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-1/2">{item.teacherName}</TableCell>
                                        <TableCell className="w-1/2">
                                            <Tooltip content="แก้ไข">
                                                <Button
                                                    size="sm"
                                                    radius="sm"
                                                    isIconOnly
                                                    color="default"
                                                    onClick={() => handleEditTeacher(item.image, item.teacherName)}
                                                    aria-label="Edit">
                                                    <EditIcon2 className="w-5 h-5" />
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
            }
        </div>
    )
}

export default TeacherTrack