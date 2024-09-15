"use client"
import { useCallback, useEffect, useState, useMemo } from 'react'
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Spinner, Tooltip } from '@nextui-org/react'
import { tableClass } from '@/src/util/ComponentClass'
import { calGrade, floorGpa, isNumber } from '@/src/util/grade';
import { Empty, message } from 'antd';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { RadioGroup, Radio } from "@nextui-org/radio";

const VerificationTable = ({ stdID }) => {
     const [loading, setLoading] = useState(true)
     const [verifySelect, setVerifySelect] = useState({})
     const [userData, setUserData] = useState({})
     const [enrollments, setEnrollment] = useState([])
     const [program, setProgram] = useState([])
     const [subgroupData, setSubgroupData] = useState([]);
     const [groupData, setGroupData] = useState([]);
     const [cateData, setCategoryData] = useState([]);
     const [semisubgroupData, setSemiSubgroupData] = useState([]);
     const [highestIndex, setHighestIndex] = useState(0);
     const [verificationID, setVerificationID] = useState(null);
     const [status, setStatus] = useState(null);
     const [conditions, setConditions] = useState([]);
     const [conditionSubgroup, setConditionSubgroup] = useState([]);
     const [conditionCategory, setConditionCategory] = useState([]);
     const [groupfirst, setGroupFirst] = useState([])
     const [group, setGroups] = useState([])
     const [subjectTrack, setSubjectTrack] = useState([]);
     const [term, setTerm] = useState("")

     const handleChange = (event) => {
          setTerm(event.target.value);
     };

     const [cumlaude, setCumLaude] = useState(1)

     const findCumLaude = useCallback((enrollments) => {
          // อันดับ 1 
          // ไม่ต่ำกว่า 3.60
          // อันดับ 1 
          // ไม่ต่ำกว่า 3.25 และต่ำกว่า 3.60

          // เรียนไม่เกิน 4 ปี
          // ไม่ติด F, R, U

          const grades = {
               "A": 4,
               "B+": 3.5,
               "B": 3,
               "C+": 2.5,
               "C": 2,
               "D+": 1.5,
               "D": 1,
               "F": 0,
          }

          let totalCredit = 0
          let totalScore = 0
          let isHonor = true
          let result = ""

          for (let index = 0; index < enrollments.length; index++) {
               const enroll = enrollments[index];
               if (["F", "R", "U"].includes(enroll.grade)) {
                    isHonor = false
                    result = "-"
                    // break
               }
               const gradePoint = grades[enroll.grade]
               const credit = enroll?.Subject?.credit
               if (!gradePoint || !credit) continue
               totalScore += gradePoint * credit
               totalCredit += credit
          }
          if (isHonor) {
               const score = totalScore / totalCredit
               if (score >= 3.6) {
                    result = "1"
               } else if (score >= 3.25 && score < 3.6) {
                    result = "2"
               } else {
                    result = "-"
               }
          }
          setCumLaude(`${result} (${floorGpa(totalScore / totalCredit)})`)
     }, [])

     const fetchEnrollment = useCallback(async function (stdID) {
          try {
               const URL = `/api/students/enrollments/${stdID}`
               const option = await getOptions(URL, "GET")
               const response = await axios(option)
               const data = response.data.data
               setUserData(data)
               if (data.Enrollments.length > 0) {
                    setEnrollment(data.Enrollments)
                    findCumLaude(data.Enrollments)
               } else {
                    setEnrollment([])
               }
          } catch (error) {
               setUserData({})
               setEnrollment([])
          }
     }, [])

     useEffect(() => {
          if (stdID) {
               fetchEnrollment(stdID)
          }
     }, [stdID])

     const getEnrollmentGrade = (subjectCode) => {
          // ต้องการหา subjectCode ใน enrollments
          const enrollment = enrollments.find(e => e?.Subject?.subject_code === subjectCode);
          if (enrollment) {
               return enrollment.grade;
          }
          return "ไม่มีเกรด";
     }

     const enrolls = enrollments.map(prev => {
          const grade = getEnrollmentGrade(prev?.Subject?.subject_code);
          const credit = prev?.Subject?.credit;

          if (grade === "ไม่มีเกรด" ||
               (credit <= 1 && ["I", "P", "R", "S", "T", "U", "W"].includes(grade))) {
               return null;
          }
          return {
               subject_code: prev?.Subject?.subject_code,
               grade: grade,
               credit: credit
          };
     }).filter(enroll => enroll !== null);

     // total credit
     const totalenrolls = enrolls.reduce((sum, enroll) => sum += enroll.credit, 0);

     const fetchData = async function () {
          try {
               let URL = `/api/verify/selects/${userData.program}/${userData.acadyear}`;
               let option = await getOptions(URL, "GET");
               const response = await axios(option);

               const data = response.data.data;

               if (data) {
                    setVerificationID(data?.id)
                    setProgram(data?.Program);
                    setVerifySelect(data);

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
                    setSemiSubgroupData(semisubgroupData);
               } else {
                    setVerifySelect({});
               }
          } catch (error) {
               console.log(error);
               setVerifySelect({});
          } finally {
               setLoading(false);
          }
     }
     const fetchConditions = async (verificationID) => {
          try {
               const url = `/api/condition/student/group/${verificationID}`;
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

     const fetchConditionSubject = async (verificationID) => {
          try {
               const url = `/api/condition/student/subgroup/${verificationID}`;
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

     const fetchConditionCategory = async (verificationID) => {
          try {
               const url = `/api/condition/student/category/${verificationID}`;
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

     const fetchStatus = async (stdID) => {
          try {
               const url = `/api/verify/selects/${stdID}`;
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

     // console.log(status);

     useEffect(() => {
          if (verificationID && stdID) {
               fetchConditions(verificationID);
               fetchConditionSubject(verificationID);
               fetchConditionCategory(verificationID);
               fetchStatus(stdID);
          }
     }, [verificationID, stdID]);


     useEffect(() => {
          if (Object.keys(userData).length > 0) {
               fetchData()
          }
     }, [userData])

     const fetchSubjects = async () => {
          try {
               const url = `/api/subjects/student`
               const option = await getOptions(url, "GET")
               try {
                    const res = await axios(option)
                    const filterSubjects = res.data.data

                    const filteredSubjects = filterSubjects.filter(subject => subject.track !== null && subject.track !== '');
                    setSubjectTrack(filteredSubjects)
               } catch (error) {
                    return
               }
          } catch (error) {
               console.error('Error fetching subjects:', error);
          }
     };


     useEffect(() => {
          fetchSubjects();
     }, [])

     const groupedSubjectsByCategory = useMemo(() => {
          const groupedSubjects = {};

          subgroupData.forEach(({ subject, subgroups }) => {
               subgroups.forEach(subgroup => {
                    const category = subgroup?.Group?.Categorie;
                    if (!groupedSubjects[category.id]) {
                         groupedSubjects[category.id] = { category, groups: {}, subgroups: {}, semisubgroups: {} };
                    }
                    if (!groupedSubjects[category.id].subgroups[subgroup.id]) {
                         groupedSubjects[category.id].subgroups[subgroup.id] = { ...subgroup, subjects: [] };
                    }
                    groupedSubjects[category.id].subgroups[subgroup.id].subjects.push(subject);
               });
          });

          groupData.forEach(({ subject, groups }) => {
               groups.forEach(group => {
                    const category = group?.Categorie;
                    if (!groupedSubjects[category.id]) {
                         groupedSubjects[category.id] = { category, groups: {}, subgroups: {}, semisubgroups: {} };
                    }
                    if (!groupedSubjects[category.id].groups[group.id]) {
                         groupedSubjects[category.id].groups[group.id] = { ...group, subjects: [] };
                    }
                    groupedSubjects[category.id].groups[group.id].subjects.push(subject);
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

          return groupedSubjects;
     }, [subgroupData, groupData, semisubgroupData]);


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


     const subjectCodesByGroupFirst = combinedGroupfirst.map(group => {
          const subjectsWithGrades = group.subjects
               .map(subject => {
                    const grade = getEnrollmentGrade(subject.subject_code);
                    const credit = subject.credit;

                    if (grade === "ไม่มีเกรด" ||
                         (credit <= 1 && ["I", "P", "R", "S", "T", "U", "W"].includes(grade))) {
                         return null;
                    }

                    const calculatedGrade = calGrade(grade);

                    return {
                         subject_code: subject.subject_code,
                         grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                         credit: credit,
                         numericGrade: isNumber(calculatedGrade) ? calculatedGrade * credit : null
                    };
               })
               .filter(subject => subject !== null);

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
          const subjectsWithGrades = group.subjects
               .map(subject => {
                    const grade = getEnrollmentGrade(subject.subject_code);
                    const credit = subject.credit;

                    // Check for invalid grades or low credits
                    if (grade === "ไม่มีเกรด" ||
                         (credit <= 1 && ["I", "P", "R", "S", "T", "U", "W"].includes(grade))) {
                         return null;
                    }

                    const calculatedGrade = calGrade(grade);

                    return {
                         subject_code: subject.subject_code,
                         grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                         credit: credit,
                         numericGrade: isNumber(calculatedGrade) ? calculatedGrade * credit : null // Store numeric grade if valid
                    };
               })
               .filter(subject => subject !== null);

          // Calculate total credits and grades
          const totalCredits = subjectsWithGrades.reduce((acc, subject) => acc + subject.credit, 0);
          const totalGrades = subjectsWithGrades.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
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

     const subjectCodesBySubgroup = combinedSubgroup.map(subgroup => {
          const subjectsWithGrades = subgroup.subjects
               .map(subject => {
                    const grade = getEnrollmentGrade(subject.subject_code);
                    const credit = subject.credit;

                    // Check for invalid grades or low credits
                    if (grade === "ไม่มีเกรด" ||
                         (credit <= 1 && ["I", "P", "R", "S", "T", "U", "W"].includes(grade))) {
                         return null;
                    }

                    const calculatedGrade = calGrade(grade);

                    return {
                         subject_code: subject.subject_code,
                         grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                         credit: credit,
                         numericGrade: isNumber(calculatedGrade) ? calculatedGrade * credit : null
                    };
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

     const getCalculatedValues = (subjectTrack) => {
          const combinedData = [...subjectTrack];

          const subtrack = combinedData.map(prev => {
               const grade = getEnrollmentGrade(prev.subject_code);
               const credit = prev.credit;

               if (grade === "ไม่มีเกรด" ||
                    (credit <= 1 && ["I", "P", "R", "S", "T", "U", "W"].includes(grade))) {
                    return null;
               }

               const calculatedGrade = calGrade(grade);

               return {
                    subject_code: prev.subject_code,
                    grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                    credit: credit,
                    numericGrade: isNumber(calculatedGrade) ? calculatedGrade * credit : null
               };
          }).filter(item => item !== null);

          const totalCredits = subtrack.reduce((acc, subject) => acc + subject.credit, 0);
          const totalGrades = subtrack.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
          const averageGrade = totalCredits ? (totalGrades / totalCredits) : 0;

          return { totalCredits, totalGrades, averageGrade };
     };

     const [insertData, setInsertData] = useState([]);

     useEffect(() => {
          const newInsertData = Object.keys(groupedSubjectsByCategory).reduce((acc, categoryId) => {
               const categoryData = groupedSubjectsByCategory[categoryId];

               const processSubjects = (subjects) => {
                    return subjects.map(subject => ({
                         subject,
                         grade: getEnrollmentGrade(subject.subject_code),
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
     }, [groupedSubjectsByCategory, enrollments]);


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
                                   <div className='bg-gray-50 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center '>
                                        <h3 className='text-md text-default-800 px-16'><li>กลุ่มย่อยที่ {trackIndex + 1} {track}</li></h3>
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
                    </div>)
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

          // console.log(groupedSubgroups);
          return (
               <>
                    {Object.keys(groupedSubgroups).map((groupTitle, groupIndex) => {
                         const subgroupsWithSameGroupTitle = groupedSubgroups[groupTitle];

                         // console.log(subgroupsWithSameGroupTitle);


                         return (
                              <div key={groupIndex}>
                                   <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center'>
                                        <h3 className='text-lg text-default-800 px-4'><li>{groupTitle}</li></h3>
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
               {loading ?
                    <div className='w-full flex justify-center h-[70vh]'>
                         <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    !(verifySelect?.id) ?
                         <>
                              <p className='text-center font-bold text-lg my-28'>
                                   จำเป็นต้องสร้างแบบฟอร์มตรวจสอบการสำเร็จการศึกษาก่อน
                              </p>
                         </>
                         :
                         <>
                              <div className={`${status?.status === 1 || status?.status === 2 ? 'flex relative' : ''}`}>
                                   <div className={`my-[30px] ${status?.status === 1 || status?.status === 2 ? 'w-[80%] 2xl:px-30 xl:pr-20' : 'w-[100%] 2xl:px-44 xl:px-20'} mt-16 max-xl:w-[100%] relative`}>
                                        <div className='text-xl text-black mb-5 px-5'>
                                             <h1 className='text-3xl text-center  leading-relaxed'>แบบฟอร์มตรวจสอบการสำเร็จการศึกษา <br /> หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{program.title_th} <br />(ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                             <div className='text-center mt-6'>
                                                  <p>{userData.first_name} {userData.last_name} รหัสประจำตัว {stdID}</p>
                                                  <div className='flex justify-center items-center'>
                                                       <p>คาดว่าจะได้รับปริญญาวิทยาศาสตรบัณฑิต  สาขาวิชา{program.title_th} เกียรตินิยมอันดับ {cumlaude}</p>
                                                  </div>
                                             </div>
                                             <h2 className='mt-6 text-center '>รายละเอียดการศึกษารายวิชาที่ได้เรียนมาทั้งหมด อย่างน้อย <span className={`font-bold ${verifySelect.main_at_least < totalenrolls ? '' : 'text-red-400'}`}>{verifySelect.main_at_least}</span> หน่วยกิต</h2>
                                        </div>
                                        {Object.keys(groupedSubjectsByCategory).map((categoryId, index) => {
                                             const { category, groups, subgroups, semisubgroups } = groupedSubjectsByCategory[categoryId];
                                             if (index > highestIndex) {
                                                  setHighestIndex(index);
                                             }
                                             // console.log(conditions);

                                             return (
                                                  <div key={index} className='mb-5'>
                                                       <div className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-md'>
                                                            <h2 className='text-lg text-default-800'>{index + 1}. {category?.category_title}</h2>
                                                            {/* <h2 className='text-sm text-default-800'>จำนวน {creditgroup} หน่วยกิต</h2> */}
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
                                                                                <TableColumn>เกรด</TableColumn>
                                                                                <TableColumn>ค่าคะแนน</TableColumn>
                                                                           </TableHeader>
                                                                           <TableBody>
                                                                                {group.subjects && group.subjects.map((subject, subjectIndex) => (
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
                                                            );
                                                       })}
                                                       {
                                                            getSubg(subgroups, semisubgroups)
                                                       }
                                                  </div>
                                             );
                                        })}

                                        {Object.keys(groupedSubjectsByCategory).length === 0 && (
                                             <>
                                                  <p className='text-center mt-10'>ไม่มีวิชาภายในแบบฟอร์ม</p>
                                             </>
                                        )}

                                        {/* <div className='text-2xl max-lg:text-xl max-md:text-xl mt-4 flex justify-between'>
                                                  <div>
                                                       เงื่อนไขตรวจสอบสำเร็จการศึกษา
                                                  </div>
                                                  <div>
                                                       หน่วยกิตที่ลงทะเบียน <span className='text-red-600'>{totalenrolls}</span>
                                                  </div>
                                             </div> */}

                                        <Table
                                             classNames={tableClass}
                                             removeWrapper
                                             onRowAction={() => { }}
                                             aria-label="program table"
                                             className='mt-5'
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

                                                            return (
                                                                 <TableRow key={index}>
                                                                      <TableCell>{condition?.Group?.group_title}</TableCell>
                                                                      <TableCell>{condition.credit}</TableCell>
                                                                      <TableCell className={creditClassName}>{totalCredits}</TableCell>
                                                                      <TableCell>{totalGrades}</TableCell>
                                                                      <TableCell className='bg-green-200'>{averageGrade.toFixed(2)}</TableCell>
                                                                 </TableRow>
                                                            );

                                                       })}
                                                  </TableBody>
                                             ) : (
                                                  <TableBody emptyContent={"ไม่มีเงื่อนไข"}>{[]}</TableBody>
                                             )}
                                        </Table>

                                        {conditionSubgroup.length > 0 && (
                                             <Table
                                                  classNames={tableClass}
                                                  removeWrapper
                                                  onRowAction={() => { }}
                                                  aria-label="program table"
                                                  className='mt-5'
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

                                                                 return (
                                                                      <TableRow key={index}>
                                                                           <TableCell>{condition?.SubGroup?.sub_group_title}</TableCell>
                                                                           <TableCell>{condition.credit}</TableCell>
                                                                           <TableCell className={creditClassName}>{totalCredits}</TableCell>
                                                                           <TableCell>{totalGrades}</TableCell>
                                                                           <TableCell className='bg-green-200'>{averageGrade.toFixed(2)}</TableCell>
                                                                      </TableRow>
                                                                 );
                                                            })}
                                                       </TableBody>
                                                  ) : (
                                                       <TableBody emptyContent={"ไม่มีเงื่อนไข"}>{[]}</TableBody>
                                                  )}
                                             </Table>
                                        )}

                                        {userData.program === "IT" && (
                                             <Table
                                                  classNames={tableClass}
                                                  removeWrapper
                                                  onRowAction={() => { }}
                                                  aria-label="program table"
                                                  className='mt-5'
                                             >
                                                  <TableHeader>
                                                       <TableColumn>รายวิชาที่คณะกำหนด</TableColumn>
                                                       <TableColumn>หน่วยกิตที่กำหนดเป็นอย่างน้อย</TableColumn>
                                                       <TableColumn className='w-1/3'>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
                                                       <TableColumn>ค่าคะแนน</TableColumn>
                                                       <TableColumn>คะแนนเฉลี่ย</TableColumn>
                                                  </TableHeader>

                                                  <TableBody>
                                                       {(() => {

                                                            const { totalCredits, totalGrades, averageGrade } = getCalculatedValues(subjectTrack);

                                                            const creditClassName = totalCredits < 21 ? 'bg-red-200' : '';

                                                            return (
                                                                 <TableRow>
                                                                      <TableCell>กลุ่มเลือก 3 วิชา</TableCell>
                                                                      <TableCell>21</TableCell>
                                                                      <TableCell className={creditClassName}>{totalCredits}</TableCell>
                                                                      <TableCell>{totalGrades}</TableCell>
                                                                      <TableCell className='bg-green-200'>{averageGrade.toFixed(2)}</TableCell>
                                                                 </TableRow>
                                                            );
                                                       })()}
                                                  </TableBody>

                                             </Table>
                                        )}
                                   </div>
                              </div>
                         </>
               }
          </>
     );
}

export default VerificationTable