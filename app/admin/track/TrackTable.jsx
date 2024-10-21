"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeleteIcon, DeleteIcon2, EditIcon2, PlusIcon, SearchIcon } from '@/app/components/icons'
import { Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import Link from 'next/link'
import { TbRestore } from 'react-icons/tb'
import { inputClass, minimalTableClass } from '@/src/util/ComponentClass'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Empty, message } from 'antd'

const TrackTable = ({ tracks, fetching, callBack }) => {

    const INITIAL_VISIBLE_COLUMNS = useMemo(() => (
        ["track", "title_en", "title_th", "actions"]
    ), [])
    const columns = useMemo(() => (
        [{
            name: "ID",
            uid: "id",
            sortable: true
        },
        {
            name: "Track",
            uid: "track",
            sortable: true
        },
        // {
        //     name: "ชื่อแทร็ก (EN)",
        //     uid: "title_en",
        //     sortable: true
        // },
        {
            name: "ชื่อแทร็ก (TH)",
            uid: "title_th",
            sortable: true
        },
        {
            name: "Actions",
            uid: "actions",
        },
        ]), [])
    const [disableDeleteBtn, setDisableDeleteBtn] = useState(true);
    const [deleting, setDeleting] = useState(false);

    // State
    const [selectedTracks, setSelectedTracks] = useState([])
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const hasSearchFilter = Boolean(filterValue);

    // Init column
    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    // Filtering handle
    const filteredItems = useMemo(() => {
        let filteredTracks = [...tracks];

        if (filterValue) {
            filteredTracks = filteredTracks.filter((track) =>
                track.track.toLowerCase().includes(filterValue.toLowerCase()) ||
                track.title_en.toLowerCase().includes(filterValue.toLowerCase()) ||
                track.title_th.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        return filteredTracks;
    }, [filterValue, tracks]);

    // Paging
    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    // Sorting data
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    // Display table body
    const renderCell = useCallback((track, columnKey) => {
        const cellValue = track[columnKey] || ""
        switch (columnKey) {
            case "track":
                return (
                    <div>
                        <Link
                            className='text-blue-500'
                            href={`/admin/track/detail?track=${cellValue}`}>
                            {cellValue}
                        </Link>
                    </div>
                )
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <Link href={`/admin/track/detail?track=${track.track}`}>
                            <Tooltip
                                content="แก้ไข"
                            >
                                <Button
                                    size='sm'
                                    color='warning'
                                    isIconOnly
                                    aria-label="แก้ไข"
                                    className='p-2'
                                >
                                    <EditIcon2 className="w-5 h-5 text-yellow-600" />
                                </Button>
                            </Tooltip>
                        </Link>
                        <Tooltip
                            content="ลบ"
                        >
                            <Button
                                onPress={() => handleDelete([track.track])}
                                size='sm'
                                color='danger'
                                isIconOnly
                                aria-label="ลบ"
                                className='p-2 bg-red-400'
                            >
                                <DeleteIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

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

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    // Searching handle
    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    // Multiple deleted
    useEffect(() => {
        let students
        if (selectedKeys == "all") {
            students = sortedItems.map(e => e.track)
            setDisableDeleteBtn(false)
        } else {
            students = [...selectedKeys.values()]
            if (students.length === 0) {
                setDisableDeleteBtn(true)
            } else {
                setDisableDeleteBtn(false)
            }
        }
        setSelectedTracks(students)
    }, [selectedKeys])

    const swal = useCallback(Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
            cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
        },
        buttonsStyling: false
    }), [])

    const handleDelete = useCallback(async (selectedTracks) => {
        swal.fire({
            text: `ต้องการลบข้อมูลแทร็กหรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeleting(true)
                const options = await getOptions("/api/tracks/multiple", 'DELETE', selectedTracks)
                axios(options)
                    .then(async result => {
                        const { message: msg } = result.data
                        message.success(msg)
                        callBack()
                        setSelectedKeys([])
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        setDeleting(false)
                    })
            }
        });
    }, [])

    const bottomContent = useMemo(() => {
        return (
            Object.keys(tracks).length > 0 ?
                <div className="py-2 px-2 flex justify-end items-center">
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
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <div className="space-y-4 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-2xl font-bold">ตารางข้อมูลแทร็ก</h2>
                <div className="flex gap-4">
                    <Link href="/admin/track/insert-track">
                        <Button
                            radius='sm'
                            size='sm'
                            className='bg-[#edf8f7] text-[#46bcaa]'
                            startContent={<PlusIcon className="w-5 h-5" />}>
                            เพิ่มแทร็ก
                        </Button>
                    </Link>
                    <Link href="/admin/track/restore">
                        <Button
                            size="sm"
                            radius="sm"
                            color="default"
                            className='bg-[#edf0ff] text-[#4d69fa]'
                            startContent={<TbRestore className="w-4 h-4" />}>
                            รายการที่ถูกลบ
                        </Button>
                    </Link>
                    <Button
                        isDisabled={disableDeleteBtn || deleting}
                        isLoading={deleting}
                        radius='sm'
                        size='sm'
                        onClick={() => handleDelete(selectedTracks)}
                        color='danger'
                        className='bg-red-400'
                        startContent={<DeleteIcon className="w-4 h-4" />}>
                        ลบ
                    </Button>
                </div>
            </div>
            <Input
                isClearable
                className="w-full h-fit"
                placeholder="ค้นหาแทร็ก"
                size="sm"
                classNames={inputClass}
                startContent={<SearchIcon />}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
            />
            <div className='p-4 border rounded-[10px]'>
                <Table
                    aria-label="Student Table"
                    checkboxesProps={{
                        classNames: {
                            wrapper: "after:bg-blue-500 after:text-background text-background",
                        },
                    }}
                    classNames={minimalTableClass}

                    isStriped
                    removeWrapper
                    selectionMode="multiple"
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    onRowAction={() => { }}
                >
                    <TableHeader columns={headerColumns}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={column.uid === "actions" ? "center" : "start"}
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        isLoading={fetching}
                        loadingContent={<Spinner />}
                        emptyContent={
                            <Empty
                                className='my-4'
                                description={
                                    <span className='text-gray-300'>ไม่มีข้อมูลแทร็ก</span>
                                }
                            />
                        }
                        items={sortedItems}>
                        {(item) => (
                            <TableRow key={item.track}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {bottomContent}
        </div>
    )
}

export default TrackTable