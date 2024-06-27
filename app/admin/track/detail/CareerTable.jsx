"use client"
import { DeleteIcon, DeleteIcon2, EditIcon2, PlusIcon, SearchIcon } from '@/app/components/icons'
import { Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@nextui-org/react'
import Link from 'next/link'
import { inputClass, minimalTableClass } from '@/src/util/ComponentClass'
import { Empty, Image, message } from 'antd'
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { swal } from '@/src/util/sweetyAlert'
import InsertCareerModal from './InsertCareerModal'
import EditCareerModal from './EditCareerModal'

const CareerTable = ({ track }) => {
     const { isOpen, onOpen, onClose } = useDisclosure();
     const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
     const [fetching, setFetching] = useState(false);
     const [careers, setCareers] = useState([]);
     const [editCareer, setEditCareer] = useState(undefined);

     const headerColumns = useMemo(() => (
          [
               {
                    name: "รูป",
                    uid: "image",
                    align: "center"
               },
               {
                    name: "Name TH",
                    uid: "name_th",
                    align: "start"
               },
               {
                    name: "Name EN",
                    uid: "name_en",
                    align: "start"
               },
               {
                    name: "Actions",
                    uid: "actions",
                    align: "center"
               },
          ]), [])

     const [disableDeleteBtn, setDisableDeleteBtn] = useState(true);
     const [deleting, setDeleting] = useState(false);

     // State
     const [selectedCareers, setSelectedCareers] = useState([])
     const [filterValue, setFilterValue] = useState("");
     const [selectedKeys, setSelectedKeys] = useState(new Set([]));
     const [rowsPerPage, setRowsPerPage] = useState(50);
     const [page, setPage] = useState(1);
     const hasSearchFilter = Boolean(filterValue);

     const getCareers = useCallback(async () => {
          setFetching(true)
          const option = await getOptions(`/api/careers/tracks/${track}`, "get")
          try {
               const res = await axios(option)
               setCareers(res.data.data)
          } catch (error) {
               setCareers([])
          } finally {
               setFetching(false)
          }
     }, [])

     useEffect(() => {
          getCareers()
     }, [])


     // Filtering handle
     const filteredItems = useMemo(() => {
          let filteredData = [...careers];
          if (filterValue) {
               filteredData = filteredData.filter(({ name_th, name_en }) =>
                    name_th.toLowerCase().includes(filterValue.toLowerCase()) ||
                    name_en.toLowerCase().includes(filterValue.toLowerCase())
               );
          }
          return filteredData;
     }, [filterValue, careers]);

     // Paging
     const pages = Math.ceil(filteredItems.length / rowsPerPage);

     const items = useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;

          return filteredItems.slice(start, end);
     }, [page, filteredItems, rowsPerPage]);

     const handleEditCareer = useCallback((id) => {
          setEditCareer(id)
          onOpenEdit()
     }, [])

     // Display table body
     const renderCell = useCallback((cellData, columnKey) => {
          const cellValue = cellData[columnKey] || ""
          switch (columnKey) {
               case "image":
                    return (
                         <div className="w-full flex justify-center p-2">
                              <Image
                                   width={160}
                                   height={160}
                                   src={cellValue}
                                   onError={({ currentTarget }) => {
                                        currentTarget.onerror = null
                                        currentTarget.src = "/image/user.png";
                                   }}
                                   className="rounded-md border border-gray-200"
                                   alt={cellValue} />
                         </div>
                    )
               case "actions":
                    return (
                         <div className="relative flex justify-center items-center gap-2">
                              <Tooltip
                                   content="แก้ไข"
                              >
                                   <Button
                                        size='sm'
                                        color='warning'
                                        isIconOnly
                                        aria-label="แก้ไข"
                                        className='p-2'
                                        onClick={() => handleEditCareer(cellData.id)}
                                   >
                                        <EditIcon2 className="w-5 h-5 text-yellow-600" />
                                   </Button>
                              </Tooltip>
                              <Tooltip
                                   content="ลบ"
                              >
                                   <Button
                                        onPress={() => handleDelete([cellData.id])}
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
          let data
          if (selectedKeys == "all") {
               data = items.map(e => e.id)
               setDisableDeleteBtn(false)
          } else {
               data = [...selectedKeys.values()]
               if (data.length === 0) {
                    setDisableDeleteBtn(true)
               } else {
                    setDisableDeleteBtn(false)
               }
          }
          setSelectedCareers(data)
     }, [selectedKeys])



     const handleDelete = useCallback(async (selectedCareers) => {
          swal.fire({
               text: `ต้องการลบข้อมูลอาชีพหรือไม่ ?`,
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
                    const options = await getOptions("/api/careers/multiple", 'DELETE', selectedCareers)
                    axios(options)
                         .then(async result => {
                              const { message: msg } = result.data
                              message.success(msg)
                              getCareers()
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
               Object.keys(careers).length > 0 ?
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
                    </div>
                    :
                    undefined
          );
     }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

     return (
          <>
               <InsertCareerModal
                    getCareers={getCareers}
                    track={track}
                    isOpen={isOpen}
                    onClose={onClose} />

               <EditCareerModal
                    careerId={editCareer}
                    getCareers={getCareers}
                    isOpen={isOpenEdit}
                    onClose={onCloseEdit} />

               <div className='flex flex-row flex-wrap gap-2 justify-between items-center rounded-md mb-4'>
                    <p className="text-sm">อาชีพภายในแทร็ก</p>
                    <div className="flex gap-4">
                         <Button
                              size="sm"
                              className='bg-[#edf8f7] text-[#46bcaa]'
                              radius="sm"
                              color="default"
                              onPress={onOpen}
                              startContent={<PlusIcon className="w-5 h-5" />}>
                              เพิ่ม
                         </Button>
                         <Button
                              radius="sm"
                              size="sm"
                              isLoading={deleting}
                              isDisabled={disableDeleteBtn}
                              onPress={() => handleDelete(selectedCareers)}
                              color='danger'
                              className='bg-red-400'
                              startContent={<DeleteIcon2 className="w-5 h-5" />}>
                              ลบ
                         </Button>
                    </div>

               </div>
               <div className="flex flex-col gap-4 mb-4">
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
               </div>
               <div className="overflow-x-auto">
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
                                        className={`text-${column.align}`}
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
                              items={items}>
                              {(item) => (
                                   <TableRow key={item.id}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>
          </>
     )
}

export default CareerTable