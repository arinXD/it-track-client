"use client"
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData, fetchDataObj } from '../../action'
import { useToggleSideBarStore } from '@/src/store'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
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
import { tableClass, tableClassCondition } from '@/src/util/ComponentClass'
import { Button, Table, Textarea, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner, Tooltip } from '@nextui-org/react'
import { Loading } from '@/app/components';
import { Empty, message } from 'antd';
import CategoryGrade from './CategoryGrade';
import { simpleDMY, simpleDMYHM } from '@/src/util/simpleDateFormatter'
import { RadioGroup, Radio } from "@nextui-org/radio";
import { useSession } from 'next-auth/react';
import { Drawer, Space } from 'antd';
import { Accordion, AccordionItem } from "@nextui-org/react";
import { TbMessage2Exclamation } from "react-icons/tb";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { BsBan } from "react-icons/bs";

const Page = ({ params }) => {
    const { id } = params
    const [loading, setLoading] = useState(true)
    const [verifySelect, setVerifySelect] = useState({})
    const [verify, setVerify] = useState({})

    const [groupData, setGroupData] = useState([]);
    const [subgroupData, setSubgroupData] = useState([]);
    const [semisubgroupData, setSemiSubgroupData] = useState([]);
    const [userData, setUserData] = useState({})
    const [enrollments, setEnrollment] = useState([])

    const [cateData, setCategoryData] = useState([]);

    const [groupfirst, setGroupFirst] = useState([])
    const [group, setGroups] = useState([])

    const [highestIndex, setHighestIndex] = useState(0);

    const [categoryverify, setCategoryVerifies] = useState([])
    const [itGrade, setItGrade] = useState([])
    const [cumlaude, setCumLaude] = useState("")

    const [conditions, setConditions] = useState([]);
    const [conditionSubgroup, setConditionSubgroup] = useState([]);
    const [conditionCategory, setConditionCategory] = useState([]);

    const [subjectTrack, setSubjectTrack] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [desct, setDesct] = useState({});
    const [descadmin, setDesAdmin] = useState([]);
    const [desAll, setDesAll] = useState([]);
    const [desc, setDesc] = useState('');

    const { data: session } = useSession();

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

    ////////////////////////////////////////


    const fetchEnrollment = useCallback(async function (stu_id) {
        try {
            const URL = `/api/students/enrollments/${stu_id}`
            const option = await getOptions(URL, "GET")
            const response = await axios(option)
            const data = response.data.data
            if (data.Enrollments.length > 0) {
                setEnrollment(data.Enrollments)
            } else {
                setEnrollment([])
            }
        } catch (error) {
            setEnrollment([])
        }
    }, [])

    useEffect(() => {
        fetchEnrollment(id);
    }, [id])

    // console.log(subjects);

    const getEnrollmentGrade = (subjectCode) => {
        // ต้องการหา subjectCode ใน enrollments
        const enrollment = enrollments.find(e => e?.Subject?.subject_code === subjectCode);
        if (enrollment) {
            return enrollment.grade;
        }
        return "ไม่มีเกรด";
    }


    const initVerify = useCallback(async function (id) {
        try {

            const URL = `/api/verifies/approve/${id}`
            const option = await getOptions(URL, "GET")
            const response = await axios(option)
            const result = response.data.data

            setVerifySelect(result);

            setUserData(result?.Student);
            setVerify(result?.Verify);

            setDesct(result?.StudentVerifyApprovements);


            // Extract all subjects from the StudentVerifyDetails
            const allSubjects = result.StudentVerifyDetails
                .flatMap(detail => detail.Subject); // Flatten the array of subjects

            // Filter subjects based on track
            const filteredSubjects = allSubjects.filter(subject => subject.track !== null && subject.track !== '');

            // Map filtered subjects with grade information
            const filteredSubjectsWithGrades = filteredSubjects.map(subject => ({
                ...subject,
                grade: result.StudentVerifyDetails.find(detail => detail.subject_id === subject.subject_id)?.grade || null
            }));

            setSubjectTrack(filteredSubjectsWithGrades);

            // console.log(filteredSubjectsWithGrades);


            // Set category verifies
            const categoryVerifies = result.Verify.CategoryVerifies?.map(categoryVerify => {
                const category = categoryVerify.Categorie;
                const subjectDetails = result.StudentVerifyDetails.filter(detail =>
                    detail.StudentCategoryVerify?.CategoryVerify?.Categorie?.id === category.id
                );
                return { category, subjectDetails };
            });
            setCategoryVerifies(categoryVerifies);

            const subjectsByCategory = result.Verify.SubjectVerifies.reduce((acc, subjectVerify) => {
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
                        grade: result.StudentVerifyDetails.find(detail =>
                            detail.subject_id === subject.subject_id &&
                            detail.StudentCategoryVerify?.CategoryVerify?.Categorie?.id === categorie.id
                        )?.grade || null
                    });
                });

                return acc;
            }, {});

            const categoryData = Object.values(subjectsByCategory);

            setCategoryData(categoryData);

            // Map subject verifies and include grade information
            const groupData = result.Verify.SubjectVerifies.map(subjectVerify => {
                const subject = subjectVerify.Subject;
                const groups = subject.GroupSubjects?.map(groupSubject => ({
                    ...groupSubject.Group,
                    grade: result.StudentVerifyDetails.find(detail => detail.subject_id === subject.subject_id)?.grade // Include grade
                }));
                return { subject, groups };
            });
            setGroupData(groupData);

            // Map subgroup verifies and include grade information
            const subgroupData = result.Verify.SubjectVerifies.map(subjectVerify => {
                const subject = subjectVerify.Subject;
                const subgroups = subject.SubgroupSubjects?.map(subgroupSubject => ({
                    ...subgroupSubject.SubGroup,
                    grade: result.StudentVerifyDetails.find(detail => detail.subject_id === subject.subject_id)?.grade // Include grade
                }));
                return { subject, subgroups };
            });
            setSubgroupData(subgroupData);

            // Map semi-subgroup verifies and include grade information
            const semisubgroupData = result.Verify.SubjectVerifies.map(subjectVerify => {
                const subject = subjectVerify.Subject;
                const semisubgroups = subject.SemiSubgroupSubjects?.map(semisubgroupSubject => ({
                    ...semisubgroupSubject.SemiSubGroup,
                    grade: result.StudentVerifyDetails.find(detail => detail.subject_id === subject.subject_id)?.grade // Include grade
                }));
                return { subject, semisubgroups };
            });
            setSemiSubgroupData(semisubgroupData);

        } catch (err) {
            console.error("Error on init func:", err);
        }
    }, []);

    const initItGrade = useCallback(async function (id) {
        const URL = `/api/verifies/approve/it/${id}`
        const option = await getOptions(URL, "GET")
        const response = await axios(option)
        const result = response.data.data
        setItGrade(result)
    }, [])

    // console.log(conditionCategory);

    const fetchConditions = useCallback(async (verifyId) => {
        try {
            const url = `/api/condition/${verifyId}`;
            const option = await getOptions(url, "GET");
            try {
                const res = await axios(option);
                // console.log(res);
                const filterConditions = res.data.data;
                setConditions(filterConditions);
            } catch (error) {
                setConditions([]);
                return;
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, []);

    const fetchConditionSubgroups = useCallback(async (verifyId) => {

        try {
            const url = `/api/condition/subgroup/${verifyId}`;
            const option = await getOptions(url, "GET");
            try {
                const res = await axios(option);
                // console.log(res);
                const filterConditions = res.data.data;
                setConditionSubgroup(filterConditions);
            } catch (error) {
                setConditionSubgroup([]);
                return;
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, []);

    const fetchConditionCategory = useCallback(async (verifyId) => {

        try {
            const url = `/api/condition/category/${verifyId}`;
            const option = await getOptions(url, "GET");
            try {
                const res = await axios(option);
                // console.log(res);
                const filterConditions = res.data.data;
                setConditionCategory(filterConditions);
            } catch (error) {
                setConditionCategory([]);
                return;
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, []);



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
                    groupedSubjects[category.id].groups[group.id].subjects.push({ ...subject, grade: group.grade });
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
                    groupedSubjects[category.id].subgroups[subgroup.id].subjects.push({ ...subject, grade: subgroup.grade });
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
                    groupedSubjects[category.id].semisubgroups[semisubgroup.id].subjects.push({ ...subject, grade: semisubgroup.grade });
                }
            });
        });

        return groupedSubjects;
    }, [subgroupData, groupData, semisubgroupData]);

    const [insertData, setInsertData] = useState([]);
    const [insideTrack, setInsideTrack] = useState([]);
    const [outsideTrack, setOutsideTrack] = useState([]);
    const [insideTrackStats, setInsideTrackStats] = useState({ totalCredits: 0, totalScores: 0, averageScore: 0 });
    const [outsideTrackStats, setOutsideTrackStats] = useState({ totalCredits: 0, totalScores: 0, averageScore: 0 });


    useEffect(() => {
        const newInsertData = Object.keys(groupedSubjectsByCategory).reduce((acc, categoryId) => {
            const categoryData = groupedSubjectsByCategory[categoryId];

            const processSubjects = (subjects) => {
                return subjects.map(subject => ({
                    subject,
                    grade: subject.grade,
                    track: subject?.Track?.track || null,
                    credit: subject.credit
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
                if (subjectData.track && subjectData.grade && subjectData.grade !== undefined) {
                    const calculatedGrade = calGrade(subjectData.grade);

                    // Check if calculatedGrade is a number before multiplication
                    const gradeValue = isNumber(calculatedGrade) ? calculatedGrade * subjectData.credit : 0;

                    const subjectEntry = {
                        subject: subjectData.subject,
                        grade: gradeValue, // Store numeric value instead of string
                        track: subjectData.track,
                        credit: Number(subjectData.credit) || 0 // Ensure credit is a number
                    };

                    validSubjects.push(subjectEntry);
                }
            });
        });

        validSubjects.sort((a, b) => b.grade - a.grade);

        validSubjects.forEach((subjectEntry) => {
            if (userData?.Selection?.result === subjectEntry.track) {
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

    }, [groupedSubjectsByCategory, userData]);

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

        // console.log(allGroups);
        setGroups(allGroups);
    }, [groupedSubjectsByCategory]);

    const condition = conditions.map(prev => prev.Group);
    const conditionsubgroups = conditionSubgroup.map(prev => prev.SubGroup);

    const go = group.map(prev => prev.subgroup || prev.semisubgroup.SubGroup);

    // console.log(group);
    // console.log(go);

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

    // console.log(combinedGroups);
    // console.log(combinedSubgroup);

    const subjectCodesByGroupFirst = combinedGroupfirst.map(group => {
        const subjectsWithGrades = group.subjects
            .map(subject => {
                const grade = subject.grade;
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
                        subject_code: subject?.subject_code,
                        grade: grade,  // Keep the original grade
                        credit: credit,
                        numericGrade: null // Do not calculate grade
                    };
                } else if (gradeAndCreditGrades.includes(grade)) {
                    // Count both credits and grades
                    calculatedGrade = calGrade(grade);
                    numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                    return {
                        subject_code: subject?.subject_code,
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
        const subjectsWithGrades = group.subjects
            .map(subject => {
                const grade = subject.grade;
                const credit = subject.credit;

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
                        subject_code: subject?.subject_code,
                        grade: grade,  // Keep the original grade
                        credit: credit,
                        numericGrade: null // Do not calculate grade
                    };
                } else if (gradeAndCreditGrades.includes(grade)) {
                    // Count both credits and grades
                    calculatedGrade = calGrade(grade);
                    numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                    return {
                        subject_code: subject?.subject_code,
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
                const grade = subject.grade;
                const credit = subject.credit;

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
                        subject_code: subject?.subject_code,
                        grade: grade,  // Keep the original grade
                        credit: credit,
                        numericGrade: null // Do not calculate grade
                    };
                } else if (gradeAndCreditGrades.includes(grade)) {
                    // Count both credits and grades
                    calculatedGrade = calGrade(grade);
                    numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                    return {
                        subject_code: subject?.subject_code,
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


    const subData = itGrade.map(subject => {
        const grade = subject.grade;
        const credit = subject.Subject.credit;

        return {
            subject_id: subject.Subject.subject_id,
            subject_code: subject.Subject.subject_code,
            grade,
            credit
        };
    });

    const getCalculatedValues = (subjectTrack) => {
        // Combine subjectTrack and subData
        const combinedData = [...subjectTrack, ...subData];

        const subtrack = combinedData.map(prev => {
            const grade = prev.grade
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
                    subject_code: prev?.subject_code,
                    grade: grade,  // Keep the original grade
                    credit: credit,
                    numericGrade: null // Do not calculate grade
                };
            } else if (gradeAndCreditGrades.includes(grade)) {
                // Count both credits and grades
                calculatedGrade = calGrade(grade);
                numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                return {
                    subject_code: prev?.subject_code,
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

        return { totalCredits, totalGrades, averageGrade };
    };

    // console.log(userData);
    // console.log(categoryverify);

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
                        subject_code: subject?.subject_code,
                        grade: grade,  // Keep the original grade
                        credit: credit,
                        numericGrade: null // Do not calculate grade
                    };
                } else if (gradeAndCreditGrades.includes(grade)) {
                    // Count both credits and grades
                    calculatedGrade = calGrade(grade);
                    numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                    return {
                        subject_code: subject?.subject_code,
                        grade: isNumber(calculatedGrade) ? String(calculatedGrade * credit) : calculatedGrade,
                        credit: credit,
                        numericGrade: numericGrade
                    };
                }
            })
            .filter(subject => subject !== null)
            : []; // Return an empty array if 'subjects' is not an array

        const totalCredits = subjectsWithGrades.reduce((acc, subject) => acc + subject.credit, 0);
        const totalGrades = subjectsWithGrades.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
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

    // console.log(subjectCategorytest);


    const subjectCategory = categoryverify.map(category => {
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
                        subject_code: subject?.Subject?.subject_code,
                        grade: grade,  // Keep the original grade
                        credit: credit,
                        numericGrade: null // Do not calculate grade
                    };
                } else if (gradeAndCreditGrades.includes(grade)) {
                    // Count both credits and grades
                    calculatedGrade = calGrade(grade);
                    numericGrade = isNumber(calculatedGrade) ? calculatedGrade * credit : null;

                    return {
                        subject_code: subject?.Subject.subject_code,
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

    const combinedSubjectCategories = subjectCategorytest.concat(subjectCategory);

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

    ///////////////////////รวมค่าคะแนน///////////////////////

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
            const { totalCredits, totalGrades } = getCalculatedValues(subjectTrack);
            totalCreditsRef.current += totalCredits;
            totalGradesRef.current += totalGrades;
        }

        // Set the state with the accumulated values from the refs
        setSumCredits(totalCreditsRef.current);
        setSumGrades(totalGradesRef.current);

    }, [conditionCategory, combinedSubjectCategories, userData.program, conditions, combinedsubjectCodesByGroup, conditionSubgroup, subjectCodesBySubgroup, subjectTrack, subData]);


    //////////////////////////////////////////////////////////


    const fetchAdStatus = useCallback(async (email, stu_id) => {
        try {
            const url = `/api/verifies/approve/calldescall/${email}/${stu_id}`;
            const option = await getOptions(url, "GET");
            try {
                const res = await axios(option);
                // console.log(res);
                const des = res.data.data;
                setDesAdmin(des);
            } catch (error) {
                setDesAdmin([]);
                return;
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, []);

    const fetchAllStatus = useCallback(async (stu_id) => {
        try {
            const url = `/api/verifies/approve/calldescall/${stu_id}`;
            const option = await getOptions(url, "GET");
            try {
                const res = await axios(option);
                // console.log(res);
                const des = res.data.data;
                // console.log(des);

                setDesAll(des);
            } catch (error) {
                setDesAll([]);
                return;
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, []);

    useEffect(() => {
        if (session?.user?.email && id) fetchAdStatus(session?.user?.email, id)
        if (id) fetchAllStatus(id)
    }, [session?.user?.email, id]);

    useEffect(() => {
        if (session?.user?.role === 'admin') {
            if (descadmin?.desc) {
                setDesc(descadmin?.desc)
            } else {
                setDesc('');
            }
        } else if (desct && desct.length > 0) {
            setDesc(desct[0].desc);
        }
    }, [desct, session?.user?.role, descadmin?.desc]);

    const handleChange = (event) => {
        setDesc(event.target.value);
    };


    const handleSubmit = useCallback(async function (stu_id) {
        try {

            const url = `/api/verifies/approve/status/${session?.user?.email}/${stu_id}`;

            const formData = {
                stu_id: stu_id,
                desc: desc,
            };

            setIsSubmitting(true);
            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;

            initVerify(id);
            initItGrade(id)
            if (verify?.id) fetchConditions(verify?.id)
            if (verify?.id) fetchConditionSubgroups(verify?.id)
            if (id) fetchAllStatus(id)
            message.success(msg)
        } catch (error) {
            console.log(error);
        }
    }, [id, verify?.id, desc, session?.user?.email]);

    const handleSubmitAdmin = useCallback(async function (stu_id) {
        try {

            const url = `/api/verifies/approve/status/admin/${session?.user?.email}/${stu_id}`;

            const formData = {
                stu_id: stu_id,
                desc: desc,
            };

            setIsSubmitting(true);
            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;

            initVerify(id);
            initItGrade(id)
            if (verify?.id) fetchConditions(verify?.id)
            if (verify?.id) fetchConditionSubgroups(verify?.id)
            if (session?.user?.email && id) fetchAdStatus(session?.user?.email, id)
            if (id) fetchAllStatus(id)
            message.success(msg)
        } catch (error) {
            console.log(error);
        }
    }, [id, verify?.id, desc, session?.user?.email]);

    const handleReject = useCallback(async function (stu_id) {
        try {

            const url = `/api/verifies/approve/status/reject/${session?.user?.email}/${stu_id}`;

            const formData = {
                stu_id: stu_id,
                desc: desc,
            };

            setIsSubmitting(true);
            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;

            initVerify(id);
            initItGrade(id)
            if (verify?.id) fetchConditions(verify?.id)
            if (verify?.id) fetchConditionSubgroups(verify?.id)
            if (id) fetchAllStatus(id)
            message.success(msg)
        } catch (error) {
            console.log(error);
        }
    }, [id, verify?.id, desc, session?.user?.email, session?.user?.user_id]);

    const handleRejectAdmin = useCallback(async function (stu_id) {
        try {

            const url = `/api/verifies/approve/status/admin/reject/${session?.user?.email}/${stu_id}`;

            const formData = {
                stu_id: stu_id,
                desc: desc,
            };

            setIsSubmitting(true);
            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;

            initVerify(id);
            initItGrade(id)
            if (verify?.id) fetchConditions(verify?.id)
            if (verify?.id) fetchConditionSubgroups(verify?.id)
            if (session?.user?.email && id) fetchAdStatus(session?.user?.email, id)
            if (id) fetchAllStatus(id)
            message.success(msg)
        } catch (error) {
            console.log(error);
        }
    }, [id, verify?.id, desc, session?.user?.email]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await initVerify(id);
                await initItGrade(id);
                if (verify?.id) {
                    await fetchConditions(verify?.id);
                    await fetchConditionSubgroups(verify?.id);
                    await fetchConditionCategory(verify?.id);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [verify?.id, fetchConditions, fetchConditionSubgroups, fetchConditionCategory, initVerify, initItGrade]);

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
                                                {subject.grade ? (
                                                    <div className="relative ml-2 w-[70px]">
                                                        <input
                                                            className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                            placeholder=" "
                                                            type="text"
                                                            value={subject.grade}
                                                            onChange={(e) => setCumLaude()}
                                                        />
                                                        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                            เกรด
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <p></p>
                                                )}
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
                            <div
                                className={`border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center 
        ${userData?.Selection?.Track?.title_th === track ? 'bg-blue-100' : 'bg-gray-50'}`}>
                                <h3 className='text-md text-default-800 px-16'>
                                    <li>กลุ่มย่อยที่ {trackIndex + 1} {track}</li>
                                </h3>
                                {userData?.Selection?.Track?.title_th === track && (
                                    <span className="text-blue-600 font-bold">แทร็กของนักศึกษา</span>
                                )}
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
                                        <TableRow key={subjectIndex} className={subject.track !== null ? '' : ''}>
                                            {/* <TableCell className=''>{subject.subject_id}</TableCell> */}
                                            <TableCell className=''>{subject.subject_code}</TableCell>
                                            <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                            <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                            <TableCell>{subject.credit}</TableCell>
                                            <TableCell>
                                                {subject.grade ? (
                                                    <div className="relative ml-2 w-[70px]">
                                                        <input
                                                            className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                            placeholder=" "
                                                            type="text"
                                                            value={subject.grade}
                                                            onChange={(e) => setCumLaude()}
                                                        />
                                                        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                            เกรด
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <p></p>
                                                )}
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
                                <TableRow key={subjectIndex} className={subject.track == null ? '' : ''}>
                                    <TableCell className=''>{subject.subject_code}</TableCell>
                                    <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                    <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                    <TableCell>{subject.credit}</TableCell>
                                    <TableCell>
                                        {subject.grade ? (
                                            <div className="relative ml-2 w-[70px]">
                                                <input
                                                    className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                    placeholder=" "
                                                    type="text"
                                                    value={subject.grade}
                                                    onChange={(e) => setCumLaude()}
                                                />
                                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                    เกรด
                                                </label>
                                            </div>
                                        ) : (
                                            <p></p>
                                        )}
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

                    // const { totalCredits, totalGrades } = combinedsubjectCodesByGroup[groupIndex] || { totalCredits: 0, totalGrades: 0 };

                    return (
                        <div key={groupTitle}>
                            <div>
                                <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center'>
                                    <h3 className='text-lg text-default-800 px-4'><li>{groupTitle}</li></h3>
                                    {/* <h2 className='text-sm text-default-800'>จำนวน {creditsubgroup} หน่วยกิต</h2> */}
                                </div>
                                {subgroupsWithSameGroupTitle.map((subgroup, subgroupIndex) => (
                                    getSubTrack(subgroup, subgroupIndex)
                                ))}
                            </div>
                            {/* {groupTitle !== "กลุ่มวิชาเลือกสาขา" && (
                                <Table aria-label="Sum" classNames={tableClass} removeWrapper color="primary">
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
                                            <TableCell className='font-bold'>รวมคะแนน {groupTitle}</TableCell>
                                            <TableCell className="w-1/3"></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{totalCredits}</TableCell>
                                            <TableCell>{totalGrades}</TableCell>
                                            <TableCell>
                                                {totalCredits > 0 ? (totalGrades / totalCredits).toFixed(2) : 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            )} */}
                        </div>
                    );
                })}
            </>
        );
    }
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className={`p-4 md:p-8 md:ml-[240px] ${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}>
                {!verifySelect ? (
                    <p>No data</p>
                ) : (
                    <div>
                        {loading ? (
                            <div className='w-full flex justify-center h-[70vh]'>
                                <Spinner label="กำลังโหลด..." color="primary" />
                            </div>
                        ) : (
                            <>
                                <div className='relative'>
                                    <div className='hidden max-xl:block max-xl:fixed max-xl:top-16 max-xl:right-0 mt-5 z-50'>
                                        {(verifySelect?.status === 0 || verifySelect.status === 1 || verifySelect.status === 2 || verifySelect.status === 3) && (
                                            <Tooltip showArrow={true} placement='left-end' size='lg' content="สถานะการอนุมัติ">
                                                <Button
                                                    onClick={showDrawer}
                                                    color="primary"
                                                    radius="sm"
                                                    variant="shadow"
                                                    startContent={<TbMessage2Exclamation className='w-6 h-6' />}
                                                />
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                                {loading ? (
                                    <div className='w-full flex justify-center h-[70vh]'>
                                        <Spinner label="กำลังโหลด..." color="primary" />
                                    </div>
                                ) : (
                                    Object.keys(verifySelect).length > 0 ? (
                                        <div className={`${verifySelect?.status === 0 || verifySelect?.status === 1 || verifySelect?.status === 2 || verifySelect?.status === 3 ? 'flex relative' : ''}`}>
                                            <div className={`my-[30px] ${verifySelect?.status === 0 || verifySelect?.status === 1 || verifySelect?.status === 2 || verifySelect?.status === 3 ? 'w-[80%] 2xl:px-30 xl:pr-20' : 'w-[100%] 2xl:px-44 xl:px-20'} mt-16 max-xl:w-[100%] relative`}>
                                                <BreadCrumb />
                                                <div className=' text-xl text-black mb-5 px-5'>
                                                    <h1 className='text-3xl text-center  leading-relaxed'>แบบฟอร์มตรวจสอบการสำเร็จการศึกษา <br /> หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{verifySelect.Verify.Program.title_th} <br />(ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.Verify.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                                    <div className='text-center mt-6'>
                                                        <p>แบบฟอร์มตรวจสอบการสำเร็จการศึกษาของ <span className='text-blue-600 font-bold'>{userData.first_name} {userData.last_name}</span> รหัสประจำตัว <span className='text-blue-600 font-bold'>{userData.stu_id}</span></p>
                                                        <div className='flex justify-center items-center my-3'>
                                                            <p>คาดว่าจะได้รับปริญญาวิทยาศาสตรบัณฑิต  สาขาวิชา{verifySelect.Verify.Program.title_th} เกียรตินิยมอันดับ</p>
                                                            <div className="relative ml-2 w-[80px]">
                                                                <input
                                                                    className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                                    placeholder=" "
                                                                    type="text"
                                                                    value={verifySelect.cum_laude === 0 ? "-" : verifySelect.cum_laude}
                                                                    onChange={(e) => setCumLaude()}
                                                                    readOnly
                                                                />
                                                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                                    อันดับ
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-wrap justify-center items-center'>
                                                            <p>ภาคการศึกษา</p>
                                                            <RadioGroup
                                                                value={verifySelect.term}
                                                                onChange={[]}
                                                                orientation="horizontal"
                                                                readOnly
                                                            >
                                                                <Radio value="ต้น" className='ml-2'>ต้น</Radio>
                                                                <Radio value="ปลาย" className='ml-2' >ปลาย</Radio>
                                                                <Radio value="ฤดูร้อน" className='mx-2' >ฤดูร้อน</Radio>
                                                            </RadioGroup>
                                                            <p>ปีการศึกษา {verifySelect.acadyear}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {Object.keys(groupedSubjectsByCategory).map((categoryId, index) => {
                                                    if (index > highestIndex) {
                                                        setHighestIndex(index);
                                                    }
                                                    const { category, groups, subgroups, semisubgroups } = groupedSubjectsByCategory[categoryId];

                                                    const { totalCredits, totalGrades } = sumCate[index] || { totalCredits: 0, totalGrades: 0 };

                                                    return (
                                                        <div key={index} className='mb-5'>
                                                            <div>
                                                                <div className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-md'>
                                                                    <h2 className='text-lg text-default-800'>{index + 1}. {category?.category_title}</h2>
                                                                </div>
                                                                {Object.keys(groups).map((groupId) => {
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
                                                                                aria-label="subjects table"
                                                                            >
                                                                                <TableHeader>
                                                                                    <TableColumn>รหัสวิชา</TableColumn>
                                                                                    <TableColumn>ชื่อวิชา EN</TableColumn>
                                                                                    <TableColumn>ชื่อวิชา TH</TableColumn>
                                                                                    <TableColumn>หน่วยกิต</TableColumn>
                                                                                    <TableColumn></TableColumn>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {group.subjects && group.subjects.map((subject) => (
                                                                                        <TableRow key={subject.subject_id || subject.subject_code}>
                                                                                            <TableCell>{subject.subject_code}</TableCell>
                                                                                            <TableCell className="w-1/3">{subject.title_en}</TableCell>
                                                                                            <TableCell className="w-1/3">{subject.title_th}</TableCell>
                                                                                            <TableCell>{subject.credit}</TableCell>
                                                                                            <TableCell>
                                                                                                {subject.grade ? (
                                                                                                    <div className="relative ml-2 w-[70px]">
                                                                                                        <input
                                                                                                            className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                                                                            placeholder=" "
                                                                                                            type="text"
                                                                                                            value={subject.grade}
                                                                                                            onChange={(e) => setCumLaude()}
                                                                                                        />
                                                                                                        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                                                                            เกรด
                                                                                                        </label>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <p></p>
                                                                                                )}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {getSubg(subgroups, semisubgroups)}
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


                                                {categoryverify && categoryverify.map((categorie, catIndex) => (
                                                    <CategoryGrade
                                                        key={catIndex}
                                                        catIndex={catIndex}
                                                        categorie={categorie}
                                                        highestIndex={highestIndex}
                                                    />
                                                ))}
                                                {/* {userData.program === "IT" && (
                                                    <>
                                                        <h2 className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center mt-5 rounded-t-md text-lg text-default-800'>
                                                            กลุ่มเลือก 3 วิชา
                                                        </h2>
                                                        <ul className='overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                                            {itGrade.length > 0 ? (
                                                                <div className='bg-gray-100 rounded-md relative gap-2'>
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
                                                                            {itGrade.map((it, index) => (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{it.Subject.subject_code}</TableCell>
                                                                                    <TableCell className="w-1/3">{it.Subject.title_en}</TableCell>
                                                                                    <TableCell className="w-1/3">{it.Subject.title_th}</TableCell>
                                                                                    <TableCell>{it.Subject.credit}</TableCell>
                                                                                    <TableCell>
                                                                                        {it.grade ? (
                                                                                            <div className="relative ml-2 w-[70px]">
                                                                                                <input
                                                                                                    className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                                                                    placeholder=" "
                                                                                                    type="text"
                                                                                                    value={it.grade}
                                                                                                    onChange={(e) => setCumLaude(e.target.value)}
                                                                                                />
                                                                                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                                                                    เกรด
                                                                                                </label>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <p></p>
                                                                                        )}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            ) : (
                                                                <li className='flex justify-center items-center h-full'>
                                                                    <Empty
                                                                        description={
                                                                            <span>ไม่มีข้อมูล</span>
                                                                        }
                                                                    />
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </>
                                                )} */}

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
                                                        <Table
                                                            aria-label="วิชาในเงื่อนไข"
                                                            className={tableClassCondition}
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
                                                            className={tableClassCondition}
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
                                                        <Table
                                                            aria-label="วิชานอกเงื่อนไข"
                                                            className={tableClassCondition}
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
                                                            className={tableClassCondition}
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
                                                                    const creditClass = outsideTrackStats.totalCredits < 9 ? '' : 'bg-green-200';

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
                                                    </>
                                                )}

                                                {userData.program === "IT" && (
                                                    <>
                                                        <div className='bg-blue-100 border-blue-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                            <h2 className='text-lg text-default-800'>เงื่อนไขเฉพาะหลักสูตร IT</h2>
                                                        </div>
                                                        <Table
                                                            aria-label="เงื่อนไขเฉพาะหลักสูตร IT"
                                                            className={tableClassCondition}
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

                                                                    const { totalCredits, totalGrades, averageGrade } = getCalculatedValues(subjectTrack);

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
                                                    </>
                                                )}

                                                {conditionCategory.length > 0 ? (
                                                    <>
                                                        <div className='bg-blue-100 border-blue-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                            <h2 className='text-lg text-default-800'>เงื่อนไขหมวดหมู่วิชา</h2>
                                                        </div>
                                                        <Table
                                                            aria-label="เงื่อนไขหมวดหมู่วิชา"
                                                            className={tableClassCondition}
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
                                                    </>
                                                ) : (
                                                    <></>
                                                )}

                                                {conditions.length > 0 ? (
                                                    <>
                                                        <div className='bg-blue-100 border-blue-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                            <h2 className='text-lg text-default-800'>เงื่อนไขกลุ่มวิชา</h2>
                                                        </div>
                                                        <Table
                                                            aria-label="เงื่อนไขกลุ่มวิชา"
                                                            className={tableClassCondition}
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
                                                    </>
                                                ) : (
                                                    <></>
                                                )}

                                                {conditionSubgroup.length > 0 ? (
                                                    <>
                                                        <div className='bg-blue-100 border-blue-100 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                            <h2 className='text-lg text-default-800'>เงื่อนไขกลุ่มย่อยวิชา</h2>
                                                        </div>
                                                        <Table
                                                            aria-label="เงื่อนไขกลุ่มย่อยวิชา"
                                                            className={tableClassCondition}
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
                                                    </>
                                                ) : (
                                                    <></>
                                                )}

                                                <>
                                                    <div className='bg-blue-200 border-blue-200 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-t-large mt-5'>
                                                        <h2 className='text-lg text-default-800'>รวมหน่วยกิตและค่าคะแนนทั้งหมด</h2>
                                                    </div>
                                                    <Table
                                                        aria-label="รวมหน่วยกิตและค่าคะแนนทั้งหมด"
                                                        className={tableClassCondition}
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
                                                </>

                                                {(session.user.role === 'admin' ? verifySelect.status === 2 : verifySelect.status === 1) ? (
                                                    <>
                                                        <Textarea
                                                            label="ความคิดเห็น"
                                                            variant="bordered"
                                                            color="primary"
                                                            size="lg"
                                                            value={desc}
                                                            placeholder="เพิ่มความคิดเห็น..."
                                                            disableAnimation
                                                            disableAutosize
                                                            classNames={{
                                                                base: "w-full my-3",
                                                                input: "resize-y min-h-[80px]",
                                                            }}
                                                            onChange={handleChange}
                                                        />
                                                        <div className='flex justify-end items-end mt-3'>
                                                            <Button
                                                                type='submit'
                                                                onClick={() => {
                                                                    if (session.user.role === 'admin') {
                                                                        handleRejectAdmin(userData.stu_id);
                                                                    } else {
                                                                        handleReject(userData.stu_id);
                                                                    }
                                                                }}
                                                                color="danger"
                                                                variant="light"
                                                                size='lg'
                                                                className='text-lg mr-3'
                                                                isLoading={isSubmitting}
                                                            >
                                                                {isSubmitting ? "กำลังโหลด..." : "ไม่อนุมัติ"}
                                                            </Button>
                                                            <Button
                                                                type='submit'
                                                                onClick={() => {
                                                                    if (session.user.role === 'admin') {
                                                                        handleSubmitAdmin(userData.stu_id);
                                                                    } else {
                                                                        handleSubmit(userData.stu_id);
                                                                    }
                                                                }}
                                                                color="primary"
                                                                variant="ghost"
                                                                size='lg'
                                                                className='text-lg'
                                                                isLoading={isSubmitting}
                                                            >
                                                                {isSubmitting ? "กำลังโหลด..." : "อนุมัติ"}
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Textarea
                                                            label="ความคิดเห็น"
                                                            variant="bordered"
                                                            color={verifySelect?.status === 0 ? "danger" : "primary"}
                                                            size="lg"
                                                            value={desc}
                                                            placeholder="ไม่มีความคิดเห็น"
                                                            disableAnimation
                                                            disableAutosize
                                                            classNames={{
                                                                base: "w-full my-3",
                                                                input: "resize-y min-h-[80px]",
                                                            }}
                                                            isReadOnly

                                                        />
                                                        <div className='flex justify-end items-end mt-3'>
                                                            {verifySelect.status === 0 ? (
                                                                <Button
                                                                    color="danger"
                                                                    variant="ghost"
                                                                    size='lg'
                                                                    className='text-lg'
                                                                    isDisabled
                                                                >
                                                                    ไม่อนุมัติ
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    color="primary"
                                                                    variant="ghost"
                                                                    size='lg'
                                                                    className='text-lg'
                                                                    isDisabled
                                                                >
                                                                    อนุมัติแล้ว
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}

                                                <Drawer
                                                    title="สถานะการอนุมัติ"
                                                    onClose={onClose}
                                                    open={open}
                                                    extra={
                                                        <Space>
                                                            {verifySelect?.status === 0 && (
                                                                <div className='inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300'>
                                                                    <span className='w-3 h-3 inline-block bg-red-500 rounded-full mr-2'></span>
                                                                    ไม่อนุมัติ
                                                                </div>
                                                            )}
                                                            {(verifySelect?.status === 1 || verifySelect?.status === 2) && (
                                                                <div className='inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300'>
                                                                    <span className='w-3 h-3 inline-block bg-yellow-500 rounded-full mr-2'></span>
                                                                    รอการอนุมัติ
                                                                </div>
                                                            )}
                                                            {verifySelect?.status === 3 && (
                                                                <div className='inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>
                                                                    <span className='w-3 h-3 inline-block bg-green-500 rounded-full mr-2'></span>
                                                                    อนุมัติ
                                                                </div>
                                                            )}
                                                        </Space>
                                                    }
                                                >
                                                    {desAll.length > 0 ? (
                                                        <>
                                                            <Accordion selectionMode="multiple">
                                                                {desAll.length > 0 ? (
                                                                    desAll.map((statuss, index) => (
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
                                                            {desAll.length !== 2 && (
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
                                            <div
                                                className={`${verifySelect?.status === 0 || verifySelect?.status === 1 || verifySelect?.status === 2 || verifySelect?.status === 3 ? 'w-[20%]' : 'w-[20%]w-0'} fixed left-auto right-0 max-xl:hidden h-screen border-l border-l-gray-200/80`}
                                            >
                                                <div className='relative top-16 px-5'>
                                                    <div className='flex justify-between items-center mb-5'>
                                                        <h1 className='text-2xl'>สถานะการอนุมัติ</h1>
                                                        {verifySelect?.status === 0 && (
                                                            <div className='inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300'>
                                                                <span className='w-3 h-3 inline-block bg-red-500 rounded-full mr-2'></span>
                                                                ไม่อนุมัติ
                                                            </div>
                                                        )}
                                                        {(verifySelect?.status === 1 || verifySelect?.status === 2) && (
                                                            <div className='inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300'>
                                                                <span className='w-3 h-3 inline-block bg-yellow-500 rounded-full mr-2'></span>
                                                                รอการอนุมัติ
                                                            </div>
                                                        )}
                                                        {verifySelect?.status === 3 && (
                                                            <div className='inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>
                                                                <span className='w-3 h-3 inline-block bg-green-500 rounded-full mr-2'></span>
                                                                อนุมัติ
                                                            </div>
                                                        )}
                                                    </div>
                                                    {desAll.length > 0 ? (
                                                        <>
                                                            <Accordion selectionMode="multiple">
                                                                {desAll.length > 0 ? (
                                                                    desAll.map((statuss, index) => (
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
                                                            {desAll.length !== 2 && (
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
                                        </div>
                                    ) : (
                                        <p className='text-center mt-28'>ไม่มีข้อมูลแบบฟอร์มตรวจสอบจบ {params.id}</p>
                                    )
                                )}
                            </>
                        )}

                    </div>
                )}
            </div>
        </>
    );

}

export default Page