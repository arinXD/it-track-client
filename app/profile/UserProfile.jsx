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
import { useEffect, useMemo, useState } from 'react';
import { updateTeacherData } from './profileAction';
import "./style.css"

const UserProfile = ({ userData, tracks }) => {
     const { email, username, role, sign_in_type, createdAt, Student, Teacher, Admin } = userData;
     const [teacherTrack, setTeacherTrack] = useState(Teacher?.TeacherTrack?.track || "");
     const [submiting, setSubmiting] = useState(false);

     const prefixes = useMemo(() => ([
          {
               prefix: "ศาสตราจารย์ ดร. (ศ. ดร.)",
               value: "ศ. ดร."
          },
          {
               prefix: "รองศาสตราจารย์ ดร. (รศ. ดร.)",
               value: "รศ. ดร."
          },
          {
               prefix: "ผู้ช่วยศาสตราจารย์ ดร. (ผศ. ดร.)",
               value: "ผศ. ดร."
          },
          {
               prefix: "ผู้ช่วยศาสตราจารย์ (ผศ.)",
               value: "ผศ."
          },
          {
               prefix: "อาจารย์ ดร. (อ. ดร.)",
               value: "อ. ดร."
          },
          {
               prefix: "อาจารย์ (อ.)",
               value: "อ."
          },
          {
               prefix: "นาย",
               value: "นาย"
          },
          {
               prefix: "นาง",
               value: "นาง"
          },
          {
               prefix: "นางสาว",
               value: "นางสาว"
          },
     ]), [])

     const [prefix, setPrefix] = useState();

     useEffect(() => {
          if (Admin) {
               setPrefix(Admin.prefix)
          } else {
               setPrefix(Teacher.prefix)
          }
     }, [role])

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
                    <div className={`bg-white p-[24px] border border-[#f0f0f0] rounded-[8px] w-full h-full col-span-2 lg:col-span-1`}>
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
                                   <div className='flex flex-col md:flex-row gap-2 md:items-center md:justify-between'>
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
                                        <p className='md:text-right text-xs text-default-500'>เข้าสู่ระบบ {dmy(createdAt)}</p>
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
                    </div>
                    {Admin && (
                         <form className='col-span-2 lg:col-span-1' onSubmit={handleEdit}>
                              <div className='bg-white p-[24px] border border-[#f0f0f0] rounded-[8px] w-full h-full !flex flex-col justify-between'>
                                   <div className='mb-4 flex gap-4'>
                                        <MdOutlinePersonOutline className={`text-5xl border-[${insertColor.onlyColor}] text-[${insertColor.onlyColor}] ${insertColor.bg} pointer-events-none flex-shrink-0`} />
                                        <div>
                                             <p className='font-bold text-base'>Admin Information</p>
                                             <p className='text-sm text-default-600'>ข้อมูลเจ้าหน้าที่</p>
                                        </div>
                                   </div>
                                   <div className='grid grid-cols-6 gap-4'>
                                        <input type="hidden" name="id" value={Admin.id} readOnly />
                                        <input type="hidden" name="role" value="admin" readOnly />
                                        <Select
                                             isRequired
                                             className='w-full text-sm col-span-5 md:col-span-2'
                                             variant='bordered'
                                             classNames={{
                                                  trigger: "border-1 rounded-md",
                                             }}
                                             name='prefix'
                                             labelPlacement='outside'
                                             label="คำนำหน้า"
                                             placeholder="เลือกคำนำหน้า"
                                             selectedKeys={[prefix || Admin.prefix]}
                                             onChange={(e) => setPrefix(e.target.value || Admin.prefix)}
                                             scrollShadowProps={{
                                                  isEnabled: false
                                             }}
                                        >
                                             {prefixes.map((prefix) => (
                                                  <SelectItem key={prefix.value} value={prefix.value}>
                                                       {prefix.value}
                                                  </SelectItem>
                                             ))}
                                        </Select>
                                        <Input
                                             classNames={{
                                                  label: "text-black/50 text-[.9em]",
                                                  inputWrapper: ["rounded-md", "p-2", "border-1"],
                                                  input: "text-[1em]"
                                             }}
                                             className='w-full text-sm col-span-5 md:col-span-2'
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
                                             className='w-full text-sm col-span-5 md:col-span-2'
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
                              </div>
                         </form>
                    )}
                    {Teacher && (
                         <form className='col-span-2 lg:col-span-1' onSubmit={handleEdit}>
                              <div className='bg-white p-[24px] border border-[#f0f0f0] rounded-[8px] w-full h-full col-span-2 md:col-span-1 flex flex-col justify-between'>
                                   <div className='flex flex-col'>
                                        <div className='mb-4 flex gap-4'>
                                             <MdOutlinePersonOutline className={`text-5xl border-[${insertColor.onlyColor}] text-[${insertColor.onlyColor}] ${insertColor.bg} pointer-events-none flex-shrink-0`} />
                                             <div>
                                                  <p className='font-bold text-base'>Teacher Information</p>
                                                  <p className='text-sm text-default-600'>ข้อมูลอาจารย์</p>
                                             </div>
                                        </div>
                                        <div className='grid grid-cols-6 gap-4'>
                                             <input type="hidden" name="id" value={Teacher.id} readOnly />
                                             <input type="hidden" name="role" value="teacher" readOnly />
                                             <Select
                                                  isRequired
                                                  className='w-full text-sm col-span-5 md:col-span-2'
                                                  variant='bordered'
                                                  classNames={{
                                                       trigger: "border-1 rounded-md",
                                                  }}
                                                  name='prefix'
                                                  labelPlacement='outside'
                                                  label="คำนำหน้า"
                                                  placeholder="เลือกคำนำหน้า"
                                                  selectedKeys={[prefix || Teacher.prefix]}
                                                  onChange={(e) => setPrefix(e.target.value || Teacher.prefix)}
                                                  scrollShadowProps={{
                                                       isEnabled: false
                                                  }}
                                             >
                                                  {prefixes.map((prefix) => (
                                                       <SelectItem key={prefix.value} value={prefix.value}>
                                                            {prefix.value}
                                                       </SelectItem>
                                                  ))}
                                             </Select>
                                             <Input
                                                  classNames={{
                                                       label: "text-black/50 text-[.9em]",
                                                       inputWrapper: ["rounded-md", "p-2", "border-1"],
                                                       input: "text-[1em]"
                                                  }}
                                                  className='w-full text-sm col-span-5 lg:col-span-2'
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
                                                  className='w-full text-sm col-span-5 lg:col-span-2'
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
                                                       className="col-span-5 !text-black"
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
                         <div className='bg-white p-[24px] border border-[#f0f0f0] rounded-[8px] w-full h-full col-span-2 lg:col-span-1'>
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
                                        className='w-full text-sm max-lg:order-1 col-span-2 lg:col-span-1'
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
                                        className='w-full text-sm max-lg:order-4 col-span-1 md:col-span-2 lg:col-span-1'
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
                                        className='w-full text-sm max-lg:order-2 col-span-2 lg:col-span-1'
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
                                        className='w-full text-sm max-lg:order-3 col-span-2 lg:col-span-1'
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
                                        className='w-full text-sm max-lg:order-5 col-span-1 md:col-span-2 lg:col-span-1'
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
                                             className='w-full text-sm max-lg:order-6 col-span-2 lg:col-span-1'
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
                                             className='w-full text-sm max-lg:order-7 col-span-2'
                                             type="text"
                                             label="อาจารย์ที่ปรึกษา"
                                             value={`${Student.Advisor.prefix || ""}${Student.Advisor.name || ""}${Student.Advisor.surname ? " " + Student.Advisor.surname : ""}`}
                                             isReadOnly
                                             labelPlacement="outside"
                                        />
                                   }
                              </div>
                         </div>
                    )}

               </div>
               {Student && (
                    <div className='bg-white p-[24px] border border-[#f0f0f0] rounded-[8px] w-full h-full'>
                         <div className='mb-4 flex gap-4'>
                              <CiStar className={`text-5xl text-[#ffcf52] bg-[#fff5dc] pointer-events-none flex-shrink-0`} />
                              <div>
                                   <p className='font-bold text-base'>Enrollments</p>
                                   <p className='text-sm text-default-600'>ข้อมูลการลงทะเบียน</p>
                              </div>
                         </div>
                         <Tabs
                              className='overflow-auto'
                              defaultActiveKey="1"
                              items={enrollItems}
                         />
                    </div>
               )}
          </div>

     );
};

export default UserProfile;