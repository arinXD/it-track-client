"use client"
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData, fetchDataObj } from '../../action'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { inputClass } from '@/src/util/ComponentClass';
import { getCurrentDate } from '@/src/util/dateFormater';
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import { FaPlay } from "react-icons/fa";
import { FaRegCircleStop } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import { calGrade, floorGpa, isNumber } from '@/src/util/grade';
import { utils, writeFile } from "xlsx";
import { tableClass } from '@/src/util/ComponentClass'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner } from '@nextui-org/react'
import { Loading } from '@/app/components';
import InsertSubjectModal from './InsertSubjectModal';


const Page = ({ params }) => {
     const [loading, setLoading] = useState(true)
     const [verifySelect, setVerifySelect] = useState({})

     const [program, setProgram] = useState([])
     const [ids, setId] = useState([])
     const [subjects, setSubjects] = useState({})
     const [subgroupData, setSubgroupData] = useState([]);
     const [groupData, setGroupData] = useState([]);

     const [isInsertModalOpen, setInsertModalOpen] = useState(false);

     const [creditgroup, setCreditGroup] = useState(0)
     const [creditsubgroup, setCreditSubgroup] = useState(0)

     const initVerify = useCallback(async function (id) {
          try {
               const result = await fetchDataObj(`/api/verify/${id}`)
               setVerifySelect(result)
               setId(result.id)
               // console.log(result);
               // console.log(result);
               setProgram(result?.Program)
               // const subjects = result.SubjectVerifies.map(subjectVerify => subjectVerify.Subject);
               // setSubjects(subjects);

               const subgroupData = result.SubjectVerifies.map(subjectVerify => {
                    const subject = subjectVerify.Subject;
                    const subgroups = subject.SubgroupSubjects.map(subgroupSubject => subgroupSubject.SubGroup);
                    return { subject, subgroups };
               });
               setSubgroupData(subgroupData);

               const groupData = result.SubjectVerifies.map(subjectVerify => {
                    const subject = subjectVerify.Subject;
                    const groups = subject.GroupSubjects.map(groupSubject => groupSubject.Group);
                    return { subject, groups };
               });
               setGroupData(groupData);

               // console.log("Subgroup");
               // console.table(subgroupData);

               // console.log("Group");
               // console.table(groupData);
          } catch (err) {
               console.error("Error on init func:", err);
          }
     }, [])

     const { id } = params

     const groupedSubjectsByCategory = {};

     subgroupData.forEach(({ subject, subgroups }) => {
          subgroups.forEach(subgroup => {
               const category = subgroup?.Group?.Categorie;
               if (!groupedSubjectsByCategory[category.id]) {
                    groupedSubjectsByCategory[category.id] = { category, groups: {}, subgroups: {} };
               }
               if (!groupedSubjectsByCategory[category.id].subgroups[subgroup.id]) {
                    groupedSubjectsByCategory[category.id].subgroups[subgroup.id] = subgroup;
                    groupedSubjectsByCategory[category.id].subgroups[subgroup.id].subjects = [];
               }
               groupedSubjectsByCategory[category.id].subgroups[subgroup.id].subjects.push(subject);
          });
     });

     groupData.forEach(({ subject, groups }) => {
          groups.forEach(group => {
               const category = group?.Categorie;
               if (!groupedSubjectsByCategory[category.id]) {
                    groupedSubjectsByCategory[category.id] = { category, groups: {}, subgroups: {} };
               }
               if (!groupedSubjectsByCategory[category.id].groups[group.id]) {
                    groupedSubjectsByCategory[category.id].groups[group.id] = group;
                    groupedSubjectsByCategory[category.id].groups[group.id].subjects = [];
               }
               groupedSubjectsByCategory[category.id].groups[group.id].subjects.push(subject);
          });
     });


     useEffect(() => {
          setLoading(false)
          initVerify(id);
     }, [])


     const handleInsertModalOpen = () => {
          setInsertModalOpen(true);
     };

     const handleInsertModalClose = () => {
          setInsertModalOpen(false);
     };

     const handleDataInserted = async () => {
          try {
               await initVerify(id);
               handleInsertModalClose();

          } catch (error) {
               console.error('Error inserting data:', error);
               showToastMessage(false, "Error adding Subject Verify")
          }
     };

     const getSubTrack = useCallback((subgroup, subgroupIndex) => {
          if (subgroup?.subjects.every(subject => subject?.Track)) {
               const subjects = subgroup?.subjects
               const trackSubjects = {}
               for (let index = 0; index < subjects?.length; index++) {
                    const track = subjects[index]?.Track.title_th
                    if (!trackSubjects.hasOwnProperty(track)) {
                         trackSubjects[track] = []
                    }
                    trackSubjects[track].push(subjects[index])
               }
               console.log(trackSubjects);
               return (
                    <div key={subgroupIndex}>
                         <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                              <h3 className='text-md text-default-800 px-10'><li>{subgroup?.sub_group_title}</li></h3>
                         </div>
                         {trackSubjects && Object.keys(trackSubjects).map((track, trackIndex) => (
                              <div key={trackIndex}>
                                   <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                                        <h3 className='text-md text-default-800 px-16'><li>กลุ่มย่อยที่ {trackIndex+1} {track}</li></h3>
                                   </div>
                                   <Table
                                        classNames={tableClass}
                                        removeWrapper
                                        onRowAction={() => { }}
                                        aria-label="subjects table">
                                        <TableHeader>
                                             <TableColumn>รหัสวิชา</TableColumn>
                                             <TableColumn>ชื่อวิชา EN</TableColumn>
                                             <TableColumn>ชื่อวิชา TH</TableColumn>
                                             <TableColumn>หน่วยกิต</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                             {trackSubjects[track].map((subject, subjectIndex) => (
                                                  <TableRow key={subjectIndex}>
                                                       <TableCell className=''>{subject.subject_code}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                       <TableCell>{subject.credit}</TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>
                              </div>
                         ))}
                    </div>
               );

          } else {
               return (
                    <div key={subgroupIndex}>
                         <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                              <h3 className='text-md text-default-800 px-10'><li>{subgroup?.sub_group_title}</li></h3>
                         </div>
                         <Table
                              classNames={tableClass}
                              removeWrapper
                              onRowAction={() => { }}
                              aria-label="subjects table">
                              <TableHeader>
                                   <TableColumn>รหัสวิชา</TableColumn>
                                   <TableColumn>ชื่อวิชา EN</TableColumn>
                                   <TableColumn>ชื่อวิชา TH</TableColumn>
                                   <TableColumn>หน่วยกิต</TableColumn>
                              </TableHeader>
                              <TableBody>
                                   {subgroup.subjects && subgroup.subjects.map((subject, subjectIndex) => (
                                        <TableRow key={subjectIndex}>
                                             <TableCell className=''>{subject.subject_code}</TableCell>
                                             <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                             <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                             <TableCell>{subject.credit}</TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </div>)
          }
     }, [])

     const getSubg = useCallback((subgroups) => {
          if (!subgroups) return undefined
          if (Object.values(subgroups).length == 0) return undefined
          const groupedSubgroups = {};
          Object.values(subgroups).forEach((subgroup) => {
               const groupTitle = subgroup?.Group?.group_title;
               if (!groupedSubgroups[groupTitle]) {
                    groupedSubgroups[groupTitle] = [];
               }
               groupedSubgroups[groupTitle].push(subgroup);
          });
          return (
               <>
                    {Object.keys(groupedSubgroups).map((groupTitle, groupIndex) => {
                         const subgroupsWithSameGroupTitle = groupedSubgroups[groupTitle];
                         return (
                              <div key={groupIndex}>
                                   <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center'>
                                        <h3 className='text-lg text-default-800 px-4'><li>{groupTitle}</li></h3>
                                        <h2 className='text-sm text-default-800'>จำนวน {creditsubgroup} หน่วยกิต</h2>
                                   </div>
                                   {subgroupsWithSameGroupTitle.map((subgroup, subgroupIndex) => (
                                        getSubTrack(subgroup, subgroupIndex)
                                   ))}
                              </div>
                         );
                    })}
               </>
          );
     }, [])

     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <BreadCrumb />
                    {!verifySelect ?
                         <p>No data</p>
                         :
                         <div>
                              <ToastContainer />
                              {loading ?
                                   <div className='w-full flex justify-center h-[70vh]'>
                                        <Spinner label="กำลังโหลด..." color="primary" />
                                   </div>
                                   :
                                   Object.keys(verifySelect).length > 0 ?
                                        <div className='my-[30px] 2xl:px-44 xl:px-20'>
                                             <div className='text-center text-xl text-black mb-5'>
                                                  <h1 className='text-3xl leading-relaxed'>แบบฟอร์มตรวจสอบการสำเร็จการศึกษา <br></br>หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{program.title_th}<br></br>(ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                                  <h2 className='mt-6'>ขอยื่นแบบฟอร์มแสดงรายละเอียดการศึกษารายวิชาที่ได้เรียนมาทั้งหมด อย่างน้อย <span className='font-bold'>{verifySelect.main_at_least}</span> หน่วยกิต ต่องานทะเบียนและประมวลผลการศึกษา ดังต่อไปนี้คือ.—</h2>
                                             </div>
                                             <div className='bg-gray-100 border-gray-200 border-1 p-2 justify-between items-center rounded-md mb-4 grid  grid-cols-4'>
                                                  <div className="flex items-center w-[100%] text-base col-span-3 max-lg:col-span-4">
                                                       <h1 className='py-2 p-2 px-1'><span className='font-bold'>{verifySelect.verify}</span> {verifySelect.title} สาขาวิชา{program.title_th} (ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                                  </div>
                                                  <div className='grid gap-2 col-span-1 justify-end p-2 px-1 max-lg:col-span-4 max-lg:w-full max-lg:justify-start max-lg:pt-3 max-lg:pb-2 max-lg:border-t-2'>
                                                       <div className="">
                                                            <Button
                                                                 radius="sm"
                                                                 size='sm'
                                                                 onPress={handleInsertModalOpen}
                                                                 className='bg-gray-300'
                                                                 color="default"
                                                                 startContent={<PlusIcon className="w-5 h-5" />}>
                                                                 เพิ่มวิชาภายในแบบฟอร์ม
                                                            </Button>
                                                            {/* <div>
                                                            <Button
                                                                 radius="sm"
                                                                 className='bg-gray-300'
                                                                 size='sm'
                                                                 color="default"
                                                                 startContent={<DeleteIcon2 className="w-5 h-5" />}>
                                                                 ลบรายการที่เลือก
                                                            </Button>
                                                       </div> */}
                                                       </div>
                                                  </div>
                                             </div>

                                             {Object.keys(groupedSubjectsByCategory).map((categoryId, index) => {
                                                  const { category, groups, subgroups } = groupedSubjectsByCategory[categoryId];
                                                  return (
                                                       <div key={index} className='mb-5'>
                                                            <div className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-md'>
                                                                 <h2 className='text-lg text-default-800'>{index + 1}. {category?.category_title}</h2>
                                                                 <h2 className='text-sm text-default-800'>จำนวน {creditgroup} หน่วยกิต</h2>
                                                            </div>
                                                            {Object.keys(groups).map((groupId, groupIndex) => {
                                                                 const group = groups[groupId];

                                                                 return (
                                                                      <div key={groupIndex} >
                                                                           <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center'>
                                                                                <h3 className='text-lg text-default-800 px-4'><li>{group?.group_title}</li></h3>
                                                                           </div>
                                                                           <Table
                                                                                classNames={tableClass}
                                                                                removeWrapper
                                                                                onRowAction={() => { }}
                                                                                aria-label="subjects table">
                                                                                <TableHeader>
                                                                                     <TableColumn>รหัสวิชา</TableColumn>
                                                                                     <TableColumn>ชื่อวิชา EN</TableColumn>
                                                                                     <TableColumn>ชื่อวิชา TH</TableColumn>
                                                                                     <TableColumn>หน่วยกิต</TableColumn>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                     {group.subjects && group.subjects.map((subject, subjectIndex) => (
                                                                                          <TableRow key={subjectIndex}>
                                                                                               <TableCell className=''>{subject.subject_code}</TableCell>
                                                                                               <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                                                               <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                                                               <TableCell>{subject.credit}</TableCell>
                                                                                          </TableRow>
                                                                                     ))}
                                                                                </TableBody>
                                                                           </Table>
                                                                      </div>
                                                                 );
                                                            })}
                                                            {
                                                                 getSubg(subgroups)
                                                            }
                                                       </div>
                                                  );
                                             })}
                                             {Object.keys(groupedSubjectsByCategory).length === 0 && (
                                                  <>
                                                       <p className='text-center mt-10'>ไม่มีวิชาภายในแบบฟอร์ม</p>
                                                  </>
                                             )}

                                        </div>
                                        :
                                        <>
                                             <p className='text-center'>ไม่มีข้อมูลแบบฟอร์มตรวจสอบจบ {params.id}</p>
                                        </>
                              }
                         </div>
                    }
                    <InsertSubjectModal
                         isOpen={isInsertModalOpen}
                         onClose={handleInsertModalClose}
                         onDataInserted={handleDataInserted}
                         verify_id={ids}
                    />

               </ContentWrap >
          </>
     )
}

export default Page