"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeleteIcon2, PlusIcon, SearchIcon } from '@/app/components/icons'
import { Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import Link from 'next/link'
import { TbRestore } from 'react-icons/tb'
import { inputClass } from '@/src/util/ComponentClass'

const TrackTable = ({ tracks, fetching, openInsertModal }) => {

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
        {
            name: "ชื่อแทรค (EN)",
            uid: "title_en",
            sortable: true
        },
        {
            name: "ชื่อแทรค (TH)",
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
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <Link href={`/admin/track/detail?track=${track.track}`}>
                            <Button
                                radius='sm'
                                size="sm"
                                color='default'
                                className=''
                            >
                                รายละเอียด
                            </Button>
                        </Link>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [deleting]);

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

    const handleDelete = useCallback((selectedTracks) => {
        console.log("del", selectedTracks);
    }, [selectedTracks])

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className='bg-gray-100 border-gray-200 border-1 p-2 flex flex-row justify-between items-center gap-2 rounded-md'>
                    <h1>ข้อมูลแทรค</h1>
                    <div className="flex gap-2">
                        <Button
                            radius='sm'
                            size='sm'
                            onPress={openInsertModal}
                            startContent={<PlusIcon className="w-5 h-5" />}>
                            เพิ่มแทรค
                        </Button>
                        <Link href="/admin/track/restore">
                            <Button
                                size="sm"
                                radius="sm"
                                color="default"
                                className="bg-gray-300"
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
                            startContent={<DeleteIcon2 className="w-5 h-5" />}>
                            ลบ
                        </Button>
                    </div>
                </div>
                <Input
                    isClearable
                    className="w-full h-fit"
                    placeholder="ค้นหาแทรค"
                    size="sm"
                    classNames={inputClass}
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                />
            </div>
        );
    }, [
        filterValue,
        visibleColumns,
        onRowsPerPageChange,
        onSearchChange,
        hasSearchFilter,
        disableDeleteBtn,
        selectedTracks
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
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
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <div>
            <Table
                aria-label="Student Table"
                checkboxesProps={{
                    classNames: {
                        wrapper: "after:bg-blue-500 after:text-background text-background",
                    },
                }}
                classNames={{
                    table: "min-h-[250px]",
                }}

                bottomContent={bottomContent}
                bottomContentPlacement="outside"

                topContent={topContent}
                topContentPlacement="outside"

                isCompact
                removeWrapper
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
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
                    // emptyContent={"ไม่มีข้อมูลแทรค"}
                    items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.track}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default TrackTable