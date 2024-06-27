"use client"
import { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
import { useSession } from "next-auth/react"
import { getOptions } from '@/app/components/serverAction/TokenAction';
import TMonlicaEmail from '@/app/components/TMonlicaEmail';
import axios from 'axios';
import { Loading } from '@/app/components'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner } from '@nextui-org/react'
import { ToastContainer, toast } from "react-toastify";
import { tableClass } from '@/src/util/ComponentClass'
import { Checkbox } from "@nextui-org/checkbox";
import { calGrade, isNumber } from '@/src/util/grade';
import { Empty, message } from 'antd';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import InsertSubject from './InsertSubject';

const Page = () => {
    const [loading, setLoading] = useState(true)
    const [verifySelect, setVerifySelect] = useState({})
    const [verifySubjects, setVerifySubjects] = useState([])
    const [userData, setUserData] = useState({})
    const [enrollments, setEnrollment] = useState([])
    const [program, setProgram] = useState([])
    const [subgroupData, setSubgroupData] = useState([]);
    const [groupData, setGroupData] = useState([]);

    const [categoryverify, setCategoryVerifies] = useState([])
    const [highestIndex, setHighestIndex] = useState(0);

    const [subjects, setSubjects] = useState([]);

    const { data: session } = useSession();

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    const fetchEnrollment = useCallback(async function (stu_id) {
        try {
            const URL = `/api/students/enrollments/${stu_id}`
            const option = await getOptions(URL, "GET")
            const response = await axios(option)
            const data = response.data.data
            setUserData(data)
            console.log(data);
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

    const getEnrollmentGrade = (subjectCode) => {
        // ต้องการหา subjectCode ใน enrollments
        const enrollment = enrollments.find(e => e?.Subject?.subject_code === subjectCode);
        if (enrollment) {
            return enrollment.grade;
        }
        return "ไม่มีเกรด";
    }

    ////////////////////////////////////////////////////////////////////////////////////////

    const fetchData = async function () {
        try {
            let URL = `/api/verify/selects/${userData.program}/${userData.acadyear}`
            let option = await getOptions(URL, "GET")
            const response = await axios(option)

            const data = response.data.data;
            setProgram(data?.Program)
            setVerifySelect(data);
            const categoryverifies = data.CategoryVerifies.map(categoryVerify => categoryVerify.Categorie);
            setCategoryVerifies(categoryverifies);

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

    ////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const url = `/api/subjects/student`
                const option = await getOptions(url, "GET")
                try {
                    const res = await axios(option)
                    const filterSubjects = res.data.data
                    setSubjects(filterSubjects)
                } catch (error) {
                    setSubjects([])
                    return
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };
        fetchSubjects();
    }, [])


    ///////////////////////////////////////////////////////////////////////////////////////////
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
    // console.log(groupedSubjectsByCategory);

    const getSubTrack = (subgroup, subgroupIndex) => {
        // console.log(subgroup);
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

    const getSubg = (subgroups) => {
        if (!subgroups) return undefined;
        if (Object.values(subgroups).length === 0) return undefined;
        // console.log(subgroups);
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
                            <div className='my-[30px] 2xl:px-44 xl:px-20'>
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
                                                />
                                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                    อันดับ
                                                </label>
                                            </div>
                                        </div>
                                        <div className='flex flex-wrap justify-center items-center'>
                                            <p>ภาคการศึกษา</p>
                                            <Checkbox className='ml-2'>ต้น</Checkbox>
                                            <Checkbox className='ml-2'>ปลาย</Checkbox>
                                            <Checkbox className='mx-2'>ฤดูร้อน</Checkbox>
                                            <p>ปีการศึกษา {userData.acadyear}</p>
                                        </div>
                                    </div>
                                    <h2 className='mt-6 text-center '>ขอยื่นแบบฟอร์มแสดงรายละเอียดการศึกษารายวิชาที่ได้เรียนมาทั้งหมด อย่างน้อย <span className='font-bold'>{verifySelect.main_at_least}</span> หน่วยกิต ต่องานทะเบียนและประมวลผลการศึกษา ดังต่อไปนี้คือ.—</h2>
                                </div>
                                {Object.keys(groupedSubjectsByCategory).map((categoryId, index) => {
                                    const { category, groups, subgroups } = groupedSubjectsByCategory[categoryId];
                                    if (index > highestIndex) {
                                        setHighestIndex(index);
                                    }
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
                                                getSubg(subgroups)
                                            }
                                        </div>
                                    );
                                })}
                                {categoryverify && categoryverify.map((categorie, catIndex) => (
                                    <InsertSubject
                                        key={catIndex}
                                        catIndex={catIndex}
                                        categorie={categorie}
                                        subjects={subjects}
                                        highestIndex={highestIndex}
                                    />
                                ))}
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