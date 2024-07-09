"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckIcon, DeleteIcon, DeleteIcon2, EditIcon2, PlusIcon, SearchIcon } from '@/app/components/icons'
import { Button, Chip, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import Link from 'next/link'
import { TbRestore } from 'react-icons/tb'
import { inputClass, minimalTableClass } from '@/src/util/ComponentClass'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Empty, message } from 'antd'
import { IoIosCloseCircle } from "react-icons/io";
import { swal } from '@/src/util/sweetyAlert'

const SuggestFormTable = ({ forms, fetching, callBack }) => {

     const INITIAL_VISIBLE_COLUMNS = useMemo(() => (
          ["title", "desc", "available", "actions"]
     ), [])
     const columns = useMemo(() => (
          [
               {
                    name: "ID",
                    uid: "id",
                    sortable: true
               },
               {
                    name: "สถานะ",
                    uid: "available",
                    sortable: true
               },
               {
                    name: "ชื่อแบบฟอร์ม",
                    uid: "title",
                    sortable: true
               },
               {
                    name: "คำอธิบาย",
                    uid: "desc",
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
     const [updating, setupdating] = useState(false);

     // Init column
     const headerColumns = useMemo(() => {
          if (visibleColumns === "all") return columns;

          return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
     }, [visibleColumns]);

     // Filtering handle
     const filteredItems = useMemo(() => {
          let filterForm = [...forms];

          if (filterValue) {
               filterForm = filterForm.filter((form) =>
                    form.title.toLowerCase().includes(filterValue.toLowerCase()) ||
                    form.desc.toLowerCase().includes(filterValue.toLowerCase())
               );
          }
          return filterForm;
     }, [filterValue, forms]);

     // Paging
     const pages = Math.ceil(filteredItems.length / rowsPerPage);

     const items = useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;

          return filteredItems.slice(start, end);
     }, [page, filteredItems, rowsPerPage]);

     const availableForm = async (id) => {
          if (updating) return
          setupdating(true)
          const option = await getOptions(`/api/suggestion-forms/${id}/available`, "PUT")
          try {
               await axios(option)
               await callBack()
          } catch (error) {
               console.log(error);
               message.error("error")
          } finally {
               setupdating(false)
          }
     }

     // Display table body
     const renderCell = useCallback((form, columnKey) => {
          const cellValue = form[columnKey] || ""
          switch (columnKey) {
               case "available":
                    const status = form.isAvailable
                    return (
                         <Chip
                              onClick={() => availableForm(form.id)}
                              className={`!text-[.8em] !p-1 active:scale-95 cursor-pointer`}
                              startContent={
                                   status ?
                                        <CheckIcon size={18} />
                                        :
                                        <IoIosCloseCircle className='w-5 h-5' />
                              }
                              variant="flat"
                              color={`${status ? "secondary" : "default"}`}
                         >
                              {status ? "เปิดใช้งาน" : " ปิดใช้งาน"}
                         </Chip>
                    )
               case "actions":
                    return (
                         <div className="relative flex justify-center items-center gap-2">
                              <Link href={`/admin/suggest-form/detail?id=${form.id}`}>
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
                                        isDisabled={deleting}
                                        onPress={() => handleDelete([form.id])}
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
               students = items.map(e => e.id)
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

     const handleDelete = useCallback(async (selectedTracks) => {
          swal.fire({
               text: `ต้องการลบข้อมูลแบบฟอร์มหรือไม่ ?`,
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
                    const options = await getOptions("/api/suggestion-forms/multiple", 'DELETE', selectedTracks)
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
               Object.keys(forms).length > 0 ?
                    <div className="py-2 px-2 flex justify-between items-center">
                         <span className="w-[30%] text-small text-default-400">
                              {selectedKeys === "all"
                                   ? "All items selected"
                                   : `${selectedKeys?.size || 0} of ${filteredItems?.length || 0} selected`}
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
                    :
                    undefined
          );
     }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

     return (
          <div className='border p-4 rounded-[10px] w-full'>
               <div className="flex flex-col gap-4 mb-4">
                    <div className="flex gap-4">
                         <Link href="/admin/suggest-form/create">
                              <Button
                                   radius='sm'
                                   size='sm'
                                   className='bg-[#edf8f7] text-[#46bcaa]'
                                   startContent={<PlusIcon className="w-5 h-5" />}>
                                   เพิ่มแบบฟอร์ม
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
                              startContent={<DeleteIcon2 className="w-5 h-5" />}>
                              ลบ
                         </Button>
                    </div>
                    <Input
                         isClearable
                         className="w-full h-fit"
                         placeholder="ค้นหาแบบฟอร์ม"
                         size="sm"
                         classNames={inputClass}
                         startContent={<SearchIcon />}
                         value={filterValue}
                         onClear={() => onClear()}
                         onValueChange={onSearchChange}
                    />
               </div>
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

                    isStriped
                    removeWrapper
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    onRowAction={() => { }}
               >
                    <TableHeader columns={headerColumns}>
                         {(column) => (
                              <TableColumn
                                   key={column.uid}
                                   className={`text-${column.uid === "available" || column.uid === "actions" ? "center" : "start"}`}
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
                                   className='my-4 w-1/'
                                   description={
                                        <span className='text-gray-300'>ไม่มีข้อมูล</span>
                                   }
                              />
                         }
                         items={items}>
                         {(item) => (
                              <TableRow key={item.id}>
                                   {(columnKey) =>
                                        <TableCell
                                             className={`${columnKey === "title" ? "w-1/5" : ""}`}
                                        >
                                             {renderCell(item, columnKey)}
                                        </TableCell>}
                              </TableRow>
                         )}
                    </TableBody>
               </Table>
          </div>
     )
}

export default SuggestFormTable