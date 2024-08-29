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
import CategoryGrade from './CategoryGrade';
import { RadioGroup, Radio } from "@nextui-org/radio";

const Page = ({ params }) => {
    const { id } = params
    const [loading, setLoading] = useState(true)
    const [verifySelect, setVerifySelect] = useState({})
    const [verify, setVerify] = useState({})

    const [groupData, setGroupData] = useState([]);
    const [subgroupData, setSubgroupData] = useState([]);
    const [semisubgroupData, setSemiSubgroupData] = useState([]);
    const [userData, setUserData] = useState({})
    const [userDatas, setUserDatas] = useState({})
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

    const fetchEnrollment = useCallback(async function (stu_id) {
        try {
            const URL = `/api/students/enrollments/${stu_id}`
            const option = await getOptions(URL, "GET")
            const response = await axios(option)
            const data = response.data.data
            setUserDatas(data)
            // console.log(data);
            if (data.Enrollments.length > 0) {
                setEnrollment(data.Enrollments)
            } else {
                setEnrollment([])
            }
        } catch (error) {
            setUserDatas({})
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
            const result = await fetchDataObj(`/api/verifies/approve/${id}`);
            console.log(result);
            setVerifySelect(result);
            setUserData(result.Student);
            setVerify(result.Verify);


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

            console.log(categoryVerifies);
            console.log(categoryData);



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
        const result = await fetchDataObj(`/api/verifies/approve/it/${id}`)
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

                if (grade === null || grade === undefined ||
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
                const grade = subject.grade;
                const credit = subject.credit;

                if (grade === null || grade === undefined ||
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

            if (grade === "ไม่มีเกรด" || grade === null || grade === undefined ||
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

    console.log(subjectCategorytest);


    const subjectCategory = categoryverify.map(category => {
        // console.log(category);
        const subjectsWithGrades = category.subjectDetails
            .map(subject => {
                const grade = subject.grade;
                const credit = subject.Subject.credit;

                console.log(subject);

                // Check for invalid grades or low credits
                if (grade === "ไม่มีเกรด" ||
                    (credit <= 1 && ["I", "P", "R", "S", "T", "U", "W"].includes(grade))) {
                    return null;
                }

                const calculatedGrade = calGrade(grade);

                return {
                    subject_code: subject.Subject.subject_code,
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
            id: category.category.id,
            category_title: category.category.category_title,
            subjects: subjectsWithGrades,
            totalCredits: totalCredits,
            totalGrades: totalGrades,
            averageGrade: averageGrade
        };
    }).filter(category => category.subjects.length > 0);

    const combinedSubjectCategories = subjectCategorytest.concat(subjectCategory);


    const handleSubmit = useCallback(async function (stu_id) {
        try {

            const url = `/api/verifies/approve/status/${stu_id}`;

            const formData = {
                stu_id: stu_id,
            };

            // console.log(formData);
            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;

            // showToastMessage(ok, message);
            initVerify(id);
            initItGrade(id)
            if (verify.id) fetchConditions(verify.id)
            if (verify.id) fetchConditionSubgroups(verify.id)
            message.success(msg)
        } catch (error) {
            console.log(error);
        }
    }, [id, verify.id]);



    useEffect(() => {
        setLoading(false);
        initVerify(id);
        initItGrade(id)
        if (verify.id) fetchConditions(verify.id)
        if (verify.id) fetchConditionSubgroups(verify.id)
        if (verify.id) fetchConditionCategory(verify.id)
    }, [verify.id, fetchConditions, fetchConditionSubgroups, fetchConditionCategory])

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
                                <TableRow key={subjectIndex} className={subject.track == null ? 'bg-red-50' : ''}>
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
                {!verifySelect ? (
                    <p>No data</p>
                ) : (
                    <div>
                        <ToastContainer />
                        {loading ? (
                            <div className='w-full flex justify-center h-[70vh]'>
                                <Spinner label="กำลังโหลด..." color="primary" />
                            </div>
                        ) : (
                            <>
                                {Object.keys(verifySelect).length > 0 ? (
                                    <div className='my-[30px] 2xl:px-44 xl:px-20'>
                                        <div className=' text-xl text-black mb-5 px-5'>
                                            <h1 className='text-3xl text-center  leading-relaxed'>แบบฟอร์มตรวจสอบการสำเร็จการศึกษา <br /> หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{verifySelect.Verify.Program.title_th} <br />(ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.Verify.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                            <div className='text-center mt-6'>
                                                <p>แบบฟอร์มตรวจสอบการสำเร็จการศึกษาของ <span className='text-blue-600 font-bold'>{userData.first_name} {userData.last_name}</span> รหัสประจำตัว <span className='text-blue-600 font-bold'>{userData.stu_id}</span></p>
                                                <div className='flex justify-center items-center my-3'>
                                                    <p>คาดว่าจะได้รับปริญญาวิทยาศาสตรบัณฑิต  สาขาวิชา{verifySelect.Verify.Program.title_th} เกียรตินิยมอันดับ</p>
                                                    <div className="relative ml-2 w-[70px]">
                                                        <input
                                                            className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                            placeholder=" "
                                                            type="text"
                                                            value={verifySelect.cum_laude}
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
                                            return (
                                                <div key={categoryId} className='mb-5'>
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
                                        {userData.program === "IT" && (
                                            <>
                                                <h2 className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center mt-5 rounded-t-md text-lg text-default-800'>
                                                    กลุ่มเลือก 3 วิชา
                                                </h2>
                                                <ul className='h-full overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
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
                                                            <Empty />
                                                        </li>
                                                    )}
                                                </ul>
                                            </>
                                        )}
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
                                        <Table
                                            classNames={tableClass}
                                            removeWrapper
                                            onRowAction={() => { }}
                                            aria-label="condition category"
                                            className='mt-5'
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

                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell>{conditionCategory?.Categorie?.category_title}</TableCell>
                                                                <TableCell>{conditionCategory.credit}</TableCell>
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
                                                    <TableColumn>หน่วยกิตที่ลงทะเบียนทั้งหมด</TableColumn>
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
                                        {verifySelect.status === 1 ? (
                                            <Button type='submit' onClick={() => handleSubmit(userData.stu_id)} className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid'>
                                                อนุมัติ
                                            </Button>
                                        ) : (
                                            <p>อนุมัติแล้ว</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className='text-center'>ไม่มีข้อมูลแบบฟอร์มตรวจสอบจบ {params.id}</p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </ContentWrap>
        </>
    );

}

export default Page