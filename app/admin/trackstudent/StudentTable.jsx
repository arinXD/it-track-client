"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Autocomplete, AutocompleteItem, Link, useDisclosure, select, Tooltip, } from "@nextui-org/react";
import { SearchIcon, ChevronDownIcon, PlusIcon, DeleteIcon2, DeleteIcon, EditIcon2 } from "@/app/components/icons";
import { capitalize } from "@/src/util/utils";
import { fetchData, fetchDataObj } from "../action";
import { getAcadyears } from "@/src/util/academicYear";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteColor, insertColor, minimalTableClass, restoreColor, thinInputClass } from "@/src/util/ComponentClass";
import { Empty, message } from "antd";
import { TbRestore } from "react-icons/tb";
import EditModal from "./EditModal";
import InsertModal from "./InsertModal";
import { swal } from "@/src/util/sweetyAlert";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import { MdDoNotDisturb, MdOutlineFileDownload } from "react-icons/md";
import { utils, writeFile } from "xlsx";
import { useSession } from "next-auth/react";

const INITIAL_VISIBLE_COLUMNS = ["stu_id", "fullName", "courses_type", "score", "gpa", "result", "actions"];
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
     name: "เกรดที่ใช้ในการคัดเลือก",
     uid: "score",
     sortable: true
},
{
     name: "เกรดรวม",
     uid: "gpa",
     sortable: true
},
{
     name: "Result",
     uid: "result",
     sortable: true
},
{
     name: "ACTIONS",
     uid: "actions"
},]

