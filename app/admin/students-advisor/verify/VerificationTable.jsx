"use client"
import { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic';
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components';
import { useSession } from "next-auth/react"
import { useToggleSideBarStore } from '@/src/store'
import { getOptions } from '@/app/components/serverAction/TokenAction';
import TMonlicaEmail from '@/app/components/TMonlicaEmail';
import axios from 'axios';
import { Loading } from '@/app/components'
import { Button, Textarea, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner, Tooltip } from '@nextui-org/react'
import { tableClass, tableClassCondition } from '@/src/util/ComponentClass'
import { Checkbox } from "@nextui-org/checkbox";
import { floorGpa, calGrade, isNumber } from '@/src/util/grade';
import { Empty, message } from 'antd';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import InsertSubject from './InsertSubject';
import { RadioGroup, Radio } from "@nextui-org/radio";
import Link from 'next/link'
import { simpleDMY, simpleDMYHM } from '@/src/util/simpleDateFormatter'
import { SearchOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import { TbMessage2Exclamation } from "react-icons/tb";

import { Accordion, AccordionItem } from "@nextui-org/react";
import { Divider, notification, Space } from 'antd';
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { BsBan } from "react-icons/bs";
import html2canvas from 'html2canvas-pro'; // Correct import
import { jsPDF } from 'jspdf';
import { FloatButton } from 'antd';
import { BsFiletypePdf } from "react-icons/bs";
import CategoryGrade from '../../verify-selection/[id]/CategoryGrade';
import TextUnderline from '@/app/components/TextUnderline';

const VerificationTable = ({ stdID }) => {

     const [loading, setLoading] = useState(true)
     const [verifySelect, setVerifySelect] = useState({})
     const [verifySubjects, setVerifySubjects] = useState([])
     const [userData, setUserData] = useState({})
     const [enrollments, setEnrollment] = useState([])
     const [program, setProgram] = useState([])
     const [subgroupData, setSubgroupData] = useState([]);
     const [groupData, setGroupData] = useState([]);
     const [cateData, setCategoryData] = useState([]);
     const [semisubgroupData, setSemiSubgroupData] = useState([]);
     const [categoryverify, setCategoryVerifies] = useState([])
     const [highestIndex, setHighestIndex] = useState(0);

     const [ids, setId] = useState(null);
     const [status, setStatus] = useState(null);
     const [statusVerify, setStatusVerify] = useState([]);

     const [subjects, setSubjects] = useState([]);

     const [conditions, setConditions] = useState([]);
     const [conditionSubgroup, setConditionSubgroup] = useState([]);
     const [conditionCategory, setConditionCategory] = useState([]);

     const [groupfirst, setGroupFirst] = useState([])
     const [group, setGroups] = useState([])

     const [pickSubj, setVerifySubj] = useState([]);
     const [searchSubj, setSearchSubj] = useState("");
     const [filterSubj, setFilterSubj] = useState([]);

     const [subjectTrack, setSubjectTrack] = useState([]);

     const [gpa, setGpa] = useState(0)

     /////////////////////////////////from have grade//////////////////////////////////////

     const [verifyHaveGrade, setVerifyHaveGrade] = useState({})
     const [itGrade, setItGrade] = useState([])

     const [groupDataGrade, setGroupDataGrade] = useState([]);
     const [subgroupDataGrade, setSubgroupDataGrade] = useState([]);
     const [semisubgroupDataGrade, setSemiSubgroupDataGrade] = useState([]);

     const [cateDataGrade, setCategoryDataGrade] = useState([]);
     const [categoryverifyGrade, setCategoryVerifiesGrade] = useState([])

     const [subjectTrackGrade, setSubjectTrackGrade] = useState([]);


     //////////// ant design ////////////

     const [open, setOpen] = useState(false);

     const showDrawer = () => {
          setOpen(true);
     };
     const onClose = () => {
          setOpen(false);
     };

     useEffect(() => {
          const mediaQuery = window.matchMedia('(min-width: 1280px)'); // xl and above
          const handleScreenSizeChange = (e) => {
               if (e.matches) {
                    onClose(); // Close the drawer if screen size is xl or above
               }
          };

          mediaQuery.addEventListener('change', handleScreenSizeChange);

          // Cleanup listener on component unmount
          return () => {
               mediaQuery.removeEventListener('change', handleScreenSizeChange);
          };
     }, []);

     const [api, contextHolder] = notification.useNotification();

     /////////////////////////// ตัวหนังสือสีๆแดงๆ ว่า ผ่านอะไรไม่ผ่านอะไร /////////////////////////////

     const [insufficientCreditCategories, setInsufficientCreditCategories] = useState([]);
     const [insufficientCreditGroups, setInsufficientCreditGroups] = useState([]);
     const [insufficientCreditSubGroups, setInsufficientCreditSubGroups] = useState([]);
     const [insufficientCreditIT, setInsufficientCreditIT] = useState([]);


     ////////////////////////////////// useState to verify_selection//////////////////////////////////////////////////////////////

     const [term, setTerm] = useState("");
     const [cumlaude, setCumLaude] = useState("");

     useEffect(() => {
          if (status?.status !== 0) {
               if (verifyHaveGrade?.term) {
                    setTerm(verifyHaveGrade.term);
               }

               if (verifyHaveGrade?.cum_laude) {
                    setCumLaude(verifyHaveGrade.cum_laude);
               }
          } else {
               setTerm("");
          }
     }, [status?.status, verifyHaveGrade]);

     const handleChange = (event) => {
          setTerm(event.target.value);
     };

     const isReadOnly = verifyHaveGrade?.cum_laude ? true : false;
     const isDisabled = status?.status !== 0 ? (verifyHaveGrade?.term ? true : false) : false;

     //////////////////////////////////////useState to studentcategoryverifies รับค่ามาจาก insertSubject/////////////////////////////////////////////////////////

     const [studentcategory, setStudentCategory] = useState([]);

     const handleVerifySubjChange = (catIndex, category_id, verifySubj, category_title) => {
          setStudentCategory(prevCategories => {
               const updatedCategories = [...prevCategories];
               updatedCategories[catIndex] = { ...updatedCategories[catIndex], category_id, verifySubj, category_title };
               return updatedCategories;
          });
     };

     ///////////////////////////////////////////////////////////////////////////////////////////////

     function getGpa(enrollments) {
          if (enrollments.length == 0) return 0
          let sumGrade = 0
          let sumCredit = 0
          for (const enrollment of enrollments) {
               const grade = calGrade(enrollment?.grade)
               if (grade == undefined || !isNumber(grade)) {
                    continue
               }
               const credit = enrollment?.Subject?.credit || 0
               sumGrade += grade * credit
               sumCredit += credit
          }
          return floorGpa(sumGrade / sumCredit)
     }

     const fetchEnrollment = useCallback(async function (stu_id) {
          try {
               const URL = `/api/students/enrollments/${stu_id}`;
               const option = await getOptions(URL, "GET");
               const response = await axios(option);
               const data = response.data.data;
               console.log(data);

               setUserData(data);

               if (data?.Enrollments?.length) {
                    let enrollments = data?.Enrollments;
                    // หา GPA
                    const gpa = getGpa(enrollments);
                    setGpa(gpa);

                    // Check for cumlaude conditions
                    let hasInvalidGrade = false;
                    for (const enrollment of enrollments) {
                         const grade = calGrade(enrollment?.grade);
                         if (["F", "R", "U"].includes(enrollment?.grade)) {
                              hasInvalidGrade = true;
                              break;
                         }
                    }

                    if (hasInvalidGrade) {
                         setCumLaude("-"); // No cumlaude if invalid grades
                    } else if (gpa >= 3.60) {
                         setCumLaude(1); // cumlaude 1
                    } else if (gpa >= 3.25 && gpa < 3.60) {
                         setCumLaude(2); // cumlaude 2
                    } else {
                         setCumLaude("-"); // No cumlaude if conditions are not met
                    }

               }

               if (data.Enrollments.length > 0) {
                    setEnrollment(data.Enrollments);
               } else {
                    setEnrollment([]);
               }
          } catch (error) {
               setUserData({});
               setEnrollment([]);
          }
     }, []);

     useEffect(() => {
          if (stdID) {
               fetchEnrollment(stdID)
          }
     }, [stdID])

     // console.log(subjects);

     const getEnrollmentGrade = (subjectCode) => {
          // ต้องการหา subjectCode ใน enrollments
          const enrollment = enrollments.find(e => e?.Subject?.subject_code === subjectCode);
          if (enrollment) {
               return enrollment.grade;
          }
          return "ไม่มีเกรด";
     }

     ///////////////////////////////////อย่างน้อยของแบบฟอร์มใหญ่/////////////////////////////////////////////////////


     const enrolls = enrollments.map(prev => {
          const grade = getEnrollmentGrade(prev?.Subject?.subject_code);
          const credit = prev?.Subject?.credit;

          // Check for invalid grades or low credits
          if (grade === "ไม่มีเกรด" || grade === null || grade === undefined) {
               return null;
          }

          const creditOnlyGrades = ["I", "P", "R", "S", "T", "U", "W"];
          const gradeAndCreditGrades = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

          let calculatedGrade = null;
          let numericGrade = null;

          if (credit <= 1 || credit === 6 && creditOnlyGrades.includes(grade)) {
               // Only count credits, not grades
               return {
                    subject_code: prev?.Subject?.subject_code,
                    grade: grade,  // Keep the original grade
                    credit: credit,
                    numericGrade: null // Do not calculate grade
               };
          } else if (gradeAndCreditGrades.includes(grade)) {
               // Count both credits and grades
               calculatedGrade = calGrade(grade);
               numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

               return {
                    subject_code: prev?.Subject?.subject_code,
                    grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                    credit: credit,
                    numericGrade: numericGrade
               };
          }
     }).filter(enroll => enroll !== null);

     // const totalenrolls = enrolls.reduce((sum, enroll) => sum += enroll.credit, 0);

     // console.log('Total Credits:', totalenrolls);


     ////////////////////////////////////////////////////////////////////////////////////////

     const fetchData = async function () {
          try {
               let URL = `/api/verify/selects/${userData.program}/${userData.acadyear}`;
               let option = await getOptions(URL, "GET");
               const response = await axios(option);

               const data = response.data.data;
               // console.log(data);

               if (data) {
                    setId(data?.id)
                    setProgram(data?.Program);
                    setVerifySelect(data);

                    const categoryverifies = data.CategoryVerifies.map(categoryVerify => categoryVerify.Categorie);
                    setCategoryVerifies(categoryverifies);

                    const subjectsByCategory = data.SubjectVerifies.reduce((acc, subjectVerify) => {
                         const subject = subjectVerify.Subject;
                         const categories = [...new Set([
                              ...subject.SubgroupSubjects.map(subgroup => subgroup.SubGroup.Group.Categorie),
                              ...subject.GroupSubjects.map(group => group.Group.Categorie),
                              ...subject.SemiSubgroupSubjects.map(semisubgroup => semisubgroup.SubGroup.Group.Categorie)
                         ])];

                         categories.forEach(categorie => {
                              if (!acc[categorie.id]) {
                                   acc[categorie.id] = {
                                        category: categorie,
                                        subjects: []
                                   };
                              }
                              acc[categorie.id].subjects.push(subject);
                         });

                         return acc;
                    }, {});

                    const categoryData = Object.values(subjectsByCategory);

                    setCategoryData(categoryData);

                    // console.log(categoryData);

                    const subgroupData = data.SubjectVerifies.map(subjectVerify => {
                         const subject = subjectVerify.Subject;
                         const subgroups = subject.SubgroupSubjects.map(subgroupSubject => subgroupSubject.SubGroup);
                         return { subject, subgroups };
                    });
                    setSubgroupData(subgroupData);

                    const groupData = data.SubjectVerifies.map(subjectVerify => {
                         const subject = subjectVerify.Subject;
                         const groups = subject.GroupSubjects.map(groupSubject => groupSubject.Group);
                         return { subject, groups };
                    });
                    setGroupData(groupData);

                    const semisubgroupData = data.SubjectVerifies.map(subjectVerify => {
                         const subject = subjectVerify.Subject;
                         const semisubgroups = subject.SemiSubgroupSubjects.map(semisubgroupSubject => {
                              // Create a new object without circular references
                              const { SemiSubGroup, ...rest } = semisubgroupSubject;
                              return {
                                   ...SemiSubGroup,
                                   ...rest,
                                   SubGroup: SemiSubGroup.SubGroup ? {
                                        id: SemiSubGroup.SubGroup.id,
                                        name: SemiSubGroup.SubGroup.name,
                                        Group: SemiSubGroup.SubGroup.Group ? {
                                             id: SemiSubGroup.SubGroup.Group.id,
                                             name: SemiSubGroup.SubGroup.Group.name,
                                             Categorie: SemiSubGroup.SubGroup.Group.Categorie ? {
                                                  id: SemiSubGroup.SubGroup.Group.Categorie.id,
                                                  name: SemiSubGroup.SubGroup.Group.Categorie.name
                                             } : null
                                        } : null
                                   } : null
                              };
                         });

                         return { subject: { subject_id: subject.subject_id, subject_code: subject.subject_code }, semisubgroups };
                    });
                    // console.log(semisubgroupData);

                    setSemiSubgroupData(semisubgroupData);

                    if (data?.Subjects) {
                         setVerifySubjects(data.Subjects);
                    } else {
                         setVerifySubjects([]);
                    }
               } else {
                    setVerifySelect({});
                    setVerifySubjects([]);
               }
          } catch (error) {
               console.log(error);
               setVerifySelect({});
               setVerifySubjects([]);
          } finally {
               setLoading(false);
          }
     }

     const fetchConditions = async (ids) => {
          try {
               const url = `/api/condition/student/group/${ids}`;
               const option = await getOptions(url, "GET");
               try {
                    const res = await axios(option);
                    const filterConditions = res.data.data;

                    setConditions(filterConditions);
               } catch (error) {
                    setConditions([]);
                    return;
               }
          } catch (error) {
               console.error('Error fetching conditions:', error);
          }
     };

     const fetchConditionSubject = async (ids) => {
          try {
               const url = `/api/condition/student/subgroup/${ids}`;
               const option = await getOptions(url, "GET");
               try {
                    const res = await axios(option);
                    const filterConditions = res.data.data;

                    setConditionSubgroup(filterConditions);
               } catch (error) {
                    setConditionSubgroup([]);
                    return;
               }
          } catch (error) {
               console.error('Error fetching conditions:', error);
          }
     };

     const fetchConditionCategory = async (ids) => {
          try {
               const url = `/api/condition/student/category/${ids}`;
               const option = await getOptions(url, "GET");
               try {
                    const res = await axios(option);
                    const filterConditions = res.data.data;

                    setConditionCategory(filterConditions);
               } catch (error) {
                    setConditionCategory([]);
                    return;
               }
          } catch (error) {
               console.error('Error fetching conditions:', error);
          }
     };

     const fetchStatus = async (stu_id) => {
          try {
               const url = `/api/verify/selects/${stu_id}`;
               const option = await getOptions(url, "GET");
               try {
                    const res = await axios(option);
                    const setstatus = res.data.data;

                    setStatus(setstatus);
               } catch (error) {
                    setStatus([]);
                    return;
               }
          } catch (error) {
               console.error('Error fetching Status:', error);
          }
     };

     const fetchStatusVerify = async (stu_id) => {
          try {
               const url = `/api/verify/selects/status/verify/${stu_id}`;
               const option = await getOptions(url, "GET");

               const res = await axios(option);

               // Check if the response is successful and contains data
               if (res.status === 200 && res.data.ok) {
                    const setstatus = res.data.data;

                    setStatusVerify(setstatus);
               } else {
                    setStatusVerify([]); // No data found or unexpected response
               }
          } catch (error) {
               // If any error occurs, set status to empty
               setStatusVerify([]);
          }
     };


     useEffect(() => {
          // fetchstdverify(ids);
          fetchConditions(ids);
          fetchConditionSubject(ids);
          fetchConditionCategory(ids);
          fetchStatus(userData?.stu_id);
          if (userData?.stu_id) fetchStatusVerify(userData?.stu_id);
     }, [ids, userData?.stu_id]);



     const fetchSubjects = async () => {
          try {
               const url = `/api/subjects/student`
               const option = await getOptions(url, "GET")
               try {
                    const res = await axios(option)
                    const filterSubjects = res.data.data

                    const filteredSubjects = filterSubjects
                         .filter(subject => subject.track !== null && subject.track !== '') // Valid track
                         .map(subject => ({
                              ...subject,
                              grade: getEnrollmentGrade(subject.subject_code) // Get grade for the subject
                         }))
                         .filter(subject => subject.grade !== "ไม่มีเกรด"); // Filter out subjects without a grade

                    setSubjectTrack(filteredSubjects)
                    setSubjects(filterSubjects)
               } catch (error) {
                    setSubjects([])
                    // setSubjectTrack([])
                    return
               }
          } catch (error) {
               console.error('Error fetching subjects:', error);
          }
     };

     useEffect(() => {
          const fetchDataAsync = async () => {
               if (Object.keys(userData).length > 0) {
                    await fetchData();
                    await fetchSubjects();
               }
          };

          fetchDataAsync();
     }, [userData]);



     ////////////////////////////////////////fetch from have grade///////////////////////////////////////////////////

     const initVerifyHaveGrade = useCallback(async function (stu_id) {
          try {
               const url = `/api/verify/selects/grade/confirm/${stu_id}`;
               const option = await getOptions(url, "GET");
               try {
                    const res = await axios(option);
                    const verifyHaveGrade = res.data.data

                    setVerifyHaveGrade(verifyHaveGrade);

                    const allSubjects = verifyHaveGrade.StudentVerifyDetails
                         .flatMap(detail => detail.Subject); // Flatten the array of subjects

                    // Filter subjects based on track
                    const filteredSubjects = allSubjects.filter(subject => subject.track !== null && subject.track !== '');

                    // Map filtered subjects with grade information
                    const filteredSubjectsWithGrades = filteredSubjects.map(subject => ({
                         ...subject,
                         grade: verifyHaveGrade.StudentVerifyDetails.find(detail => detail.subject_id === subject.subject_id)?.grade || null
                    }));

                    setSubjectTrackGrade(filteredSubjectsWithGrades);

                    // Set category verifies
                    const categoryVerifies = verifyHaveGrade.Verify.CategoryVerifies?.map(categoryVerify => {
                         const category = categoryVerify.Categorie;
                         const subjectDetails = verifyHaveGrade.StudentVerifyDetails.filter(detail =>
                              detail.StudentCategoryVerify?.CategoryVerify?.Categorie?.id === category.id
                         );
                         return { category, subjectDetails };
                    });
                    setCategoryVerifiesGrade(categoryVerifies);

                    const subjectsByCategory = verifyHaveGrade.Verify.SubjectVerifies.reduce((acc, subjectVerify) => {
                         const subject = subjectVerify.Subject;
                         const categories = [
                              ...subject.SubgroupSubjects.map(subgroup => subgroup.SubGroup.Group.Categorie),
                              ...subject.GroupSubjects.map(group => group.Group.Categorie),
                              ...subject.SemiSubgroupSubjects.map(semisubgroup => semisubgroup.SubGroup.Group.Categorie)
                         ];

                         categories.forEach(categorie => {
                              if (!acc[categorie.id]) {
                                   acc[categorie.id] = {
                                        category: categorie,
                                        subjects: []
                                   };
                              }
                              acc[categorie.id].subjects.push({
                                   ...subject,
                                   grade: verifyHaveGrade.StudentVerifyDetails.find(detail =>
                                        detail.subject_id === subject.subject_id &&
                                        detail.StudentCategoryVerify?.CategoryVerify?.Categorie?.id === categorie.id
                                   )?.grade || null
                              });
                         });

                         return acc;
                    }, {});

                    const categoryData = Object.values(subjectsByCategory);

                    setCategoryDataGrade(categoryData);

                    // Map subject verifies and include grade information
                    const groupData = verifyHaveGrade.Verify.SubjectVerifies.map(subjectVerify => {
                         const subject = subjectVerify.Subject;
                         const groups = subject.GroupSubjects?.map(groupSubject => ({
                              ...groupSubject.Group,
                              grade: verifyHaveGrade.StudentVerifyDetails.find(detail => detail.subject_id === subject.subject_id)?.grade // Include grade
                         }));
                         return { subject, groups };
                    });
                    setGroupDataGrade(groupData);

                    // Map subgroup verifies and include grade information
                    const subgroupData = verifyHaveGrade.Verify.SubjectVerifies.map(subjectVerify => {
                         const subject = subjectVerify.Subject;
                         const subgroups = subject.SubgroupSubjects?.map(subgroupSubject => ({
                              ...subgroupSubject.SubGroup,
                              grade: verifyHaveGrade.StudentVerifyDetails.find(detail => detail.subject_id === subject.subject_id)?.grade // Include grade
                         }));
                         return { subject, subgroups };
                    });
                    setSubgroupDataGrade(subgroupData);

                    // Map semi-subgroup verifies and include grade information
                    const semisubgroupData = verifyHaveGrade.Verify.SubjectVerifies.map(subjectVerify => {
                         const subject = subjectVerify.Subject;
                         const semisubgroups = subject.SemiSubgroupSubjects?.map(semisubgroupSubject => ({
                              ...semisubgroupSubject.SemiSubGroup,
                              grade: verifyHaveGrade.StudentVerifyDetails.find(detail => detail.subject_id === subject.subject_id)?.grade // Include grade
                         }));
                         return { subject, semisubgroups };
                    });
                    setSemiSubgroupDataGrade(semisubgroupData);

               } catch (error) {
                    setSubjectTrackGrade([])
                    setCategoryVerifiesGrade([])
                    setCategoryDataGrade([])
                    setGroupDataGrade([])
                    setSubgroupDataGrade([])
                    setSemiSubgroupDataGrade([])
                    setVerifyHaveGrade([]);
                    return;
               }
          } catch (error) {
               console.error('Error fetching havegrade:', error);
          }
     }, []);

     const initItGrade = useCallback(async function (stu_id) {
          try {
               const url = `/api/verify/selects/grade/it/${stu_id}`;
               const option = await getOptions(url, "GET");
               try {
                    const res = await axios(option);
                    const itgrade = res.data.data;

                    setItGrade(itgrade);
               } catch (error) {
                    setItGrade([]);
                    return;
               }
          } catch (error) {
               console.error('Error fetching havegrade:', error);
          }
     }, [])

     useEffect(() => {
          // fetchstdverify(ids);
          if (userData?.stu_id) initVerifyHaveGrade(userData?.stu_id);
          if (userData?.stu_id) initItGrade(userData?.stu_id);
     }, [userData?.stu_id]);


     ///////////////////////////////////////////////////////////////////////////////////////////
     const groupedSubjectsByCategory = useMemo(() => {
          const groupedSubjects = {};

          (groupDataGrade.length > 0 ? groupDataGrade : groupData).forEach(({ subject, groups }) => {
               groups.forEach(group => {
                    const category = group?.Categorie;
                    if (!groupedSubjects[category.id]) {
                         groupedSubjects[category.id] = { category, groups: {}, subgroups: {}, semisubgroups: {} };
                    }
                    if (!groupedSubjects[category.id].groups[group.id]) {
                         groupedSubjects[category.id].groups[group.id] = { ...group, subjects: [] };
                    }
                    groupedSubjects[category.id].groups[group.id].subjects.push(
                         groupDataGrade.length > 0 ? { ...subject, grade: group.grade } : subject
                    );
               });
          });

          (subgroupDataGrade.length > 0 ? subgroupDataGrade : subgroupData).forEach(({ subject, subgroups }) => {
               subgroups.forEach(subgroup => {
                    const category = subgroup?.Group?.Categorie;
                    if (!groupedSubjects[category.id]) {
                         groupedSubjects[category.id] = { category, groups: {}, subgroups: {}, semisubgroups: {} };
                    }
                    if (!groupedSubjects[category.id].subgroups[subgroup.id]) {
                         groupedSubjects[category.id].subgroups[subgroup.id] = { ...subgroup, subjects: [] };
                    }
                    groupedSubjects[category.id].subgroups[subgroup.id].subjects.push(
                         subgroupDataGrade.length > 0 ? { ...subject, grade: subgroup.grade } : subject
                    );
               });
          });

          (semisubgroupDataGrade.length > 0 ? semisubgroupDataGrade : semisubgroupData).forEach(({ subject, semisubgroups }) => {
               semisubgroups.forEach(semisubgroup => {
                    const category = semisubgroup?.SubGroup?.Group?.Categorie;
                    if (category) {
                         if (!groupedSubjects[category.id]) {
                              groupedSubjects[category.id] = { category, groups: {}, subgroups: {}, semisubgroups: {} };
                         }
                         if (!groupedSubjects[category.id].semisubgroups[semisubgroup.id]) {
                              groupedSubjects[category.id].semisubgroups[semisubgroup.id] = { ...semisubgroup, subjects: [] };
                         }
                         groupedSubjects[category.id].semisubgroups[semisubgroup.id].subjects.push(
                              semisubgroupDataGrade.length > 0 ? { ...subject, grade: semisubgroup.grade } : subject
                         );
                    }
               });
          });

          return groupedSubjects;
     }, [subgroupData, groupData, semisubgroupData, subgroupDataGrade, groupDataGrade, semisubgroupDataGrade]);


     /////////////////////////////// เงือนไข //////////////////////////////////////////////

     useEffect(() => {
          const groupDatatest = [];

          Object.keys(groupedSubjectsByCategory).forEach(categoryId => {
               const category = groupedSubjectsByCategory[categoryId];
               const groups = category.groups;

               Object.keys(groups).forEach(groupId => {
                    const group = groups[groupId];
                    groupDatatest.push({ group });
               });
          });

          setGroupFirst(groupDatatest)
     }, [groupedSubjectsByCategory]);

     useEffect(() => {
          const groupData = [];
          const groupinsubData = [];

          Object.keys(groupedSubjectsByCategory).forEach(categoryId => {
               const category = groupedSubjectsByCategory[categoryId];
               const subgroups = category.subgroups;

               Object.keys(subgroups).forEach(groupId => {
                    const subgroup = subgroups[groupId];
                    groupData.push({ subgroup });
               });
          });

          Object.keys(groupedSubjectsByCategory).forEach(categoryId => {
               const category = groupedSubjectsByCategory[categoryId];
               const semisubgroups = category.semisubgroups;

               Object.keys(semisubgroups).forEach(subgroupId => {
                    const semisubgroup = semisubgroups[subgroupId];
                    groupinsubData.push({ semisubgroup });
               });
          });

          const allGroups = groupData.concat(groupinsubData);

          setGroups(allGroups);
     }, [groupedSubjectsByCategory]);

     // console.log(groupedSubjectsByCategory);

     // console.log(group);

     const condition = conditions.map(prev => prev.Group);
     const conditionsubgroups = conditionSubgroup.map(prev => prev.SubGroup);

     const go = group.map(prev => prev.subgroup || prev.semisubgroup.SubGroup);

     const filteredGofirst = groupfirst.filter(group => {
          return condition.some(cond => cond.id === group?.group?.id);
     }).map(group => group);

     const filteredGo = go.filter(subgroup => {
          return condition.some(cond => cond.id === subgroup?.Group?.id);
     }).map(subgroup => subgroup);

     const filteredGoSub = go.filter(subgroup => {
          return conditionsubgroups.some(cond => cond.id === subgroup?.id);
     }).map(subgroup => subgroup);

     const combinedGroupfirst = [];

     filteredGofirst.map(group => {
          if (group.group) {
               combinedGroupfirst.push(group.group);
          }
     });


     const combinedGroups = filteredGo.reduce((acc, curr) => {
          const groupId = curr.Group.id;
          const existingGroup = acc.find(group => group.Group.id === groupId);

          if (existingGroup) {
               existingGroup.subjects = [...new Set([...existingGroup.subjects, ...curr.subjects])];
          } else {
               acc.push({ ...curr });
          }

          return acc;
     }, []);

     const combinedSubgroup = filteredGoSub.reduce((acc, curr) => {
          const subgroupId = curr.id;
          const existingSubGroup = acc.find(subgroup => subgroup.id === subgroupId);

          if (existingSubGroup) {
               existingSubGroup.subjects = [...new Set([...existingSubGroup.subjects, ...curr.subjects])];
          } else {
               acc.push({ ...curr });
          }

          return acc;
     }, []);


     //////////////////////////////////// เงื่อนไขกลุ่มวิชา  //////////////////////////////////////////////////////////////

     const subjectCodesByGroupFirst = combinedGroupfirst.map(group => {
          const subjectsWithGrades = group?.subjects
               .map(subject => {
                    const grade = groupDataGrade.length > 0 ? subject.grade : getEnrollmentGrade(subject.subject_code);
                    const credit = subject.credit;

                    // Check for invalid grades or low credits
                    if (grade === "ไม่มีเกรด" || grade === null || grade === undefined) {
                         return null;
                    }

                    const creditOnlyGrades = ["I", "P", "R", "S", "T", "U", "W"];
                    const gradeAndCreditGrades = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

                    let calculatedGrade = null;
                    let numericGrade = null;

                    if (credit <= 1 || credit === 6 && creditOnlyGrades.includes(grade)) {
                         // Only count credits, not grades
                         return {
                              subject_code: subject.subject_code,
                              grade: grade,  // Keep the original grade
                              credit: credit,
                              numericGrade: null // Do not calculate grade
                         };
                    } else if (gradeAndCreditGrades.includes(grade)) {
                         // Count both credits and grades
                         calculatedGrade = calGrade(grade);
                         numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                         return {
                              subject_code: subject.subject_code,
                              grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                              credit: credit,
                              numericGrade: numericGrade
                         };
                    }
               })
               .filter(subject => subject !== null);

          // Calculate total credits and grades
          const totalCredits = subjectsWithGrades.reduce((acc, subject) => acc + subject.credit, 0);
          const totalGrades = subjectsWithGrades.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
          const averageGrade = subjectsWithGrades.length ? (totalGrades / totalCredits) : 0;

          return {
               id: group.id,
               group_title: group.group_title,
               subjects: subjectsWithGrades,
               totalCredits: totalCredits,
               totalGrades: totalGrades,
               averageGrade: averageGrade
          };
     }).filter(group => group.subjects.length > 0);

     const subjectCodesByGroup = combinedGroups.map(group => {
          const subjectsWithGrades = group?.subjects
               .map(subject => {
                    const grade = groupDataGrade.length > 0 ? subject.grade : getEnrollmentGrade(subject.subject_code);
                    const credit = subject.credit;

                    // Check for invalid grades or low credits
                    if (grade === "ไม่มีเกรด" || grade === null || grade === undefined) {
                         return null;
                    }

                    const creditOnlyGrades = ["I", "P", "R", "S", "T", "U", "W"];
                    const gradeAndCreditGrades = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

                    let calculatedGrade = null;
                    let numericGrade = null;

                    if (credit <= 1 || credit === 6 && creditOnlyGrades.includes(grade)) {
                         // Only count credits, not grades
                         return {
                              subject_code: subject.subject_code,
                              grade: grade,  // Keep the original grade
                              credit: credit,
                              numericGrade: null // Do not calculate grade
                         };
                    } else if (gradeAndCreditGrades.includes(grade)) {
                         // Count both credits and grades
                         calculatedGrade = calGrade(grade);
                         numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                         return {
                              subject_code: subject.subject_code,
                              grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                              credit: credit,
                              numericGrade: numericGrade
                         };
                    }
               })
               .filter(subject => subject !== null);

          // Calculate total credits and grades
          const totalCredits = subjectsWithGrades.reduce((acc, subject) => acc + subject?.credit, 0);
          const totalGrades = subjectsWithGrades.reduce((acc, subject) => acc + (subject?.numericGrade || 0), 0);
          const averageGrade = subjectsWithGrades.length ? (totalGrades / totalCredits) : 0;

          return {
               id: group.Group.id,
               group_title: group.Group.group_title,
               subjects: subjectsWithGrades,
               totalCredits: totalCredits,
               totalGrades: totalGrades,
               averageGrade: averageGrade
          };
     }).filter(group => group.subjects.length > 0);

     const combinedsubjectCodesByGroup = subjectCodesByGroupFirst.concat(subjectCodesByGroup);

     ///////////////////////////////////////////////////////////////////
     const subjectCodesBySubgroup = combinedSubgroup.map(subgroup => {
          const subjectsWithGrades = subgroup.subjects
               .map(subject => {
                    const grade = subgroupDataGrade.length > 0 ? subject.grade : getEnrollmentGrade(subject.subject_code);
                    const credit = subject.credit;

                    // Check for invalid grades or low credits
                    if (grade === "ไม่มีเกรด" || grade === null || grade === undefined) {
                         return null;
                    }

                    const creditOnlyGrades = ["I", "P", "R", "S", "T", "U", "W"];
                    const gradeAndCreditGrades = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

                    let calculatedGrade = null;
                    let numericGrade = null;

                    if (credit <= 1 || credit === 6 && creditOnlyGrades.includes(grade)) {
                         // Only count credits, not grades
                         return {
                              subject_code: subject.subject_code,
                              grade: grade,  // Keep the original grade
                              credit: credit,
                              numericGrade: null // Do not calculate grade
                         };
                    } else if (gradeAndCreditGrades.includes(grade)) {
                         // Count both credits and grades
                         calculatedGrade = calGrade(grade);
                         numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                         return {
                              subject_code: subject.subject_code,
                              grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                              credit: credit,
                              numericGrade: numericGrade
                         };
                    }
               })
               .filter(subject => subject !== null);

          // Calculate total credits and grades
          const totalCredits = subjectsWithGrades.reduce((acc, subject) => acc + subject.credit, 0);
          const totalGrades = subjectsWithGrades.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
          const averageGrade = subjectsWithGrades.length ? (totalGrades / totalCredits) : 0;

          return {
               id: subgroup.id,
               sub_group_title: subgroup.sub_group_title,
               subjects: subjectsWithGrades,
               totalCredits: totalCredits,
               totalGrades: totalGrades,
               averageGrade: averageGrade
          };
     }).filter(subgroup => subgroup.subjects.length > 0);

     ///////////////// เงื่อนไข Category ## เสรี /////////////////

     const subjectCategorytest = cateData.map(({ category, subjects }) => {
          // Ensure 'subjects' is an array before mapping over it
          const subjectsWithGrades = Array.isArray(subjects) ? subjects
               .map(subject => {
                    const grade = getEnrollmentGrade(subject.subject_code);
                    const credit = subject.credit;

                    // Check for invalid grades or low credits
                    if (grade === "ไม่มีเกรด" || grade === null || grade === undefined) {
                         return null;
                    }

                    const creditOnlyGrades = ["I", "P", "R", "S", "T", "U", "W"];
                    const gradeAndCreditGrades = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

                    let calculatedGrade = null;
                    let numericGrade = null;

                    if (credit <= 1 || credit === 6 && creditOnlyGrades.includes(grade)) {
                         // Only count credits, not grades
                         return {
                              subject_code: subject.subject_code,
                              grade: grade,  // Keep the original grade
                              credit: credit,
                              numericGrade: null // Do not calculate grade
                         };
                    } else if (gradeAndCreditGrades.includes(grade)) {
                         // Count both credits and grades
                         calculatedGrade = calGrade(grade);
                         numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                         return {
                              subject_code: subject.subject_code,
                              grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                              credit: credit,
                              numericGrade: numericGrade
                         };
                    }
               })
               .filter(subject => subject !== null)
               : []; // Return an empty array if 'subjects' is not an array

          const totalCredits = subjectsWithGrades.reduce((acc, subject) => acc + subject?.credit, 0);
          const totalGrades = subjectsWithGrades.reduce((acc, subject) => acc + (subject?.numericGrade || 0), 0);
          const averageGrade = subjectsWithGrades.length ? (totalGrades / totalCredits) : 0;

          return {
               id: category.id,
               category_title: category.category_title,
               subjects: subjectsWithGrades,
               totalCredits: totalCredits,
               totalGrades: totalGrades,
               averageGrade: averageGrade
          };
     }).filter(category => category.subjects.length > 0);

     const subjectCategoryHaveGrade = categoryverifyGrade.map(category => {
          // console.log(category);
          const subjectsWithGrades = category.subjectDetails
               .map(subject => {
                    const grade = subject.grade;
                    const credit = subject.Subject.credit;

                    // Check for invalid grades or low credits
                    if (grade === "ไม่มีเกรด" || grade === null || grade === undefined) {
                         return null;
                    }

                    const creditOnlyGrades = ["I", "P", "R", "S", "T", "U", "W"];
                    const gradeAndCreditGrades = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

                    let calculatedGrade = null;
                    let numericGrade = null;

                    if (credit <= 1 || credit === 6 && creditOnlyGrades.includes(grade)) {
                         // Only count credits, not grades
                         return {
                              subject_code: subject.Subject.subject_code,
                              grade: grade,  // Keep the original grade
                              credit: credit,
                              numericGrade: null // Do not calculate grade
                         };
                    } else if (gradeAndCreditGrades.includes(grade)) {
                         // Count both credits and grades
                         calculatedGrade = calGrade(grade);
                         numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                         return {
                              subject_code: subject.Subject.subject_code,
                              grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                              credit: credit,
                              numericGrade: numericGrade
                         };
                    }
               })
               .filter(subject => subject !== null);

          // Calculate total credits and grades
          const totalCredits = subjectsWithGrades.reduce((acc, subject) => acc + subject.credit, 0);
          const totalGrades = subjectsWithGrades.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
          const averageGrade = subjectsWithGrades.length ? (totalGrades / totalCredits) : 0;

          return {
               id: category.category.id,
               category_title: category.category.category_title,
               subjects: subjectsWithGrades,
               totalCredits: totalCredits,
               totalGrades: totalGrades,
               averageGrade: averageGrade
          };
     }).filter(category => category.subjects.length > 0);

     const subjectCategory = studentcategory.map(category => {
          const subjectsWithGrades = category.verifySubj
               .map(subject => {
                    const grade = getEnrollmentGrade(subject.subject_code);
                    const credit = subject.credit;

                    // Check for invalid grades or low credits
                    if (grade === "ไม่มีเกรด" || grade === null || grade === undefined) {
                         return null;
                    }

                    const creditOnlyGrades = ["I", "P", "R", "S", "T", "U", "W"];
                    const gradeAndCreditGrades = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

                    let calculatedGrade = null;
                    let numericGrade = null;

                    if (credit <= 1 || credit === 6 && creditOnlyGrades.includes(grade)) {
                         // Only count credits, not grades
                         return {
                              subject_code: subject.subject_code,
                              grade: grade,  // Keep the original grade
                              credit: credit,
                              numericGrade: null // Do not calculate grade
                         };
                    } else if (gradeAndCreditGrades.includes(grade)) {
                         // Count both credits and grades
                         calculatedGrade = calGrade(grade);
                         numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                         return {
                              subject_code: subject.subject_code,
                              grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                              credit: credit,
                              numericGrade: numericGrade
                         };
                    }
               })
               .filter(subject => subject !== null);

          // Calculate total credits and grades
          const totalCredits = subjectsWithGrades.reduce((acc, subject) => acc + subject.credit, 0);
          const totalGrades = subjectsWithGrades.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
          const averageGrade = subjectsWithGrades.length ? (totalGrades / totalCredits) : 0;

          return {
               id: category.category_id,
               category_title: category.category_title,
               subjects: subjectsWithGrades,
               totalCredits: totalCredits,
               totalGrades: totalGrades,
               averageGrade: averageGrade
          };
     }).filter(category => category.subjects.length > 0);

     const combinedSubjectCategories = (status?.status !== 0 & categoryverifyGrade.length > 0) ? subjectCategorytest.concat(subjectCategoryHaveGrade) : subjectCategorytest.concat(subjectCategory);

     ////////////////// รวมค่าคะแนนหมวดหมู่วิชา///////////////////////


     const [sumCate, setSumCate] = useState([]);

     useEffect(() => {
          const sum = []; // Initialize a new array to collect the results

          cateData.forEach((ceta) => {
               const categoryDatas = combinedSubjectCategories.find(category => category.id === ceta.category.id) || {};
               const { totalCredits = 0, totalGrades = 0 } = categoryDatas;
               sum.push({ totalCredits, totalGrades });
          });

          if (JSON.stringify(sum) !== JSON.stringify(sumCate)) {
               setSumCate(sum);
          }
     }, [cateData, combinedSubjectCategories, sumCate]);


     /////////////////////// เฉพาะ IT //////////////////////////

     const subData = (status?.status === 0 ? pickSubj : (itGrade.length ? itGrade : pickSubj)).map(subject => {
          // If using itGrade, access subject and credit accordingly
          const isItGrade = itGrade.length && status?.status !== 0;
          const grade = isItGrade ? subject.grade : getEnrollmentGrade(subject.subject_code);
          const credit = isItGrade ? subject.Subject.credit : subject.credit;

          return {
               subject_id: isItGrade ? subject.Subject.subject_id : subject.subject_id,
               subject_code: isItGrade ? subject.Subject.subject_code : subject.subject_code,
               grade,
               credit
          };
     });

     const getCalculatedValues = (subjectTrack, requiredCredits) => {
          // Use subjectTrackGrade if available, otherwise use subjectTrack
          const dataToUse = subjectTrackGrade.length ? subjectTrackGrade : subjectTrack;

          // Combine dataToUse with subData
          const combinedData = [...dataToUse, ...subData];

          const subtrack = combinedData.map(prev => {
               // Use prev.grade directly if using subjectTrackGrade
               const grade = subjectTrackGrade.length ? prev.grade : getEnrollmentGrade(prev.subject_code);
               const credit = prev.credit;

               if (grade === "ไม่มีเกรด" || grade === null || grade === undefined) {
                    return null;
               }

               const creditOnlyGrades = ["I", "P", "R", "S", "T", "U", "W"];
               const gradeAndCreditGrades = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];

               let calculatedGrade = null;
               let numericGrade = null;

               if (credit <= 1 || credit === 6 && creditOnlyGrades.includes(grade)) {
                    // Only count credits, not grades
                    return {
                         subject_code: prev.subject_code,
                         grade: grade,  // Keep the original grade
                         credit: credit,
                         numericGrade: null // Do not calculate grade
                    };
               } else if (gradeAndCreditGrades.includes(grade)) {
                    // Count both credits and grades
                    calculatedGrade = calGrade(grade);
                    numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                    return {
                         subject_code: prev.subject_code,
                         grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                         credit: credit,
                         numericGrade: numericGrade
                    };
               }

          }).filter(item => item !== null);

          // Calculate total credits, total grades, and average grade
          const totalCredits = subtrack.reduce((acc, subject) => acc + subject.credit, 0);
          const totalGrades = subtrack.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
          const averageGrade = totalCredits ? (totalGrades / totalCredits) : 0;

          // Calculate missing credits based on the required credits (e.g. 21)
          const missingCredits = Math.max(0, requiredCredits - totalCredits);

          return { totalCredits, totalGrades, averageGrade, missingCredits };
     };

     /////////////////////////////////////// รวมค่าคะแนน /////////////////////////////////////////////

     const [sumCredits, setSumCredits] = useState(0);
     const [sumGrades, setSumGrades] = useState(0);

     const totalCreditsRef = useRef(0);
     const totalGradesRef = useRef(0);

     useEffect(() => {
          // Reset the refs on every data change
          totalCreditsRef.current = 0;
          totalGradesRef.current = 0;

          // Calculate for conditionCategory
          conditionCategory.forEach((condition) => {
               const categoryDatas = combinedSubjectCategories.find(category => category.id === condition.Categorie.id) || {};
               const { totalCredits = 0, totalGrades = 0 } = categoryDatas;
               totalCreditsRef.current += totalCredits;
               totalGradesRef.current += totalGrades;
          });

          // Calculate for conditions
          conditions.forEach((condition) => {
               const groupDatas = combinedsubjectCodesByGroup.find(group => group.id === condition.Group.id) || {};
               const { totalCredits = 0, totalGrades = 0 } = groupDatas;
               totalCreditsRef.current += totalCredits;
               totalGradesRef.current += totalGrades;
          });

          // Calculate for conditionSubgroup
          conditionSubgroup.forEach((condition) => {
               const subgroupDatas = subjectCodesBySubgroup.find(subgroup => subgroup.id === condition.SubGroup.id) || {};
               const { totalCredits = 0, totalGrades = 0 } = subgroupDatas;
               totalCreditsRef.current += totalCredits;
               totalGradesRef.current += totalGrades;
          });

          // Calculate for IT program if applicable
          if (userData.program === "IT") {
               const { totalCredits, totalGrades } = getCalculatedValues(subjectTrackGrade.length ? subjectTrackGrade : subjectTrack);
               totalCreditsRef.current += totalCredits;
               totalGradesRef.current += totalGrades;
          }

          // Set the state with the accumulated values from the refs
          setSumCredits(totalCreditsRef.current);
          setSumGrades(totalGradesRef.current);

     }, [conditionCategory, combinedSubjectCategories, conditions, combinedsubjectCodesByGroup, conditionSubgroup, subjectCodesBySubgroup, userData.program, subjectTrack, subjectTrackGrade, subData]);


     //////////////////////////////////////////////ตัวหนังสือ แดงๆ///////////////////////////////////////////////////////////

     useEffect(() => {
          const categoriesWithInsufficientCredits = [];

          conditionCategory.forEach((conditionCategory) => {
               const categoryDatas = combinedSubjectCategories.find(category => category.id === conditionCategory.Categorie.id) || {};
               const { totalCredits = 0 } = categoryDatas;

               // Check if totalCredits is less than the required credits
               if (totalCredits < conditionCategory.credit) {
                    const missingCredits = conditionCategory.credit - totalCredits;
                    categoriesWithInsufficientCredits.push({
                         title: conditionCategory?.Categorie?.category_title,
                         missingCredits,
                    });
               }
          });

          const areArraysEqual = (arr1, arr2) =>
               arr1.length === arr2.length && arr1.every((val, index) => val.title === arr2[index].title);

          if (!areArraysEqual(categoriesWithInsufficientCredits, insufficientCreditCategories)) {
               setInsufficientCreditCategories(categoriesWithInsufficientCredits); // Only update if different
          }

     }, [conditionCategory, combinedSubjectCategories]);

     useEffect(() => {
          const groupsWithInsufficientCredits = [];

          conditions.forEach((condition) => {
               const groupDatas = combinedsubjectCodesByGroup.find(group => group.id === condition.Group.id) || {};
               const { totalCredits = 0 } = groupDatas;

               // Check if totalCredits is less than the required credits
               if (totalCredits < condition.credit) {
                    const missingCredits = condition.credit - totalCredits;
                    groupsWithInsufficientCredits.push({
                         title: condition?.Group?.group_title,
                         missingCredits,
                    });
               }
          });

          const areArraysEqual = (arr1, arr2) =>
               arr1.length === arr2.length && arr1.every((val, index) => val.title === arr2[index].title);

          if (!areArraysEqual(groupsWithInsufficientCredits, insufficientCreditGroups)) {
               setInsufficientCreditGroups(groupsWithInsufficientCredits); // Only update if different
          }

     }, [conditions, combinedsubjectCodesByGroup]);

     useEffect(() => {
          const subgroupsWithInsufficientCredits = [];

          conditionSubgroup.forEach((conditionSubgroup) => {
               const subgroupDatas = subjectCodesBySubgroup.find(subgroup => subgroup.id === conditionSubgroup.SubGroup.id) || {};
               const { totalCredits = 0 } = subgroupDatas;

               // Check if totalCredits is less than the required credits
               if (totalCredits < conditionSubgroup.credit) {
                    const missingCredits = conditionSubgroup.credit - totalCredits;
                    subgroupsWithInsufficientCredits.push({
                         title: conditionSubgroup?.SubGroup?.sub_group_title,
                         missingCredits,
                    });
               }
          });

          const areArraysEqual = (arr1, arr2) =>
               arr1.length === arr2.length && arr1.every((val, index) => val.title === arr2[index].title);

          if (!areArraysEqual(subgroupsWithInsufficientCredits, insufficientCreditSubGroups)) {
               setInsufficientCreditSubGroups(subgroupsWithInsufficientCredits); // Only update if different
          }
     }, [conditionSubgroup, subjectCodesBySubgroup]);

     useEffect(() => {
          // Call getCalculatedValues with the required credits for IT (e.g. 21)
          const { missingCredits } = getCalculatedValues(subjectTrackGrade.length ? subjectTrackGrade : subjectTrack, 21);

          // If there are missing credits, update the state using setInsufficientCreditIT
          if (missingCredits > 0) {
               setInsufficientCreditIT(missingCredits);
          } else {
               setInsufficientCreditIT(0); // Reset or clear if no credits are missing
          }
     }, [subjectTrackGrade, subjectTrack, subData, setInsufficientCreditIT]);


     // console.log(insufficientCreditCategories);
     // console.log(insufficientCreditGroups);
     // console.log(insufficientCreditSubGroups);
     // console.log(insufficientCreditIT);


     /////////////////////////////////////////////////////////////////////////////////////////////////////////
     //เงื่อนไข FIX 21

     useEffect(() => setFilterSubj(subjectTrack), [subjectTrack])

     useEffect(() => {
          if (searchSubj) {
               const data = subjectTrack.filter(e => {
                    if (e.subject_code?.toLowerCase()?.includes(searchSubj.toLowerCase()) ||
                         e.title_en?.toLowerCase()?.includes(searchSubj.toLowerCase()) ||
                         e.title_th?.toLowerCase()?.includes(searchSubj.toLowerCase())) {
                         return e
                    }
               })
               setFilterSubj(data)
               return
          }
          setFilterSubj(subjectTrack)
     }, [searchSubj])

     const addSubj = useCallback(function (subj) {
          setVerifySubj((prevState) => {
               const data = [...prevState];
               let status = false
               for (const e of data) {
                    if (e[subj.subject_code] === subj.subject_code) {
                         status = true
                         break
                    }
               }
               if (!status) {
                    let result = {
                         subject_id: subj.subject_id,
                         subject_code: subj.subject_code,
                         title_th: subj.title_th,
                         title_en: subj.title_en,
                         credit: subj.credit
                    }
                    data.push(result)
               }
               return data
          })
     }, [])

     const delSubj = useCallback(function (subject_code) {
          const data = pickSubj.filter(element => element.subject_code !== subject_code)
          setVerifySubj(data)
     }, [pickSubj])

     /////////////////////////////////////////////////

     const [insertData, setInsertData] = useState([]);
     const [insideTrack, setInsideTrack] = useState([]);
     const [outsideTrack, setOutsideTrack] = useState([]);
     const [insideTrackStats, setInsideTrackStats] = useState({ totalCredits: 0, totalScores: 0, averageScore: 0 });
     const [outsideTrackStats, setOutsideTrackStats] = useState({ totalCredits: 0, totalScores: 0, averageScore: 0 });

     // console.log(insideTrack);
     // console.log(outsideTrack);


     useEffect(() => {
          const newInsertData = Object.keys(groupedSubjectsByCategory).reduce((acc, categoryId) => {
               const categoryData = groupedSubjectsByCategory[categoryId];

               const processSubjects = (subjects) => {
                    return subjects.map(subject => ({
                         subject,
                         grade: getEnrollmentGrade(subject.subject_code),
                         track: subject?.Track?.track || null,
                         credit: subject.credit // Ensure you are pulling credit from the subject
                    }));
               };

               // Process groups
               Object.keys(categoryData.groups).forEach(groupId => {
                    const group = categoryData.groups[groupId];
                    acc.push({ type: 'group', subjects: processSubjects(group.subjects) });
               });

               // Process subgroups
               Object.keys(categoryData.subgroups).forEach(subgroupId => {
                    const subgroup = categoryData.subgroups[subgroupId];
                    acc.push({ type: 'subgroup', subjects: processSubjects(subgroup.subjects) });
               });

               // Process semisubgroups
               Object.keys(categoryData.semisubgroups).forEach(semisubgroupId => {
                    const semisubgroup = categoryData.semisubgroups[semisubgroupId];
                    acc.push({ type: 'semisubgroup', subjects: processSubjects(semisubgroup.subjects) });
               });

               return acc;
          }, []);

          setInsertData(newInsertData);

          const insideTrackData = [];
          const outsideTrackData = [];
          const validSubjects = [];


          newInsertData.forEach(data => {
               data?.subjects.forEach(subjectData => {
                    if (subjectData.track && subjectData.grade && subjectData.grade !== 'ไม่มีเกรด') {
                         const calculatedGrade = calGrade(subjectData.grade);

                         // Check if calculatedGrade is a number before multiplication
                         const gradeValue = isNumber(calculatedGrade) ? calculatedGrade * subjectData.credit : 0;

                         const subjectEntry = {
                              subject: subjectData.subject,
                              grade: gradeValue, // Store numeric value instead of string
                              track: subjectData.track,
                              gradeTrue: subjectData.grade,
                              credit: Number(subjectData.credit) || 0 // Ensure credit is a number
                         };

                         validSubjects.push(subjectEntry);
                    }
               });
          });

          validSubjects.sort((a, b) => b.grade - a.grade);

          validSubjects.forEach((subjectEntry) => {
               if (userData?.Selection?.Track?.track === subjectEntry.track) {
                    if (insideTrackData.length < 4) {
                         insideTrackData.push(subjectEntry);
                    } else {
                         outsideTrackData.push(subjectEntry);
                    }
               } else {
                    outsideTrackData.push(subjectEntry);
               }
          });

          // Set the state with the filtered data
          setInsideTrack(insideTrackData);
          setOutsideTrack(outsideTrackData);

          // Calculate stats for insideTrack
          const insideTotalCredits = insideTrackData.reduce((sum, subject) => sum + subject.credit, 0);
          const insideTotalScores = insideTrackData.reduce((sum, subject) => sum + subject.grade, 0);
          const insideAverageScore = insideTotalCredits ? insideTotalScores / insideTotalCredits : 0;

          setInsideTrackStats({
               totalCredits: insideTotalCredits,
               totalScores: insideTotalScores,
               averageScore: insideAverageScore,
          });

          // Calculate stats for outsideTrack
          const outsideTotalCredits = outsideTrackData.reduce((sum, subject) => sum + subject.credit, 0);
          const outsideTotalScores = outsideTrackData.reduce((sum, subject) => sum + subject.grade, 0);
          const outsideAverageScore = outsideTotalCredits ? outsideTotalScores / outsideTotalCredits : 0;

          setOutsideTrackStats({
               totalCredits: outsideTotalCredits,
               totalScores: outsideTotalScores,
               averageScore: outsideAverageScore,
          });


     }, [groupedSubjectsByCategory, enrollments, userData]);

     // console.log(insideTrack);
     // console.log(outsideTrack);
     // console.log(insideTrackStats);
     // console.log(outsideTrackStats);


     useEffect(() => {
          if (insertData.length === 0 || enrollments.length === 0) return;

          setInsertData((prev) =>
               prev.map((typeData) => {
                    const updatedSubjects = typeData.subjects.map((subject) => {
                         const enrollment = enrollments.find(e => e?.Subject?.subject_code === subject.subject_code);
                         const grade = enrollment ? enrollment.grade : "ไม่มีเกรด";
                         return { ...subject, grade };
                    });
                    return { ...typeData, subjects: updatedSubjects };
               })
          );
     }, [enrollments]);

     ///////////////////////// print to pdf ///////////////////////////////////////

     const divToPrintRef = useRef(null);
     const [isClient, setIsClient] = useState(false);

     useEffect(() => {
          setIsClient(true);
     }, []);

     const convertOklchToRgb = (oklchColor) => {
          const match = oklchColor.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
          if (!match) {
               console.error('Invalid OKLCH color format:', oklchColor);
               return 'rgb(0, 0, 0)'; // Return black as fallback
          }

          let [, l, c, h, alpha] = match;
          l = parseFloat(l) / 100; // Convert percentage to 0-1 range
          c = parseFloat(c);
          h = parseFloat(h);
          alpha = alpha ? parseFloat(alpha) : 1;

          // Simple conversion from OKLCH to sRGB
          // Note: This is a rough approximation and may not be accurate for all colors
          const hueRadians = h * (Math.PI / 180);
          const a = c * Math.cos(hueRadians);
          const bs = c * Math.sin(hueRadians);

          // Convert to XYZ
          const x = 0.99999999845051981432 * l + 0.39633779217376785678 * a + 0.21580375806075880339 * bs;
          const y = 1.0000000088817607767 * l - 0.1055613423236563494 * a - 0.063854174771705903402 * bs;
          const z = 1.0000000546724109177 * l - 0.089484182094965759684 * a - 1.2914855378640917399 * bs;

          // Convert XYZ to sRGB
          const r = Math.max(0, Math.min(1, 3.2406 * x - 1.5372 * y - 0.4986 * z));
          const g = Math.max(0, Math.min(1, -0.9689 * x + 1.8758 * y + 0.0415 * z));
          const b = Math.max(0, Math.min(1, 0.0557 * x - 0.2040 * y + 1.0570 * z));

          // Apply gamma correction
          const gammaCorrect = (color) => {
               return color <= 0.0031308 ? 12.92 * color : 1.055 * Math.pow(color, 1 / 2.4) - 0.055;
          };

          const rGamma = Math.round(gammaCorrect(r) * 255);
          const gGamma = Math.round(gammaCorrect(g) * 255);
          const bGamma = Math.round(gammaCorrect(b) * 255);

          return `rgb(${rGamma}, ${gGamma}, ${bGamma})`;
     };

     const preprocessStyles = (element) => {
          const styles = window.getComputedStyle(element);
          const oklchProperties = ['color', 'backgroundColor'];

          oklchProperties.forEach(prop => {
               const value = styles[prop];
               if (value.includes('oklch')) {
                    element.style[prop] = convertOklchToRgb(value);
               }
          });

          Array.from(element.children).forEach(child => preprocessStyles(child));
     };

     const printDocument = () => {
          if (!isClient) return;

          const input = divToPrintRef.current;
          if (!input) return;

          // Clone the element to avoid modifying the original
          const clonedInput = input.cloneNode(true);
          document.body.appendChild(clonedInput);

          // Preprocess styles
          preprocessStyles(clonedInput);

          // Adjust the scale for lower resolution
          const lowResolutionScale = 1.2; // Adjust this value (e.g., 0.5 for half resolution)

          html2canvas(clonedInput, { scale: lowResolutionScale }) // Use lower scale for lower quality
               .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', putOnlyUsedFonts: true, floatPrecision: 16 });

                    // A4 size in mm
                    const a4Width = 210; // A4 width
                    const a4Height = 297; // A4 height

                    // Calculate scaling to fit A4
                    const canvasWidth = canvas.width;  // in pixels
                    const canvasHeight = canvas.height; // in pixels

                    // Convert pixel dimensions to mm
                    const canvasWidthInMM = canvasWidth * 0.264583; // 1px = 0.264583mm
                    const canvasHeightInMM = canvasHeight * 0.264583;

                    // Calculate scale factor to fit A4
                    const scale = Math.min(a4Width / canvasWidthInMM, a4Height / canvasHeightInMM);

                    const imgWidth = canvasWidthInMM * scale; // Width in mm
                    const imgHeight = canvasHeightInMM * scale; // Height in mm

                    // Calculate offsets to center the image
                    const xOffset = (a4Width - imgWidth) / 2;
                    const yOffset = (a4Height - imgHeight) / 2;

                    // Add the image to the PDF
                    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
                    pdf.save(`แบบฟอร์มตรวจสอบจบ${userData?.stu_id}.pdf`);

                    // Remove the cloned element
                    document.body.removeChild(clonedInput);
               })
               .catch((error) => console.error('Error generating PDF:', error));
     };

     ///////////////////////// print to pdf ///////////////////////////////////////



     if (!stdID) {
          return (
               <div>
                    ไม่สามารถเข้าถึงข้อมูลของคุณได้ กรุณาติดต่อ <TMonlicaEmail />
               </div>
          )
     }

     const getSubTrack = (subgroup, subgroupIndex) => {
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
                                             <TableColumn>เกรด</TableColumn>
                                             <TableColumn>ค่าคะแนน</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                             {SemiSubjects[semi].map((subject, subjectIndex) => (
                                                  <TableRow key={subjectIndex}>
                                                       {/* <TableCell className=''>{subject.subject_id}</TableCell> */}
                                                       <TableCell className=''>{subject.subject_code}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                       <TableCell>{subject.credit}</TableCell>
                                                       <TableCell>{getEnrollmentGrade(subject.subject_code)}</TableCell>
                                                       <TableCell>
                                                            {(() => {
                                                                 const grade = calGrade(getEnrollmentGrade(subject.subject_code));
                                                                 const credit = subject.credit;
                                                                 if (grade == null) {
                                                                      return "-";
                                                                 } else if (isNumber(grade)) {
                                                                      return String(grade * credit);
                                                                 } else {
                                                                      return grade;
                                                                 }
                                                            })()}
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
               return (
                    <div key={subgroupIndex}>
                         <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                              <h3 className='text-md text-default-800 px-10'><li>{subgroup?.sub_group_title}</li></h3>
                         </div>
                         {trackSubjects && Object.keys(trackSubjects).map((track, trackIndex) => (
                              <div key={trackIndex}>
                                   <div
                                        className={`border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center 
        ${userData?.Selection?.Track?.title_th === track ? 'bg-blue-100' : 'bg-gray-50'}`}>
                                        <h3 className='text-md text-default-800 px-16'>
                                             <li>กลุ่มย่อยที่ {trackIndex + 1} {track}</li>
                                        </h3>
                                        {userData?.Selection?.Track?.title_th === track && (
                                             <span className="text-blue-600 font-bold">แทร็กของคุณ</span>
                                        )}
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
                                             <TableColumn>เกรด</TableColumn>
                                             <TableColumn>ค่าคะแนน</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                             {trackSubjects[track].map((subject, subjectIndex) => (
                                                  <TableRow key={subjectIndex}>
                                                       <TableCell className=''>{subject.subject_code}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                       <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                       <TableCell>{subject.credit}</TableCell>
                                                       <TableCell>{getEnrollmentGrade(subject.subject_code)}</TableCell>
                                                       <TableCell>
                                                            {(() => {
                                                                 const grade = calGrade(getEnrollmentGrade(subject.subject_code));
                                                                 const credit = subject.credit;
                                                                 if (grade == null) {
                                                                      return "-";
                                                                 } else if (isNumber(grade)) {
                                                                      return String(grade * credit);
                                                                 } else {
                                                                      return grade;
                                                                 }
                                                            })()}
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
                                   <TableColumn>เกรด</TableColumn>
                                   <TableColumn>ค่าคะแนน</TableColumn>
                              </TableHeader>
                              <TableBody>
                                   {subgroup.subjects && subgroup.subjects.map((subject, subjectIndex) => (
                                        <TableRow key={subjectIndex}>
                                             <TableCell className=''>{subject.subject_code}</TableCell>
                                             <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                             <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                             <TableCell>{subject.credit}</TableCell>
                                             <TableCell>{getEnrollmentGrade(subject.subject_code)}</TableCell>
                                             <TableCell>
                                                  {(() => {
                                                       const grade = calGrade(getEnrollmentGrade(subject.subject_code));
                                                       const credit = subject.credit;
                                                       if (grade == null) {
                                                            return "-";
                                                       } else if (isNumber(grade)) {
                                                            return String(grade * credit);
                                                       } else {
                                                            return grade;
                                                       }
                                                  })()}
                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </div>
               )
          }
     }

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

          Object.values(semisubgroups).forEach((semisubgroup) => {
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
                              <div key={groupTitle}>
                                   <div>
                                        <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center'>
                                             <h3 className='text-lg text-default-800 px-4'>
                                                  <li>{groupTitle}</li>
                                             </h3>
                                        </div>
                                        {subgroupsWithSameGroupTitle.map((subgroup, subgroupIndex) => (
                                             getSubTrack(subgroup, subgroupIndex)
                                        ))}
                                   </div>
                              </div>
                         );
                    })}
               </>
          );
     }

     return (
          <>
               <BreadCrumb />
               {contextHolder}
               {loading ?
                    <div className='w-full flex justify-center h-[70vh]'>
                         <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    !(verifySelect?.id) ?
                         <>
                              <p className='text-center font-bold text-lg my-28'>
                                   เร็วๆ นี้!
                              </p>
                         </>
                         :
                         <>
                              <div className={`${status?.status === 3 ? 'block' : 'hidden max-xl:block'}`}>
                                   <FloatButton.Group
                                        trigger="click"
                                        type="primary"
                                        style={{
                                             insetInlineEnd: 24,
                                        }}
                                   >
                                        {(status?.status === 0 || status?.status === 1 || status?.status === 2 || status?.status === 3) && (
                                             <FloatButton
                                                  onClick={showDrawer}
                                                  icon={<TbMessage2Exclamation />}
                                                  tooltip={<div>สถานะการอนุมัติ</div>}
                                                  className='hidden max-xl:block'
                                             />
                                        )}

                                        {(status?.status === 3) && (
                                             <FloatButton
                                                  icon={<BsFiletypePdf />}
                                                  onClick={printDocument}
                                                  tooltip={<div>Print to PDF</div>}
                                             />
                                        )}
                                   </FloatButton.Group>
                              </div>

                              <div className={`${status?.status === 0 || status?.status === 1 || status?.status === 2 || status?.status === 3 ? 'flex relative' : ''}`}>
                                   <div id="divToPrint" ref={divToPrintRef} className={`my-[30px] ${status?.status === 0 || status?.status === 1 || status?.status === 2 || status?.status === 3 ? 'w-[80%] 2xl:px-30 xl:pr-20' : 'w-[100%] 2xl:px-44 xl:px-20'} mt-8 max-xl:w-[100%] relative`}>
                                        <div className=' text-xl text-black mb-5 px-5'>
                                             <h1 className='text-3xl text-center leading-relaxed'>แบบฟอร์มตรวจสอบการสำเร็จการศึกษา <br /> หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{program.title_th} <br />(ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                             <div className='text-center mt-6'>
                                                  <p>ชื่อ-สกุล <TextUnderline>{`${userData.first_name} ${userData.last_name}`}</TextUnderline> รหัสประจำตัว <TextUnderline>{userData.stu_id}</TextUnderline></p>
                                                  <div className='flex justify-center items-center my-2'>
                                                       <p>คาดว่าจะได้รับปริญญาวิทยาศาสตรบัณฑิต สาขาวิชา <TextUnderline>{program.title_th}</TextUnderline> เกียรตินิยมอันดับ <TextUnderline>{cumlaude}</TextUnderline> </p>
                                                  </div>
                                                  <div className='flex flex-wrap justify-center items-center'>
                                                       <p>ภาคการศึกษา</p>
                                                       <RadioGroup
                                                            value={term}
                                                            onChange={handleChange}
                                                            orientation="horizontal"
                                                            isDisabled={true}
                                                       >
                                                            <Radio value="ต้น" className='ml-2'>ต้น</Radio>
                                                            <Radio value="ปลาย" className='ml-2' >ปลาย</Radio>
                                                            <Radio value="ฤดูร้อน" className='mx-2' >ฤดูร้อน</Radio>
                                                       </RadioGroup>
                                                       <p>ปีการศึกษา <TextUnderline>{verifyHaveGrade?.acadyear ? verifyHaveGrade.acadyear : userData.acadyear + 4}</TextUnderline></p>
                                                  </div>
                                             </div>
                                        </div>
                                        {Object.keys(groupedSubjectsByCategory).map((categoryId, index) => {
                                             const { category, groups, subgroups, semisubgroups } = groupedSubjectsByCategory[categoryId];
                                             if (index > highestIndex) {
                                                  setHighestIndex(index);
                                             }
                                             const { totalCredits, totalGrades } = sumCate[index] || { totalCredits: 0, totalGrades: 0 };

                                             return (
                                                  <div key={index} className='mb-5'>
                                                       <div>
                                                            <div className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-md'>
                                                                 <h2 className='text-lg text-default-800'>{index + 1}. {category?.category_title}</h2>
                                                            </div>
                                                            {Object.keys(groups).map((groupId, groupIndex) => {
                                                                 const group = groups[groupId];

                                                                 return (
                                                                      <div key={groupId}>
                                                                           <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center'>
                                                                                <h3 className='text-lg text-default-800 px-4'>
                                                                                     <li>{group?.group_title}</li>
                                                                                </h3>
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
                                                                                     <TableColumn>เกรด</TableColumn>
                                                                                     <TableColumn>ค่าคะแนน</TableColumn>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                     {group.subjects && group.subjects.map((subject, subjectIndex) => (
                                                                                          <TableRow key={subject.subject_code}>
                                                                                               <TableCell>{subject.subject_code}</TableCell>
                                                                                               <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                                                               <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                                                               <TableCell>{subject.credit}</TableCell>
                                                                                               <TableCell>{getEnrollmentGrade(subject.subject_code)}</TableCell>
                                                                                               <TableCell>
                                                                                                    {(() => {
                                                                                                         const grade = calGrade(getEnrollmentGrade(subject.subject_code));
                                                                                                         const credit = subject.credit;
                                                                                                         if (grade == null) {
                                                                                                              return "-";
                                                                                                         } else if (isNumber(grade)) {
                                                                                                              return String(grade * credit);
                                                                                                         } else {
                                                                                                              return grade;
                                                                                                         }
                                                                                                    })()}
                                                                                               </TableCell>
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
                                                       <Table aria-label="Sum"
                                                            classNames={tableClass}
                                                            removeWrapper
                                                            color="primary"
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>#</TableColumn>
                                                                 <TableColumn></TableColumn>
                                                                 <TableColumn></TableColumn>
                                                                 <TableColumn>หน่วยกิต</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                                 <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                            </TableHeader>
                                                            <TableBody>
                                                                 <TableRow>
                                                                      <TableCell className='font-bold'>รวมคะแนน{category?.category_title}</TableCell>
                                                                      <TableCell className="w-1/3"></TableCell>
                                                                      <TableCell></TableCell>
                                                                      <TableCell>{totalCredits}</TableCell>
                                                                      <TableCell>{totalGrades}</TableCell>
                                                                      <TableCell>{totalCredits > 0 ? (totalGrades / totalCredits).toFixed(2) : 'N/A'}</TableCell>
                                                                 </TableRow>
                                                            </TableBody>
                                                       </Table>
                                                  </div>
                                             );
                                        })}

                                        {categoryverifyGrade && categoryverifyGrade.length > 0 && (
                                             // Case 3: default case when status is not 0 but categoryverifyGrade is available
                                             categoryverifyGrade.map((categorie, catIndex) => (
                                                  <CategoryGrade
                                                       key={catIndex}
                                                       catIndex={catIndex}
                                                       categorie={categorie}
                                                       highestIndex={highestIndex}
                                                  />
                                             ))
                                        )}

                                        {Object.keys(groupedSubjectsByCategory).length === 0 && (
                                             <>
                                                  <p className='text-center mt-10'>ไม่มีวิชาภายในแบบฟอร์ม</p>
                                             </>
                                        )}

                                        {userData.program === "IT" && (
                                             <>
                                                  <div className='bg-orange-100 border-orange-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                       <h2 className='text-lg text-default-800'>เงื่อนไขในแทร็ก</h2>
                                                       <div>
                                                            <Tooltip showArrow={true}
                                                                 content={
                                                                      <div className="px-1 py-2">
                                                                           <div className="text-small font-bold">เก็บวิชาในแทร็กที่เกรดมากที่สุดไว้ 12 หน่วยกิต นอกเหนือจากนั้นจะถูกนำมาเป็นวิชานอกแทร็ก</div>
                                                                      </div>
                                                                 }
                                                                 size='lg'
                                                            >
                                                                 <div>
                                                                      <AiOutlineInfoCircle />
                                                                 </div>
                                                            </Tooltip>
                                                       </div>
                                                  </div>
                                                  <div className='p-4 border overflow-x-auto border-t-orange-100 rounded-br-lg rounded-bl-lg'>
                                                       <Table
                                                            aria-label="วิชาในเงื่อนไข"
                                                            removeWrapper
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>รหัสวิชา</TableColumn>
                                                                 <TableColumn>ชื่อวิชา EN</TableColumn>
                                                                 <TableColumn>ชื่อวิชา TH</TableColumn>
                                                                 <TableColumn>หน่วยกิต</TableColumn>
                                                                 <TableColumn>เกรด</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                            </TableHeader>

                                                            <TableBody>
                                                                 {insideTrack.map((subject, index) => (
                                                                      <TableRow key={index}>
                                                                           <TableCell>{subject?.subject?.subject_code}</TableCell>
                                                                           <TableCell>{subject?.subject?.title_en}</TableCell>
                                                                           <TableCell>{subject?.subject?.title_th}</TableCell>
                                                                           <TableCell>{subject?.subject?.credit}</TableCell>
                                                                           <TableCell>{subject?.gradeTrue}</TableCell>
                                                                           <TableCell>{subject?.grade}</TableCell>
                                                                      </TableRow>
                                                                 ))}
                                                            </TableBody>
                                                       </Table>
                                                       <Table
                                                            aria-label="รวมหน่วยกิตและค่าคะแนนของเงื่อนไข"
                                                            removeWrapper
                                                            className={"mt-4"}
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>#</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่กำหนดเป็นอย่างน้อย</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                                 <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                            </TableHeader>

                                                            <TableBody>
                                                                 {(() => {
                                                                      const creditClassName = insideTrackStats.totalCredits < 12 ? 'bg-red-200' : '';
                                                                      const creditClass = insideTrackStats.totalCredits < 12 ? '' : 'bg-green-200';

                                                                      return (
                                                                           <TableRow>
                                                                                <TableCell>รวม</TableCell>
                                                                                <TableCell>12</TableCell>
                                                                                <TableCell className={creditClassName}>{insideTrackStats.totalCredits}</TableCell>
                                                                                <TableCell>{insideTrackStats.totalScores}</TableCell>
                                                                                <TableCell className={creditClass}>{(insideTrackStats.averageScore || 0).toFixed(2)}</TableCell>
                                                                           </TableRow>
                                                                      );
                                                                 })()}
                                                            </TableBody>
                                                       </Table>
                                                  </div>

                                                  <div className='bg-orange-100 border-orange-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                       <h2 className='text-lg text-default-800'>เงื่อนไขนอกแทร็ก</h2>
                                                       <div>
                                                            <Tooltip showArrow={true}
                                                                 content={
                                                                      <div className="px-1 py-2">
                                                                           <div className="text-small font-bold">วิชานอกแทร็กอย่างน้อย 9 หน่วยกิต</div>
                                                                      </div>
                                                                 }
                                                                 size='lg'
                                                            >
                                                                 <div>
                                                                      <AiOutlineInfoCircle />
                                                                 </div>
                                                            </Tooltip>
                                                       </div>
                                                  </div>
                                                  <div className='p-4 border overflow-x-auto border-t-orange-100 rounded-br-lg rounded-bl-lg'>
                                                       <Table
                                                            aria-label="วิชานอกเงื่อนไข"
                                                            removeWrapper
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>รหัสวิชา</TableColumn>
                                                                 <TableColumn>ชื่อวิชา EN</TableColumn>
                                                                 <TableColumn>ชื่อวิชา TH</TableColumn>
                                                                 <TableColumn>หน่วยกิต</TableColumn>
                                                                 <TableColumn>เกรด</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                            </TableHeader>

                                                            <TableBody>
                                                                 {outsideTrack.map((subject, index) => (
                                                                      <TableRow key={index}>
                                                                           <TableCell>{subject?.subject?.subject_code}</TableCell>
                                                                           <TableCell>{subject?.subject?.title_en}</TableCell>
                                                                           <TableCell>{subject?.subject?.title_th}</TableCell>
                                                                           <TableCell>{subject?.subject?.credit}</TableCell>
                                                                           <TableCell>{subject?.gradeTrue}</TableCell>
                                                                           <TableCell>{subject?.grade}</TableCell>
                                                                      </TableRow>
                                                                 ))}
                                                            </TableBody>
                                                       </Table>

                                                       <Table
                                                            aria-label="รวมหน่วยกิตและค่าคะแนนของเงื่อนไข"
                                                            removeWrapper
                                                            className={"mt-4"}
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>#</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่กำหนดเป็นอย่างน้อย</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                                 <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                            </TableHeader>

                                                            <TableBody>
                                                                 {(() => {
                                                                      const creditClassName = outsideTrackStats.totalCredits < 9 ? 'bg-red-200' : '';
                                                                      const creditClass = outsideTrackStats.totalCredits < 9 ? 'bg-white' : 'bg-green-200';


                                                                      return (
                                                                           <TableRow>
                                                                                <TableCell>รวม</TableCell>
                                                                                <TableCell>9</TableCell>
                                                                                <TableCell className={creditClassName}>{outsideTrackStats.totalCredits}</TableCell>
                                                                                <TableCell>{outsideTrackStats.totalScores}</TableCell>
                                                                                <TableCell className={creditClass}>{(outsideTrackStats.averageScore || 0).toFixed(2)}</TableCell>
                                                                           </TableRow>
                                                                      );
                                                                 })()}
                                                            </TableBody>
                                                       </Table>
                                                  </div>
                                             </>
                                        )}

                                        {userData.program === "IT" && (
                                             <>
                                                  <div className='bg-blue-100 border-blue-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                       <h2 className='text-lg text-default-800'>เงื่อนไขเฉพาะหลักสูตร IT</h2>
                                                  </div>
                                                  <div className='overflow-x-auto p-4 border border-t-blue-100 rounded-br-lg rounded-bl-lg'>
                                                       <Table
                                                            aria-label="เงื่อนไขเฉพาะหลักสูตร IT"
                                                            removeWrapper
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>รายวิชาที่คณะกำหนด</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่กำหนดเป็นอย่างน้อย</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                                 <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                            </TableHeader>

                                                            <TableBody>
                                                                 {(() => {
                                                                      // Use subjectTrackGrade if available, otherwise use subjectTrack
                                                                      const { totalCredits, totalGrades, averageGrade, missingCredits } = getCalculatedValues(subjectTrackGrade.length ? subjectTrackGrade : subjectTrack);

                                                                      const creditClassName = totalCredits < 21 ? 'bg-red-200' : '';
                                                                      const creditClass = totalCredits < 21 ? '' : 'bg-green-200';


                                                                      return (
                                                                           <TableRow>
                                                                                <TableCell>กลุ่มเลือก 3 วิชา</TableCell>
                                                                                <TableCell>21</TableCell>
                                                                                <TableCell className={creditClassName}>{totalCredits}</TableCell>
                                                                                <TableCell>{totalGrades}</TableCell>
                                                                                <TableCell className={creditClass}>{averageGrade.toFixed(2)}</TableCell>
                                                                           </TableRow>
                                                                      );
                                                                 })()}
                                                            </TableBody>
                                                       </Table>
                                                  </div>
                                             </>
                                        )}

                                        {conditionCategory.length > 0 ? (
                                             <>
                                                  <div className='bg-blue-100 border-blue-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                       <h2 className='text-lg text-default-800'>เงื่อนไขหมวดหมู่วิชา</h2>
                                                  </div>
                                                  <div className='overflow-x-auto p-4 border border-t-blue-100 rounded-br-lg rounded-bl-lg'>
                                                       <Table
                                                            aria-label="เงื่อนไขหมวดหมู่วิชา"
                                                            removeWrapper
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>รายวิชาที่คณะกำหนด</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่กำหนดเป็นอย่างน้อย</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                                 <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                            </TableHeader>
                                                            {conditionCategory.length > 0 ? (
                                                                 <TableBody>
                                                                      {conditionCategory.map((conditionCategory, index) => {
                                                                           const categoryDatas = combinedSubjectCategories.find(category => category.id === conditionCategory.Categorie.id) || {};
                                                                           const { totalCredits = 0, totalGrades = 0, averageGrade = 0 } = categoryDatas;

                                                                           const creditClassName = totalCredits < conditionCategory.credit ? 'bg-red-200' : '';
                                                                           const creditClass = totalCredits < conditionCategory.credit ? '' : 'bg-green-200';

                                                                           return (
                                                                                <TableRow key={index}>
                                                                                     <TableCell >{conditionCategory?.Categorie?.category_title}</TableCell>
                                                                                     <TableCell>{conditionCategory.credit}</TableCell>
                                                                                     <TableCell className={creditClassName}>{totalCredits}</TableCell>
                                                                                     <TableCell>{totalGrades}</TableCell>
                                                                                     <TableCell className={creditClass}>{averageGrade.toFixed(2)}</TableCell>
                                                                                </TableRow>
                                                                           );
                                                                      })}
                                                                 </TableBody>
                                                            ) : (
                                                                 <TableBody emptyContent={"ไม่มีเงื่อนไขหมวดหมู่วิชา"}>{[]}</TableBody>
                                                            )}
                                                       </Table>
                                                  </div>
                                             </>
                                        ) : (
                                             <></>
                                        )}

                                        {conditions.length > 0 ? (
                                             <>
                                                  <div className='bg-blue-100 border-blue-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                       <h2 className='text-lg text-default-800'>เงื่อนไขกลุ่มวิชา</h2>
                                                  </div>
                                                  <div className='overflow-x-auto p-4 border border-t-blue-100 rounded-br-lg rounded-bl-lg'>
                                                       <Table
                                                            aria-label="เงื่อนไขกลุ่มวิชา"
                                                            removeWrapper
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>รายวิชาที่คณะกำหนด</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่กำหนดเป็นอย่างน้อย</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                                 <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                            </TableHeader>
                                                            {conditions.length > 0 ? (
                                                                 <TableBody>
                                                                      {conditions.map((condition, index) => {
                                                                           const groupData = combinedsubjectCodesByGroup.find(group => group.id === condition.Group.id) || {};
                                                                           const { totalCredits = 0, totalGrades = 0, averageGrade = 0 } = groupData;

                                                                           const creditClassName = totalCredits < condition.credit ? 'bg-red-200' : '';
                                                                           const creditClass = totalCredits < condition.credit ? '' : 'bg-green-200';

                                                                           return (
                                                                                <TableRow key={index}>
                                                                                     <TableCell>{condition?.Group?.group_title}</TableCell>
                                                                                     <TableCell>{condition.credit}</TableCell>
                                                                                     <TableCell className={creditClassName}>{totalCredits}</TableCell>
                                                                                     <TableCell>{totalGrades}</TableCell>
                                                                                     <TableCell className={creditClass}>{averageGrade.toFixed(2)}</TableCell>
                                                                                </TableRow>
                                                                           );

                                                                      })}
                                                                 </TableBody>
                                                            ) : (
                                                                 <TableBody emptyContent={"ไม่มีเงื่อนไขกลุ่มวิชา"}>{[]}</TableBody>
                                                            )}
                                                       </Table>
                                                  </div>
                                             </>
                                        ) : (
                                             <></>
                                        )}

                                        {conditionSubgroup.length > 0 ? (
                                             <>
                                                  <div className='bg-blue-100 border-blue-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                       <h2 className='text-lg text-default-800'>เงื่อนไขกลุ่มย่อยวิชา</h2>
                                                  </div>
                                                  <div className='p-4 overflow-x-auto border border-t-blue-100 rounded-br-lg rounded-bl-lg'>
                                                       <Table
                                                            aria-label="เงื่อนไขกลุ่มย่อยวิชา"
                                                            removeWrapper
                                                       >
                                                            <TableHeader>
                                                                 <TableColumn>รายวิชาที่คณะกำหนด</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่กำหนดเป็นอย่างน้อย</TableColumn>
                                                                 <TableColumn>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
                                                                 <TableColumn>ค่าคะแนน</TableColumn>
                                                                 <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                            </TableHeader>
                                                            {conditionSubgroup.length > 0 ? (
                                                                 <TableBody>
                                                                      {conditionSubgroup.map((condition, index) => {
                                                                           const subgroupData = subjectCodesBySubgroup.find(subgroup => subgroup.id === condition.SubGroup.id) || {};
                                                                           const { totalCredits = 0, totalGrades = 0, averageGrade = 0 } = subgroupData;

                                                                           const creditClassName = totalCredits < condition.credit ? 'bg-red-200' : '';
                                                                           const creditClass = totalCredits < condition.credit ? '' : 'bg-green-200';

                                                                           return (
                                                                                <TableRow key={index}>
                                                                                     <TableCell>{condition?.SubGroup?.sub_group_title}</TableCell>
                                                                                     <TableCell>{condition.credit}</TableCell>
                                                                                     <TableCell className={creditClassName}>{totalCredits}</TableCell>
                                                                                     <TableCell>{totalGrades}</TableCell>
                                                                                     <TableCell className={creditClass}>{averageGrade.toFixed(2)}</TableCell>
                                                                                </TableRow>
                                                                           );
                                                                      })}
                                                                 </TableBody>
                                                            ) : (
                                                                 <TableBody emptyContent={"ไม่มีเงื่อนไขกลุ่มย่อยวิชา"}>{[]}</TableBody>
                                                            )}
                                                       </Table>
                                                  </div>
                                             </>
                                        ) : (
                                             <></>
                                        )}


                                        <>
                                             {(conditionCategory?.length > 0 || conditionSubgroup?.length > 0 || conditions?.length > 0) ? (
                                                  <>
                                                       <div className='bg-blue-200 border-blue-200 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                            <h2 className='text-lg text-default-800'>รวมหน่วยกิตและค่าคะแนนทั้งหมด</h2>
                                                       </div>
                                                       <div className='p-4 border border-t-blue-100 rounded-br-lg rounded-bl-lg'>
                                                            <Table
                                                                 aria-label="รวมหน่วยกิตและค่าคะแนนของเงื่อนไข"
                                                                 removeWrapper
                                                            >
                                                                 <TableHeader>
                                                                      <TableColumn>#</TableColumn>
                                                                      <TableColumn>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
                                                                      <TableColumn>ค่าคะแนน</TableColumn>
                                                                      <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                                 </TableHeader>

                                                                 <TableBody>
                                                                      <TableRow>
                                                                           <TableCell>รวม</TableCell>
                                                                           <TableCell>{sumCredits}</TableCell>
                                                                           <TableCell>{sumGrades}</TableCell>
                                                                           <TableCell>
                                                                                {sumCredits > 0 ? (sumGrades / sumCredits).toFixed(2) : 'N/A'}
                                                                           </TableCell>
                                                                      </TableRow>
                                                                 </TableBody>
                                                            </Table>
                                                       </div>
                                                  </>
                                             ) : (
                                                  <></>
                                             )}
                                        </>

                                        {/* This element will be absolutely positioned and visible on screens `max-xl` */}
                                        <Drawer
                                             title="สถานะการอนุมัติ"
                                             onClose={onClose}
                                             open={open}
                                             extra={
                                                  <Space>
                                                       {status?.status === 0 && (
                                                            <div className='inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300'>
                                                                 <span className='w-3 h-3 inline-block bg-red-500 rounded-full mr-2'></span>
                                                                 ไม่อนุมัติ
                                                            </div>
                                                       )}
                                                       {(status?.status === 1 || status?.status === 2) && (
                                                            <div className='inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300'>
                                                                 <span className='w-3 h-3 inline-block bg-yellow-500 rounded-full mr-2'></span>
                                                                 รอการยืนยัน
                                                            </div>
                                                       )}
                                                       {status?.status === 3 && (
                                                            <div className='inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>
                                                                 <span className='w-3 h-3 inline-block bg-green-500 rounded-full mr-2'></span>
                                                                 อนุมัติ
                                                            </div>
                                                       )}
                                                  </Space>
                                             }
                                        >
                                             {statusVerify.length > 0 ? (
                                                  <>
                                                       <Accordion selectionMode="multiple">
                                                            {statusVerify.length > 0 ? (
                                                                 statusVerify.map((statuss, index) => (
                                                                      <AccordionItem
                                                                           key={index}
                                                                           aria-label={`Accordion ${index + 1}`}
                                                                           className='px-2 mt-3 rounded-md shadow drop-shadow-md'
                                                                           startContent={status?.status === 0
                                                                                ? <BsBan size={25} className='text-red-500' />
                                                                                : <BsCheckCircle size={25} className='text-green-500' />}
                                                                           title={
                                                                                statuss.User.role === 'admin'
                                                                                     ? 'งานทะเบียนเรียน'
                                                                                     : statuss.User.role === 'teacher'
                                                                                          ? 'อาจารย์ที่ปรึกษา'
                                                                                          : 'Untitled'
                                                                           }>
                                                                           <div>
                                                                                {/* Only show Teacher's information if all necessary fields are present and Teacher is not null */}
                                                                                {statuss?.User?.Teacher?.name && statuss?.User?.Teacher?.surname ? (
                                                                                     // Case 1: Teacher
                                                                                     <h1>
                                                                                          {statuss.User.Teacher.prefix} {statuss.User.Teacher.name} {statuss.User.Teacher.surname}
                                                                                     </h1>
                                                                                ) : statuss?.User?.Admin?.name && statuss?.User?.Admin?.surname ? (
                                                                                     // Case 2: Admin
                                                                                     <h1>
                                                                                          {statuss.User.Admin.prefix} {statuss.User.Admin.name} {statuss.User.Admin.surname}
                                                                                     </h1>
                                                                                ) : (
                                                                                     // Case 3: Fallback to email
                                                                                     <p>{statuss.User.email}</p>
                                                                                )}

                                                                                {statuss?.User?.Teacher?.name && statuss?.User?.Teacher?.surname ? (
                                                                                     // Case 1: Teacher is present
                                                                                     <div>
                                                                                          <p className='my-2'><strong>ลงนามโดย :</strong> {statuss.User.Teacher.name} {statuss.User.Teacher.surname}</p>
                                                                                          <p className='my-2'><strong>เวลา:</strong> {simpleDMYHM(statuss.approver_time)}</p>
                                                                                          {statuss.desc && (
                                                                                               <Textarea
                                                                                                    label="ความคิดเห็น"
                                                                                                    variant="bordered"
                                                                                                    color={status?.status === 0 ? 'danger' : 'primary'}
                                                                                                    size="lg"
                                                                                                    value={statuss.desc}
                                                                                                    placeholder="เพิ่มความคิดเห็น..."
                                                                                                    disableAnimation
                                                                                                    disableAutosize
                                                                                                    classNames={{
                                                                                                         base: "w-full my-3",
                                                                                                         input: "resize-y min-h-[80px]",
                                                                                                    }}
                                                                                                    isReadOnly
                                                                                               />
                                                                                          )}
                                                                                     </div>
                                                                                ) : statuss?.User?.Admin?.name && statuss?.User?.Admin?.surname ? (
                                                                                     // Case 2: Admin is present
                                                                                     <div>
                                                                                          <p className='my-2'><strong>ลงนามโดย :</strong> {statuss.User.Admin.name} {statuss.User.Admin.surname}</p>
                                                                                          <p className='my-2'><strong>เวลา:</strong> {simpleDMYHM(statuss.approver_time)}</p>
                                                                                          {statuss.desc && (
                                                                                               <Textarea
                                                                                                    label="ความคิดเห็น"
                                                                                                    variant="bordered"
                                                                                                    color={status?.status === 0 ? 'danger' : 'primary'}
                                                                                                    size="lg"
                                                                                                    value={statuss.desc}
                                                                                                    placeholder="เพิ่มความคิดเห็น..."
                                                                                                    disableAnimation
                                                                                                    disableAutosize
                                                                                                    classNames={{
                                                                                                         base: "w-full my-3",
                                                                                                         input: "resize-y min-h-[80px]",
                                                                                                    }}
                                                                                                    isReadOnly
                                                                                               />
                                                                                          )}
                                                                                     </div>
                                                                                ) : (
                                                                                     // Case 3: Fallback to email
                                                                                     <div>
                                                                                          <p className='my-2'><strong>ลงนามโดย : </strong>{statuss.User.email}</p>
                                                                                          <p className='my-2'><strong>เวลา :</strong> {simpleDMYHM(statuss.approver_time)}</p>
                                                                                          {statuss.desc && (
                                                                                               <Textarea
                                                                                                    label="ความคิดเห็น"
                                                                                                    variant="bordered"
                                                                                                    color={status?.status === 0 ? 'danger' : 'primary'}
                                                                                                    size="lg"
                                                                                                    value={statuss.desc}
                                                                                                    placeholder="เพิ่มความคิดเห็น..."
                                                                                                    disableAnimation
                                                                                                    disableAutosize
                                                                                                    classNames={{
                                                                                                         base: "w-full my-3",
                                                                                                         input: "resize-y min-h-[80px]",
                                                                                                    }}
                                                                                                    isReadOnly
                                                                                               />
                                                                                          )}
                                                                                     </div>
                                                                                )}

                                                                           </div>
                                                                      </AccordionItem>
                                                                 ))
                                                            ) : (
                                                                 <div>รอการอนุมัติจากอาจารย์และเจ้าหน้าที่</div>
                                                            )}
                                                       </Accordion>
                                                       {statusVerify.length !== 2 && (
                                                            <div className='flex items-center gap-3 py-4 px-2 mx-2 rounded-md shadow drop-shadow-md mt-3'>
                                                                 <BsCheckCircle size={25} className='text-gray-400' />
                                                                 <p className='text-foreground text-large'>งานทะเบียนเรียน</p>
                                                            </div>
                                                       )}
                                                  </>
                                             ) : (
                                                  <div className=''>
                                                       <div className='flex items-center gap-3 py-4 px-2 mx-2 rounded-md shadow drop-shadow-md'>
                                                            <BsCheckCircle size={25} className='text-gray-400' />
                                                            <p className='text-foreground text-large'>อาจารย์ที่ปรึกษา</p>
                                                       </div>
                                                       <div className='flex  items-center gap-3 py-4 px-2 mx-2 rounded-md shadow drop-shadow-md mt-3'>
                                                            <BsCheckCircle size={25} className='text-gray-400' />
                                                            <p className='text-foreground text-large'>งานทะเบียนเรียน</p>
                                                       </div>
                                                  </div>
                                             )}
                                        </Drawer>
                                   </div>
                                   {(status?.status === 0 || status?.status === 1 || status?.status === 2 || status?.status === 3) && (
                                        <div
                                             className={`${status?.status === 0 || status?.status === 1 || status?.status === 2 || status?.status === 3 ? 'w-[20%]' : 'w-[20%]w-0'} fixed left-auto right-0 max-xl:hidden h-screen border-l border-l-gray-200/80 top-16`}
                                        >
                                             <div className='relative top-10 px-5'>
                                                  <div className='flex justify-between items-center mb-5'>
                                                       <h1 className='text-2xl'>สถานะการอนุมัติ</h1>
                                                       {status?.status === 0 && (
                                                            <div className='inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300'>
                                                                 <span className='w-3 h-3 inline-block bg-red-500 rounded-full mr-2'></span>
                                                                 ไม่อนุมัติ
                                                            </div>
                                                       )}
                                                       {(status?.status === 1 || status?.status === 2) && (
                                                            <div className='inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300'>
                                                                 <span className='w-3 h-3 inline-block bg-yellow-500 rounded-full mr-2'></span>
                                                                 รอการยืนยัน
                                                            </div>
                                                       )}
                                                       {status?.status === 3 && (
                                                            <div className='inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>
                                                                 <span className='w-3 h-3 inline-block bg-green-500 rounded-full mr-2'></span>
                                                                 อนุมัติ
                                                            </div>
                                                       )}
                                                  </div>
                                                  {statusVerify.length > 0 ? (
                                                       <>
                                                            <Accordion selectionMode="multiple">
                                                                 {statusVerify.length > 0 ? (
                                                                      statusVerify.map((statuss, index) => (
                                                                           <AccordionItem
                                                                                key={index}
                                                                                aria-label={`Accordion ${index + 1}`}
                                                                                className='px-2 mt-3 rounded-md shadow drop-shadow-md'
                                                                                startContent={status?.status === 0
                                                                                     ? <BsBan size={25} className='text-red-500' />
                                                                                     : <BsCheckCircle size={25} className='text-green-500' />}
                                                                                title={
                                                                                     statuss.User.role === 'admin'
                                                                                          ? 'งานทะเบียนเรียน'
                                                                                          : statuss.User.role === 'teacher'
                                                                                               ? 'อาจารย์ที่ปรึกษา'
                                                                                               : 'Untitled'
                                                                                }>
                                                                                <div>
                                                                                     {/* Only show Teacher's information if all necessary fields are present and Teacher is not null */}
                                                                                     {statuss?.User?.Teacher?.name && statuss?.User?.Teacher?.surname ? (
                                                                                          // Case 1: Teacher
                                                                                          <h1>
                                                                                               {statuss.User.Teacher.prefix} {statuss.User.Teacher.name} {statuss.User.Teacher.surname}
                                                                                          </h1>
                                                                                     ) : statuss?.User?.Admin?.name && statuss?.User?.Admin?.surname ? (
                                                                                          // Case 2: Admin
                                                                                          <h1>
                                                                                               {statuss.User.Admin.prefix} {statuss.User.Admin.name} {statuss.User.Admin.surname}
                                                                                          </h1>
                                                                                     ) : (
                                                                                          // Case 3: Fallback to email
                                                                                          <p>{statuss.User.email}</p>
                                                                                     )}

                                                                                     {statuss?.User?.Teacher?.name && statuss?.User?.Teacher?.surname ? (
                                                                                          // Case 1: Teacher is present
                                                                                          <div>
                                                                                               <p className='my-2'><strong>ลงนามโดย :</strong> {statuss.User.Teacher.name} {statuss.User.Teacher.surname}</p>
                                                                                               <p className='my-2'><strong>เวลา:</strong> {simpleDMYHM(statuss.approver_time)}</p>
                                                                                               {statuss.desc && (
                                                                                                    <Textarea
                                                                                                         label="ความคิดเห็น"
                                                                                                         variant="bordered"
                                                                                                         color={status?.status === 0 ? 'danger' : 'primary'}
                                                                                                         size="lg"
                                                                                                         value={statuss.desc}
                                                                                                         placeholder="เพิ่มความคิดเห็น..."
                                                                                                         disableAnimation
                                                                                                         disableAutosize
                                                                                                         classNames={{
                                                                                                              base: "w-full my-3",
                                                                                                              input: "resize-y min-h-[80px]",
                                                                                                         }}
                                                                                                         isReadOnly
                                                                                                    />
                                                                                               )}
                                                                                          </div>
                                                                                     ) : statuss?.User?.Admin?.name && statuss?.User?.Admin?.surname ? (
                                                                                          // Case 2: Admin is present
                                                                                          <div>
                                                                                               <p className='my-2'><strong>ลงนามโดย :</strong> {statuss.User.Admin.name} {statuss.User.Admin.surname}</p>
                                                                                               <p className='my-2'><strong>เวลา:</strong> {simpleDMYHM(statuss.approver_time)}</p>
                                                                                               {statuss.desc && (
                                                                                                    <Textarea
                                                                                                         label="ความคิดเห็น"
                                                                                                         variant="bordered"
                                                                                                         color={status?.status === 0 ? 'danger' : 'primary'}
                                                                                                         size="lg"
                                                                                                         value={statuss.desc}
                                                                                                         placeholder="เพิ่มความคิดเห็น..."
                                                                                                         disableAnimation
                                                                                                         disableAutosize
                                                                                                         classNames={{
                                                                                                              base: "w-full my-3",
                                                                                                              input: "resize-y min-h-[80px]",
                                                                                                         }}
                                                                                                         isReadOnly
                                                                                                    />
                                                                                               )}
                                                                                          </div>
                                                                                     ) : (
                                                                                          // Case 3: Fallback to email
                                                                                          <div>
                                                                                               <p className='my-2'><strong>ลงนามโดย : </strong>{statuss.User.email}</p>
                                                                                               <p className='my-2'><strong>เวลา :</strong> {simpleDMYHM(statuss.approver_time)}</p>
                                                                                               {statuss.desc && (
                                                                                                    <Textarea
                                                                                                         label="ความคิดเห็น"
                                                                                                         variant="bordered"
                                                                                                         color={status?.status === 0 ? 'danger' : 'primary'}
                                                                                                         size="lg"
                                                                                                         value={statuss.desc}
                                                                                                         placeholder="เพิ่มความคิดเห็น..."
                                                                                                         disableAnimation
                                                                                                         disableAutosize
                                                                                                         classNames={{
                                                                                                              base: "w-full my-3",
                                                                                                              input: "resize-y min-h-[80px]",
                                                                                                         }}
                                                                                                         isReadOnly
                                                                                                    />
                                                                                               )}
                                                                                          </div>
                                                                                     )}

                                                                                </div>
                                                                           </AccordionItem>
                                                                      ))
                                                                 ) : (
                                                                      <div>รอการอนุมัติจากอาจารย์และเจ้าหน้าที่</div>
                                                                 )}
                                                            </Accordion>
                                                            {statusVerify.length !== 2 && (
                                                                 <div className='flex items-center gap-3 py-4 px-2 mx-2 rounded-md shadow drop-shadow-md mt-3'>
                                                                      <BsCheckCircle size={25} className='text-gray-400' />
                                                                      <p className='text-foreground text-large'>งานทะเบียนเรียน</p>
                                                                 </div>
                                                            )}
                                                       </>
                                                  ) : (
                                                       <div className=''>
                                                            <div className='flex items-center gap-3 py-4 px-2 mx-2 rounded-md shadow drop-shadow-md'>
                                                                 <BsCheckCircle size={25} className='text-gray-400' />
                                                                 <p className='text-foreground text-large'>อาจารย์ที่ปรึกษา</p>
                                                            </div>
                                                            <div className='flex  items-center gap-3 py-4 px-2 mx-2 rounded-md shadow drop-shadow-md mt-3'>
                                                                 <BsCheckCircle size={25} className='text-gray-400' />
                                                                 <p className='text-foreground text-large'>งานทะเบียนเรียน</p>
                                                            </div>
                                                       </div>
                                                  )}
                                             </div>
                                        </div>
                                   )}
                              </div>
                         </>
               }
          </>
     );
}

export default VerificationTable