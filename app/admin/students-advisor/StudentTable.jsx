"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Link, useDisclosure, Tooltip, Spinner } from "@nextui-org/react";
import { PlusIcon, SearchIcon, ChevronDownIcon, DeleteIcon2, DeleteIcon, EditIcon2 } from "@/app/components/icons";
import { capitalize } from "@/src/util/utils";
import { fetchData } from '../action'
import { getAcadyears } from "@/src/util/academicYear";
import { deleteColor, insertColor, minimalTableClass, restoreColor, thinInputClass } from "@/src/util/ComponentClass";
import { RiFileExcel2Fill } from "react-icons/ri";
import { SiGoogleforms } from "react-icons/si";
import { Empty, message } from "antd";
import { IoMdEye } from "react-icons/io";
import { swal } from "@/src/util/sweetyAlert";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import { HiOutlineAcademicCap } from "react-icons/hi2";

const StudentTable = ({ email }) => {

     const INITIAL_VISIBLE_COLUMNS = useMemo(() => (
          ["stu_id", "fullName", "courses_type", "program", "acadyear", "status_code", "actions"]
     ), [])
     const columns = useMemo(() => ([{
          name: "ID",
          uid: "id",
          sortable: true
     },
     {
          name: "รหัสนักศึกษา",
          uid: "stu_id",
          sortable: true
     },
     {
          name: "ชื่อ-สกุล",
          uid: "fullName",
          sortable: true
     },
     {
          name: "โครงการ",
          uid: "courses_type",
          sortable: true
     },
     {
          name: "หลักสูตร",
          uid: "program"
     },
     {
          name: "ปีการศึกษา",
          uid: "acadyear",
     },
     {
          name: "สถานะภาพ",
          uid: "status_code",
          sortable: true
     },
     {
          name: "ACTIONS",
          uid: "actions"
     },
     ]), [])

     // State
     const [fetching, setFetching] = useState(true)
     const acadyears = getAcadyears()
     const [selectProgram, setSelectProgram] = useState(null)
     const [selectAcadYear, setSelectAcadYear] = useState(acadyears[0])
     const [students, setStudents] = useState([])
     const [programs, setPrograms] = useState([])
     const [disableSelectDelete, setDisableSelectDelete] = useState(false)
     const [selectedStudents, setSelectedStudents] = useState([])
     const [statusOptions, setStatusOptions] = useState([])
     const [filterValue, setFilterValue] = useState("");
     const [selectedKeys, setSelectedKeys] = useState(new Set([]));
     const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
     const [statusFilter, setStatusFilter] = useState(["10", "50", "62"]);
     const [rowsPerPage, setRowsPerPage] = useState(50);
     const [sortDescriptor, setSortDescriptor] = useState({
          column: "id",
          direction: "ascending",
     });
     const [page, setPage] = useState(1);
     const hasSearchFilter = Boolean(filterValue)

     // Fetching data
     const getStudentStatuses = useCallback(async function () {
          try {
               const statuses = await fetchData("/api/statuses")
               setStatusOptions(statuses)
          } catch (err) {
               setStatusOptions([])
          }
     }, [])

     const getStudents = useCallback(async function (program = selectProgram, acadyear = selectAcadYear) {
          setFetching(true)
          localStorage.setItem("search-students-advisor", JSON.stringify({ program, acadyear }))
          try {
               let students = await fetchData(`/api/students/programs/${program}/acadyear/${acadyear}/advisor/${email}`)
               students.sort((a, b) => {
                    const order = {
                         "โครงการปกติ": 1,
                         "โครงการพิเศษ": 2
                    };
                    return order[a.courses_type] - order[b.courses_type];
               });
               console.log(students);
               setStudents(students);
          } catch (error) {
               setStudents([]);
          } finally {
               setFetching(false)
          }
     }, [selectProgram, selectAcadYear, email])

     const getPrograms = useCallback(async function () {
          try {
               const programs = await fetchData(`/api/programs`)
               setPrograms(programs)
          } catch (error) {
               setPrograms([])
          }
     }, [])

     const initData = useCallback(async function () {
          setFetching(true)
          await getPrograms()
          await getStudentStatuses()
          const searchItem = localStorage.getItem("search-students-advisor")
          if (searchItem) {
               const { program, acadyear } = JSON.parse(searchItem)
               setSelectProgram(program)
               setSelectAcadYear(acadyear)
               document.querySelector('#selectProgram').value = program
               document.querySelector('#selectAcadyear').value = acadyear
               await getStudents(program, acadyear)
          }
          setFetching(false)
     }, [])

     useEffect(() => {
          initData()
     }, [])

     // Init column
     const headerColumns = useMemo(() => {
          if (visibleColumns === "all") return columns;

          return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
     }, [visibleColumns]);

     // Filtering handle
     const filteredItems = useMemo(() => {
          let filteredUsers = [...students];

          if (hasSearchFilter) {
               filteredUsers = filteredUsers.filter((stu) =>
                    stu.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                    stu.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                    stu.stu_id.toLowerCase().includes(filterValue.toLowerCase()) ||
                    stu.email.toLowerCase().includes(filterValue.toLowerCase())
               );
          }
          if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
               filteredUsers = filteredUsers.filter((stu) =>
                    Array.from(statusFilter).includes(String(stu.status_code)),
               );
          }
          console.log(filteredUsers);
          return filteredUsers;
     }, [students, filterValue, statusFilter]);

     // Paging
     const pages = Math.ceil(filteredItems.length / rowsPerPage);

     const items = useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;

          return filteredItems.slice(start, end);
     }, [page, filteredItems, rowsPerPage]);

     // Sorting data
     const sortedItems = useMemo(() => {
          console.log(items);
          return [...items].sort((a, b) => {
               const first = a[sortDescriptor.column];
               const second = b[sortDescriptor.column];
               const cmp = first < second ? -1 : first > second ? 1 : 0;

               return sortDescriptor.direction === "descending" ? -cmp : cmp;
          });
     }, [sortDescriptor, items]);

     // Display table body
     const renderCell = useCallback((stu, columnKey) => {
          const cellValue = stu[columnKey];

          switch (columnKey) {
               case "stu_id":
                    return (
                         <div className="my-3">
                              <User
                                   avatarProps={{ src: stu?.User?.image || "/image/user.png" }}
                                   description={(
                                        <Link className="ms-2" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${stu.email}&authuser=1`} size="sm" isExternal>
                                             {stu.email}
                                        </Link>
                                   )}
                                   name={(<p className="ms-2">{cellValue}</p>)}
                              />
                         </div>
                    );
               case "fullName":
                    return (
                         <div className="flex flex-row gap-2">
                              <p className="w-full text-bold text-small capitalize">{stu.first_name}</p>
                              <p className="w-full text-bold text-small capitalize">{stu.last_name}</p>
                         </div>
                    );
               case "status_code":
                    return stu?.StudentStatus?.description
               case "actions":
                    return (
                         <div className="relative flex justify-center items-center gap-2">
                              <Link href={`/admin/students-advisor/${stu?.stu_id}`} target="_blank">
                                   <Tooltip
                                        content="รายละเอียด"
                                   >
                                        <Button
                                             size='sm'
                                             isIconOnly
                                             aria-label="รายละเอียด"
                                             className='p-2 bg-gray-200'
                                        >
                                             <IoMdEye className="w-5 h-5 text-gray-600" />
                                        </Button>
                                   </Tooltip>
                              </Link>
                              <Link href={`/admin/students-advisor/verify?std_id=${stu?.stu_id}`} target="_blank">
                                   <Tooltip
                                        content="ตรวจสอบสำเร็จการศึกษา"
                                   >
                                        <Button
                                             size='sm'
                                             isIconOnly
                                             aria-label="ตรวจสอบสำเร็จการศึกษา"
                                             className='p-2 bg-blue-500'
                                        >
                                             <HiOutlineAcademicCap className="w-5 h-5 text-white" />
                                        </Button>
                                   </Tooltip>
                              </Link>
                              <Link href={`/admin/students-advisor/${stu?.stu_id}?edit=1`} target="_blank">
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
                                        onPress={() => handleDelete([stu?.id])}
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
                    return cellValue
          }
     }, []);

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

     const handleDelete = useCallback(function (arr) {
          swal.fire({
               text: `ต้องการลบใช้หรือไม่ ?`,
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "ตกลง",
               cancelButtonText: "ยกเลิก",
               reverseButtons: true
          }).then(async (result) => {
               if (result.isConfirmed) {
                    const options = await getOptions(`/api/advisors/students/multiple`, 'DELETE', arr)
                    try {
                         await axios(options)
                         setFetching(true)
                         const searchItem = localStorage.getItem("search-students-advisor")
                         if (searchItem) {
                              const { program, acadyear } = JSON.parse(searchItem)
                              setSelectProgram(program)
                              setSelectAcadYear(acadyear)
                              document.querySelector('#selectProgram').value = program
                              document.querySelector('#selectAcadyear').value = acadyear
                              await getStudents(program, acadyear)
                         }
                         setSelectedKeys([])
                         message.success("ลบนักศึกษาออกจากที่ปรึกษาสำเร็จ")
                    } catch {
                         message.warning("ไม่สามารถลบนักศึกษาออกจากที่ปรึกษา")
                    } finally {
                         setFetching(false)
                    }
               }
          });
     }, [])

     // Multiple deleted
     useEffect(() => {
          let students
          if (selectedKeys == "all") {
               students = sortedItems.map(e => parseInt(e.id))
               setDisableSelectDelete(false)
          } else {
               students = [...selectedKeys.values()].map(id => parseInt(id))
               if (students.length === 0) {
                    setDisableSelectDelete(true)
               } else {
                    setDisableSelectDelete(false)
               }
          }
          setSelectedStudents(students)
     }, [selectedKeys])

     const removeStatusFilter = useCallback((id) => {
          setStatusFilter((prev) => {
               const newStatusFilter = [...prev]
               const index = newStatusFilter.indexOf(String(id));
               if (index > -1) {
                    newStatusFilter.splice(index, 1)
               }
               return newStatusFilter
          });
     }, [])

     const topContent = useMemo(() => {
          return (
               <div className="flex flex-col gap-2 mb-4">
                    {
                         students.length > 0 &&
                         <div className="flex flex-col text-small">
                              <div className="flex flex-col text-small mb-2 text-default-400 gap-2">
                                   <div>
                                        <p className="mb-1">สถานะ:</p>
                                        <div className="flex gap-2 flex-wrap">
                                             {statusFilter == "all" ?
                                                  statusOptions.map(s => (
                                                       <Chip
                                                            key={s.id}
                                                            size="sm"
                                                            radius="sm"
                                                            className="bg-gray-200 text-gray-600"
                                                            onClose={() => removeStatusFilter(s.id)}
                                                       >
                                                            {`${s.description} (${s.id})`}
                                                       </Chip>
                                                  ))
                                                  :
                                                  statusOptions
                                                       .filter(s => Array.from(statusFilter).includes(String(s.id)))
                                                       .map(s => (
                                                            <Chip
                                                                 key={s.id}
                                                                 size="sm"
                                                                 radius="sm"
                                                                 className="bg-gray-200 text-gray-600"
                                                                 onClose={() => removeStatusFilter(s.id)}
                                                            >
                                                                 {`${s.description} (${s.id})`}
                                                            </Chip>
                                                       ))
                                             }
                                        </div>
                                   </div>
                                   <div>
                                        <p className="mb-1">คอลัมน์: </p>
                                        <div className="flex gap-2 flex-wrap">
                                             {headerColumns.map(column => (
                                                  <Chip
                                                       key={column.name}
                                                       size="sm"
                                                       radius="sm"
                                                       className="bg-gray-200 text-gray-600"
                                                  >
                                                       {column.name}
                                                  </Chip>
                                             ))}
                                        </div>
                                   </div>
                              </div>
                              <div className="flex justify-between items-center">
                                   <span className="text-default-400 text-small">นักศึกษาทั้งหมด {students.length} คน</span>
                                   <label className="flex items-center text-default-400 text-small">
                                        Rows per page
                                        <select
                                             id="rowPerPage"
                                             className="ms-2 border-1 rounded-md bg-transparent outline-none text-default-400 text-small"
                                             onChange={onRowsPerPageChange}
                                        >
                                             <option value="50">50</option>
                                             <option value="100">100</option>
                                             <option value="150">150</option>
                                             <option value={students?.length}>ทั้งหมด</option>
                                        </select>
                                   </label>
                              </div>
                         </div>
                    }
                    <div className='flex flex-row justify-between items-center gap-4'>
                         <Input
                              isClearable
                              className="w-full h-fit"
                              placeholder="ค้นหานักศึกษา (รหัสนักศึกษา, อีเมล, ชื่อ)"
                              size="sm"
                              classNames={thinInputClass}
                              startContent={<SearchIcon />}
                              value={filterValue}
                              onClear={() => onClear()}
                              onValueChange={onSearchChange}
                         />
                         <div className="flex gap-4">
                              <Dropdown>
                                   <DropdownTrigger>
                                        <Button
                                             size="sm"
                                             className={insertColor.color}
                                             radius="sm"
                                             startContent={<PlusIcon className="w-5 h-5" />}>
                                             เพิ่มข้อมูล
                                        </Button>
                                   </DropdownTrigger>
                                   <DropdownMenu
                                        variant="faded"
                                        aria-label="Dropdown menu"
                                   >
                                        <DropdownItem
                                             href="students-advisor/create?tab=advisor-form"
                                             key="add-advisor-form"
                                             description="แบบฟอร์ม"
                                             startContent={<SiGoogleforms className="w-5 h-5 text-green-600" />}
                                        >
                                             เพิ่มรายชื่อนักศึกษาในที่ปรึกษา
                                        </DropdownItem>
                                        <DropdownItem
                                             href="students-advisor/create?tab=advisor-sheet"
                                             key="add-advisor-sheet"
                                             description="ไฟล์ Spreadsheet"
                                             startContent={<RiFileExcel2Fill className="w-5 h-5 text-green-600" />}
                                        >
                                             เพิ่มรายชื่อนักศึกษาในที่ปรึกษา
                                        </DropdownItem>
                                   </DropdownMenu>
                              </Dropdown>
                              <div className={disableSelectDelete ? "cursor-not-allowed" : ""}>
                                   <Button
                                        radius="sm"
                                        size="sm"
                                        isDisabled={disableSelectDelete}
                                        onClick={() => handleDelete(selectedStudents)}
                                        color="danger"
                                        className={deleteColor.color}
                                        startContent={<DeleteIcon2 className="w-5 h-5" />}>
                                        ลบรายการที่เลือก
                                   </Button>
                              </div>
                         </div>
                    </div>
               </div>
          );
     }, [
          filterValue,
          statusFilter,
          visibleColumns,
          onRowsPerPageChange,
          students.length,
          onSearchChange,
          hasSearchFilter,
          fetching,
          selectedStudents,
     ]);

     const bottomContent = useMemo(() => {
          return (
               Object.keys(students).length > 0 ?
                    <div className="py-2 px-2 flex justify-center items-center">
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

     const selectStyle = useMemo(() => ({
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          background: 'white',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: '99%',
          backgroundPositionY: '2px',
          border: '1px solid #dfdfdf',
          paddingRight: '1.7rem'
     }), [])

     return (
          <section>
               <div>
                    <>
                         <div className='border p-4 rounded-[10px] w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 flex-wrap'>
                              <div className="flex gap-4 flex-wrap">
                                   <Dropdown>
                                        <DropdownTrigger className="flex">
                                             <Button
                                                  size="sm"
                                                  radius="sm"
                                                  className="bg-blue-100 text-blue-500"
                                                  endContent={<ChevronDownIcon className="text-small" />}
                                                  variant="flat">
                                                  สถานะภาพ
                                             </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                             disallowEmptySelection
                                             aria-label="Table Columns"
                                             closeOnSelect={false}
                                             selectedKeys={statusFilter}
                                             selectionMode="multiple"
                                             onSelectionChange={setStatusFilter}
                                             className="h-[500px] overflow-y-auto"
                                        >
                                             {statusOptions.map((status) => (
                                                  <DropdownItem key={status.id} className="capitalize">
                                                       {status.id} {status.description}
                                                  </DropdownItem>
                                             ))}
                                        </DropdownMenu>
                                   </Dropdown>
                                   <Dropdown>
                                        <DropdownTrigger className="hidden sm:flex">
                                             <Button
                                                  size="sm"
                                                  className="bg-blue-100 text-blue-500"
                                                  radius="sm"
                                                  endContent={<ChevronDownIcon className="text-small" />}
                                                  variant="flat">
                                                  คอลัมน์
                                             </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                             disallowEmptySelection
                                             aria-label="Table Columns"
                                             closeOnSelect={false}
                                             selectedKeys={visibleColumns}
                                             selectionMode="multiple"
                                             onSelectionChange={setVisibleColumns}
                                        >
                                             {columns.map((column) => (
                                                  <DropdownItem key={column.uid} className="capitalize">
                                                       {capitalize(column.name)}
                                                  </DropdownItem>
                                             ))}
                                        </DropdownMenu>
                                   </Dropdown>
                              </div>
                              <div className="flex gap-4 items-center flex-wrap">
                                   <select
                                        name="select-program"
                                        id="selectProgram"
                                        onInput={() => setSelectProgram(event.target.value)}
                                        defaultValue=""
                                        style={{
                                             height: "32px",
                                             ...selectStyle
                                        }}
                                        className="px-2 pe-3 py-1 border-1 rounded-lg text-sm "
                                   >
                                        <option value="" disabled hidden>หลักสูตร</option>
                                        <option value="all">ทั้งหมด</option>
                                        {programs?.length && programs.map((program) => (
                                             <option key={program.program} value={program.program}>
                                                  {program.title_th} {program.program}
                                             </option>
                                        ))}
                                   </select>
                                   <select
                                        disabled={selectProgram === "all"}
                                        name="select-acadyear"
                                        id="selectAcadyear"
                                        onInput={() => setSelectAcadYear(event.target.value)}
                                        defaultValue=""
                                        style={{
                                             height: "32px",
                                             ...selectStyle,
                                             backgroundColor: selectProgram === "all" ? "#d1d5db" : "white"
                                        }}
                                        className={`px-2 pe-3 py-1 border-1 rounded-lg text-sm`}
                                   >
                                        <option value="" disabled hidden>ปีการศึกษา</option>
                                        {acadyears.map((acadyear) => (
                                             <option key={acadyear} value={acadyear}>
                                                  {acadyear}
                                             </option>
                                        ))}
                                   </select>
                                   <Button
                                        onClick={() => getStudents(selectProgram, selectAcadYear)}
                                        radius="sm"
                                        size="sm"
                                        variant="solid"
                                        className="bg-blue-100 text-blue-500"
                                        startContent={<SearchIcon />}
                                   >
                                        ค้นหา
                                   </Button>
                              </div>
                         </div>
                         <div className="border p-4 rounded-[10px] w-full">
                              {topContent}
                              {
                                   !fetching ?
                                        <Table
                                             aria-label="Student Table"
                                             checkboxesProps={{
                                                  classNames: {
                                                       wrapper: "after:bg-blue-500 after:text-background text-background",
                                                  },
                                             }}
                                             classNames={minimalTableClass}
                                             bottomContent={bottomContent}
                                             bottomContentPlacement="outside"

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
                                                  emptyContent={
                                                       <Empty
                                                            className='my-4'
                                                            description={
                                                                 <span className='text-gray-300'>ไม่มีข้อมูลนักศึกษา</span>
                                                            }
                                                       />}
                                                  items={sortedItems}>
                                                  {(item) => (
                                                       <TableRow key={item.id}>
                                                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                                       </TableRow>
                                                  )}
                                             </TableBody>
                                        </Table>
                                        :
                                        <div className="flex justify-center items-center mt-8 mb-4">
                                             <Spinner />
                                        </div>
                              }
                         </div>
                    </>
                    {/* } */}
               </div>
          </section>
     )
}

export default StudentTable