const StudentTable = ({ }) => {
     const { data: session } = useSession();
     const acadyears = useMemo(() => (getAcadyears()), [])

     const getTrackSelect = useCallback(async function (acadyear = acadyears[0]) {
          localStorage.setItem("search-students-track", JSON.stringify({ acadyear }))
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
     }, [acadyears])

     const getTracks = useCallback(async function () {
          let tracks = await fetchData(`/api/tracks/all`)
          if (tracks?.length) {
               tracks = tracks.map(track => track.track)
          } else {
               tracks = []
          }
          setTracks(tracks)
     }, [])

     useEffect(() => {
          async function init() {
               setFetching(true)
               const searchItem = localStorage.getItem("search-students-track")
               if (searchItem) {
                    const { acadyear } = JSON.parse(searchItem)
                    setSelectAcadYear(acadyear)
                    document.querySelector('#selectAcadyear').value = acadyear
                    await getTrackSelect(acadyear)
               }
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
     const [countStudent, setCountStudent] = useState(0);
     const [selectedTrack, setSelectedTrack] = useState("all");
     const [selectedKeys, setSelectedKeys] = useState(new Set([]));
     const [disableSelectDelete, setDisableSelectDelete] = useState(true)
     const [selectionId, setSelectionId] = useState(null);
     const [deleting, setDeleting] = useState(false);
     const [selectedRecords, setSelectedRecords] = useState([]);

     const { isOpen: isInsertOpen, onOpen: onInsertOpen, onClose: onInsertClose } = useDisclosure();
     const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

     const [filterValue, setFilterValue] = useState("");
     const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
     const [rowsPerPage, setRowsPerPage] = useState(50);
     const [sortDescriptor, setSortDescriptor] = useState({
          column: "id",
          direction: "ascending",
     });
     const [page, setPage] = useState(1);
     const hasSearchFilter = Boolean(filterValue);

     useEffect(() => {
          let sl
          if (selectedKeys == "all") {
               sl = sortedItems.map(e => parseInt(e.id))
               setDisableSelectDelete(false)
          } else {
               sl = [...selectedKeys.values()].map(id => parseInt(id))
               if (sl.length === 0) {
                    setDisableSelectDelete(true)
               } else {
                    setDisableSelectDelete(false)
               }
          }
          setSelectedRecords(sl)
     }, [selectedKeys])

     // Init column
     const headerColumns = useMemo(() => {
          if (visibleColumns === "all") return columns;

          return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
     }, [visibleColumns]);

     const studentEachTrack = useMemo(() => {
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
                    filterSelect = filterSelect.filter(select => select?.result?.toLowerCase() == selectedTrack?.toLowerCase())
               }
               setCountStudent(filterSelect?.length || 0)
          }
          return filterSelect
     }, [selections, selectedTrack])

     // Filtering handle
     const filteredItems = useMemo(() => {
          if (hasSearchFilter) {
               return studentEachTrack.filter((select) => {
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

          return studentEachTrack;
     }, [filterValue, studentEachTrack]);

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

     const handleEdit = useCallback((id) => {
          setSelectionId(id)
          onEditOpen()
     }, [])

     const handleDeleted = useCallback((ids) => {
          swal.fire({
               text: `ต้องการลบข้อมูลหรือไม่ ?`,
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
                    const options = await getOptions("/api/selections/multiple", 'DELETE', ids)
                    axios(options)
                         .then(async result => {
                              const { message: msg } = result.data
                              message.success(msg)
                              const searchItem = localStorage.getItem("search-students-track")
                              const { acadyear } = JSON.parse(searchItem)
                              setSelectAcadYear(acadyear)
                              await getTrackSelect(acadyear)
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

     // Display table body
     const renderCell = useCallback((select, columnKey) => {
          // ["stu_id", "fullName", "courses_type", "score", "gpa", "result"];
          const cellValue = select[columnKey];
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
               case "actions":
                    return (
                         <div className="relative flex justify-center items-center gap-2">
                              {session?.user?.role === "admin" ?
                                   <>
                                        <Tooltip content="แก้ไข">
                                             <Button
                                                  size='sm'
                                                  color='warning'
                                                  isIconOnly
                                                  aria-label="แก้ไข"
                                                  className='p-2'
                                                  onClick={() => handleEdit(select?.id)}
                                             >
                                                  <EditIcon2 className="w-5 h-5 text-yellow-600" />
                                             </Button>
                                        </Tooltip>
                                        <Tooltip content="ลบ">
                                             <Button
                                                  onPress={() => handleDeleted([select?.id])}
                                                  size='sm'
                                                  color='danger'
                                                  isIconOnly
                                                  aria-label="ลบ"
                                                  className='p-2 bg-red-400'
                                             >
                                                  <DeleteIcon className="w-5 h-5" />
                                             </Button>
                                        </Tooltip>
                                   </>
                                   :
                                   <Tooltip content="ไม่มีสิทธิ์เข้าถึง">
                                        <Button
                                             size='sm'
                                             color='warning'
                                             isIconOnly
                                             aria-label="แก้ไข"
                                             className='p-2'
                                        >
                                             <MdDoNotDisturb className="w-5 h-5 text-gray-500" />
                                        </Button>
                                   </Tooltip>

                              }

                         </div>
                    );
               default:
                    return cellValue
          }
     }, [session?.user?.role]);

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

     const exportStudent = useCallback(async (data) => {
          function sortByStuid(array) {
               return array.sort((a, b) => {
                    const idA = parseFloat(a.stuid);
                    const idB = parseFloat(b.stuid);

                    if (idA > idB) {
                         return 1;
                    }
                    if (idA < idB) {
                         return -1;
                    }
                    return 0;
               });
          }
          function getNo(array, type = "reg") {
               return array.map((row, index) => {
                    const no = type === "reg" ? "No." : "No. ";
                    return {
                         [no]: index + 1,
                         ...row
                    };
               });
          }
          const students = data.map(selection => ({
               result: selection?.result,
               ...selection?.Student
          }))

          const wb = utils.book_new();
          const reg = students.filter(std => std.courses_type === "โครงการปกติ").map(obj => {
               return {
                    "รหัสนักศึกษา": obj.stu_id,
                    "ชื่อ - สกุล": `${obj.first_name} ${obj.last_name}`,
                    "Track": obj.result
               };
          });
          const spe = students.filter(std => std.courses_type === "โครงการพิเศษ").map(obj => {
               return {
                    "รหัสนักศึกษา ": obj.stu_id,
                    "ชื่อ - สกุล ": `${obj.first_name} ${obj.last_name}`,
                    "Track ": obj.result
               };
          });
          const regArr = getNo(sortByStuid(reg))
          const speArr = getNo(sortByStuid(spe), "spe")
          const minLength = Math.min(regArr?.length || 0, speArr?.length || 0);
          const [maxArr, minArr] = speArr.length == minLength ? [regArr, speArr] : [speArr, regArr]
          const announce = []

          for (let index = 0; index < maxArr.length; index++) {
               if (index >= minLength) {
                    announce.push(maxArr[index]);
               } else {
                    announce.push({
                         ...maxArr[index],
                         " ": null,
                         ...minArr[index]
                    });
               }
          }
          const header = ["ภาคปกติ", "", "", "", "", "โครงการพิเศษ"];
          const newHeader = Object.keys(announce[0]);
          const merges = [
               { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Merge cells from A1 to D1
               { s: { r: 0, c: 5 }, e: { r: 0, c: 8 } }  // Merge cells from F1 to I1
          ];

          let ws
          ws = utils.aoa_to_sheet([header, newHeader])
          ws['!merges'] = merges;

          utils.sheet_add_json(ws, announce, {
               skipHeader: true,
               origin: -1 // Start adding data from the last row
          });

          utils.book_append_sheet(wb, ws, 'Announce');

          try {
               writeFile(wb, `Track_Announce_${selectedTrack?.toUpperCase()}.xlsx`);
          } catch (error) {
               console.error('Error exporting Excel:', error);
          }
     }, [selectedTrack])

     const topContent = useMemo(() => {
          return (
               <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between items-end text-small text-default-400 gap-2">
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
                         <div>
                              <Button
                                   size="sm"
                                   radius="sm"
                                   onClick={() => exportStudent(studentEachTrack)}
                                   startContent={<MdOutlineFileDownload className="w-5 h-5" />}>
                                   ดาวน์โหลด
                              </Button>
                         </div>
                    </div>
                    {selections?.length > 0 &&
                         (<>
                              <div className="flex justify-between items-center">
                                   <span className="text-default-400 text-small">นักศึกษาทั้งหมด {countStudent} คน</span>
                                   <div className="flex items-center gap-4 flex-row-reverse">
                                        <Pagination
                                             isCompact
                                             showControls
                                             showShadow
                                             color="primary"
                                             page={page}
                                             total={pages}
                                             onChange={setPage}
                                        />
                                        <div className="flex items-center text-default-400 text-small">
                                             Rows per page:
                                             <select
                                                  style={{
                                                       height: "32px",
                                                       ...selectStyle
                                                  }}
                                                  className="ms-2 px-2 pe-3 py-1 border-1 rounded-lg text-sm"
                                                  onChange={onRowsPerPageChange}
                                             >
                                                  <option value="50">50</option>
                                                  <option value="100">100</option>
                                                  <option value="150">150</option>
                                                  <option value={selections?.length}>ทั้งหมด</option>
                                             </select>
                                        </div>
                                   </div>
                              </div>
                              <div className='flex flex-row justify-between items-center gap-4'>
                                   <Input
                                        isClearable
                                        className="w-full h-fit"
                                        placeholder="ค้นหานักศึกษา (รหัส, ชื่อ-สกุล, แทร็ก)"
                                        size="sm"
                                        classNames={thinInputClass}
                                        startContent={<SearchIcon />}
                                        value={filterValue}
                                        onClear={() => onClear()}
                                        onValueChange={onSearchChange}
                                   />
                                   {session?.user?.role === "admin" &&
                                        <div className="flex gap-4">
                                             <Button
                                                  size="sm"
                                                  className={insertColor.color}
                                                  radius="sm"
                                                  onClick={onInsertOpen}
                                                  startContent={<PlusIcon className="w-5 h-5" />}>
                                                  เพิ่มข้อมูล
                                             </Button>
                                             <div className={disableSelectDelete ? "cursor-not-allowed" : ""}>
                                                  <Button
                                                       radius="sm"
                                                       size="sm"
                                                       isLoading={deleting}
                                                       isDisabled={disableSelectDelete}
                                                       onPress={() => handleDeleted(selectedRecords)}
                                                       color="danger"
                                                       className={deleteColor.color}
                                                       startContent={<DeleteIcon2 className="w-5 h-5" />}>
                                                       ลบรายการที่เลือก
                                                  </Button>
                                             </div>
                                        </div>
                                   }
                              </div>
                         </>)
                    }
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
          sortedItems,
          items.length,
          page,
          pages,
          hasSearchFilter,
          countStudent,
          deleting,
          selectedRecords,
          session?.user?.role
     ]);

     const bottomContent = useMemo(() => {
          return (
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
          );
     }, [sortedItems, items.length, page, pages, hasSearchFilter]);

     return (
          <>

               <ToastContainer />

               <InsertModal
                    cb={getTrackSelect}
                    isOpen={isInsertOpen}
                    onClose={onInsertClose}
                    tracks={tracks}
               />

               <EditModal
                    cb={getTrackSelect}
                    id={selectionId}
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    tracks={tracks}
               />

               <div className='border p-4 rounded-[10px] w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 flex-wrap'>
                    <div className="flex gap-4 flex-wrap">
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
                              name="select-acadyear"
                              id="selectAcadyear"
                              onInput={() => setSelectAcadYear(event.target.value)}
                              defaultValue=""
                              style={{
                                   height: "32px",
                                   ...selectStyle
                              }}
                              className="px-2 pe-3 py-1 border-1 rounded-lg text-sm"
                         >
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
                              size="sm"
                              variant="solid"
                              isLoading={searching}
                              isDisabled={searching}
                              className="bg-blue-100 text-blue-500"
                              startContent={<SearchIcon />}
                         >
                              ค้นหา
                         </Button>
                    </div>
               </div>
               <div className="border p-4 rounded-[10px] w-full">
                    {!selections?.length ? null :
                         <div className="flex w-full flex-col mb-4">
                              <Tabs
                                   aria-label="Options"
                                   selectedKey={selectedTrack}
                                   onSelectionChange={setSelectedTrack}
                                   color="primary"
                                   variant="underlined"
                                   classNames={{
                                        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider !text-[1px]",
                                        cursor: "w-full",
                                        tab: "max-w-fit h-10",
                                        tabContent: "group-data-[selected=true]:text-black group-data-[selected=true]:font-bold"
                                   }}>
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
                         classNames={minimalTableClass}

                         bottomContent={bottomContent}
                         bottomContentPlacement="outside"

                         topContent={topContent}
                         topContentPlacement="outside"

                         isCompact
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
                              emptyContent={
                                   <Empty
                                        className='my-4'
                                        description={
                                             <span className='text-gray-300'>ไม่มีข้อมูลนักศึกษา</span>
                                        }
                                   />
                              }
                              items={sortedItems}>
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

export default StudentTable