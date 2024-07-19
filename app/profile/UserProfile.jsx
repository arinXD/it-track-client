"use client"
import { insertColor, restoreColor, warningColor } from '@/src/util/ComponentClass';
import { dmy } from '@/src/util/dateFormater';
import { floorGpa } from '@/src/util/grade';
import { capitalize } from '@/src/util/utils';
import { Chip, Input, Tooltip } from '@nextui-org/react';
import { Card, Typography, Table, Collapse, Tabs } from 'antd';
import Image from 'next/image';
import { MailIcon } from '@/app/components/icons/MailIcon';
const { Title, Text } = Typography;
const { Panel } = Collapse;
import { CiStar } from "react-icons/ci";
import { BiSolidIdCard } from "react-icons/bi";
import { MdOutlinePersonOutline } from "react-icons/md";
import { useMemo } from 'react';

const UserProfile = ({ userData }) => {
     const { email, username, role, sign_in_type, createdAt, Student } = userData;

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

     return (
          <div className='max-w-4xl mx-auto'>
               <Card className="mb-4 w-full">
                    <div className="flex gap-6">
                         <div>
                              <Image
                                   className='rounded-[5px]'
                                   width={150}
                                   height={150}
                                   src={userData.image}
                                   alt='user profile'
                                   onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = "/image/admin.png";
                                   }}
                              />
                         </div>
                         <div className='flex flex-col gap-4 w-full'>
                              <div className='flex gap-2 items-center'>
                                   <Tooltip color="foreground" content="Sign in by" className='rounded-[5px]'>
                                        <Chip size="sm" className={`${insertColor.color} border-1 border-[#46bcaa] cursor-pointer rounded-[5px]`}>
                                             {capitalize(sign_in_type)}
                                        </Chip>
                                   </Tooltip>
                                   <Tooltip color="foreground" content="Role" className='rounded-[5px]'>
                                        <Chip size="sm" className={`${restoreColor.color} border-1 border-[#4d69fa] cursor-pointer rounded-[5px]`}>
                                             {capitalize(role)}
                                        </Chip>
                                   </Tooltip>
                              </div>
                              <div>
                                   <div className='flex gap-6'>
                                        <Input
                                             classNames={{
                                                  inputWrapper: ["rounded-[5px]"]
                                             }}
                                             type="text"
                                             label="Name"
                                             value={capitalize(username)}
                                             isReadOnly
                                             labelPlacement="outside"
                                             startContent={
                                                  <BiSolidIdCard className="text-2xl text-default-400 pointer-events-none flex-shrink-0 me-1" />
                                             }
                                        />
                                        <Input
                                             classNames={{
                                                  inputWrapper: ["rounded-[5px]"]
                                             }}
                                             type="email"
                                             label="Email"
                                             value={capitalize(email)}
                                             isReadOnly
                                             labelPlacement="outside"
                                             startContent={
                                                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 me-1" />
                                             }
                                        />
                                   </div>
                                   <p className='mt-6 text-right text-sm text-default-400/70'>เข้าสู่ระบบ {dmy(createdAt)}</p>
                              </div>
                         </div>
                    </div>
               </Card>
               {Student && (
                    <Card className='mb-4'>
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
                                        label: "text-black/50 text-[.8em]",
                                        inputWrapper: ["rounded-none", "p-2"],
                                        input: "text-[.9em]"
                                   }}
                                   className='w-full text-sm'
                                   type="text"
                                   label="รหัสนักศึกษา"
                                   value={Student.stu_id}
                                   isReadOnly
                              />
                              <Input
                                   classNames={{
                                        label: "text-black/50 text-[.8em]",
                                        inputWrapper: ["rounded-none", "p-2"],
                                        input: "text-[.9em]"
                                   }}
                                   className='w-full text-sm'
                                   type="text"
                                   label="GPA"
                                   value={floorGpa(Student.gpa)}
                                   isReadOnly
                              />
                              <Input
                                   classNames={{
                                        label: "text-black/50 text-[.8em]",
                                        inputWrapper: ["rounded-none", "p-2"],
                                        input: "text-[.9em]"
                                   }}
                                   className='w-full text-sm'
                                   type="text"
                                   label="ชื่อ"
                                   value={Student.first_name}
                                   isReadOnly
                              />
                              <Input
                                   classNames={{
                                        label: "text-black/50 text-[.8em]",
                                        inputWrapper: ["rounded-none", "p-2"],
                                        input: "text-[.9em]"
                                   }}
                                   className='w-full text-sm'
                                   type="text"
                                   label="สกุล"
                                   value={Student.last_name}
                                   isReadOnly
                              />
                              <Input
                                   classNames={{
                                        label: "text-black/50 text-[.8em]",
                                        inputWrapper: ["rounded-none", "p-2"],
                                        input: "text-[.9em]"
                                   }}
                                   className='w-full text-sm'
                                   type="text"
                                   label="หลักสูตร"
                                   value={Student.Program.title_th}
                                   isReadOnly
                              />
                              {
                                   Student.Program.program.toLowerCase() === "it" &&
                                   <Input
                                        classNames={{
                                             label: "text-black/50 text-[.8em]",
                                             inputWrapper: ["rounded-none", "p-2"],
                                             input: "text-[.9em]"
                                        }}
                                        className='w-full text-sm'
                                        type="text"
                                        label="แทร็ก"
                                        value={Student.track || "ยังไม่มีแทร็ก"}
                                        isReadOnly
                                   />
                              }
                         </div>
                    </Card>
               )}

               {Student && (
                    <Card>
                         <div className='mb-4 flex gap-4'>
                              <CiStar className={`text-5xl text-[${warningColor.border}] bg-[${warningColor.onlyColor}] pointer-events-none flex-shrink-0`} />
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