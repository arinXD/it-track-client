"use client"

import { useCallback, useEffect, useState } from 'react'
import { Empty, message } from 'antd';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";

const InsertSubject = ({ subjects, catIndex, categorie, highestIndex, onVerifySubjChange, enrollments }) => {
    const [verifySubj, setVerifySubj] = useState([]);
    const [searchSubj, setSearchSubj] = useState("");
    const [filterSubj, setFilterSubj] = useState([]);

    useEffect(() => {
        setFilterSubj(subjects)
    }, [subjects])

    useEffect(() => {
        if (searchSubj) {
            const data = subjects.filter(e => {
                if (e.subject_code?.toLowerCase()?.includes(searchSubj.toLowerCase()) ||
                    e.title_en?.toLowerCase()?.includes(searchSubj.toLowerCase()) ||
                    e.title_th?.toLowerCase()?.includes(searchSubj.toLowerCase())) {
                    return e
                }
            })
            setFilterSubj(data)
            return
        }
        setFilterSubj(subjects)
    }, [searchSubj])



    useEffect(() => {
        onVerifySubjChange(verifySubj, categorie.category_title);
    }, [verifySubj]);

    const getEnrollmentGrade = (subjectCode) => {
        // ต้องการหา subjectCode ใน enrollments
        const enrollment = enrollments.find(e => e?.Subject?.subject_code === subjectCode);
        if (enrollment) {
            return enrollment.grade;
        }
        return "-";
    }

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
                const grade = getEnrollmentGrade(subj.subject_code);
                let result = {
                    subject_id: subj.subject_id,
                    subject_code: subj.subject_code,
                    title_th: subj.title_th,
                    title_en: subj.title_en,
                    credit: subj.credit,
                    grade: grade
                }
                data.push(result)
            }
            return data
        })
    }, [])

    const delSubj = useCallback(function (subject_code) {
        const data = verifySubj.filter(element => element.subject_code !== subject_code)
        setVerifySubj(data)
    }, [verifySubj])

    return (
        <>
            <h2 className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center mt-5 rounded-t-md text-lg text-default-800'>{catIndex + highestIndex + 2}. {categorie.category_title}</h2>
            <div className='flex flex-row gap-3'>
                <div className='w-1/2 flex flex-col'>
                    <p className='my-3'>วิชาที่ต้องการจะเพิ่ม {verifySubj.length == 0 ? undefined : <>({verifySubj.length} วิชา)</>}</p>
                    <ul className='h-[210px] overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                        {verifySubj.length > 0 ?
                            verifySubj.map((sbj, index) => (
                                <li key={index} className='bg-gray-100 rounded-md relative p-1 gap-2 border-1 border-b-gray-300'>
                                    <input
                                        readOnly
                                        className='bg-gray-100 block focus:outline-none font-bold'
                                        type="text"
                                        name="verifySubj[]"
                                        value={sbj.subject_code} />
                                    <p className='flex justify-between text-sm'>
                                        <span>{sbj.title_th}</span>
                                        <span>{getEnrollmentGrade(sbj.subject_code)}</span>
                                    </p>
                                    <IoIosCloseCircle onClick={() => delSubj(sbj.subject_code)} className="absolute top-1 right-1 w-5 h-5 cursor-pointer active:scale-95 hover:opacity-75" />
                                </li>
                            ))
                            :
                            <li className='flex justify-center items-center h-full'>
                                <Empty
                                    description={
                                        <span>ไม่มีข้อมูล</span>
                                    }
                                />
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
                                !(verifySubj.map(z => z.subject_code).includes(subject.subject_code)) &&
                                <li
                                    onClick={() => addSubj(subject)}
                                    key={index}
                                    className='bg-gray-100 rounded-md flex flex-row gap-2 p-1 border border-b-gray-300 cursor-pointer'
                                >
                                    <div className='flex flex-grow gap-2 justify-start'>
                                        <strong className='block'>{subject.subject_code}</strong>
                                        <p className='flex flex-col text-sm'>
                                            <span>{subject.title_en}</span>
                                            <span>{subject.title_th}</span>
                                        </p>
                                    </div>
                                    <div className='flex justify-end text-sm mr-2'>
                                        <p>{getEnrollmentGrade(subject.subject_code)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InsertSubject