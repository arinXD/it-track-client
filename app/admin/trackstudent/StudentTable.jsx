"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Autocomplete, AutocompleteItem, Link, useDisclosure, select, } from "@nextui-org/react";
import { SearchIcon, ChevronDownIcon } from "@/app/components/icons";
import { capitalize } from "@/src/util/utils";
import { fetchData, fetchDataObj } from "../action";
import { getAcadyears } from "@/src/util/academicYear";
import { Skeleton } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tableClass } from "@/src/util/ComponentClass";
import { FaFileExcel } from "react-icons/fa6";

const INITIAL_VISIBLE_COLUMNS = ["stu_id", "fullName", "courses_type", "score", "gpa", "result"];
const columns = [{
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
     name: "Score",
     uid: "score",
     sortable: true
},
{
     name: "GPA",
     uid: "gpa",
     sortable: true
},
{
     name: "Result",
     uid: "result",
     sortable: true
},
];
function showToastMessage(ok, message) {
     if (ok) {
          toast.success(message, {
               position: toast.POSITION.TOP_RIGHT,
               position: "top-right",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
          });
     } else {
          toast.warning(message, {
               position: toast.POSITION.TOP_RIGHT,
               position: "top-right",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
          });
     }
};
const StudentTable = () => {
     const acadyears = getAcadyears()
     async function getTrackSelect(acadyear = acadyears[0]) {
          setSearching(true)
          const trackSelect = await fetchDataObj(`/api/tracks/selects/${acadyear}/students`)
          if (trackSelect?.Selections?.length) {
               trackSelect?.Selections?.sort((a, b) => {
                    const order = {
                         "โครงการปกติ": 1,
                         "โครงการพิเศษ": 2
                    };
                    return order[a?.Student?.courses_type] - order[b?.Student?.courses_type];
               });
          }
          setTrackSelect(trackSelect);
          setSelections(trackSelect?.Selections || [])
          setSearching(false)
     }
     async function getTracks() {
          let tracks = await fetchData(`/api/tracks`)
          if (tracks?.length) {
               tracks = tracks.map(track => track.track)
          } else {
               tracks = []
          }
          setTracks(tracks)
     }

     useEffect(() => {
          async function init() {
               setFetching(true)
               await getTrackSelect()
               await getTracks()
               setFetching(false)
          }
          init()
     }, [])

     // State
     const [tracks, setTracks] = useState([])
     const [searching, setSearching] = useState(false)
     const [fetching, setFetching] = useState(true)
     const [selectAcadYear, setSelectAcadYear] = useState(acadyears[0])
     const [trackSelect, setTrackSelect] = useState({})
     const [selections, setSelections] = useState([])
     const [selectedTrack, setSelectedTrack] = useState("all");

     const [filterValue, setFilterValue] = useState("");
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
          let filterSelect = []

          if (selections?.length) {
               filterSelect = selections.map(select => {
                    const selectData = {
                         ...select
                    }
                    selectData.gpa = parseFloat(selectData.gpa).toFixed(2)
                    selectData.score = parseFloat(selectData.score).toFixed(2)
                    return selectData
               })
               if (selectedTrack !== "all") {
                    filterSelect = filterSelect.filter(select => select?.result == selectedTrack)
               }
          }

          if (hasSearchFilter) {
               filterSelect = filterSelect.filter((select) => {
                    const stu = select?.Student
                    if (
                         stu.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                         stu.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                         stu.stu_id.toLowerCase().includes(filterValue.toLowerCase()) ||
                         stu.email.toLowerCase().includes(filterValue.toLowerCase()) ||
                         select?.result.toLowerCase().includes(filterValue.toLowerCase())
                    ) {
                         return select
                    }
               });
          }

          return filterSelect;
     }, [selections, filterValue, selectedTrack]);

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
     const renderCell = useCallback((select, columnKey) => {
          const cellValue = select[columnKey];
          // ["stu_id", "fullName", "courses_type", "score", "gpa", "result"];
          const student = select?.Student
          switch (columnKey) {
               case "stu_id":
                    return (
                         <div className="my-3 ms-3">
                              <p>
                                   {student?.stu_id}
                              </p>
                              <p>
                                   <Link href={`https://mail.google.com/mail/?view=cm&fs=1&to=${student?.email}&authuser=1`} size="sm" isExternal>
                                        {student?.email}
                                   </Link>
                              </p>
                         </div>
                    );
               case "fullName":
                    return (
                         <div className="flex flex-row gap-2">
                              <p className="w-full text-bold text-small capitalize">{student?.first_name}</p>
                              <p className="w-full text-bold text-small capitalize">{student?.last_name}</p>
                         </div>
                    );
               case "courses_type":
                    return student?.courses_type
               default:
                    return cellValue
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

     const topContent = useMemo(() => {
          return (
               <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-3 items-end">
                         <Input
                              isClearable
                              variant="bordered"
                              label="ค้นหานักศึกษา"
                              className="w-full sm:max-w-[44%]"
                              placeholder="ค้นหาจาก รหัส, ชื่อ-สกุล, แทร็ก"
                              size="sm"
                              labelPlacement="outside"
                              startContent={<SearchIcon />}
                              value={filterValue}
                              onClear={() => onClear()}
                              onValueChange={onSearchChange}
                         />
                         <div className="flex gap-3">
                              <Button
                                   radius="sm"
                                   startContent={<FaFileExcel />}
                                   className="bg-green-500"
                              >Export</Button>
                              <Dropdown>
                                   <DropdownTrigger className="hidden sm:flex">
                                        <Button radius="sm" endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                             Columns
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
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-default-400 text-small">นักศึกษาทั้งหมด {selections.length} คน</span>
                         <label className="flex items-center text-default-400 text-small">
                              Rows per page:
                              <select
                                   className="ms-2 border-1 rounded-md bg-transparent outline-none text-default-400 text-small"
                                   onChange={onRowsPerPageChange}
                              >
                                   <option value="50">50</option>
                                   <option value="100">100</option>
                                   <option value="150">150</option>
                                   <option value={selections?.length}>ทั้งหมด</option>
                              </select>
                         </label>
                    </div>
               </div>
          );
     }, [
          filterValue,
          visibleColumns,
          onRowsPerPageChange,
          selections.length,
          onSearchChange,
          hasSearchFilter,
          fetching,
     ]);

     const bottomContent = useMemo(() => {
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
     }, [items.length, page, pages, hasSearchFilter]);

     return (
          <>

               <ToastContainer />
               {fetching ?
                    <div className="space-y-3">
                         <Skeleton className="h-10 w-[40%] rounded-lg" />
                         <div className="flex gap-5">
                              <Skeleton className="h-10 w-[50%] rounded-lg" />
                              <Skeleton className="h-10 w-[50%] rounded-lg" />
                         </div>
                         <div className="pt-5 space-y-3">
                              <Skeleton className="h-4 w-full rounded-lg" />
                              <Skeleton className="h-2 w-full rounded-lg" />
                              <Skeleton className="h-2 w-full rounded-lg" />
                              <Skeleton className="h-2 w-full rounded-lg" />
                              <Skeleton className="h-2 w-full rounded-lg" />
                              <Skeleton className="h-2 w-full rounded-lg" />
                              <Skeleton className="h-2 w-full rounded-lg" />
                         </div>
                    </div>
                    :
                    <>

                         <div className="flex gap-3 items-center mb-4">
                              <select onInput={() => setSelectAcadYear(event.target.value)} defaultValue="" id="" className="px-2 pe-3 py-1 border-1 rounded-lg">
                                   <option value="" disabled hidden>ปีการศึกษา</option>
                                   {acadyears.map((acadyear) => (
                                        <option key={acadyear} value={acadyear}>
                                             {acadyear}
                                        </option>
                                   ))}
                              </select>
                              <Button
                                   onClick={() => getTrackSelect(selectAcadYear)}
                                   radius="sm"
                                   size="md"
                                   variant="solid"
                                   className="bg-gray-200"
                                   isLoading={searching}
                                   isDisabled={searching}
                                   startContent={<SearchIcon />}
                              >
                                   ค้นหา
                              </Button>
                         </div>
                         {!selections?.length ? null :
                              <div className="flex w-full flex-col mb-4">
                                   <Tabs
                                        aria-label="Options"
                                        selectedKey={selectedTrack}
                                        onSelectionChange={setSelectedTrack}
                                        color="primary"
                                        variant="bordered">
                                        <Tab
                                             key="all"
                                             title={
                                                  <div className="flex items-center space-x-2">
                                                       <span>ทั้งหมด</span>
                                                  </div>
                                             }
                                        />
                                        {tracks?.map(track => (
                                             <Tab
                                                  key={track}
                                                  title={
                                                       <div className="flex items-center space-x-2">
                                                            <span>{track}</span>
                                                       </div>
                                                  }
                                             />
                                        ))}
                                   </Tabs>
                              </div>
                         }
                         <Table
                              aria-label="Student Table"
                              checkboxesProps={{
                                   classNames: {
                                        wrapper: "after:bg-blue-500 after:text-background text-background",
                                   },
                              }}
                              classNames={{
                                   ...tableClass
                              }}

                              bottomContent={bottomContent}
                              bottomContentPlacement="outside"

                              topContent={topContent}
                              topContentPlacement="outside"

                              isCompact
                              removeWrapper
                              // selectionMode="multiple"
                              sortDescriptor={sortDescriptor}
                              onSortChange={setSortDescriptor}
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
                              <TableBody emptyContent={"ไม่มีข้อมูลนักศึกษา"} items={sortedItems}>
                                   {(item) => (
                                        <TableRow key={item.id}>
                                             {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                        </TableRow>
                                   )}
                              </TableBody>
                         </Table>
                    </>
               }
          </>
     )
}

export default StudentTable