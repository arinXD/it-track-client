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
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner, Tooltip } from '@nextui-org/react'
import { Loading } from '@/app/components';
import { Empty, message } from 'antd';
import InsertSubjectModal from './InsertSubjectModal';
import InsertConditionModal from './InsertConditionModal';

const Page = ({ params }) => {
     const [loading, setLoading] = useState(true)
     const [verifySelect, setVerifySelect] = useState({})

     const [program, setProgram] = useState([])
     const [ids, setId] = useState(null)
     var idss;
     // var ids;

     const [groupData, setGroupData] = useState([]);
     const [subgroupData, setSubgroupData] = useState([]);
     const [semisubgroupData, setSemiSubgroupData] = useState([]);

     const [isInsertModalOpen, setInsertModalOpen] = useState(false);
     const [isInsertConditionModalOpen, setInsertConditionModalOpen] = useState(false);

     const [category, setCategories] = useState([])
     const [group, setGroups] = useState([])
     // const [groupinsub, setGroupInSubs] = useState([])
     const [categoryverify, setCategoryVerifies] = useState([])

     const [highestIndex, setHighestIndex] = useState(0);

     const showToastMessage = useCallback((ok, message) => {
          toast[ok ? 'success' : 'warning'](message, {
               position: toast.POSITION.TOP_RIGHT,
               position: "top-right",
               autoClose: 3000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
          });
     }, []);

     const { id } = params

     const initID = useCallback(async function (id) {
          const URL = `/api/verify/${id}`;
          const option = await getOptions(URL, "GET");
          const response = await axios(option);
          const result = response.data.data;
          setId(result.id)
          idss = result.id;
     }, [])

     // console.log("idS",ids)
     // console.log("idSS",idss)

     const initVerify = useCallback(async function (id) {
          // console.log(id);
          try {
               const URL = `/api/verify/${id}`;
               const option = await getOptions(URL, "GET");
               const response = await axios(option);
               const result = response.data.data;
               setVerifySelect(result)
               setProgram(result?.Program)

               const categoryverifies = result.CategoryVerifies?.map(categoryVerify => categoryVerify.Categorie);
               setCategoryVerifies(categoryverifies);

               const groupData = result.SubjectVerifies.map(subjectVerify => {
                    const subject = subjectVerify.Subject;
                    const groups = subject.GroupSubjects?.map(groupSubject => groupSubject.Group);
                    return { subject, groups };
               });
               setGroupData(groupData);

               const subgroupData = result.SubjectVerifies.map(subjectVerify => {
                    const subject = subjectVerify.Subject;
                    const subgroups = subject.SubgroupSubjects?.map(subgroupSubject => subgroupSubject.SubGroup);
                    return { subject, subgroups };
               });
               setSubgroupData(subgroupData);

               const semisubgroupData = result.SubjectVerifies.map(subjectVerify => {
                    const subject = subjectVerify.Subject;
                    const semisubgroups = subject.SemiSubgroupSubjects?.map(semisubgroupSubject => semisubgroupSubject.SemiSubGroup);
                    return { subject, semisubgroups };
               });
               setSemiSubgroupData(semisubgroupData);

               // console.log(semisubgroupData);

          } catch (err) {
               console.error("Error on init func:", err);
          }
     }, [])

     const groupedSubjectsByCategory = useMemo(() => {
          const groupedSubjects = {};

          groupData.forEach(({ subject, groups }) => {
               groups.forEach(group => {
                    const category = group?.Categorie;
                    if (category) {
                         if (!groupedSubjects[category.id]) {
                              groupedSubjects[category.id] = { category, groups: {}, subgroups: {}, semisubgroups: {} };
                         }
                         if (!groupedSubjects[category.id].groups[group.id]) {
                              groupedSubjects[category.id].groups[group.id] = { ...group, subjects: [] };
                         }
                         groupedSubjects[category.id].groups[group.id].subjects.push(subject);
                    }
               });
          });

          subgroupData.forEach(({ subject, subgroups }) => {
               subgroups.forEach(subgroup => {
                    const category = subgroup?.Group?.Categorie;
                    if (category) {
                         if (!groupedSubjects[category.id]) {
                              groupedSubjects[category.id] = { category, groups: {}, subgroups: {}, semisubgroups: {} };
                         }
                         if (!groupedSubjects[category.id].subgroups[subgroup.id]) {
                              groupedSubjects[category.id].subgroups[subgroup.id] = { ...subgroup, subjects: [] };
                         }
                         groupedSubjects[category.id].subgroups[subgroup.id].subjects.push(subject);
                    }
               });
          });

          semisubgroupData.forEach(({ subject, semisubgroups }) => {
               semisubgroups.forEach(semisubgroup => {
                    const category = semisubgroup?.SubGroup?.Group?.Categorie;
                    if (category) {
                         if (!groupedSubjects[category.id]) {
                              groupedSubjects[category.id] = { category, groups: {}, subgroups: {}, semisubgroups: {} };
                         }
                         if (!groupedSubjects[category.id].semisubgroups[semisubgroup.id]) {
                              groupedSubjects[category.id].semisubgroups[semisubgroup.id] = { ...semisubgroup, subjects: [] };
                         }
                         groupedSubjects[category.id].semisubgroups[semisubgroup.id].subjects.push(subject);
                    }
               });
          });
          // console.log(semisubgroupData);

          return groupedSubjects;
     }, [subgroupData, groupData, semisubgroupData]);

     // console.log(groupedSubjectsByCategory);

     useEffect(() => {
          const categoryData = Object.keys(groupedSubjectsByCategory).map(categoryId => {
               const category = groupedSubjectsByCategory[categoryId].category;
               return { id: category.id, category_title: category.category_title };
          });

          setCategories(categoryData);
     }, [groupedSubjectsByCategory]);

     // console.log(category);


     useEffect(() => {
          const groupData = Object.keys(groupedSubjectsByCategory).flatMap(categoryId => {
               const category = groupedSubjectsByCategory[categoryId];
               const groups = category.groups;
               return Object.keys(groups).map(groupId => {
                    const group = groups[groupId];
                    return {
                         id: group.id,
                         group_title: group.group_title,
                    };
               });
          });

          const groupinsubData = Object.keys(groupedSubjectsByCategory).flatMap(categoryId => {
               const category = groupedSubjectsByCategory[categoryId];
               const subgroups = category.subgroups;

               // console.log(category);

               const uniqueGroups = new Map();

               Object.keys(subgroups).forEach(subgroupId => {
                    const subgroup = subgroups[subgroupId];
                    const group = subgroup.Group;

                    if (!uniqueGroups.has(group.id)) {
                         uniqueGroups.set(group.id, {
                              id: group.id,
                              group_title: group.group_title,
                              sub_group_titles: []  // Array to hold subgroup objects
                         });
                    }

                    const groupEntry = uniqueGroups.get(group.id);
                    groupEntry.sub_group_titles.push({
                         value: subgroup.id,
                         label: subgroup.sub_group_title
                    });
               });

               return Array.from(uniqueGroups.values());
          });

          const semiData = Object.keys(groupedSubjectsByCategory).flatMap(categoryId => {
               const category = groupedSubjectsByCategory[categoryId];
               const semisubgroups = category.semisubgroups;

               const uniqueGroupsss = new Map();

               Object.keys(semisubgroups).forEach(semisubgroupId => {
                    const semisubgroup = semisubgroups[semisubgroupId];
                    const subgroup = semisubgroup.SubGroup;
                    const group = subgroup.Group;

                    if (!uniqueGroupsss.has(group.id)) {
                         uniqueGroupsss.set(group.id, {
                              id: group.id,
                              group_title: group.group_title,
                              sub_group_titles: []
                         });
                    }

                    const groupEntry = uniqueGroupsss.get(group.id);

                    let subgroupEntry = groupEntry.sub_group_titles.find(sg => sg.value === subgroup.id);
                    if (!subgroupEntry) {
                         subgroupEntry = {
                              value: subgroup.id,
                              label: subgroup.sub_group_title,
                              semi_sub_group_titles: []
                         };
                         groupEntry.sub_group_titles.push(subgroupEntry);
                    }

                    subgroupEntry.semi_sub_group_titles.push({
                         value: semisubgroup.id,
                         label: semisubgroup.semi_sub_group_title
                    });
               });

               return Array.from(uniqueGroupsss.values());
          });

          // console.log(groupData);
          // console.log(groupinsubData);
          // console.log(semiData);

          const groupss = groupData.concat(groupinsubData).concat(semiData);
          setGroups(groupss);

     }, [groupedSubjectsByCategory]);

     // console.log(group);
     // console.log(groupedSubjectsByCategory);

     useEffect(() => {
          setLoading(false)
          initID(id);
          initVerify(id);
     }, [])

     const handleInsertModalOpen = () => {
          setInsertModalOpen(true);
     };

     const handleInsertModalClose = () => {
          setInsertModalOpen(false);
     };

     const handleInsertConditionModalOpen = () => {
          setInsertConditionModalOpen(true);
     };

     const handleInsertConditionModalClose = () => {
          setInsertConditionModalOpen(false);
     };

     const handleDataInserted = async () => {
          try {
               initVerify(id);
               handleInsertModalClose();

          } catch (error) {
               console.error('Error inserting data:', error);
               showToastMessage(false, "Error adding Subject Verify")
          }
     };
     // console.log(ids);

     const handleDataConditionInserted = async () => {
          try {
               initVerify(id);

          } catch (error) {
               console.error('Error inserting data:', error);
               showToastMessage(false, "Error adding Condition Verify")
          }
     };

     ///////////////////////////////////////////////////////////

     const handleDeleteGroupSubject = async (gs) => {
          // console.log(`Deleting GroupSubject with id: ${gs}`);
          // console.log("IDF: ",ids)

          const url = `/api/verify/group/${gs}/${ids}`
          // console.log(url)
          const options = await getOptions(url, 'DELETE')
          // console.log(id);
          axios(options)
               .then(async result => {
                    const { ok, message } = result.data
                    showToastMessage(ok, message)
                    initVerify(id);
               })
               .catch(error => {
                    showToastMessage(false, error)
               })
     };

     const handleDeleteSubGroupSubjectAndTrack = async (sgt) => {
          // console.log(`Deleting SubGroupSubjectAndTrack with id: ${sgt}`);

          const url = `/api/verify/subgroup/${sgt}/${idss}`
          const options = await getOptions(url, 'DELETE')
          axios(options)
               .then(async result => {
                    const { ok, message } = result.data
                    showToastMessage(ok, message)
                    initVerify(id);
               })
               .catch(error => {
                    showToastMessage(false, error)
               })
     };

     const handleDeleteSemi = async (sgt, idtest) => {
          console.log(idss);
          // console.log(`Deleting SubGroupSubjectAndTrack with id: ${sgt}`);
          // alert(ids)

          const url = `/api/verify/semisubgroup/${sgt}/${idss}`
          const options = await getOptions(url, 'DELETE')
          axios(options)
               .then(async result => {
                    const { ok, message } = result.data
                    showToastMessage(ok, message)
                    initVerify(id);
               })
               .catch(error => {
                    showToastMessage(false, error)
               })
     };

     const handleDeleteCategory = async (cat) => {
          // console.log(`Deleting handleDeleteCategory with id: ${cat}`);

          const url = `/api/verify/category/${cat}/${ids}`
          const options = await getOptions(url, 'DELETE')
          axios(options)
               .then(async result => {
                    const { ok, message } = result.data
                    showToastMessage(ok, message)
                    initVerify(id);
               })
               .catch(error => {
                    showToastMessage(false, error)
               })

     };

     ///////////////////////////////////////////////////////////

     const getSubTrack = useCallback((subgroup, subgroupIndex) => {
          // console.log(subgroup);
          if (subgroup?.subjects?.every(subject => subject?.SemiSubgroupSubjects?.some(e => e?.SemiSubGroup))) {
               const subjects = subgroup.subjects || [];
               const SemiSubjects = {};

               subjects.forEach(subject => {
                    const semiSubGroup = subject.SemiSubgroupSubjects?.find(e => e.SemiSubGroup);
                    if (semiSubGroup) {
                         const name = semiSubGroup.SemiSubGroup.semi_sub_group_title;
                         if (!SemiSubjects[name]) {
                              SemiSubjects[name] = [];
                         }
                         SemiSubjects[name].push(subject);
                    }
               });

               return (
                    <div key={subgroupIndex}>
                         <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                              <h3 className='text-md text-default-800 px-10'><li>{subgroup?.sub_group_title}</li></h3>
                         </div>
                         {SemiSubjects && Object.keys(SemiSubjects).map((semi, semiIndex) => (
                              <div key={semiIndex}>
                                   <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                                        <h3 className='text-md text-default-800 px-16'><li>{semi}</li></h3>
                                   </div>
                                   <Table
                                        classNames={tableClass}
                                        removeWrapper
                                        onRowAction={() => { }}
                                        aria-label="subjects table">
                                        <TableHeader>
                                             {/* <TableColumn>รหัสวิชา</TableColumn> */}
                                             <TableColumn>รหัสวิชา</TableColumn>
                                             <TableColumn>ชื่อวิชา EN</TableColumn>
                                             <TableColumn>ชื่อวิชา TH</TableColumn>
                                             <TableColumn>หน่วยกิต</TableColumn>
                                             <TableColumn></TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                             {SemiSubjects[semi].map((subject, subjectIndex) => (
                                                  <TableRow key={subjectIndex}>
                                                       {/* <TableCell className=''>{subject.subject_id}</TableCell> */}
                                                       <TableCell className=''>{subject.subject_code}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                       <TableCell>{subject.credit}</TableCell>
                                                       <TableCell>
                                                            <div className='relative flex items-center gap-2'>
                                                                 <Tooltip color="danger" content="ลบ">
                                                                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                           <DeleteIcon2 onClick={() => handleDeleteSemi(subject.subject_id, ids)} />
                                                                           {/* {subject.subject_id} */}
                                                                      </span>
                                                                 </Tooltip>
                                                            </div>
                                                       </TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>
                              </div>
                         ))}
                    </div>
               );

          } else if (subgroup?.subjects.every(subject => subject?.Track)) {
               const subjects = subgroup?.subjects
               const trackSubjects = {}
               for (let index = 0; index < subjects?.length; index++) {
                    const track = subjects[index]?.Track.title_th
                    if (!trackSubjects.hasOwnProperty(track)) {
                         trackSubjects[track] = []
                    }
                    trackSubjects[track].push(subjects[index])
               }
               ////// Subgroup มีแทรค
               // console.log(subgroup);
               // console.log(trackSubjects);
               return (
                    <div key={subgroupIndex}>
                         <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                              <h3 className='text-md text-default-800 px-10'><li>{subgroup?.sub_group_title}</li></h3>
                         </div>
                         {trackSubjects && Object.keys(trackSubjects).map((track, trackIndex) => (
                              <div key={trackIndex}>
                                   <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                                        <h3 className='text-md text-default-800 px-16'><li>กลุ่มย่อยที่ {trackIndex + 1} {track}</li></h3>
                                   </div>
                                   <Table
                                        classNames={tableClass}
                                        removeWrapper
                                        onRowAction={() => { }}
                                        aria-label="subjects table">
                                        <TableHeader>
                                             {/* <TableColumn>รหัสวิชา</TableColumn> */}
                                             <TableColumn>รหัสวิชา</TableColumn>
                                             <TableColumn>ชื่อวิชา EN</TableColumn>
                                             <TableColumn>ชื่อวิชา TH</TableColumn>
                                             <TableColumn>หน่วยกิต</TableColumn>
                                             <TableColumn></TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                             {trackSubjects[track].map((subject, subjectIndex) => (
                                                  <TableRow key={subjectIndex} className={subject.track !== null ? 'bg-green-50' : ''}>
                                                       {/* <TableCell className=''>{subject.subject_id}</TableCell> */}
                                                       <TableCell className=''>{subject.subject_code}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                       <TableCell>{subject.credit}</TableCell>
                                                       <TableCell>
                                                            <div className='relative flex items-center gap-2'>
                                                                 <Tooltip color="danger" content="ลบ">
                                                                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                           <DeleteIcon2 onClick={() => handleDeleteSubGroupSubjectAndTrack(subject.subject_id)} />
                                                                           {/* {subject.subject_id} */}
                                                                      </span>
                                                                 </Tooltip>
                                                            </div>
                                                       </TableCell>
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
                                   <TableColumn></TableColumn>
                              </TableHeader>
                              <TableBody>
                                   {subgroup.subjects && subgroup.subjects.map((subject, subjectIndex) => (
                                        <TableRow key={subjectIndex} className={subject.track == null ? 'bg-red-50' : ''}>
                                             <TableCell className=''>{subject.subject_code}</TableCell>
                                             <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                             <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                             <TableCell>{subject.credit}</TableCell>
                                             <TableCell>
                                                  <div className='relative flex items-center gap-2'>
                                                       <Tooltip color="danger" content="ลบ">
                                                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                 <DeleteIcon2 onClick={() => handleDeleteSubGroupSubjectAndTrack(subject.subject_id)} />
                                                                 {/* {subject.subject_id} */}
                                                            </span>
                                                       </Tooltip>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </div>
               )
          }
     }, [])

     const getSubg = (subgroups, semisubgroups) => {
          if (!subgroups || !semisubgroups) return undefined;
          if (Object.values(subgroups).length === 0 && Object.values(semisubgroups).length === 0) return undefined;

          const groupedSubgroups = {};

          Object.values(subgroups).forEach((subgroup) => {
               const groupTitle = subgroup?.Group?.group_title;
               if (!groupedSubgroups[groupTitle]) {
                    groupedSubgroups[groupTitle] = [];
               }
               groupedSubgroups[groupTitle].push(subgroup);
          });


          Object.values(semisubgroups).forEach(semisubgroup => {
               const groupTitle = semisubgroup?.SubGroup?.Group?.group_title;
               if (!groupedSubgroups[groupTitle]) {
                    groupedSubgroups[groupTitle] = [];
               }
               semisubgroup.SubGroup.subjects = semisubgroup.subjects
               groupedSubgroups[groupTitle].push(semisubgroup?.SubGroup);
          });

          return (
               <>
                    {Object.keys(groupedSubgroups).map((groupTitle, groupIndex) => {
                         const subgroupsWithSameGroupTitle = groupedSubgroups[groupTitle];

                         return (
                              <div key={groupIndex}>
                                   <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center'>
                                        <h3 className='text-lg text-default-800 px-4'><li>{groupTitle}</li></h3>
                                        {/* <h2 className='text-sm text-default-800'>จำนวน {creditsubgroup} หน่วยกิต</h2> */}
                                   </div>
                                   {subgroupsWithSameGroupTitle.map((subgroup, subgroupIndex) => (
                                        getSubTrack(subgroup, subgroupIndex)
                                   ))}
                              </div>
                         );
                    })}
               </>
          );
     }


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
                                             <div className='bg-gray-100 border-gray-200 border-1 p-2 items-center rounded-md mb-4 flex flex-wrap justify-between'>
                                                  <div className="text-base">
                                                       <h1 className='py-2 p-2 px-1'><span className='font-bold'>{verifySelect.verify}</span> {verifySelect.title} สาขาวิชา{program.title_th} (ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                                  </div>
                                                  <div className='flex gap-2 p-2 px-1 max-lg:col-span-4'>
                                                       <div className="">
                                                            <Button
                                                                 radius="sm"
                                                                 size='sm'
                                                                 onPress={handleInsertConditionModalOpen}
                                                                 className='bg-gray-300'
                                                                 color="default"
                                                                 startContent={<PlusIcon className="w-5 h-5" />}>
                                                                 เพิ่มเงื่อนไข
                                                            </Button>
                                                       </div>
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
                                                       </div>
                                                  </div>
                                             </div>

                                             {Object.keys(groupedSubjectsByCategory).map((categoryId, index) => {
                                                  if (index > highestIndex) {
                                                       setHighestIndex(index);
                                                  }
                                                  const { category, groups, subgroups, semisubgroups } = groupedSubjectsByCategory[categoryId];
                                                  return (
                                                       <div key={index} className='mb-5'>
                                                            <div className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-md'>
                                                                 <h2 className='text-lg text-default-800'>{index + 1}. {category?.category_title}</h2>
                                                                 {/* <h2 className='text-sm text-default-800'>จำนวน {creditgroup} หน่วยกิต</h2> */}
                                                            </div>
                                                            {Object.keys(groups).map((groupId, groupIndex) => {
                                                                 const group = groups[groupId];
                                                                 // console.log(group);
                                                                 ///// วิชาที่อยู่ใน group
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
                                                                                     <TableColumn></TableColumn>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                     {group.subjects && group.subjects.map((subject, subjectIndex) => (
                                                                                          <TableRow key={subjectIndex}>
                                                                                               <TableCell className=''>{subject.subject_code}</TableCell>
                                                                                               <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                                                               <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                                                               <TableCell>{subject.credit}</TableCell>
                                                                                               {subject.GroupSubjects && subject.GroupSubjects.map((z, zIndex) => (
                                                                                                    <TableCell key={zIndex} className="">
                                                                                                         <div className='relative flex items-center gap-2'>
                                                                                                              <Tooltip color="danger" content="ลบ">
                                                                                                                   <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                                                                        <DeleteIcon2 onClick={() => handleDeleteGroupSubject(z.id, ids)} />
                                                                                                                        {/* {z.id} */}
                                                                                                                   </span>
                                                                                                              </Tooltip>
                                                                                                         </div>
                                                                                                    </TableCell>
                                                                                               ))}
                                                                                          </TableRow>
                                                                                     ))}
                                                                                </TableBody>
                                                                           </Table>
                                                                      </div>
                                                                 );
                                                            })}
                                                            {
                                                                 getSubg(subgroups, semisubgroups)
                                                            }
                                                       </div>
                                                  );
                                             })}

                                             {categoryverify && categoryverify.map((categorie, catIndex) => (
                                                  <div key={catIndex}>
                                                       <div className='flex justify-between items-center bg-gray-200 border-gray-300 border-1 p-2 px-3 flex-row  mt-5 rounded-t-md text-lg text-default-800'>
                                                            <h2 className=''>{catIndex + highestIndex + 2}. {categorie.category_title}</h2>
                                                            <div className='relative flex items-center gap-2'>
                                                                 <Tooltip color="danger" content="ลบ">
                                                                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                           <DeleteIcon2 onClick={() => handleDeleteCategory(categorie.id, ids)} />
                                                                      </span>
                                                                 </Tooltip>
                                                            </div>
                                                       </div>
                                                       <div className='flex justify-center items-center h-full w-full border-1'>
                                                            <p className='my-5'>ให้นักศึกษาเพิ่มวิชาเอง</p>
                                                       </div>
                                                  </div>
                                             ))}

                                             {Object.keys(groupedSubjectsByCategory).length === 0 && categoryverify.length === 0 && (
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
                         category_page={category}
                    />
                    <InsertConditionModal
                         isOpen={isInsertConditionModalOpen}
                         onClose={handleInsertConditionModalClose}
                         onDataInserted={handleDataConditionInserted}
                         verify_id={ids}
                         group={group}
                    />

               </ContentWrap >
          </>
     )
}

export default Page