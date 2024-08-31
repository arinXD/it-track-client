"use client"
import { useCallback, useEffect, useState, useMemo } from 'react'
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
import { useSession } from "next-auth/react"
import { getOptions } from '@/app/components/serverAction/TokenAction';
import TMonlicaEmail from '@/app/components/TMonlicaEmail';
import axios from 'axios';
import { Loading } from '@/app/components'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner, Tooltip } from '@nextui-org/react'
import { ToastContainer, toast } from "react-toastify";
import { tableClass } from '@/src/util/ComponentClass'
import { Checkbox } from "@nextui-org/checkbox";
import { calGrade, isNumber } from '@/src/util/grade';
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
import Step from './Step';

const Page = () => {
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const [subjects, setSubjects] = useState([]);

    const [conditions, setConditions] = useState([]);
    const [conditionSubgroup, setConditionSubgroup] = useState([]);
    const [conditionCategory, setConditionCategory] = useState([]);

    const [groupfirst, setGroupFirst] = useState([])
    const [group, setGroups] = useState([])

    const [testss, setTest] = useState([]);

    const { data: session } = useSession();

    const [pickSubj, setVerifySubj] = useState([]);
    const [searchSubj, setSearchSubj] = useState("");
    const [filterSubj, setFilterSubj] = useState([]);

    const [subjectTrack, setSubjectTrack] = useState([]);

    //////////// ant design ////////////

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    ////////////////////////////////// useState to verify_selection//////////////////////////////////////////////////////////////

    const [term, setTerm] = useState("")

    const handleChange = (event) => {
        setTerm(event.target.value);
    };

    const [cumlaude, setCumLaude] = useState("")

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    const fetchEnrollment = useCallback(async function (stu_id) {
        try {
            const URL = `/api/students/enrollments/${stu_id}`
            const option = await getOptions(URL, "GET")
            const response = await axios(option)
            const data = response.data.data
            setUserData(data)
            // console.log(data);
            if (data.Enrollments.length > 0) {
                setEnrollment(data.Enrollments)
            } else {
                setEnrollment([])
            }
        } catch (error) {
            setUserData({})
            setEnrollment([])
        }
    }, [])

    useEffect(() => {
        if (session?.user?.stu_id != undefined) {
            fetchEnrollment(session?.user?.stu_id)
        }
    }, [session])

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
        if (grade === "ไม่มีเกรด" ||
            (credit <= 1 && ["I", "P", "R", "S", "T", "U", "W"].includes(grade))) {
            return null;
        }

        // Return valid enrollments
        return {
            subject_code: prev?.Subject?.subject_code,
            grade: grade,
            credit: credit
        };
    }).filter(enroll => enroll !== null);

    const totalenrolls = enrolls.reduce((sum, enroll) => sum += enroll.credit, 0);

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

    // console.log(status);

    useEffect(() => {
        // fetchstdverify(ids);
        fetchConditions(ids);
        fetchConditionSubject(ids);
        fetchConditionCategory(ids);
        fetchStatus(userData?.stu_id);
    }, [ids, userData?.stu_id]);

    // console.log(conditions);
    // console.log(conditionSubgroup);


    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            fetchData()
        }
    }, [userData])

    ////////////////////////////////////////////////////////////////////////////////////////////

    const fetchSubjects = async () => {
        try {
            const url = `/api/subjects/student`
            const option = await getOptions(url, "GET")
            try {
                const res = await axios(option)
                const filterSubjects = res.data.data

                const filteredSubjects = filterSubjects.filter(subject => subject.track !== null && subject.track !== '');
                // const subjectsWithGrades = filteredSubjects.filter(subject => {
                //     const grade = getEnrollmentGrade(subject.subject_code);
                //     return grade !== "ไม่มีเกรด";
                // });
                // console.log(filterSubjects);


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
        fetchSubjects();
    }, [])


    ///////////////////////////////////////////////////////////////////////////////////////////
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

    ///////////////////////////////////////////////////////////////////
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

    const subjectCategory = studentcategory.map(category => {
        const subjectsWithGrades = category.verifySubj
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
            id: category.category_id,
            category_title: category.category_title,
            subjects: subjectsWithGrades,
            totalCredits: totalCredits,
            totalGrades: totalGrades,
            averageGrade: averageGrade
        };
    }).filter(category => category.subjects.length > 0);

    const combinedSubjectCategories = subjectCategorytest.concat(subjectCategory);


    /////////////////////// เฉพาะ IT //////////////////////////


    const subData = pickSubj.map(subject => {
        const grade = getEnrollmentGrade(subject.subject_code);
        const credit = subject.credit;

        return {
            subject_id: subject.subject_id,
            subject_code: subject.subject_code,
            grade,
            credit
        };
    });

    const getCalculatedValues = (subjectTrack) => {
        // Combine subjectTrack and subData
        const combinedData = [...subjectTrack, ...subData];

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

        // Calculate total credits, total grades, and average grade
        const totalCredits = subtrack.reduce((acc, subject) => acc + subject.credit, 0);
        const totalGrades = subtrack.reduce((acc, subject) => acc + (subject.numericGrade || 0), 0);
        const averageGrade = totalCredits ? (totalGrades / totalCredits) : 0;

        return { totalCredits, totalGrades, averageGrade };
    };



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

    // console.log(insertData);


    /////////////////////////////////////////sent to verify_selection////////////////////////////////////////////////////////////////

    const handleSubmit = useCallback(async function () {
        try {
            const url = `/api/verify/selects/${ids}/${userData.stu_id}`;

            const filteredData = insertData.map(subj => ({
                ...subj,
                subjects: subj.subjects.filter(subject => subject.grade !== null && subject.grade !== "ไม่มีเกรด")
            })).filter(subj => subj.subjects.length > 0);

            const filteredstudentcategory = studentcategory.map(category => ({
                ...category,
                verifySubj: category.verifySubj.filter(subject => subject.grade && subject.grade !== "ไม่มีเกรด")
            }));

            const cleanCircularReferences = (obj) => {
                const seen = new WeakSet();
                return JSON.parse(JSON.stringify(obj, (key, value) => {
                    if (typeof value === "object" && value !== null) {
                        if (seen.has(value)) {
                            return;
                        }
                        seen.add(value);
                    }
                    return value;
                }));
            };

            const formData = cleanCircularReferences({
                verify_id: ids,
                stu_id: userData.stu_id,
                term: term,
                cum_laude: cumlaude,
                acadyear: userData.acadyear + 4,
                status: 1,
                subjects: filteredData,
                tracksubject: subData,
                studentcategory: filteredstudentcategory
            });

            // console.log(formData);

            setIsSubmitting(true);

            const options = await getOptions(url, "POST", formData);
            const result = await axios(options);
            const { ok, message: msg } = result.data;

            // showToastMessage(ok, message);
            fetchData()
            fetchConditions(ids);
            fetchConditionSubject(ids);
            fetchStatus(userData?.stu_id);
            message.success(msg)
        } catch (error) {
            console.log(error);
            // const message = error?.response?.data?.message || error.message;
            // showToastMessage(false, message);
        }
    }, [ids, term, cumlaude, userData.stu_id, insertData, subData]);



    if (!session?.user?.stu_id) {
        return (
            <>
                <header>
                    <Navbar />
                </header>
                <Sidebar />
                <ContentWrap>
                    <div>
                        ไม่สามารถเข้าถึงข้อมูลของคุณได้ กรุณาติดต่อ <TMonlicaEmail />
                    </div>
                </ContentWrap>
            </>
        )
    }
    // console.log(enrollments);
    // console.log(verifySelect);
    // console.log(verifySubjects);
    // console.log(subgroupData);
    // console.log(groupData);
    // console.log(groupedSubjectsByCategory);

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
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='p-4 md:p-8 md:ml-[240px]'>
                <ToastContainer />
                {loading ?
                    <div className='w-full flex justify-center h-[70vh]'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    !(verifySelect?.id) ?
                        <>
                            <p className='text-center font-bold text-lg my-28'>
                                Coming soon!
                            </p>
                        </>
                        :
                        <>
                            <div className='relative'>
                                <div className='hidden max-xl:block max-xl:fixed max-xl:top-16 max-xl:right-0 mt-5 z-50'>
                                    {(status?.status === 1 || status?.status === 2) && (
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

                            <div className={`${status?.status === 1 || status?.status === 2 ? 'flex relative' : ''}`}>
                                <div className={`my-[30px] ${status?.status === 1 || status?.status === 2 ? 'w-[80%] 2xl:px-30 xl:pr-20' : 'w-[100%] 2xl:px-44 xl:px-20'} mt-16 max-xl:w-[100%] relative`}>
                                    <div className=' text-xl text-black mb-5 px-5'>
                                        <h1 className='text-3xl text-center  leading-relaxed'>แบบฟอร์มตรวจสอบการสำเร็จการศึกษา <br /> หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{program.title_th} <br />(ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                        <div className='text-center mt-6'>
                                            <p>ข้าพเจ้า {userData.first_name} {userData.last_name} รหัสประจำตัว {userData.stu_id}</p>
                                            <div className='flex justify-center items-center'>
                                                <p>คาดว่าจะได้รับปริญญาวิทยาศาสตรบัณฑิต  สาขาวิชา{program.title_th} เกียรตินิยมอันดับ</p>
                                                <div className="relative ml-2 w-[70px]">
                                                    <input
                                                        className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                        placeholder=" "
                                                        type="text"
                                                        value={cumlaude}
                                                        onChange={(e) => setCumLaude(e.target.value)}
                                                    />
                                                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                        อันดับ
                                                    </label>
                                                </div>
                                            </div>
                                            <div className='flex flex-wrap justify-center items-center'>
                                                <p>ภาคการศึกษา</p>
                                                <RadioGroup
                                                    value={term}
                                                    onChange={handleChange}
                                                    orientation="horizontal"
                                                >
                                                    <Radio value="ต้น" className='ml-2'>ต้น</Radio>
                                                    <Radio value="ปลาย" className='ml-2' >ปลาย</Radio>
                                                    <Radio value="ฤดูร้อน" className='mx-2' >ฤดูร้อน</Radio>
                                                </RadioGroup>
                                                <p>ปีการศึกษา {userData.acadyear + 4}</p>
                                            </div>
                                        </div>
                                        {(() => {
                                            const creditClassName = verifySelect.main_at_least < totalenrolls ? '' : 'text-red-400';
                                            // `font-bold ${verifySelect.main_at_least < totalenrolls ? 'text-red-500' : ''}

                                            return <h2 className='mt-6 text-center '>ขอยื่นแบบฟอร์มแสดงรายละเอียดการศึกษารายวิชาที่ได้เรียนมาทั้งหมด อย่างน้อย <span className={`font-bold ${creditClassName}`}>{verifySelect.main_at_least}</span> หน่วยกิต ต่องานทะเบียนและประมวลผลการศึกษา ดังต่อไปนี้คือ.—</h2>
                                        })()}


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

                                    {userData.program === "IT" && (
                                        <>
                                            <h2 className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center mt-5 rounded-t-md text-lg text-default-800'>วิชาเลือก 3 กลุ่ม</h2>
                                            <div className='flex flex-row gap-3'>
                                                <div className='w-1/2 flex flex-col'>
                                                    <p className='my-3'>วิชาที่ต้องการจะเพิ่ม {pickSubj.length == 0 ? undefined : <>({pickSubj.length} วิชา)</>}</p>
                                                    <ul className='h-[210px] overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                                        {pickSubj.length > 0 ?
                                                            pickSubj.map((sbj, index) => (
                                                                <li key={index} className='bg-gray-100 rounded-md relative p-1 gap-2 border-1 border-b-gray-300'>
                                                                    <input
                                                                        readOnly
                                                                        className='bg-gray-100 block focus:outline-none font-bold'
                                                                        type="text"
                                                                        name="pickSubj[]"
                                                                        value={sbj.subject_code} />
                                                                    <p className='flex flex-col text-sm'>
                                                                        <span>{sbj.title_th}</span>
                                                                    </p>
                                                                    <IoIosCloseCircle onClick={() => delSubj(sbj.subject_code)} className="absolute top-1 right-1 w-5 h-5 cursor-pointer active:scale-95 hover:opacity-75" />
                                                                </li>
                                                            ))
                                                            :
                                                            <li className='flex justify-center items-center h-full'>
                                                                <Empty />
                                                            </li>}
                                                    </ul>
                                                </div>
                                                <div className='w-1/2'>
                                                    <p className='my-3'>ค้นหาวิชาที่ต้องการ</p>
                                                    <div className='flex flex-col'>
                                                        <div className='flex flex-row relative'>
                                                            <IoSearchOutline className='absolute left-3.5 top-[25%]' />
                                                            <input
                                                                className='ps-10 py-1 rounded-md border-1 w-full px-2 focus:outline-none mb-1 focus:border-blue-500'
                                                                type="search"
                                                                value={searchSubj}
                                                                onChange={(e) => setSearchSubj(e.target.value)}
                                                                placeholder='รหัสวิชา ชื่อวิชา' />
                                                        </div>
                                                        <ul className='rounded-md border-1 h-[180px] overflow-y-auto p-2 flex flex-col gap-1'>
                                                            {filterSubj.map((subject, index) => (
                                                                !(pickSubj.map(z => z.subject_code).includes(subject.subject_code)) &&
                                                                <li onClick={() => addSubj(subject)} key={index} className='bg-gray-100 rounded-md flex flex-row gap-2 p-1 border-1 border-b-gray-300 cursor-pointer'>
                                                                    <strong className='block'>{subject.subject_code}</strong>
                                                                    <p className='flex flex-col text-sm'>
                                                                        <span>{subject.title_en}</span>
                                                                        <span>{subject.title_th}</span>
                                                                    </p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {categoryverify && categoryverify.map((categorie, catIndex) => (
                                        <InsertSubject
                                            key={catIndex}
                                            catIndex={catIndex}
                                            categorie={categorie}
                                            category_id={categorie.category_id}
                                            subjects={subjects}
                                            highestIndex={highestIndex}
                                            enrollments={enrollments}
                                            onVerifySubjChange={(verifySubj) => handleVerifySubjChange(catIndex, categorie.id, verifySubj, categorie.category_title)}
                                        />
                                    ))}

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
                                            <TableBody emptyContent={"ไม่มีเงื่อนไขหมวดหมู่วิชา"}>{[]}</TableBody>
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
                                    {(status?.status !== 1 && status?.status !== 2) && (
                                        <div className='flex justify-end items-end mt-3'>
                                            <Button
                                                type='submit'
                                                onClick={handleSubmit}
                                                color="primary"
                                                variant="ghost"
                                                size='lg'
                                                className='text-lg'
                                                isLoading={isSubmitting} // Pass `isSubmitting` to control the loading state
                                            >
                                                {isSubmitting ? "กำลังโหลด..." : "ยืนยัน"}
                                            </Button>
                                        </div>
                                    )}


                                    {/* This element will be absolutely positioned and visible on screens `max-xl` */}
                                    <Drawer title="สถานะการอนุมัติ" onClose={onClose} open={open}>
                                        <Step status={status?.status} />
                                    </Drawer>

                                </div>
                                {(status?.status === 1 || status?.status === 2) && (
                                    <div
                                        className={`${status?.status === 1 || status?.status === 2 ? 'w-[20%]' : 'w-[20%]w-0'} fixed left-auto right-0 max-xl:hidden h-screen border-l border-l-gray-200/80`}
                                    >
                                        <div className='relative top-16 px-5'>
                                            <h1 className='text-2xl'>สถานะการอนุมัติ</h1>
                                            <Step />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                }

            </div>
        </>
    );

}

export default Page;