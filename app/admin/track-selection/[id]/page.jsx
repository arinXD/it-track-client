"use client"
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../../action'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Tab, Tabs, Input, Spinner, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from "@nextui-org/react";
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentTrackTable from './StudentTrackTable';
import { inputClass, minimalTableClass } from '@/src/util/ComponentClass';
import { getCurrentDate } from '@/src/util/dateFormater';
import { DeleteIcon2 } from '@/app/components/icons';
import { FaPlay } from "react-icons/fa";
import { FaRegCircleStop } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import TrackSubjectTable from './TrackSubjectTable';
import { FiDownload } from "react-icons/fi";
import { calGrade, floorGpa, isNumber } from '@/src/util/grade';
import { utils, writeFile } from "xlsx";
import { Empty, message } from 'antd';
import { RiMailSendLine } from "react-icons/ri";
import InsertSubjectModal from './InsertSubjectModal';
import moment from 'moment-timezone';

const Page = ({ params }) => {
    const swal = useCallback(Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue-500 text-white ms-3 hover:bg-blue-600",
            cancelButton: "btn bg-white border-1 border-blue-500 text-blue-500 hover:bg-gray-100 hover:border-blue-500"
        },
        buttonsStyling: false
    }), [])

    const showToastMessage = useCallback((ok, message) => {
        if (ok) {
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.warning(message, {
                position: toast.POSITION.TOP_RIGHT,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [])

    const { id } = params
    const [loading, setLoading] = useState(true)
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [trackSubj, setTrackSubj] = useState([])
    const [trackSelect, setTrackSelect] = useState({})
    const [studentsBit, setStudentsBit] = useState({})
    const [studentsNetwork, setStudentsNetwork] = useState({})
    const [studentsWeb, setStudentsWeb] = useState({})
    const [studentsSelect, setStudentsSelect] = useState([])
    const [allTrack, setAllTrack] = useState([])
    const [tracks, setTracks] = useState([])
    const [selectedTrack, setSelectedTrack] = useState("all");
    const [sendingEmail, setSendingEmail] = useState(false);

    const [starting, setStarting] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const [title, setTitle] = useState("")
    const [startAt, setStartAt] = useState("")
    const [expiredAt, setExpiredAt] = useState("")
    const [announcementDate, setAnnouncementDate] = useState("")
    const [hasFinished, setHasFinished] = useState("")
    const [valueChange, setValueChange] = useState(false)
    const [rendering, setRendering] = useState(false);

    const initTrackSelect = useCallback(async function (id) {
        try {
            // moment.tz.setDefault('Asia/Bangkok');
            const option = await getOptions(`/api/tracks/selects/${id}/subjects/students`, "GET")
            const result = (await axios(option)).data.data
            setTrackSelect(result)
            setTrackSubj(result?.Subjects)
        } catch (err) {
            console.error("Error on init func:", err);
        }
    }, [])

    const [nonSelectStudent, setNonSelectStudent] = useState([]);

    const getStudentNonSelect = useCallback(async (id) => {
        try {
            const students = await fetchData(`/api/tracks/selects/${id}/non-select`)
            setNonSelectStudent(students)
        } catch (error) {
            setNonSelectStudent([])
        }
    }, [])

    const cb = useCallback(async (acadyear) => {
        await initTrackSelect(acadyear)
        await getStudentNonSelect(acadyear)
    }, [])

    const getTracks = useCallback(async function () {
        let tracks = await fetchData(`/api/tracks/all`)
        if (tracks?.length) {
            tracks = tracks.map(track => track.track)
        } else {
            tracks = []
        }
        setTracks(tracks)
    }, [])

    useEffect(() => {
        setLoading(true)
        initTrackSelect(id)
        getStudentNonSelect(id)
        getTracks()
        setLoading(false)
    }, []);

    const getStudentCount = useCallback(function (studentData) {
        const studentCount = {
            students: studentData,
            normal: studentData.filter(stu => stu?.Student?.courses_type === "โครงการปกติ").length,
            vip: studentData.filter(stu => stu?.Student?.courses_type === "โครงการพิเศษ").length
        }
        return studentCount
    }, [])

    useEffect(() => {
        if (Object.keys(trackSelect).length > 0) {
            setTitle(trackSelect.title)
            setStartAt(format(new Date(trackSelect?.startAt), 'yyyy-MM-dd HH:mm'))
            setExpiredAt(format(new Date(trackSelect?.expiredAt), 'yyyy-MM-dd HH:mm'))
            const announcement = trackSelect?.announcementDate ? moment(trackSelect?.announcementDate).format('YYYY-MM-DD HH:mm') : null
            setAnnouncementDate(announcement)
            setHasFinished(trackSelect.has_finished)

            const stuBit = trackSelect?.Selections?.filter(select => select.result == "BIT")
            const stuNetwork = trackSelect?.Selections?.filter(select => select.result == "Network")
            const stuWeb = trackSelect?.Selections?.filter(select => select.result == "Web and Mobile")
            const all = trackSelect?.Selections?.filter(select => select.result != null)
            const stuSelect = trackSelect?.Selections?.filter(select => select.result == null)

            setAllTrack(getStudentCount(all))
            setStudentsBit(getStudentCount(stuBit))
            setStudentsNetwork(getStudentCount(stuNetwork))
            setStudentsWeb(getStudentCount(stuWeb))
            setStudentsSelect(getStudentCount(stuSelect))
        }
    }, [trackSelect]);

    const handleUpdate = useCallback(async function () {
        swal.fire({
            text: `ต้องการแก้ไขข้อมูลการคัดแทร็กปีการศึกษา ${trackSelect.acadyear} หรือไม่`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                setUpdating(true)
                const url = `/api/tracks/selects/${id}`
                const data = {
                    title,
                    startAt,
                    expiredAt,
                    announcementDate,
                    has_finished: hasFinished,
                }
                const options = await getOptions(url, "PUT", data)
                try {
                    const result = await axios(options)
                    const { ok, message } = result.data
                    showToastMessage(ok, message)
                    initTrackSelect(trackSelect.acadyear)
                    setValueChange(false)
                } catch (error) {
                    showToastMessage(false, "message")
                } finally {
                    setUpdating(false)
                }
            }
        });
    }, [
        trackSelect,
        id,
        title,
        startAt,
        expiredAt,
        announcementDate,
        hasFinished,
    ])

    const handleStartSelect = useCallback(async function ({ id, hasFinished }) {
        swal.fire({
            text: `ต้องการ${hasFinished ? "เปิดการคัดเลือก" : "ปิดการคัดเลือก"}หรือไม่?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                setStarting(true)
                const url = `/api/tracks/selects/selected/${id}`
                const options = await getOptions(url, 'PUT')
                try {
                    const result = await axios(options)
                    const { ok, message } = result.data
                    showToastMessage(ok, message)
                    initTrackSelect(trackSelect.acadyear)
                } catch (error) {
                    console.error(error);
                    showToastMessage(false, "message")
                } finally {
                    setValueChange(false)
                    setStarting(false)
                }
            }
        });
    }, [trackSelect])

    const isDefaultValueChange = useCallback(function (newValue) {
        const changeCount = Object.keys(newValue).filter(stateKey => {
            return newValue[stateKey] !== trackSelect[stateKey];
        });
        return changeCount.length > 0;
    }, [trackSelect])

    const handleValueChange = useCallback(function (newValue) {
        const state = {
            title,
            startAt,
            expiredAt,
            announcementDate,
            has_finished: hasFinished
        }
        const newState = { ...state, ...newValue }

        const isChange = isDefaultValueChange(newState);

        if (isChange) {
            setValueChange(true)
        } else {
            setValueChange(false)
        }
    }, [
        title,
        startAt,
        expiredAt,
        announcementDate,
        hasFinished,
    ])

    const handleUnsave = useCallback(function () {
        setTitle(trackSelect.title)
        setStartAt(moment(trackSelect.startAt).format('YYYY-MM-DD HH:mm'))
        setExpiredAt(moment(trackSelect.expiredAt).format('YYYY-MM-DD HH:mm'))
        const announcement = trackSelect.announcementDate ? moment(trackSelect.announcementDate).format('YYYY-MM-DD HH:mm') : null
        setAnnouncementDate(announcement)
        document.querySelector("#announcementDate").value = null
        setHasFinished(trackSelect.has_finished)
        setValueChange(false)
    }, [trackSelect])

    const handleDelete = useCallback(async function () {
        swal.fire({
            text: `ต้องการลบการคัดแทร็กปีการศึกษา ${trackSelect.acadyear} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = `/api/tracks/selects/${trackSelect.acadyear}`
                const options = await getOptions(url, 'DELETE')
                setDeleting(true)
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        showToastMessage(ok, message)
                        setTimeout(() => {
                            window.location.href = "/admin/track-selection"
                        }, 1500)
                    })
                    .catch(error => {
                        const message = error.response.data.message
                        showToastMessage(false, message)
                    })
                    .finally(() => {
                        setDeleting(false)
                    })
            }
        });
    }, [trackSelect])

    const displayResult = useMemo(() => {
        const selecteData = {
            "all": {
                studentData: allTrack,
                track: "ทุกแทร็ก"
            },
            "BIT": {
                studentData: studentsBit,
                track: "BIT"
            },
            "Network": {
                studentData: studentsNetwork,
                track: "Network"
            },
            "Web and Mobile": {
                studentData: studentsWeb,
                track: "Web and Mobile"
            },
        }
        const data = selecteData[selectedTrack] || undefined
        if (!data) return
        return (
            <StudentTrackTable
                trackSubj={trackSubj}
                studentData={data.studentData}
                track={data.track} />
        )
    }, [
        selectedTrack,
        allTrack,
        studentsBit,
        studentsNetwork,
        studentsWeb,
        trackSubj,
    ])

    const downloadTrack = useCallback(async function (trackSelect) {

        function getWorkSheet(data) {
            return utils.json_to_sheet(data);
        }

        function sortByScore(data) {
            data.sort((a, b) => {
                const scoreA = parseFloat(a.Score);
                const scoreB = parseFloat(b.Score);

                if (scoreA < scoreB) {
                    return 1;
                }
                if (scoreA > scoreB) {
                    return -1;
                }
                return 0;
            });
            const result = data.map((row, index) => ({
                ...row,
                "No.": index + 1
            }))
            return result
        }

        function getResult(data) {
            let output = []
            for (const [index, select] of data.entries()) {
                const student = {
                    "No.": index + 1,
                    stuid: select?.Student?.stu_id,
                    email: select?.Student?.email,
                    name: select?.Student?.first_name + " " + select?.Student?.last_name,
                    program: select?.Student?.courses_type
                }
                const grade = allSubjects.map(subj => {
                    const gradeValue = {}
                    gradeValue[subj] = null
                    return gradeValue
                })
                let score = 0
                for (const detail of select?.SelectionDetails) {
                    const subjCode = detail?.Subject?.subject_code
                    grade[subjCode] = detail?.grade
                    const gradeValue = calGrade(detail?.grade)
                    if (isNumber(gradeValue)) {
                        score += gradeValue * (detail?.Subject?.credit || 3)
                    }
                }
                delete grade["0"]
                delete grade["1"]
                delete grade["2"]
                delete grade["3"]
                score = floorGpa(score / 12)
                const result = {
                    OR01: select?.track_order_1 || "-",
                    OR02: select?.track_order_2 || "-",
                    OR03: select?.track_order_3 || "-",
                    Result: select?.result
                }
                output.push({
                    ...student,
                    ...grade,
                    Score: score,
                    ...result
                })
            }
            return sortByScore(output)
        }

        function sortByStuid(array) {
            return array.sort((a, b) => {
                const idA = parseFloat(a.stuid);
                const idB = parseFloat(b.stuid);

                if (idA > idB) {
                    return 1;
                }
                if (idA < idB) {
                    return -1;
                }
                return 0;
            });
        }
        function getNo(array, type = "reg") {
            return array.map((row, index) => {
                const no = type === "reg" ? "No." : "No. ";
                return {
                    [no]: index + 1,
                    ...row
                };
            });
        }

        const allSubjects = trackSubj?.map(subject => subject.subject_code)
        let data
        let ws
        const wb = utils.book_new();
        const selections = trackSelect?.Selections
        const tracks = {
            "BIT": 1,
            "Web and Mobile": 2,
            "Network": 3,
            "1": "BIT",
            "2": "Web and Mobile",
            "3": "Network",
        }

        data = []
        for (const select of selections) {
            const selectData = {
                stuid: select?.Student?.stu_id,
                name: select?.Student?.first_name + " " + select?.Student?.last_name,
                program: select?.Student?.courses_type == "โครงการปกติ" ? "ภาคปกติ" : "โครงการพิเศษ",
                acadyear: select?.Student?.acadyear,
            }
            for (const detail of select?.SelectionDetails) {
                const detailData = {
                    subjectCode: detail?.Subject?.subject_code,
                    subjectName: detail?.Subject?.title_th,
                    grade: detail?.grade,
                }
                data.push({
                    ...selectData,
                    ...detailData
                })
            }
        }
        ws = getWorkSheet(data.filter(row => row.stuid))
        utils.book_append_sheet(wb, ws, 'Grade');

        data = selections.map(select => {
            return {
                email: select?.Student?.email,
                stuid: select?.Student?.stu_id,
                name: select?.Student?.first_name + " " + select?.Student?.last_name,
                ORCode1: tracks[select?.track_order_1] || "-",
                ORCode2: tracks[select?.track_order_2] || "-",
                ORCode3: tracks[select?.track_order_3] || "-",
                OR01: tracks[tracks[select?.track_order_1]] || "-",
                OR02: tracks[tracks[select?.track_order_2]] || "-",
                OR03: tracks[tracks[select?.track_order_3]] || "-",
            }
        }).filter(row => row.stuid)
        ws = getWorkSheet(data)
        utils.book_append_sheet(wb, ws, 'Selection');

        const reg = selections?.filter(select => select?.Student?.courses_type == "โครงการปกติ")
        const regData = getResult(reg)
        let regDataFilterKey = regData.map(obj => {
            const newObj = { ...obj };
            delete newObj.program;
            return newObj;
        });
        ws = getWorkSheet(regDataFilterKey)
        utils.book_append_sheet(wb, ws, 'REG');

        const spe = selections?.filter(select => select?.Student?.courses_type == "โครงการพิเศษ")
        const speData = getResult(spe)
        let speDataFilterKey = speData.map(obj => {
            const newObj = { ...obj };
            delete newObj.program;
            return newObj;
        });
        ws = getWorkSheet(speDataFilterKey)
        utils.book_append_sheet(wb, ws, 'SPE');

        // all
        const sorceKey = ["No.", "stuid", "email", "name", "program", "Score", "GPA", "Result"]
        const studentGpa = await fetchData(`/api/students/enrollments/${trackSelect.acadyear}/gpa/all`)
        const all = [...regData, ...speData].map(row => {
            const targerData = {}
            for (const key of Object.keys(row)) {
                if (sorceKey.includes(key)) {
                    if (key == "Result") {
                        targerData.GPA = floorGpa(studentGpa.filter(stuGpa => stuGpa.stuid == row.stuid)[0]?.gpa || 0.00)
                        targerData[key] = row[key]
                    } else if (key == "program") {
                        targerData[key] = row[key] == "โครงการปกติ" ? "Regular" : "Special"
                    } else {
                        targerData[key] = row[key]
                    }
                }
            }
            return targerData
        })
        ws = getWorkSheet(all)
        utils.book_append_sheet(wb, ws, 'All');

        //  announce
        regDataFilterKey = regData.map(obj => {
            return {
                "รหัสนักศึกษา": obj.stuid,
                "ชื่อ - สกุล": obj.name,
                Track: obj.Result
            };
        });
        speDataFilterKey = speData.map(obj => {
            return {
                "รหัสนักศึกษา ": obj.stuid,
                "ชื่อ - สกุล ": obj.name,
                "Track ": obj.Result
            };
        });
        const regArr = getNo(sortByStuid(regDataFilterKey))
        const speArr = getNo(sortByStuid(speDataFilterKey), "spe")
        const minLength = Math.min(regArr?.length || 0, speArr?.length || 0);
        const [maxArr, minArr] = speArr.length == minLength ? [regArr, speArr] : [speArr, regArr]
        const announce = []

        for (let index = 0; index < maxArr.length; index++) {
            if (index >= minLength) {
                announce.push(maxArr[index]);
            } else {
                announce.push({
                    ...maxArr[index],
                    " ": null,
                    ...minArr[index]
                });
            }
        }
        const header = ["ภาคปกติ", "", "", "", "", "โครงการพิเศษ"];
        const newHeader = Object.keys(announce[0]);
        const merges = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Merge cells from A1 to D1
            { s: { r: 0, c: 5 }, e: { r: 0, c: 8 } }  // Merge cells from F1 to I1
        ];

        ws = utils.aoa_to_sheet([header, newHeader])
        ws['!merges'] = merges;

        // Add data to the worksheet
        utils.sheet_add_json(ws, announce, {
            skipHeader: true,
            origin: -1 // Start adding data from the last row
        });

        utils.book_append_sheet(wb, ws, 'Announce');

        try {
            writeFile(wb, `Track_${trackSelect.acadyear}.xlsx`);
        } catch (error) {
            console.error('Error exporting Excel:', error);
        }
    }, [trackSubj])

    const handleSendingEmail = useCallback(async (acadyear) => {
        swal.fire({
            text: `ต้องการส่งอีเมลแจ้งเตือนแทร็กหรือไม่`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const option = await getOptions(`/api/tracks/selects/${acadyear}/email/send`, "post")
                try {
                    setSendingEmail(true)
                    await axios(option)
                    message.success("ส่งอีเมลแจ้งเตือนสำเร็จ")
                } catch (error) {
                    console.log(error);
                    message.warning("ไม่สามารถส่งอีเมลแจ้งเตือนได้")
                } finally {
                    setSendingEmail(false)
                }
            }
        });

    }, [])

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                {!trackSelect ?
                    <p>No data</p>
                    :
                    <div>
                        <ToastContainer />
                        {loading ?
                            <div className='w-full flex justify-center h-[70vh]'>
                                <Spinner label="กำลังโหลด..." color="primary" />
                            </div>
                            :
                            Object.keys(trackSelect).length > 0 ?
                                <div className='space-y-6 mt-6'>

                                    <div className='bg-white border-1 p-4 flex flex-col justify-start items-center gap-2 rounded-[10px]'>
                                        <h1 className='w-[100%] font-bold text-base'>
                                            {title}
                                        </h1>
                                        <hr className='my-3 w-full border-t-1 border-t-gray-300 ' />
                                        <div className='grid grid-cols-3 justify-stretch justify-items-stretch gap-4 w-full'>
                                            <div className='space-y-3 rounded-md w-full col-span-3 max-lg:col-span-3'>
                                                <div className='w-full flex justify-start items-center gap-4'>
                                                    <Input
                                                        type="text"
                                                        variant="bordered"
                                                        radius='sm'
                                                        label="ปีการศึกษา"
                                                        placeholder="กรอกปีการศึกษา"
                                                        labelPlacement="outside"
                                                        value={trackSelect.acadyear}
                                                        isReadOnly
                                                        classNames={inputClass}
                                                    />
                                                </div>
                                                <div className='w-full flex flex-col md:flex-row gap-4 justify-between items-center'>
                                                    <div className='w-full flex justify-start items-center gap-4'>
                                                        <Input
                                                            type='datetime-local'
                                                            label="เริ่มต้น"
                                                            variant="bordered"
                                                            radius='sm'
                                                            placeholder="เดือน/วัน/ปี"
                                                            labelPlacement="outside"
                                                            value={startAt}
                                                            classNames={inputClass}
                                                            onChange={(e) => {
                                                                setStartAt(e.target.value)
                                                                const nextWeek = new Date(e.target.value);
                                                                nextWeek.setDate(nextWeek.getDate() + 7);
                                                                setExpiredAt(format(nextWeek, 'yyyy-MM-dd\'T\'HH:mm'));

                                                                nextWeek.setDate(nextWeek.getDate() + 7);
                                                                setAnnouncementDate(format(nextWeek, 'yyyy-MM-dd\'T\'HH:mm'));

                                                                handleValueChange({ startAt: e.target.value })
                                                            }}
                                                            min={getCurrentDate()}
                                                        />
                                                    </div>
                                                    <div className='w-full flex justify-start items-center gap-4'>
                                                        <Input
                                                            type='datetime-local'
                                                            label="สิ้นสุด"
                                                            variant="bordered"
                                                            radius='sm'
                                                            placeholder="เดือน/วัน/ปี"
                                                            labelPlacement="outside"
                                                            value={expiredAt}
                                                            classNames={inputClass}
                                                            onChange={(e) => {
                                                                setExpiredAt(e.target.value)
                                                                const nextWeek = new Date(e.target.value);
                                                                nextWeek.setDate(nextWeek.getDate() + 7);
                                                                setAnnouncementDate(format(nextWeek, 'yyyy-MM-dd\'T\'HH:mm'));
                                                                handleValueChange({ expiredAt: e.target.value })
                                                            }}
                                                            min={startAt}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='w-full flex gap-4 justify-between items-center'>
                                                    <div className='w-full flex justify-start items-center'>
                                                        <Input
                                                            id='announcementDate'
                                                            type='datetime-local'
                                                            label="วันประกาศผล"
                                                            variant="bordered"
                                                            radius='sm'
                                                            placeholder="วันประกาศผล"
                                                            labelPlacement="outside"
                                                            value={announcementDate || null}
                                                            classNames={inputClass}
                                                            onChange={(e) => {
                                                                setAnnouncementDate(e.target.value)
                                                                handleValueChange({ startAt: e.target.value })
                                                            }}
                                                            min={expiredAt}
                                                        />
                                                    </div>
                                                    <div className='w-full hidden md:block'>

                                                    </div>
                                                </div>
                                                <div className='w-full flex justify-start items-center gap-2'>
                                                    <span className='block text-sm'>สถานะ: </span>
                                                    <span className='text-sm'>
                                                        <Chip color={`${hasFinished ? "danger" : "warning"}`} variant="solid">
                                                            {hasFinished ?
                                                                <>สิ้นสุดการคัดเลือก</>
                                                                :
                                                                <>กำลังดำเนินการ</>
                                                            }
                                                        </Chip>
                                                    </span>
                                                </div>
                                                <div className='flex flex-row justify-start items-center gap-3 border-t-1 border-gray-300 pt-3 flex-wrap'>
                                                    <div className={!valueChange ? "cursor-not-allowed" : ""}>
                                                        <Button
                                                            size='sm'
                                                            radius='sm'
                                                            color="default"
                                                            isLoading={updating}
                                                            isDisabled={!valueChange}
                                                            onClick={handleUpdate}
                                                            startContent={<FaSave className='w-3 h-3' />}
                                                            className='bg-gray-300'>
                                                            {updating ? "ยืนยันการแก้ไข..." : "ยืนยันการแก้ไข"}
                                                        </Button>
                                                    </div>
                                                    <div className={!valueChange ? "cursor-not-allowed" : ""}>
                                                        <Button
                                                            size='sm'
                                                            radius='sm'
                                                            color="default"
                                                            isDisabled={!valueChange}
                                                            onClick={handleUnsave}
                                                            startContent={<CiUndo className='w-4 h-4' />}
                                                            className='bg-gray-300'>
                                                            ยกเลิกการแก้ไข
                                                        </Button>
                                                    </div>
                                                    {!(trackSelect.has_finished) ?
                                                        <Button
                                                            size='sm'
                                                            radius='sm'
                                                            color="default"
                                                            isLoading={starting}
                                                            onPress={() => handleStartSelect({ id: trackSelect.id, hasFinished: trackSelect.has_finished })}
                                                            variant="solid"
                                                            startContent={<FaRegCircleStop />}
                                                            className='bg-gray-300'>
                                                            {starting ? "ปิดการคัดเลือก..." : "ปิดการคัดเลือก"}
                                                        </Button>
                                                        :
                                                        <Button
                                                            size='sm'
                                                            radius='sm'
                                                            color="default"
                                                            isLoading={starting}
                                                            onPress={() => handleStartSelect({ id: trackSelect.id, hasFinished: trackSelect.has_finished })}
                                                            variant="solid"
                                                            startContent={<FaPlay className='' />}
                                                            className='bg-gray-300'>
                                                            {starting ? "เปิดการคัดเลือก..." : "เปิดการคัดเลือก"}
                                                        </Button>}
                                                    <Button
                                                        size='sm'
                                                        radius='sm'
                                                        color="default"
                                                        isDisabled={deleting}
                                                        isLoading={deleting}
                                                        onPress={handleDelete}
                                                        variant="solid"
                                                        startContent={<DeleteIcon2 className="w-5 h-5" />}
                                                        className='bg-gray-300'>
                                                        ลบ
                                                    </Button>
                                                    <Button
                                                        size='sm'
                                                        radius='sm'
                                                        color="default"
                                                        isDisabled={sendingEmail}
                                                        isLoading={sendingEmail}
                                                        onPress={() => handleSendingEmail(trackSelect?.acadyear)}
                                                        variant="solid"
                                                        startContent={<RiMailSendLine className="w-4 h-4" />}
                                                        className='bg-gray-300'>
                                                        ส่งอีเมลแจ้งเตือน
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        !parseInt(studentsBit?.normal + studentsNetwork?.normal + studentsWeb?.normal) ? null :
                                            <>
                                                <h2 className='mt-6 text-center text-2xl font-bold'>จำนวนนักศึกษาในแต่ละแทร็ก</h2>
                                                <div className='grid grid-cols-3 gap-8 max-xl:grid-cols-2 max-lg:grid-cols-1'>

                                                    {/* 1 */}
                                                    <div className="bg-gradient-to-br from-gray-50 border rounded-large p-6">

                                                        <div style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
                                                            className="mx-auto  w-[6em] h-[6em] bg-white rounded-full flex justify-center items-center">
                                                            <p className='text-3xl text-black'>{studentsBit?.students?.length}</p>
                                                        </div>
                                                        <div className='mt-6 w-full grid grid-cols-1'>
                                                            <h1 className='font-bold text-center'>Business Information Technology</h1>
                                                            <div className='mt-3 flex flex-col items-center gap-2 md:gap-4 md:flex-row'>
                                                                <div className='w-full flex flex-col justify-center items-center max-md:flex-row max-md:gap-2'>
                                                                    <p>โครงการปกติ</p>
                                                                    <p>{studentsBit?.normal}</p>
                                                                </div>
                                                                <hr className='h-12 border max-md:hidden' />
                                                                <div className='w-full flex flex-col justify-center items-center max-md:flex-row max-md:gap-2'>
                                                                    <p>โครงการพิเศษ</p>
                                                                    <p>{studentsBit?.vip}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 2 */}
                                                    <div className="bg-gradient-to-br from-gray-50 border rounded-large p-6">
                                                        <div style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
                                                            className="mx-auto w-[6em] h-[6em] bg-white rounded-full flex justify-center items-center">
                                                            <p className='text-3xl text-black'>{studentsNetwork?.students?.length}</p>
                                                        </div>
                                                        <div className='mt-6 w-full grid grid-cols-1'>
                                                            <h1 className='font-bold text-center'>Systems, Network, Security and IoTs </h1>
                                                            <div className='mt-3 flex flex-col items-center gap-2 md:gap-4 md:flex-row'>
                                                                <div className='w-full flex flex-col justify-center items-center max-md:flex-row max-md:gap-2'>
                                                                    <p>โครงการปกติ</p>
                                                                    <p>{studentsNetwork?.normal}</p>
                                                                </div>
                                                                <hr className='h-12 border max-md:hidden' />
                                                                <div className='w-full flex flex-col justify-center items-center max-md:flex-row max-md:gap-2'>
                                                                    <p>โครงการพิเศษ</p>
                                                                    <p>{studentsNetwork?.vip}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 3 */}
                                                    <div className="bg-gradient-to-br from-gray-50 border rounded-large p-6">

                                                        <div style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
                                                            className="mx-auto w-[6em] h-[6em] bg-white rounded-full flex justify-center items-center">
                                                            <p className='text-3xl text-black'>{studentsWeb?.students?.length}</p>
                                                        </div>
                                                        <div className='mt-6 w-full grid grid-cols-1'>
                                                            <h1 className='font-bold text-center'>Mobile and Web Application Development</h1>
                                                            <div className='mt-3 flex flex-col md:flex-row items-center gap-2 md:gap-4'>
                                                                <div className='w-full flex flex-col justify-center items-center max-md:flex-row max-md:gap-2'>
                                                                    <p>โครงการปกติ</p>
                                                                    <p>{studentsWeb?.normal}</p>
                                                                </div>
                                                                <hr className='h-12 border max-md:hidden' />
                                                                <div className='w-full flex flex-col justify-center items-center max-md:flex-row max-md:gap-2'>
                                                                    <p>โครงการพิเศษ</p>
                                                                    <p>{studentsWeb?.vip}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                    }
                                    <InsertSubjectModal
                                        cb={cb}
                                        setRendering={setRendering}
                                        acadyear={trackSelect.acadyear}
                                        trackId={trackSelect?.id}
                                        defaultTrackSubj={trackSubj}
                                        isOpen={isOpen}
                                        onClose={onClose} />
                                    <TrackSubjectTable
                                        cb={cb}
                                        setRendering={setRendering}
                                        acadyear={trackSelect.acadyear}
                                        onOpen={onOpen}
                                        trackSubj={trackSubj}
                                        trackId={trackSelect?.id}
                                    />
                                    {
                                        studentsSelect?.students?.length > 0 ?
                                            rendering ? <div>Loading...</div>
                                                :
                                                <div className="border p-4 rounded-[10px] w-full flex flex-col mb-4">
                                                    <Tabs
                                                        aria-label="selection options"
                                                        selectedKey={selectedTrack}
                                                        onSelectionChange={setSelectedTrack}
                                                        color="primary"
                                                        variant="underlined"
                                                        disabledKeys={["download"]}
                                                        classNames={{
                                                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider !text-[1px]",
                                                            cursor: "w-full",
                                                            tab: "max-w-fit h-10",
                                                            tabContent: "group-data-[selected=true]:text-black group-data-[selected=true]:font-bold"
                                                        }}
                                                    >
                                                        <Tab
                                                            className='p-0'
                                                            key="all"
                                                            title={
                                                                <div className="flex items-center space-x-2">
                                                                    <span>นักศึกษาที่เข้าคัดแทร็ก</span>
                                                                </div>
                                                            }
                                                        >
                                                            <div>
                                                                <p className='text-default-900 text-small my-4'>รายชื่อนักศึกษาที่เข้ารับการคัดเลือก ทั้งหมด {studentsSelect?.students?.length} คน</p>
                                                                <StudentTrackTable
                                                                    cb={cb}
                                                                    acadyear={trackSelect.acadyear}
                                                                    isManagable={true}
                                                                    trackSubj={trackSubj}
                                                                    studentData={studentsSelect}
                                                                    title={false}
                                                                    tracks={tracks}
                                                                    track={"กำลังคัดเลือก"} />
                                                            </div>
                                                        </Tab>
                                                        <Tab
                                                            className='p-0'
                                                            key="nonSelect"
                                                            title={
                                                                <div className="flex items-center space-x-2">
                                                                    <span>นักศึกษาที่ไม่ได้เข้าคัดแทร็ก</span>
                                                                </div>
                                                            }
                                                        >
                                                            <div>
                                                                <p className='text-default-900 text-small my-4'>รายชื่อนักศึกษาที่ไม่ได้เข้ารับการคัดเลือก ทั้งหมด {nonSelectStudent?.length} คน</p>
                                                                <p className='text-default-900 text-small mb-2'>
                                                                    โครงการปกติ {nonSelectStudent?.filter(student => student.courses_type == "โครงการปกติ")?.length} คน
                                                                    โครงการพิเศษ {nonSelectStudent?.filter(student => student.courses_type == "โครงการพิเศษ")?.length} คน
                                                                </p>
                                                                <Table
                                                                    removeWrapper
                                                                    className='overflow-x-auto max-h-[400px] rounded-md'
                                                                    isStriped
                                                                    isHeaderSticky
                                                                    classNames={{
                                                                        ...minimalTableClass,
                                                                        wrapper: "max-h-[400px]",
                                                                    }}
                                                                    aria-label="Non select data">
                                                                    <TableHeader>
                                                                        <TableColumn>รหัสนักศึกษา</TableColumn>
                                                                        <TableColumn>ชื่อ - สกุล</TableColumn>
                                                                        <TableColumn>ประเภทโครงการ</TableColumn>
                                                                    </TableHeader>
                                                                    <TableBody
                                                                        items={nonSelectStudent}
                                                                        emptyContent={
                                                                            <Empty
                                                                                className='my-4'
                                                                                description={
                                                                                    <span className='text-gray-300'>นักศึกษาเลือกแทร็กทุกคนแล้ว</span>
                                                                                }
                                                                            />
                                                                        }
                                                                    >
                                                                        {(item) => (
                                                                            <TableRow key={item.stu_id}>
                                                                                <TableCell>{item?.stu_id}</TableCell>
                                                                                <TableCell>{item?.fullname}</TableCell>
                                                                                <TableCell>{item?.courses_type}</TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </Tab>
                                                    </Tabs>
                                                </div>
                                            : (studentsBit?.students?.length == 0 &&
                                                studentsNetwork?.students?.length == 0 &&
                                                studentsWeb?.students?.length == 0) ?
                                                <p
                                                    className='border-2 border-dashed p-4 text-center rounded-[5px] bg-gray-100'>ยังไม่มีนักศึกษาเลือกแทร็ก</p>
                                                :
                                                null
                                    }
                                    {studentsBit?.students?.length == 0 &&
                                        studentsNetwork?.students?.length == 0 &&
                                        studentsWeb?.students?.length == 0 ? null :
                                        <div className="border p-4 rounded-[10px] w-full flex flex-col mb-4">
                                            <Tabs
                                                aria-label="Track result options"
                                                selectedKey={selectedTrack}
                                                onSelectionChange={setSelectedTrack}
                                                color="primary"
                                                variant="underlined"
                                                disabledKeys={["download"]}
                                                classNames={{
                                                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider !text-[1px]",
                                                    cursor: "w-full",
                                                    tab: "max-w-fit h-10 last:p-0 last:absolute last:right-0 last:!cursor-default last:!opacity-100",
                                                    tabContent: "group-data-[selected=true]:text-black group-data-[selected=true]:font-bold"
                                                }}
                                            >
                                                <Tab
                                                    className='p-0'
                                                    key="all"
                                                    title={
                                                        <div className="flex items-center space-x-2">
                                                            <span>ทั้งหมด</span>
                                                        </div>
                                                    }
                                                >
                                                    {allTrack?.students?.length === 0 ? null : displayResult}
                                                </Tab>
                                                {studentsBit?.students?.length === 0 ? null :
                                                    <Tab
                                                        className='p-0'
                                                        key={"BIT"}
                                                        title={
                                                            <div className="flex items-center space-x-2">
                                                                <span>BIT</span>
                                                            </div>
                                                        }
                                                    >
                                                        {displayResult}
                                                    </Tab>
                                                }

                                                {studentsNetwork?.students?.length === 0 ? null :
                                                    <Tab
                                                        className='p-0'
                                                        key={"Network"}
                                                        title={
                                                            <div className="flex items-center space-x-2">
                                                                <span>Network</span>
                                                            </div>
                                                        }
                                                    >
                                                        {displayResult}
                                                    </Tab>
                                                }

                                                {studentsWeb?.students?.length === 0 ? null :
                                                    <Tab
                                                        className='p-0'
                                                        key={"Web and Mobile"}
                                                        title={
                                                            <div className="flex items-center space-x-2">
                                                                <span>Web and Mobile</span>
                                                            </div>
                                                        }
                                                    >
                                                        {displayResult}
                                                    </Tab>
                                                }
                                                <Tab
                                                    key="download"
                                                    className='max-md:hidden hover:border-b-2 border-blue-500'
                                                    title={
                                                        <div
                                                            onClick={() => downloadTrack(trackSelect)}
                                                            className='flex gap-2 px-3 py-1.5 cursor-pointer active:scale-95'>
                                                            <FiDownload className="w-4 h-4" />
                                                            ดาวน์โหลด
                                                        </div>
                                                    }
                                                />
                                            </Tabs>
                                        </div>
                                    }
                                </div>
                                :
                                <>
                                    <p className='text-center'>ไม่มีข้อมูลคัดเลือกแทร็ก</p>
                                </>
                        }

                    </div>
                }
            </ContentWrap>
        </>
    )
}

export default Page