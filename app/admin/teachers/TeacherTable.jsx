"use client"
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Input, TableHeader, TableColumn, TableBody, TableCell, TableRow, Spinner, Pagination, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import { Empty, message } from 'antd';
import { DeleteIcon, EditIcon2, PlusIcon } from '@/app/components/icons';
import { thinInputClass } from '@/src/util/ComponentClass';
import TeacherForm from './TeacherForm';
import { swal } from '@/src/util/sweetyAlert';

export default function TeacherTable({ tracks }) {
     const { isOpen, onOpen, onClose } = useDisclosure();
     const [teachers, setTeachers] = useState([]);
     const [trackFilter, setTrackFilter] = useState('all');
     const [loading, setLoading] = useState(true);
     const [search, setSearch] = useState('');
     const [page, setPage] = useState(1);
     const [rowsPerPage, setRowsPerPage] = useState(5);
     const [teacher, setTeacher] = useState({});

     const trackItems = useMemo(() => ["all", ...tracks], [tracks])

     useEffect(() => {
          fetchTeachers()
     }, []);

     const fetchTeachers = useCallback(async () => {
          setLoading(true)
          try {
               const option = await getOptions("/api/teachers", "get")
               const data = (await axios(option)).data.data;
               setTeachers(data);
          } catch (error) {
               setTeachers([]);
          } finally {
               setLoading(false)
          }
     }, [])

     const filteredTeachers = useMemo(() => {
          return teachers.filter(teacher =>
               (teacher.email.toLowerCase().includes(search.toLowerCase()) ||
                    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
                    teacher.surname.toLowerCase().includes(search.toLowerCase())) &&
               (trackFilter === 'all' || teacher.TeacherTrack?.track === trackFilter)
          );
     }, [teachers, search, trackFilter]);

     const pages = Math.ceil(filteredTeachers.length / rowsPerPage);

     const paginatedTeachers = useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          return filteredTeachers.slice(start, start + rowsPerPage);
     }, [filteredTeachers, page, rowsPerPage]);

     const handleTrackFilter = useCallback((value) => {
          setTrackFilter(value);
          setPage(1);
     }, [])

     const handleOpenModal = useCallback((teacher) => {
          setTeacher(teacher)
          onOpen()
     }, [])

     const handleDelete = useCallback(async (id) => {
          swal.fire({
               text: `ต้องการลบข้อมูลอาจารย์หรือไม่ ?`,
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "ตกลง",
               cancelButtonText: "ยกเลิก",
               reverseButtons: true
          }).then(async (result) => {
               if (result.isConfirmed) {
                    const option = await getOptions(`/api/teachers/${id}`, 'DELETE')
                    try {
                         await axios(option)
                         message.success("ลบข้อมูลเรียบร้อย")
                         await fetchTeachers()
                    } catch (error) {
                         message.warning(error?.response?.data?.message)
                    }
               }
          });
     }, [])

     return (
          <div className="space-y-4 p-4">
               <TeacherForm
                    teacher={teacher}
                    isOpen={isOpen}
                    onClose={onClose}
                    tracks={tracks}
                    fn={fetchTeachers}
               />
               <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                    <h2 className="text-2xl font-bold">ตารางข้อมูลอาจารย์</h2>
                    <div className="flex space-x-4">
                         <Input
                              classNames={thinInputClass}
                              placeholder="ค้นหาข้อมูลอาจารย์ อีเมล ชื่อ นามสกุล"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-[350px] !text-xs"
                         />
                         <Select
                              classNames={{
                                   label: "!text-xs",
                                   trigger: "border-1 h-10 !text-xs",
                              }}
                              variant="bordered"
                              placeholder="เลือกแทร็ก"
                              className="max-w-[150px]"
                              selectedKeys={[trackFilter]}
                              onChange={(e) => handleTrackFilter(e.target.value || "all")}
                         >
                              {trackItems.map(track => (
                                   <SelectItem key={track} value={track}>
                                        {track === 'all' ? 'ทั้งหมด' : track}
                                   </SelectItem>
                              ))}
                         </Select>
                         <div>
                              <Button
                                   onClick={() => {
                                        setTeacher({})
                                        onOpen()
                                   }}
                                   className='bg-[#edf8f7] text-[#46bcaa]'
                                   startContent={<PlusIcon className="w-4 h-4" />}>
                                   เพิ่มข้อมูลอาจารย์
                              </Button>
                         </div>
                    </div>
               </div>
               <Table
                    aria-label="Teachers table"
                    className="min-w-full"
               >
                    <TableHeader>
                         <TableColumn>EMAIL</TableColumn>
                         <TableColumn>ชื่อ - สกุล</TableColumn>
                         <TableColumn>แทร็ก</TableColumn>
                         <TableColumn className='text-center'>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody
                         loadingContent={<Spinner />}
                         isLoading={loading}
                         emptyContent={
                              <Empty
                                   className='my-4'
                                   description={
                                        <span className='text-gray-300'>ไม่มีข้อมูลอาจารย์</span>
                                   }
                              />}
                         items={paginatedTeachers}
                    >
                         {(teacher) => (
                              <TableRow key={teacher.id}>
                                   <TableCell>{teacher.email}</TableCell>
                                   <TableCell>{`${teacher.prefix || ""}${teacher.name || ""}${teacher.surname ? " " + teacher.surname : ""}`}</TableCell>
                                   <TableCell>{teacher?.TeacherTrack?.track || "-"}</TableCell>
                                   <TableCell>
                                        <div className='flex justify-center items-center gap-2'>
                                             <Button
                                                  onClick={() => handleOpenModal(teacher)}
                                                  size='sm'
                                                  color='warning'
                                                  isIconOnly
                                                  aria-label="แก้ไข"
                                                  className='p-2'
                                             >
                                                  <EditIcon2 className="w-5 h-5 text-yellow-600" />
                                             </Button>
                                             <Button
                                                  onClick={() => handleDelete(teacher.id)}
                                                  size='sm'
                                                  color='danger'
                                                  isIconOnly
                                                  aria-label="ลบ"
                                                  className='p-2 bg-red-400'
                                             >
                                                  <DeleteIcon className="w-5 h-5" />
                                             </Button>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         )}
                    </TableBody>
               </Table>
               {paginatedTeachers?.length > 0 &&
                    <div className="flex justify-between items-center">
                         <Select
                              variant='bordered'
                              classNames={{
                                   label: "!text-xs",
                                   trigger: "border-1 h-10 !text-xs",
                              }}
                              size="sm"
                              className="w-[130px]"
                              selectedKeys={[rowsPerPage.toString()]}
                              value={rowsPerPage}
                              onChange={(e) => setRowsPerPage(Number(e.target.value) || 5)}
                         >
                              <SelectItem key="5">5 per page</SelectItem>
                              <SelectItem key="10">10 per page</SelectItem>
                              <SelectItem key="20">20 per page</SelectItem>
                              <SelectItem key="50">50 per page</SelectItem>
                         </Select>
                         <Pagination
                              total={pages}
                              page={page}
                              onChange={setPage}
                         />
                    </div>}
          </div>
     );
}