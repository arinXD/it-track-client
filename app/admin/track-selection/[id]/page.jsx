"use client"
import { Navbar, Sidebar, ContentWrap, BreadCrumb, Loading } from '@/app/components'
import { fetchData, fetchDataObj } from '../../action'
import React, { useState, useEffect } from 'react'
import { Tooltip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { DeleteIcon2, PlusIcon } from "@/app/components/icons";
import Link from 'next/link';
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import axios from 'axios';
import { getToken } from '@/app/components/serverAction/TokenAction';
import { hostname } from '@/app/api/hostname';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentTrackTable from './StudentTrackTable';
import TrackCard from './TrackCard';
import { tableClass } from '@/src/util/tableClass';
import InsertSubjectModal from './InsertSubjectModal';

const showToastMessage = (ok, message) => {
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
};
const swal = Swal.mixin({
    customClass: {
        confirmButton: "btn bg-blue-500 text-white ms-3 hover:bg-blue-600",
        cancelButton: "btn bg-white border-1 border-blue-500 text-blue-500 hover:bg-gray-100 hover:border-blue-500"
    },
    buttonsStyling: false
});
const Page = ({ params }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [fetching, setFetching] = useState(false)
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

    async function initTrackSelect(id) {
        try {
            const result = await fetchDataObj(`/api/tracks/selects/${id}/subjects/students`)
            result.startAt = format(new Date(result?.startAt), 'yyyy-MM-dd HH:mm')
            result.expiredAt = format(new Date(result?.expiredAt), 'yyyy-MM-dd HH:mm')
            setTrackSelect(result)
            setTrackSubj(result?.Subjects)
        } catch (err) {
            console.error("Error on init func:", err);
        }
    }
    async function getTracks() {
        let tracks = await fetchData(`/api/tracks`)
        if (tracks?.length) {
            tracks = tracks.map(track => track.track)
        } else {
            tracks = []
        }
        console.log(tracks);
        setTracks(tracks)
    }

    const { id } = params
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        initTrackSelect(id)
        getTracks()
        setLoading(false)
    }, []);

    useEffect(() => {
        function getStudentCount(studentData) {
            const studentCount = {
                students: studentData,
                normal: studentData.filter(stu => stu?.Student?.courses_type === "โครงการปกติ").length,
                vip: studentData.filter(stu => stu?.Student?.courses_type === "โครงการพิเศษ").length
            }
            return studentCount
        }
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

    async function handleUpdate() {
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
                const token = await getToken()
                const options = {
                    url: `${hostname}/api/tracks/selects/${id}`,
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "authorization": `${token}`,
                    },
                    data: {
                        title,
                        startAt,
                        expiredAt,
                        has_finished: hasFinished,
                    }
                };
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
    }

    async function handleStartSelect({ id, hasFinished }) {
        swal.fire({
            text: `ต้องการ${hasFinished ? "เปิดการคัดเลือก" : "ปิดการคัดเลือก"}หรือไม่?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                setStarting(true)
                const token = await getToken()
                const options = {
                    url: `${hostname}/api/tracks/selects/selected/${id}`,
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "authorization": `${token}`,
                    },
                };
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
    }

    function isDefaultValueChange(newValue) {
        const changeCount = Object.keys(newValue).filter(stateKey => {
            return newValue[stateKey] !== trackSelect[stateKey];
        });
        return changeCount.length > 0;
    }

    async function handleValueChange(newValue) {
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
    }

    async function handleUnsave() {
        setTitle(trackSelect.title)
        setStartAt(trackSelect.startAt)
        setExpiredAt(trackSelect.expiredAt)
        setHasFinished(trackSelect.has_finished)
        setValueChange(false)
    }

    async function handleDelete() {
        swal.fire({
            text: `ต้องการลบข้อมูลการคัดแทรคปีการศึกษา ${trackSelect.acadyear} หรือไม่`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeleting(true)
                const token = await getToken()
                const options = {
                    url: `${hostname}/api/tracks/selects/${id}`,
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "authorization": `${token}`,
                    },
                };
                try {
                    const result = await axios(options)
                    const { ok, message } = result.data
                    showToastMessage(ok, message)

                } catch (error) {
                    showToastMessage(false, "message")
                } finally {
                    setDeleting(false)
                }
            }
        });
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <InsertSubjectModal isOpen={isOpen} onClose={onClose} />
                {!trackSelect ?
                    <p>No data</p>
                    :
                    <div>
                        <ToastContainer />
                        {loading ?
                            <div className='w-fit mx-auto mt-14'>
                                <Loading />
                            </div>
                            :
                            Object.keys(trackSelect).length > 0 ?
                                <div className='space-y-8 mt-6'>
                                    {/* <Button className='fixed bottom-1 right-1 z-50'>UP</Button> */}
                                    <h1 className='font-bold text-2xl'>
                                        {title}
                                    </h1>
                                    <div className='my-4 flex flex-row gap-4 w-full'>
                                        <div className='space-y-3 border-1 rounded-md p-3 w-[70%]'>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <span className='inline-block w-[12%] text-end'>ปีการศึกษา: </span>
                                                <input
                                                    type='number'
                                                    readOnly
                                                    value={trackSelect.acadyear}
                                                    className='select-none w-[88%] border-1 px-2 py-1.5 rounded-md border-gray-300' />
                                            </div>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <span className='inline-block w-[12%] text-end'>เริ่มต้น: </span>
                                                <input
                                                    type='datetime-local'
                                                    required
                                                    className='w-[88%] border-1 px-2 py-1.5 rounded-md border-gray-300'
                                                    value={startAt}
                                                    onChange={(e) => {
                                                        setStartAt(e.target.value)
                                                        handleValueChange({ startAt: e.target.value })
                                                    }} />
                                            </div>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <span className='inline-block w-[12%] text-end'>สิ้นสุด: </span>
                                                <input
                                                    type='datetime-local'
                                                    required
                                                    className='w-[88%] border-1 px-2 py-1.5 rounded-md border-gray-300'
                                                    value={expiredAt}
                                                    onChange={(e) => {
                                                        setExpiredAt(e.target.value)
                                                        handleValueChange({ expiredAt: e.target.value })
                                                    }} />
                                            </div>
                                            <div className='w-full flex justify-start items-center gap-4'>
                                                <span className='inline-block w-[12%] text-end'>สถานะ: </span>
                                                <input
                                                    type="radio"
                                                    name='hasFinished'
                                                    value={false}
                                                    className='cursor-pointer'
                                                    checked={(!hasFinished)}
                                                    onChange={() => {
                                                        setHasFinished(false)
                                                        handleValueChange({ has_finished: false })
                                                    }} />
                                                <span>กำลังดำเนินการ</span>
                                                <input
                                                    type="radio"
                                                    name='hasFinished'
                                                    value={true}
                                                    className='cursor-pointer'
                                                    checked={hasFinished}
                                                    onChange={() => {
                                                        setHasFinished(true)
                                                        handleValueChange({ has_finished: true })
                                                    }} />
                                                <span>สิ้นสุด</span>
                                            </div>
                                        </div>
                                        <div className='w-[30%] flex flex-col justify-between'>
                                            <div className='flex flex-col gap-3'>
                                                {!(trackSelect.has_finished) ?
                                                    <Button size='md'
                                                        isLoading={starting}
                                                        onPress={() => handleStartSelect({ id: trackSelect.id, hasFinished: trackSelect.has_finished })}
                                                        color="primary" variant="solid" className='bg-blue-500 w-full'>
                                                        {starting ? "ปิดการคัดเลือก..." : "ปิดการคัดเลือก"}
                                                    </Button>
                                                    :
                                                    <Button size='md'
                                                        isLoading={starting}
                                                        onPress={() => handleStartSelect({ id: trackSelect.id, hasFinished: trackSelect.has_finished })}
                                                        color="primary" variant="solid" className='bg-blue-500 w-full'>
                                                        {starting ? "เปิดการคัดเลือก..." : "เปิดการคัดเลือก"}
                                                    </Button>}
                                                <Button
                                                    isLoading={updating}
                                                    disabled={!valueChange}
                                                    onClick={handleUpdate}
                                                    className={`w-full h-[40px] px-[16px] rounded-[12px] text-white ${!valueChange ? "bg-indigo-200" : "bg-blue-500 hover:bg-blue-600"}`}>
                                                    {updating ? "ยืนยันการแก้ไข..." : "ยืนยันการแก้ไข"}
                                                </Button>
                                                <Button
                                                    disabled={!valueChange}
                                                    onClick={handleUnsave}
                                                    className={`w-full h-[40px] px-[16px] rounded-[12px] ${!valueChange ? "bg-gray-200 text-gray-400" : "bg-gray-400 hover:bg-gray-500"}`}>
                                                    ยกเลิกการแก้ไข
                                                </Button>
                                                <Button
                                                    isLoading={deleting}
                                                    isDisabled={deleting}
                                                    startContent={""}
                                                    size='md'
                                                    onPress={() => handleDelete()}
                                                    color="danger" variant="solid"
                                                    className='w-full bg-red-600'>
                                                    ลบ
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        !parseInt(studentsBit?.normal + studentsNetwork?.normal + studentsWeb?.normal) ? null :
                                            <div className='grid grid-cols-3 gap-8 max-xl:grid-cols-2 max-lg:grid-cols-1'>
                                                <Link href={"#bit-students"} className="flex flex-row text-center rounded-l-full">
                                                    <div className={`bg-purple-500 p-4 rounded-l-full grid place-content-center`}>
                                                        <div class="rounded-full flex relative justify-center items-center">
                                                            <div class="w-[5.5em] h-[5.5em] bg-white rounded-full flex justify-center items-center">
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
                                                </Link>
                                                <Link href={"#network-students"} className="flex flex-row text-center rounded-l-full">
                                                    <div className={`bg-emerald-500 p-4 rounded-l-full grid place-content-center`}>
                                                        <div class="rounded-full flex relative justify-center items-center">
                                                            <div class="w-[5.5em] h-[5.5em] bg-white rounded-full flex justify-center items-center">
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
                                                </Link>
                                                <Link href={"#web-students"} className="flex flex-row text-center rounded-l-full">
                                                    <div className={`bg-indigo-500 p-4 rounded-l-full grid place-content-center`}>
                                                        <div class="rounded-full flex relative justify-center items-center">
                                                            <div class="w-[5.5em] h-[5.5em] bg-white rounded-full flex justify-center items-center">
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
                                                </Link>
                                            </div>
                                    }
                                    <div>
                                        <div className='flex justify-between items-start mb-3'>
                                            <h2 className='mb-3 text-small text-default-900'>วิชาที่ใช้ในการคัดเลือก</h2>
                                            <Button
                                                onClick={onOpen}
                                                startContent={<PlusIcon />}
                                                radius='sm'
                                                color='primary'
                                                size='sm'>
                                                เพิ่มวิขา
                                            </Button>
                                        </div>
                                        {trackSubj &&
                                            <Table
                                                classNames={tableClass}
                                                removeWrapper
                                                selectionMode="multiple"
                                                // onSelectionChange={setSelectedKeys}
                                                onRowAction={() => { }}
                                                aria-label="track selection subjects table">
                                                <TableHeader>
                                                    <TableColumn></TableColumn>
                                                    <TableColumn>รหัสวิชา</TableColumn>
                                                    <TableColumn>ชื่อวิชา EN</TableColumn>
                                                    <TableColumn>ชื่อวิชา TH</TableColumn>
                                                    <TableColumn>หน่วยกิต</TableColumn>
                                                </TableHeader>
                                                {trackSubj.length > 0 ?
                                                    <TableBody>
                                                        {trackSubj.map(subj => (
                                                            <TableRow key={subj.subject_code}>
                                                                <TableCell className=''>
                                                                    <Tooltip color="danger" content="ลบ">
                                                                        <span onClick={() => { }} className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                            <DeleteIcon2 />
                                                                        </span>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>{subj.subject_code}</TableCell>
                                                                <TableCell className="w-1/3">{subj.title_en}</TableCell>
                                                                <TableCell className="w-1/3">{subj.title_th}</TableCell>
                                                                <TableCell className='text-center'>{subj.credit}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody> :
                                                    <TableBody emptyContent={"ไม่มีวิชาที่ใช้ในการคัดเลือก"}>{[]}</TableBody>}
                                            </Table>
                                        }
                                    </div>
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
                                                {
                                                    allTrack?.students?.length === 0 ? null :
                                                        <StudentTrackTable
                                                            trackSubj={trackSubj} studentData={allTrack} track={"ทุกแทรค"} />
                                                }
                                            </Tab>
                                            {studentsBit?.students?.length == 0 ? null :
                                                <Tab
                                                    key={"BIT"}
                                                    title={
                                                        <div className="flex items-center space-x-2">
                                                            <span>BIT</span>
                                                        </div>
                                                    }
                                                >

                                                    <StudentTrackTable
                                                        trackSubj={trackSubj} studentData={studentsBit} track={"BIT"} />
                                                </Tab>
                                            }

                                            {studentsNetwork?.students?.length == 0 ? null :
                                                <Tab
                                                    key={"Network"}
                                                    title={
                                                        <div className="flex items-center space-x-2">
                                                            <span>Network</span>
                                                        </div>
                                                    }
                                                >
                                                    <StudentTrackTable trackSubj={trackSubj} studentData={studentsNetwork} track={"Network"} />
                                                </Tab>
                                            }

                                            {studentsWeb?.students?.length == 0 ? null :
                                                <Tab
                                                    key={"Web and Mobile"}
                                                    title={
                                                        <div className="flex items-center space-x-2">
                                                            <span>Web and Mobile</span>
                                                        </div>
                                                    }
                                                >
                                                    <StudentTrackTable trackSubj={trackSubj} studentData={studentsWeb} track={"Web and Mobile"} />
                                                </Tab>
                                            }
                                        </Tabs>
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