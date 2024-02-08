import React from 'react'
import { Tooltip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { EyeIcon } from "@/app/components/icons";
import Link from 'next/link';
import { dMy } from '@/src/util/dateFormater'

function displayNull(string) {
    if (string) return string
    return "-"
}

const StudentTrackTable = ({ studentData, track }) => {
    const students = studentData?.students
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...students];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
        //     filteredUsers = filteredUsers.filter((user) =>
        //         Array.from(statusFilter).includes(user.status),
        //     );
        // }

        return filteredUsers;
    }, [studentData?.students, filterValue]);

    // Calculate total pages whenever studentData or rowsPerPage changes
    const pages = Math.ceil(studentData?.students?.length / rowsPerPage);

    // Memoized items based on current page and rowsPerPage
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return studentData?.students?.slice(start, end);
    }, [page, rowsPerPage, studentData?.students]);

    // Handlers for pagination controls
    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        const newRowsPerPage = Number(e.target.value);
        setRowsPerPage(newRowsPerPage);
        // Ensure page is valid with new rowsPerPage
        const newPage = Math.max(1, Math.min(page, Math.ceil(studentData?.students?.length / newRowsPerPage)));
        setPage(newPage);
    }, [page, studentData?.students]);


    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%] h-fit"
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">นักศึกษาทั้งหมด {items?.length} คน</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        onRowsPerPageChange,
        items?.length,
        onSearchChange,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
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
    }, [items?.length, page, pages]);

    return (
        <div>
            <h2 id={`${track.toLowerCase()}-students`} className='mb-1'>
                รายชื่อนักศึกษาแทรค {track} จำนวน {studentData?.students?.length} คน
                โครงการปกติ {studentData?.normal} คน
                โครงการพิเศษ {studentData?.vip} คน
            </h2>
            {studentData &&
                <Table
                    aria-label={`Student Track Table`}
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    isStriped
                    removeWrapper
                    selectionMode="multiple"
                    classNames={{
                        wrapper: "max-h-[382px]",
                    }}
                    // onSelectionChange={setSelectedKeys}
                    onRowAction={() => { }}>
                    <TableHeader>
                        <TableColumn></TableColumn>
                        <TableColumn>No.</TableColumn>
                        <TableColumn>รหัสนักศึกษา</TableColumn>
                        <TableColumn>ชื่อ - สกุล</TableColumn>
                        <TableColumn>โครงการ</TableColumn>
                        <TableColumn>แทรคที่ได้</TableColumn>
                        <TableColumn>เลือกลำดับ 1</TableColumn>
                        <TableColumn>เลือกลำดับ 2</TableColumn>
                        <TableColumn>เลือกลำดับ 3</TableColumn>
                        <TableColumn>วันที่ยืนยัน</TableColumn>
                    </TableHeader>
                    {items?.length > 0 ?
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="relative flex items-center gap-3 w-fit">
                                            <Tooltip content="รายละเอียด">
                                                <Link href={``} className='focus:outline-none'>
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                        <EyeIcon />
                                                    </span>
                                                </Link>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.stu_id}</TableCell>
                                    <TableCell><span>{item?.Student?.first_name} {item?.Student?.last_name}</span></TableCell>
                                    <TableCell>{item?.Student?.courses_type}</TableCell>
                                    <TableCell>
                                        {item.result ? item.result : "รอการคัดเลือก"}
                                    </TableCell>
                                    <TableCell>{displayNull(item.track_order_1)}</TableCell>
                                    <TableCell>{displayNull(item.track_order_2)}</TableCell>
                                    <TableCell>{displayNull(item.track_order_3)}</TableCell>
                                    <TableCell>{dMy(item.updatedAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody> :
                        <TableBody emptyContent={"ไม่มีรายชื่อนักศึกษา"}>{[]}</TableBody>}
                </Table>
            }
        </div>
    )
}

export default StudentTrackTable
