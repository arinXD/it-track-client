"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
import { useSession } from "next-auth/react"
import { getOptions } from '@/app/components/serverAction/TokenAction';
import TMonlicaEmail from '@/app/components/TMonlicaEmail';
import axios from 'axios';
import { Loading } from '@/app/components'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner } from '@nextui-org/react'
import { ToastContainer, toast } from "react-toastify";
import { tableClass } from '@/src/util/ComponentClass'

const Page = () => {
    const [loading, setLoading] = useState(true)
    const [verifySelect, setVerifySelect] = useState({})
    const [verifySubjects, setVerifySubjects] = useState([])
    const [userData, setUserData] = useState({})
    const [enrollments, setEnrollment] = useState([])
    const [program, setProgram] = useState([])
    const [subgroupData, setSubgroupData] = useState([]);
    const [groupData, setGroupData] = useState([]);
    const { data: session } = useSession();

    const fetchEnrollment = useCallback(async function (stu_id) {
        try {
            const URL = `/api/students/enrollments/${stu_id}`
            const option = await getOptions(URL, "GET")
            const response = await axios(option)
            const data = response.data.data
            setUserData(data)
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

    const fetchData = async function () {
        try {
            let URL = `/api/verify/selects/${userData.program}/${userData.acadyear}`
            let option = await getOptions(URL, "GET")
            const response = await axios(option)

            const data = response.data.data;
            setProgram(data?.Program)
            setVerifySelect(data);

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

            if (data?.Subjects) {
                setVerifySubjects(data.Subjects)
            } else {
                setVerifySubjects([])
            }
        } catch (error) {
            console.log(error);
            setVerifySelect({});
            setVerifySubjects([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            fetchData()
        }
    }, [userData])

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
    // console.log(userData);
    // console.log(verifySelect);
    // console.log(verifySubjects);
    // console.log(subgroupData);
    // console.log(groupData);
    console.log(groupedSubjectsByCategory);

    const getSubg = (subgroups) => {
        if (!subgroups) return undefined;
        if (Object.values(subgroups).length === 0) return undefined;
        console.log(subgroups);
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
                            </div>
                            {subgroupsWithSameGroupTitle.map((subgroup, subgroupIndex) => (
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
                                                    <TableCell>{"A"}</TableCell>
                                                    <TableCell>{0}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <ToastContainer />
                {loading ?
                    <div className='w-full flex justify-center h-[70vh]'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    !(verifySelect?.id) ?
                        <>
                            <p>รอการประกาศจากอาจารย์ครับ/ค่ะ</p>
                        </>
                        :
                        <>
                            <div className='my-[30px] 2xl:px-32'>
                                <div className='text-center text-xl text-black mb-5 px-5'>
                                    <h1 className='text-3xl'>แบบฟอร์มตรวจสอบการสำเร็จการศึกษา หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชา{program.title_th}(ตั้งแต่รหัสขึ้นต้นด้วย {verifySelect.acadyear.toString().slice(-2)} เป็นต้นไป)</h1>
                                    <h2 className='mt-6'>ขอยื่นแบบฟอร์มแสดงรายละเอียดการศึกษารายวิชาที่ได้เรียนมาทั้งหมด อย่างน้อย <span className='font-bold'>{verifySelect.main_at_least}</span> หน่วยกิต ต่องานทะเบียนและประมวลผลการศึกษา ดังต่อไปนี้คือ.—</h2>
                                </div>
                                {Object.keys(groupedSubjectsByCategory).map((categoryId, index) => {
                                    const { category, groups, subgroups } = groupedSubjectsByCategory[categoryId];
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
                                                                        <TableCell>{"A"}</TableCell>
                                                                        <TableCell>{0}</TableCell>
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
                        </>
                }
            </ContentWrap>
        </>
    );

}

export default Page;