"use client"
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData, fetchDataObj } from '../../action'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Tab, Tabs, useDisclosure, Input, Spinner, Chip } from "@nextui-org/react";
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentTrackTable from './StudentTrackTable';
import { inputClass } from '@/src/util/ComponentClass';
import InsertSubjectModal from './InsertSubjectModal';
import { getCurrentDate } from '@/src/util/dateFormater';
import { DeleteIcon2, PlusIcon } from '@/app/components/icons';
import { FaPlay } from "react-icons/fa";
import { FaRegCircleStop } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import TrackSubjectTable from './TrackSubjectTable';

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

    const [starting, setStarting] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const [title, setTitle] = useState("")
    const [startAt, setStartAt] = useState("")
    const [expiredAt, setExpiredAt] = useState("")
    const [hasFinished, setHasFinished] = useState("")

    const [valueChange, setValueChange] = useState(false)

    const initTrackSelect = useCallback(async function (id) {
        try {
            const result = await fetchDataObj(`/api/tracks/selects/${id}/subjects/students`)
            result.startAt = format(new Date(result?.startAt), 'yyyy-MM-dd HH:mm')
            result.expiredAt = format(new Date(result?.expiredAt), 'yyyy-MM-dd HH:mm')
            setTrackSelect(result)
            setTrackSubj(result?.Subjects)
        } catch (err) {
            console.error("Error on init func:", err);
        }
    }, [])

    const getTracks = useCallback(async function () {
        let tracks = await fetchData(`/api/tracks`)
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
            text: `ต้องการแก้ไขข้อมูลการคัดแทรคปีการศึกษา ${trackSelect.acadyear} หรือไม่`,
            icon: "warning",
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
        hasFinished,
    ])

    const handleUnsave = useCallback(function handleUnsave() {
        setTitle(trackSelect.title)
        setStartAt(trackSelect.startAt)
        setExpiredAt(trackSelect.expiredAt)
        setHasFinished(trackSelect.has_finished)
        setValueChange(false)
    }, [trackSelect])

    const handleDelete = useCallback(async function () {
        swal.fire({
            text: `ต้องการลบการคัดแทรคปีการศึกษา ${trackSelect.acadyear} หรือไม่ ?`,
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
            }
        });
    }, [trackSelect])

    const displayResult = useMemo(() => {
        const selecteData = {
            "all": {
                studentData: allTrack,
                track: "ทุกแทรค"
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
        const data = selecteData[selectedTrack]
        return (
            <StudentTrackTable trackSubj={trackSubj} studentData={data.studentData} track={data.track} />
        )
    }, [
        selectedTrack,
        allTrack,
        studentsBit,
        studentsNetwork,
        studentsWeb,
        trackSubj,
    ])

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                {/* <InsertSubjectModal
                    callBack={initTrackSelect}
                    showToastMessage={showToastMessage}
                    trackId={trackSelect?.id}
                    defaultTrackSubj={trackSubj}
                    isOpen={isOpen}
                    onClose={onClose} /> */}
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
                                    {/* <Button className='fixed bottom-1 right-1 z-50'>UP</Button> */}
                                    <div className='bg-gray-100 border-gray-200 border-1 p-4 flex flex-col justify-start items-center gap-2 rounded-md'>
                                        <h1 className='w-[100%] font-bold text-base'>
                                            {title}
                                        </h1>
                                    </div>
                                    <div className='my-4 grid grid-cols-3 justify-stretch justify-items-stretch gap-4 w-full'>
                                        <div className='bg-gray-100 border-gray-200 border-1 space-y-3 rounded-md p-3 w-full col-span-3 max-lg:col-span-3'>
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
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <Input
                                                    type='datetime-local'
                                                    label="เริ่มต้น (ปี/เดือน/วัน)"
                                                    variant="bordered"
                                                    radius='sm'
                                                    placeholder="เดือน/วัน/ปี"
                                                    labelPlacement="outside"
                                                    value={startAt}
                                                    classNames={inputClass}
                                                    onChange={(e) => {
                                                        setStartAt(e.target.value)
                                                        handleValueChange({ startAt: e.target.value })
                                                    }}
                                                    min={getCurrentDate()}
                                                />
                                            </div>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <Input
                                                    type='datetime-local'
                                                    label="สิ้นสุด (เดือน/วัน/ปี)"
                                                    variant="bordered"
                                                    radius='sm'
                                                    placeholder="เดือน/วัน/ปี"
                                                    labelPlacement="outside"
                                                    value={expiredAt}
                                                    classNames={inputClass}
                                                    onChange={(e) => {
                                                        setExpiredAt(e.target.value)
                                                        handleValueChange({ expiredAt: e.target.value })
                                                    }}
                                                    min={startAt}
                                                />
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
                                            <div className='flex flex-row justify-start items-center gap-3 border-t-1 border-gray-300 pt-3'>
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
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        !parseInt(studentsBit?.normal + studentsNetwork?.normal + studentsWeb?.normal) ? null :
                                            <div className='grid grid-cols-3 gap-8 max-xl:grid-cols-2 max-lg:grid-cols-1'>
                                                <div className="flex flex-row text-center rounded-l-full">
                                                    <div className={`bg-purple-500 p-4 rounded-l-full grid place-content-center`}>
                                                        <div className="rounded-full flex relative justify-center items-center">
                                                            <div className="w-[5.5em] h-[5.5em] bg-white rounded-full flex justify-center items-center">
                                                                <p className='text-3xl text-black'>{studentsBit?.students?.length}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`w-full py-4 pr-4 ps-2 col-span-2 flex rounded-e-lg bg-purple-400 text-white`}>
                                                        <table className='table-auto mx-auto'>
                                                            <thead>
                                                                <tr className=''>
                                                                    <th className='text-base'>Business Information Technology</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <div className='flex flex-col gap-2 mt-3'>
                                                                            <div className='flex justify-between items-center'><span>โครงการปกติ </span> <span>{studentsBit?.normal} <span className='ms-3'>คน</span></span></div>
                                                                            <div className='flex justify-between items-center'><span>โครงการพิเศษ</span> <span> {studentsBit?.vip} <span className='ms-3'>คน</span></span></div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row text-center rounded-l-full">
                                                    <div className={`bg-emerald-500 p-4 rounded-l-full grid place-content-center`}>
                                                        <div className="rounded-full flex relative justify-center items-center">
                                                            <div className="w-[5.5em] h-[5.5em] bg-white rounded-full flex justify-center items-center">
                                                                <p className='text-3xl text-black'>{studentsNetwork?.students?.length}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`w-full py-4 pr-4 ps-2 col-span-2 flex rounded-e-lg bg-emerald-400 text-white`}>
                                                        <table className='table-auto mx-auto'>
                                                            <thead>
                                                                <tr className=''>
                                                                    <th className='text-base'>IOT & Networking</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <div className='flex flex-col gap-2 mt-3'>
                                                                            <div className='flex justify-between items-center'><span>โครงการปกติ </span> <span>{studentsNetwork?.normal} <span className='ms-3'>คน</span></span></div>
                                                                            <div className='flex justify-between items-center'><span>โครงการพิเศษ</span> <span> {studentsNetwork?.vip} <span className='ms-3'>คน</span></span></div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row text-center rounded-l-full">
                                                    <div className={`bg-indigo-500 p-4 rounded-l-full grid place-content-center`}>
                                                        <div className="rounded-full flex relative justify-center items-center">
                                                            <div className="w-[5.5em] h-[5.5em] bg-white rounded-full flex justify-center items-center">
                                                                <p className='text-3xl text-black'>{studentsWeb?.students?.length}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`w-full py-4 pr-4 ps-2 col-span-2 flex rounded-e-lg bg-indigo-400 text-white`}>
                                                        <table className='table-auto mx-auto'>
                                                            <thead>
                                                                <tr className=''>
                                                                    <th className='text-base'>Web Application & Mobile</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <div className='flex flex-col gap-2 mt-3'>
                                                                            <div className='flex justify-between items-center'><span>โครงการปกติ </span> <span>{studentsWeb?.normal} <span className='ms-3'>คน</span></span></div>
                                                                            <div className='flex justify-between items-center'><span>โครงการพิเศษ</span> <span> {studentsWeb?.vip} <span className='ms-3'>คน</span></span></div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                    <TrackSubjectTable
                                        callBack={initTrackSelect}
                                        swal={swal}
                                        showToastMessage={showToastMessage}
                                        trackSubj={trackSubj}
                                        onOpen={onOpen}
                                        trackId={trackSelect?.id}
                                    />
                                    {
                                        studentsSelect?.students?.length > 0 ?
                                            <div>
                                                <p className='text-default-900 text-small'>รายชื่อนักศึกษาที่เข้ารับการคัดเลือก</p>
                                                <StudentTrackTable trackSubj={trackSubj} studentData={studentsSelect} title={false} track={"กำลังคัดเลือก"} />
                                            </div>
                                            : (studentsBit?.students?.length == 0 &&
                                                studentsNetwork?.students?.length == 0 &&
                                                studentsWeb?.students?.length == 0) ?
                                                <p>ยังไม่มีนักศึกษาเลือกแทรค</p>
                                                :
                                                null
                                    }
                                    <div className="flex w-full flex-col mb-4">
                                        {studentsBit?.students?.length == 0 &&
                                            studentsNetwork?.students?.length == 0 &&
                                            studentsWeb?.students?.length == 0 ? null :
                                            <Tabs
                                                aria-label="Options"
                                                selectedKey={selectedTrack}
                                                onSelectionChange={setSelectedTrack}
                                                color="primary"
                                                variant="bordered">
                                                <Tab
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
                                            </Tabs>
                                        }
                                    </div>

                                </div>
                                :
                                <>
                                    <p className='text-center'>ไม่มีข้อมูลคัดเลือกแทรค</p>
                                </>
                        }

                    </div>
                }
            </ContentWrap>
        </>
    )
}

export default Page