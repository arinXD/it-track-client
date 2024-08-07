"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeleteIcon, DeleteIcon2, EditIcon2, PlusIcon, SearchIcon } from '@/app/components/icons'
import { Button, Chip, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react'
import Link from 'next/link'
import { inputClass, minimalTableClass } from '@/src/util/ComponentClass'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Empty, message } from 'antd'
import { simpleDMY } from '@/src/util/simpleDateFormatter'
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";

const Page = () => {
     const INITIAL_VISIBLE_COLUMNS = useMemo(() => (
          ["title", "desc", "published", "createdAt", "actions"]
     ), [])
     const columns = useMemo(() => (
          [{
               name: "ID",
               uid: "id",
               sortable: true
          },
          {
               name: "หัวข้อ",
               uid: "title",
          },
          {
               name: "สถานะ",
               uid: "published",
          },
          {
               name: "วันที่สร้าง",
               uid: "createdAt",
          },
          {
               name: "Actions",
               uid: "actions",
          },
          ]), [])

     const getNews = useCallback(async () => {
          const option = await getOptions("/api/news")
          try {
               setFetching(true)
               const res = await axios(option)
               setNews(res.data)
          } catch (error) {
               setNews([])
          } finally {
               setFetching(false)
          }
     }, [])

     useEffect(() => {
          getNews()
     }, [])

     const convertPublishedNews = useCallback(async (id) => {
          const options = await getOptions(`/api/news/${id}/publish`, 'patch')
          setFetching(true)
          try {
               await axios(options)
               await getNews()
          } catch (error) {
               message.error("ไม่สามารถแก้ไขสถานะข่าวได้")
          } finally {
               setFetching(false)
          }
     }, [])

     const [news, setNews] = useState([])
     const [fetching, setFetching] = useState();
     const [disableDeleteBtn, setDisableDeleteBtn] = useState(true);
     const [deleting, setDeleting] = useState(false);

     // State
     const [selectedTracks, setSelectedTracks] = useState([])
     const [filterValue, setFilterValue] = useState("");
     const [selectedKeys, setSelectedKeys] = useState(new Set([]));
     const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
     const [rowsPerPage, setRowsPerPage] = useState(10);
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
          let filteredTracks = [...news];

          if (filterValue) {
               filteredTracks = filteredTracks.filter((track) =>
                    track.title.toLowerCase().includes(filterValue.toLowerCase()) ||
                    track.desc.toLowerCase().includes(filterValue.toLowerCase())
               );
          }
          return filteredTracks;
     }, [filterValue, news]);

     // Paging
     const pages = Math.ceil(filteredItems.length / rowsPerPage);

     const items = useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;

          return filteredItems.slice(start, end);
     }, [page, filteredItems, rowsPerPage]);

     // Display table body
     const renderCell = useCallback((track, columnKey) => {
          const cellValue = track[columnKey] || ""
          switch (columnKey) {
               case "published":
                    const color = cellValue ? "success" : "default"
                    const msg = cellValue ? "เผยแพร่" : "ไม่เผยแพร่"
                    return (
                         <Chip color={color} variant="flat">{msg}</Chip>
                    )
               case "createdAt":
                    return (
                         <div>
                              {simpleDMY(cellValue)}
                         </div>
                    )
               case "actions":
                    const publishMsg = track.published ? "เลิกเผยแพร่" : "เผยแพร่"
                    const PublishedIcon = track.published ? MdOutlinePublicOff : MdOutlinePublic
                    return (
                         <div className="relative flex justify-center items-center gap-2">
                              <Tooltip
                                   content={publishMsg}
                              >
                                   <Button
                                        onClick={() => convertPublishedNews(track.id)}
                                        size='sm'
                                        color=''
                                        isIconOnly
                                        aria-label="published"
                                        className='p-2 bg-blue-100'
                                   >
                                        <PublishedIcon className="w-5 h-5 text-blue-500" />
                                   </Button>
                              </Tooltip>
                              <Link href={`/admin/news/${track.id}`}>
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
                                        onPress={() => handleDelete([track.id])}
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
                    return (
                         <div className='w-[500px] whitespace-nowrap overflow-hidden text-ellipsis'>
                              {cellValue}
                         </div>
                    )
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
               students = sortedItems.map(e => e.id)
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
               text: `ต้องการลบข้อมูลข่าวหรือไม่ ?`,
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
                    const options = await getOptions("/api/news/multiple", 'DELETE', selectedTracks)
                    axios(options)
                         .then(async result => {
                              await getNews()
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
               Object.keys(news).length > 0 ?
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

     return (
          <div className='border p-4 rounded-[10px] w-full'>
               <div className="flex flex-col gap-4 mb-4">
                    <div className="flex gap-4">
                         <Link href="/admin/news/create-news">
                              <Button
                                   radius='sm'
                                   size='sm'
                                   className='bg-[#edf8f7] text-[#46bcaa]'
                                   startContent={<PlusIcon className="w-5 h-5" />}>
                                   เพิ่มข่าว
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
                         placeholder="ค้นหาข่าว (หัวข้อข่าว, เนื้อหาแบบย่อ)"
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
                         wrapper: ["block", "w-full", "overflow-x-auto"],
                         table: ["w-full"],
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
                    onRowAction={() => { }}
               >
                    <TableHeader columns={headerColumns}>
                         {(column) => (
                              <TableColumn
                                   key={column.uid}
                                   className={`${column.uid !== "title" && "text-center"}`}
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
                                        <span className='text-gray-300'>ไม่มีข้อมูลข่าวสาร</span>
                                   }
                              />
                         }
                         items={items}>
                         {(item) => (
                              <TableRow
                                   key={item.track}>
                                   {(columnKey) =>
                                        <TableCell className={`${columnKey !== "title" && "text-center"}`}>
                                             {renderCell(item, columnKey)}
                                        </TableCell>}
                              </TableRow>
                         )}
                    </TableBody>
               </Table>
          </div>
     )
};

export default Page