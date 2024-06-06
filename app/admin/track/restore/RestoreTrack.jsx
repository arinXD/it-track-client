"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeleteIcon, DeleteIcon2, EditIcon2, PlusIcon, SearchIcon } from '@/app/components/icons'
import { Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import Link from 'next/link'
import { TbRestore } from 'react-icons/tb'
import { inputClass, restoreColor } from '@/src/util/ComponentClass'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Empty, message } from 'antd'

const RestoreTrack = ({ tracks, fetching, callBack }) => {
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
     const [restoring, setrestoring] = useState(false);

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
          console.log(columnKey);
          switch (columnKey) {
               case "actions":
                    return (
                         <div className="relative flex justify-center items-center gap-2">
                              <Tooltip
                                   content="กู้คืน"
                              >
                                   <Button
                                        onPress={() => restoreTracks([track.track])}
                                        size='sm'
                                        color='danger'
                                        isIconOnly
                                        aria-label="กู้คืน"
                                        className={`${restoreColor.bg} ${restoreColor.font} p-2`}
                                   >
                                        <TbRestore className="w-5 h-5" />
                                   </Button>
                              </Tooltip>
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
                    const options = await getOptions("/api/tracks/multiple/force", 'DELETE', selectedTracks)
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
               <div className="py-2 px-2 flex justify-between items-center">
                    <span className="w-[30%] text-small text-default-400">
                         {selectedKeys === "all"
                              ? "All items selected"
                              : `${selectedKeys.size} of ${filteredItems.length} selected`
                         }
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

     const restoreTracks = useCallback((tracks) => {
          swal.fire({
               text: `ต้องการกู้คืนข้อมูลแทร็กหรือไม่ ?`,
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "ตกลง",
               cancelButtonText: "ยกเลิก",
               reverseButtons: true
          }).then(async (result) => {
               if (result.isConfirmed) {
                    setrestoring(true)
                    const options = await getOptions("/api/tracks/multiple/restore", 'put', tracks)
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
                              setrestoring(false)
                         })
               }
          });
     }, [])

     return (
          <div className='w-full'>
               <div className="flex flex-col gap-4 mb-4">
                    <div className="flex gap-4">
                         <Button
                              isDisabled={disableDeleteBtn || restoring}
                              isLoading={restoring}
                              size="sm"
                              radius="sm"
                              color="default"
                              onClick={() => restoreTracks(selectedTracks)}
                              className={`${restoreColor.bg} ${restoreColor.font}`}
                              startContent={<TbRestore className="w-4 h-4" />}>
                              กู้คืนรายการที่เลือก
                         </Button>
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
                         placeholder="ค้นหาแทร็ก"
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

                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"

                    isStriped
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
                         emptyContent={<Empty
                              className='my-4'
                              description={
                                   <span className='text-gray-300'>ไม่มีรายการที่ถูกลบ</span>
                              }
                         />}
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

export default RestoreTrack