"use client"
import { insertColor, restoreColor } from '@/src/util/ComponentClass';
import { dmy } from '@/src/util/dateFormater';
import { floorGpa } from '@/src/util/grade';
import { capitalize } from '@/src/util/utils';
import { Button, Chip, Input, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { Card, message, Table, Tabs } from 'antd';
import Image from 'next/image';
import { MailIcon } from '@/app/components/icons/MailIcon';
import { CiStar } from "react-icons/ci";
import { BiSolidIdCard } from "react-icons/bi";
import { MdOutlinePersonOutline } from "react-icons/md";
import { useMemo, useState } from 'react';
import { updateTeacherData } from './profileAction';
import "./style.css"

const UserProfile = ({ userData, tracks }) => {
     const { email, username, role, sign_in_type, createdAt, Student, Teacher, Admin } = userData;
     const [teacherTrack, setTeacherTrack] = useState(Teacher?.TeacherTrack?.track || "");
     const [submiting, setSubmiting] = useState(false);

     const columns = [
          {
               title: 'รหัสวิชา',
               dataIndex: ['Subject', 'subject_code'],
               key: 'subject_code',
          },
          {
               title: 'ชื่อวิชา (TH)',
               dataIndex: ['Subject', 'title_th'],
               key: 'title_th',
          },
          {
               title: 'ชื่อวิชา (EN)',
               dataIndex: ['Subject', 'title_en'],
               key: 'title_en',
          },
          {
               title: 'เกรด',
               dataIndex: 'grade',
               key: 'grade',
               render: (grade) => grade || '-'
          },
     ];

     const enrollItems = useMemo(() => {
          if (Student?.Enrollments && Object.keys(Student.Enrollments).length > 0) {
               return Object.keys(Student.Enrollments).map((year, index) => ({
                    label: `ปีการศึกษา ${year}`,
                    key: index,
                    children: <Table
                         dataSource={Student.Enrollments[year]}
                         columns={columns}
                         rowKey={(record) => record.Subject.subject_code}
                         pagination={true}
                         className="w-full"
                    />,
               }))
          }
          return null

     }, [Student])

     const handleEdit = async function (e) {
          e.preventDefault();
          const formData = new FormData(e.target)
          setSubmiting(true)
          const { ok, message: msg } = await updateTeacherData(formData)
          setSubmiting(false)
          if (ok) {
               message.success(msg)
          } else {
               message.warning(msg)
          }
     }

     return (
          <div className='w-full h-full flex flex-col gap-4'>
               <div className='w-full h-full grid grid-cols-2 gap-4'>
                    <Card className={`w-full h-full col-span-1`}>
                         <div className='mb-4 flex gap-4'>
                              <Image
                                   className='rounded-[5px] object-cover'
                                   width={45}
                                   height={45}
                                   src={userData.image}
                                   alt='user profile'
                                   onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = "/image/admin.png";
                                   }}
                              />
                              <div>
                                   <p className='font-bold text-base'>User Profile</p>
                                   <p className='text-sm text-default-600'>ข้อมูลบัญชีผู้ใช้</p>
                              </div>
                         </div>
                         <div className="flex gap-6">
                              <div className='flex flex-col gap-4 w-full'>
                                   <div className='flex gap-2 items-center justify-between'>
                                        <div className='flex gap-2 items-center'>
                                             <Tooltip color="foreground" content="ลงชื่อเข้าใช้โดย" className='rounded-[5px]'>
                                                  <Chip size="sm" className={`${insertColor.color} border-1 border-[#46bcaa] cursor-pointer rounded-[5px]`}>
                                                       {capitalize(sign_in_type)}
                                                  </Chip>
                                             </Tooltip>
                                             <Tooltip color="foreground" content="ประเภทบัญชี" className='rounded-[5px]'>
                                                  <Chip size="sm" className={`${restoreColor.color} border-1 border-[#4d69fa] cursor-pointer rounded-[5px]`}>
                                                       {capitalize(role)}
                                                  </Chip>
                                             </Tooltip>
                                        </div>
                                        <p className='text-right text-xs text-default-500'>เข้าสู่ระบบ {dmy(createdAt)}</p>
                                   </div>
                                   <div className={`flex ${Student ? "flex-col" : "flex-row"}  gap-4`}>
                                        <Input
                                             classNames={{
                                                  inputWrapper: ["rounded-md"]
                                             }}
                                             type="text"
                                             label="ชื่อบัญชี"
                                             value={capitalize(username)}
                                             isReadOnly
                                             labelPlacement="outside"
                                             startContent={
                                                  <BiSolidIdCard className="text-2xl text-default-400 pointer-events-none flex-shrink-0 me-1" />
                                             }
                                        />
                                        <Input
                                             classNames={{
                                                  inputWrapper: ["rounded-md"]
                                             }}
                                             type="email"
                                             label="อีเมล"
                                             value={capitalize(email)}
                                             isReadOnly
                                             labelPlacement="outside"
                                             startContent={
                                                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 me-1" />
                                             }
                                        />
                                   </div>
                              </div>
                         </div>
                    </Card>
                    {Admin && (
                         <form onSubmit={handleEdit}>
                              <Card className='w-full h-full !flex flex-col col-span-1 justify-between'>
                                   <div className='mb-4 flex gap-4'>
                                        <MdOutlinePersonOutline className={`text-5xl border-[${insertColor.onlyColor}] text-[${insertColor.onlyColor}] ${insertColor.bg} pointer-events-none flex-shrink-0`} />
                                        <div>
                                             <p className='font-bold text-base'>Admin Information</p>
                                             <p className='text-sm text-default-600'>ข้อมูลเจ้าหน้าที่</p>
                                        </div>
                                   </div>
                                   <div className='grid grid-cols-5 gap-4'>
                                        <input type="hidden" name="id" value={Admin.id} readOnly />
                                        <input type="hidden" name="role" value="admin" readOnly />
                                        <Input
                                             classNames={{
                                                  label: "text-black/50 text-[.9em]",
                                                  inputWrapper: ["rounded-md", "p-2", "border-1"],
                                                  input: "text-[1em]"
                                             }}
                                             className='w-full text-sm col-span-1'
                                             variant="bordered"
                                             type="text"
                                             label="คำนำหน้า"
                                             name='prefix'
                                             labelPlacement="outside"
                                             defaultValue={Admin.prefix || ""}
                                        />
                                        <Input
                                             classNames={{
                                                  label: "text-black/50 text-[.9em]",
                                                  inputWrapper: ["rounded-md", "p-2", "border-1"],
                                                  input: "text-[1em]"
                                             }}
                                             className='w-full text-sm col-span-2'
                                             variant="bordered"
                                             type="text"
                                             name='name'
                                             label="ชื่อ"
                                             labelPlacement="outside"
                                             defaultValue={Admin.name || ""}
                                        />
                                        <Input
                                             classNames={{
                                                  label: "text-black/50 text-[.9em]",
                                                  inputWrapper: ["rounded-md", "p-2", "border-1"],
                                                  input: "text-[1em]"
                                             }}
                                             className='w-full text-sm col-span-2'
                                             variant="bordered"
                                             type="text"
                                             label="นามสกุล"
                                             name='surname'
                                             labelPlacement="outside"
                                             defaultValue={Admin.surname || ""}
                                        />
                                   </div>
                                   <div className="mt-4 flex justify-start">
                                        <Button
                                             isLoading={submiting}
                                             isDisabled={submiting}
                                             type="submit"
                                             size='md'
                                             color='primary'
                                             className='rounded-md text-[.9em] h-[40px] p-[8px] w-full'
                                        >
                                             บันทึก
                                        </Button>
                                   </div>
                              </Card>
                         </form>
                    )}
                    {Teacher && (
                         <form onSubmit={handleEdit}>
                              <div className='bg-white p-[24px] border border-[#f0f0f0] rounded-[8px] w-full h-full col-span-1 flex flex-col justify-between'>
                                   <div className='flex flex-col'>
                                        <div className='mb-4 flex gap-4'>
                                             <MdOutlinePersonOutline className={`text-5xl border-[${insertColor.onlyColor}] text-[${insertColor.onlyColor}] ${insertColor.bg} pointer-events-none flex-shrink-0`} />
                                             <div>
                                                  <p className='font-bold text-base'>Teacher Information</p>
                                                  <p className='text-sm text-default-600'>ข้อมูลอาจารย์</p>
                                             </div>
                                        </div>
                                        <div className='grid grid-cols-5 gap-4'>
                                             <input type="hidden" name="id" value={Teacher.id} readOnly />
                                             <input type="hidden" name="role" value="teacher" readOnly />
                                             <Input
                                                  classNames={{
                                                       label: "text-black/50 text-[.9em]",
                                                       inputWrapper: ["rounded-md", "p-2", "border-1"],
                                                       input: "text-[1em]"
                                                  }}
                                                  className='w-full text-sm col-span-1'
                                                  variant="bordered"
                                                  type="text"
                                                  label="คำนำหน้า"
                                                  name='prefix'
                                                  labelPlacement="outside"
                                                  defaultValue={Teacher.prefix || ""}
                                             />
                                             <Input
                                                  classNames={{
                                                       label: "text-black/50 text-[.9em]",
                                                       inputWrapper: ["rounded-md", "p-2", "border-1"],
                                                       input: "text-[1em]"
                                                  }}
                                                  className='w-full text-sm col-span-2'
                                                  variant="bordered"
                                                  type="text"
                                                  name='name'
                                                  label="ชื่อ"
                                                  labelPlacement="outside"
                                                  defaultValue={Teacher.name || ""}
                                             />
                                             <Input
                                                  classNames={{
                                                       label: "text-black/50 text-[.9em]",
                                                       inputWrapper: ["rounded-md", "p-2", "border-1"],
                                                       input: "text-[1em]"
                                                  }}
                                                  className='w-full text-sm col-span-2'
                                                  variant="bordered"
                                                  type="text"
                                                  label="นามสกุล"
                                                  name='surname'
                                                  labelPlacement="outside"
                                                  defaultValue={Teacher.surname || ""}
                                             />
                                             {Teacher?.TeacherTrack?.track &&
                                                  <Select
                                                       classNames={{
                                                            value: "!text-black",
                                                            label: "!text-xs !text-black",
                                                            trigger: "border-1 h-10 !text-xs rounded-md !text-black",
                                                       }}
                                                       name='track'
                                                       variant={"bordered"}
                                                       placeholder="เลือกแทร็ก"
                                                       label="แทร็ก"
                                                       labelPlacement="outside"
                                                       className="col-span-3 !text-black"
                                                       selectedKeys={[teacherTrack]}
                                                       onChange={(e) => setTeacherTrack(e.target.value || "")}
                                                  >
                                                       {tracks.map(track => (
                                                            <SelectItem key={track} value={track}>
                                                                 {track === '' ? 'ไม่มีแทร็ก' : track}
                                                            </SelectItem>
                                                       ))}
                                                  </Select>
                                             }
                                        </div>
                                   </div>
                                   <div className="mt-4 flex justify-start">
                                        <Button
                                             isLoading={submiting}
                                             isDisabled={submiting}
                                             type="submit"
                                             size='md'
                                             color='primary'
                                             className='rounded-md text-[.9em] h-[40px] p-[8px] w-full'
                                        >
                                             บันทึก
                                        </Button>
                                   </div>
                              </div>
                         </form>
                    )}
                    {Student && (
                         <Card className='w-full col-span-1'>
                              <div className='mb-4 flex gap-4'>
                                   <MdOutlinePersonOutline className={`text-5xl border-[${insertColor.onlyColor}] text-[${insertColor.onlyColor}] ${insertColor.bg} pointer-events-none flex-shrink-0`} />
                                   <div>
                                        <p className='font-bold text-base'>Student Information</p>
                                        <p className='text-sm text-default-600'>ข้อมูลนักศึกษา</p>
                                   </div>
                              </div>
                              <div className='grid grid-cols-2 gap-4'>
                                   <Input
                                        classNames={{
                                             label: "text-black/50 text-[.9em]",
                                             inputWrapper: ["rounded-none", "p-2"],
                                             input: "text-[1em]"
                                        }}
                                        className='w-full text-sm'
                                        type="text"
                                        label="รหัสนักศึกษา"
                                        value={Student.stu_id}
                                        isReadOnly
                                        labelPlacement="outside"
                                   />
                                   <Input
                                        classNames={{
                                             label: "text-black/50 text-[.9em]",
                                             inputWrapper: ["rounded-none", "p-2"],
                                             input: "text-[1em]"
                                        }}
                                        className='w-full text-sm'
                                        type="text"
                                        label="GPA"
                                        value={floorGpa(Student.gpa)}
                                        isReadOnly
                                        labelPlacement="outside"
                                   />
                                   <Input
                                        classNames={{
                                             label: "text-black/50 text-[.9em]",
                                             inputWrapper: ["rounded-none", "p-2"],
                                             input: "text-[1em]"
                                        }}
                                        className='w-full text-sm'
                                        type="text"
                                        label="ชื่อ"
                                        value={Student.first_name}
                                        isReadOnly
                                        labelPlacement="outside"
                                   />
                                   <Input
                                        classNames={{
                                             label: "text-black/50 text-[.9em]",
                                             inputWrapper: ["rounded-none", "p-2"],
                                             input: "text-[1em]"
                                        }}
                                        className='w-full text-sm'
                                        type="text"
                                        label="สกุล"
                                        value={Student.last_name}
                                        isReadOnly
                                        labelPlacement="outside"
                                   />
                                   <Input
                                        classNames={{
                                             label: "text-black/50 text-[.9em]",
                                             inputWrapper: ["rounded-none", "p-2"],
                                             input: "text-[1em]"
                                        }}
                                        className='w-full text-sm'
                                        type="text"
                                        label="หลักสูตร"
                                        value={Student.Program.title_th}
                                        isReadOnly
                                        labelPlacement="outside"
                                   />
                                   {
                                        Student.Program.program.toLowerCase() === "it" &&
                                        <Input
                                             classNames={{
                                                  label: "text-black/50 text-[.9em]",
                                                  inputWrapper: ["rounded-none", "p-2"],
                                                  input: "text-[1em]"
                                             }}
                                             className='w-full text-sm'
                                             type="text"
                                             label="แทร็ก"
                                             value={Student.track || "ยังไม่มีแทร็ก"}
                                             isReadOnly
                                             labelPlacement="outside"
                                        />
                                   }
                                   {
                                        Student.Advisor &&
                                        <Input
                                             classNames={{
                                                  label: "text-black/50 text-[.9em]",
                                                  inputWrapper: ["rounded-none", "p-2"],
                                                  input: "text-[1em]"
                                             }}
                                             className='w-full text-sm col-span-2'
                                             type="text"
                                             label="อาจารย์ที่ปรึกษา"
                                             value={`${Student.Advisor.prefix || ""}${Student.Advisor.name || ""}${Student.Advisor.surname ? " " + Student.Advisor.surname : ""}`}
                                             isReadOnly
                                             labelPlacement="outside"
                                        />
                                   }
                              </div>
                         </Card>
                    )}

               </div>
               {Student && (
                    <Card>
                         <div className='mb-4 flex gap-4'>
                              <CiStar className={`text-5xl text-[#ffcf52] bg-[#fff5dc] pointer-events-none flex-shrink-0`} />
                              <div>
                                   <p className='font-bold text-base'>Enrollments</p>
                                   <p className='text-sm text-default-600'>ข้อมูลการลงทะเบียน</p>
                              </div>
                         </div>
                         <Tabs
                              defaultActiveKey="1"
                              items={enrollItems}
                         />
                    </Card>
               )}
          </div>

     );
};

export default UserProfile;