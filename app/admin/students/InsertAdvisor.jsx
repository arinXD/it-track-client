"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Autocomplete, AutocompleteItem, Button, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { SearchIcon } from '@/app/components/icons';
import Swal from 'sweetalert2';
import { message } from 'antd';

const InsertAdvisor = () => {
     const [studentData, setStudentData] = useState([]);
     const [inserting, setInserting] = useState(false);
     const [searchingStudent, setSearchingStudent] = useState(false);
     const [searchStudent, setSearchStudent] = useState("");
     const [student, setStudent] = useState({});
     const [selectAdvisor, setSelectAdvisor] = useState(null);
     const [advisor, setAdvisors] = useState([]);

     const getAllAdvisors = useCallback(async () => {
          const option = await getOptions("/api/advisors", "get")
          try {
               const data = (await axios(option)).data.data
               const advisorItems = data.map(({ id, prefix = '', name = '', surname = '' }) => ({
                    key: id,
                    label: `${prefix}${name}${surname ? ` ${surname}` : ''}`.trim()
               }));
               setAdvisors(advisorItems)
          } catch {
               setAdvisors([])
          }
     }, [])

     useEffect(() => {
          getAllAdvisors()
     }, [])

     const findStudentAdvisor = useCallback(async (stuID) => {
          const options = await getOptions(`/api/advisors/students/${stuID}`, "get")
          try {
               const data = (await axios(options)).data.data
               return Object.keys(data)?.length > 0
          } catch {
               return false
          }
     }, [])

     const createStudentAdvisor = useCallback(async (options) => {
          try {
               setInserting(true)
               const res = (await axios(options)).data
               const { message: msg } = res
               message.success(msg)
          } catch (error) {
               const { message: msg } = error.response.data
               message.warning(msg)
          } finally {
               setInserting(false)
               closeForm()
          }
     }, [])

     const handleCreated = useCallback(async (stu_id, advisorId) => {
          if (!stu_id) {
               message.warning("เลือกนักศึกษา")
               return
          }
          if (!advisorId) {
               message.warning("เลือกอาจารย์")
               return
          }
          const hasAdvisor = await findStudentAdvisor(stu_id)
          const option = await getOptions(`/api/advisors/${advisorId}/students/${stu_id}`, "POST")
          if (hasAdvisor) {
               swal.fire({
                    text: `นักศึกษามีที่ปรึกษาแล้วต้องการแก้ไขหรือไม่ ?`,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "ยกเลิก",
                    confirmButtonText: "แก้ไข",
                    reverseButtons: true
               }).then((result) => {
                    if (result.isConfirmed) {
                         createStudentAdvisor(option)
                    } else {
                         return
                    }
               });
          } else {
               createStudentAdvisor(option)
          }
     }, [])

     const fetchStudents = useCallback(async (student) => {
          if (searchingStudent) return
          if (!student) {
               setStudentData([])
               return
          }
          const url = `/api/students/find/${student}`
          const options = await getOptions(url)
          try {
               setSearchingStudent(true)
               const res = await axios(options)
               setStudentData(res.data.data)
          } catch (error) {
               setStudentData([])
          } finally {
               setSearchingStudent(false)
          }
     }, [])

     const closeForm = useCallback(function () {
          setSelectAdvisor(null)
          setStudentData([])
          setStudent({})
          setSearchStudent("")
     }, [])

     const selectStudent = useCallback(function (student) {
          setStudent(student)
          setStudentData([])
     }, [])

     const swal = useCallback(Swal.mixin({
          customClass: {
               confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
               cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
          },
          buttonsStyling: false
     }), [])

     const inputClass = useMemo(() => ({
          label: "text-black/50",
          input: [
               "text-sm",
               "bg-transparent",
               "text-black/90",
               "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: [
               "bg-transparent",
          ],
          inputWrapper: [
               "h-[18px]",
               "hover:bg-white",
               "border-1",
               "bg-white",
               "group-data-[focused=true]:bg-default-200/50",
               "!cursor-text",
          ],
     }), [])

     return (
          <section className='max-w-4xl mx-auto bg-white'>
               <div className='flex flex-col gap-6 mt-6 border p-6 rounded-lg shadow'>
                    <div className='space-y-4'>
                         <div className='flex flex-row gap-4 justify-start items-end'>
                              <Input
                                   isClearable
                                   className="w-full"
                                   placeholder="รหัสนักศึกษา, ชื่อนักศึกษา"
                                   size="sm"
                                   label="ค้นหานักศึกษา"
                                   labelPlacement='outside'
                                   classNames={inputClass}
                                   startContent={<SearchIcon />}
                                   value={searchStudent}
                                   onValueChange={setSearchStudent}
                                   onClear={() => fetchStudents("")}
                                   onKeyDown={e => (e.code === 'Enter' || e.code === 'NumpadEnter') && fetchStudents(searchStudent)}
                              />
                              <Button
                                   onClick={() => fetchStudents(searchStudent)}
                                   radius="sm"
                                   size="md"
                                   variant="solid"
                                   className="bg-gray-200 h-[32px]"
                                   startContent={<SearchIcon className="w-5 h-5" />}>
                                   ค้นหา
                              </Button>
                         </div>
                         {
                              Object.keys(student) == 0 || studentData?.length != 0 ? undefined :
                                   <div>
                                        <p className='text-sm font-bold'>ข้อมูลนักศึกษา</p>
                                        <p>
                                             {student?.stu_id} {student?.first_name} {student?.last_name} {student?.Program?.title_th} ({student?.courses_type})
                                        </p>
                                   </div>
                         }
                         {studentData?.length == 0 ? undefined :
                              searchingStudent ?
                                   <div className='w-full flex justify-center'>
                                        Loading...
                                   </div>
                                   :
                                   <Table
                                        removeWrapper
                                        aria-label="Student table"
                                        className="max-h-[150px] overflow-y-auto border p-2 rounded-lg"
                                        selectionMode="single"
                                        onRowAction={(key) => selectStudent(studentData.find(student => student.stu_id === key))}
                                   >
                                        <TableHeader>
                                             <TableColumn>รหัสนักศึกษา</TableColumn>
                                             <TableColumn>ชื่อ-สกุล</TableColumn>
                                             <TableColumn>หลักสูตร</TableColumn>
                                        </TableHeader>
                                        <TableBody items={studentData}>
                                             {(student) => (
                                                  <TableRow key={student.stu_id}>
                                                       <TableCell>{student.stu_id}</TableCell>
                                                       <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                                                       <TableCell>{`${student.Program?.title_th} (${student.courses_type})`}</TableCell>
                                                  </TableRow>
                                             )}
                                        </TableBody>
                                   </Table>
                         }
                    </div>
                    <hr />
                    <div className='space-y-4'>
                         <div className='flex flex-row gap-4 justify-start items-end'>
                              <Autocomplete
                                   classNames={{
                                        label: "text-xs"
                                   }}
                                   inputProps={{
                                        classNames: {
                                             inputWrapper: "border-1",
                                        },
                                   }}
                                   id='advisor'
                                   radius='sm'
                                   label="อาจารย์ที่ปรึกษา"
                                   variant="bordered"
                                   defaultItems={advisor}
                                   placeholder="เลือกอาจารย์ที่ปรึกษา"
                                   className="w-full"
                                   labelPlacement='outside'
                                   selectedKey={selectAdvisor}
                                   onSelectionChange={(value) => setSelectAdvisor(value)}
                                   scrollShadowProps={{
                                        isEnabled: false
                                   }}
                              >
                                   {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                              </Autocomplete>
                         </div>
                    </div>
                    <div></div>
                    <div className='flex gap-4 justify-end'>
                         <Button type='button' className='border-1 rounded-lg' color="primary" variant='bordered' onPress={closeForm}>
                              ยกเลิก
                         </Button>
                         <Button
                              onPress={() => handleCreated(student?.stu_id, selectAdvisor)}
                              isDisabled={inserting}
                              isLoading={inserting}
                              type='submit'
                              className='rounded-lg'
                              color="primary"
                              variant='solid'>
                              บันทึก
                         </Button>
                    </div>
               </div>
          </section>
     )
}

export default InsertAdvisor