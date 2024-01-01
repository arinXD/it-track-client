"use client"
import React from 'react'
import { hostname } from '@/app/api/hostname'
import axios from 'axios'
import { useState, useEffect, useReducer } from 'react'
import { createTrackSelection } from './action'
import Swal from 'sweetalert2'
import { Button } from "@nextui-org/react";
import { DeleteIcon } from '@/app/components/icons'
import { dmy, dmyt } from '@/src/util/dateFormater'


const TrackSelectionForm = ({ enrollments, userData }) => {
    const initOrder = {
        order1: "", order2: "", order3: "",
    }
    const OrderReducer = (state, { type, payload }) => {
        switch (type) {
            case 'SET_ORDER_1':
                return {
                    ...state,
                    order1: payload
                };
            case 'SET_ORDER_2':

                return {
                    ...state,
                    order2: payload
                };
            case 'SET_ORDER_3':
                return {
                    ...state,
                    order3: payload
                };
            case "CLEAR_ORDER":
                return {
                    order1: "",
                    order2: "",
                    order3: "",
                };
            default:
                return state;
        }
    };
    const [isConfirm, setIsConfirm] = useState(false)
    const [trackSelect, setTrackSelect] = useState({})
    const [trackSubjects, setTrackSubjects] = useState([])
    const [tracks, setTracks] = useState([])
    const [orders, dispatch] = useReducer(OrderReducer, initOrder);
    const [processing, isProcessing] = useState(false)

    const getEnrollmentGrade = (subjectCode) => {
        // ต้องการหา subjectCode ใน enrollments
        const enrollment = enrollments.find(e => e.subject_code === subjectCode);
        if (enrollment) {
            return enrollment.grade;
        }
        return "ไม่มีเกรด";
    }
    const clearForm = () => {
        dispatch({
            type: "CLEAR_ORDER",

        });
        const selects = document.querySelectorAll("select.select-order")
        selects.forEach(select => {
            select.value = '';
        });
    }
    const handleSubmit = async (event) => {
        isProcessing(true)
        event.preventDefault();
        const formData = new FormData(event.target)
        const result = await createTrackSelection(formData)
        const data = result.data
        isProcessing(false)
        if (result.ok) {
            Swal.fire({
                title: "บันทึกข้อมูลการคัดเลือก",
                text: `บันทึกข้อมูลการคัดเลือกของคุณ ณ วันที่ ${dmyt(data.updatedAt)}`,
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง"
            })
        } else {
            Swal.fire({
                title: "Warning!",
                text: `มีบางอย่างผิดพลาด ${result.message}`,
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง"
            })
        }
    }
    useEffect(() => {

    }, [trackSelect])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${hostname}/api/tracks/selects/get/last`);
                const trackResponse = await axios.get(`${hostname}/api/tracks`)
                const selectDataResponse = await axios.get(`${hostname}/api/students/${userData.stu_id}/track/select`)

                const selectedData = selectDataResponse.data.data
                const data = response.data.data;
                const trackData = trackResponse.data.data
                if (selectedData) {
                    for (let index = 1; index < 4; index++) {
                        const type = `SET_ORDER_${index}`
                        dispatch({
                            type,
                            payload: selectedData[`track_order_${index}`]
                        });
                    }
                } else {
                    dispatch({
                        type: "CLEAR_ORDER",
                    });
                }

                setTrackSelect(data);
                if (data.Subjects) {
                    setTrackSubjects(data.Subjects)
                } else {
                    setTrackSubjects([])
                }
                setTracks(trackData)
            } catch (error) {
                console.error(error);
                setTrackSelect({});
                setTrackSubjects([])
                setTracks([])
            }
        }
        fetchData()
    }, [userData])

    const handleChange = async (value, index) => {
        const type = `SET_ORDER_${index + 1}`;
        dispatch({
            type,
            payload: value,
        });
    };
    useEffect(() => {
        if ([orders.order1, orders.order2, orders.order3].filter(e => e).length === 2) {
            const trackArr = [orders.order1, orders.order2, orders.order3]
            let c = trackArr.findIndex((track) => track == "")
            const result = tracks.filter(
                t => {
                    return !(trackArr.includes(t.track))
                }
            );
            const type = `SET_ORDER_${c + 1}`
            const payload = result[0].track
            dispatch({
                type,
                payload
            });
        }
    }, [orders]);

    if (userData?.track != null) {
        console.log(userData);
        return (
            <div className='text-center'>
                <h4 className="block font-sans font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased text-center text-xl my-5">
                    {/* การคัดเลือกความเชี่ยวชาญ วิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ */}
                    {trackSelect.title}
                </h4>
                <p>แทรคของคุณคือ {userData?.track}</p>
            </div>
        )
    } else if ((userData?.acadyear !== trackSelect?.acadyear)
        && (userData?.track === null)) {
        return (
            <div className='text-center'>
                <h4 className="block font-sans font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased text-center text-xl my-5">
                    {/* การคัดเลือกความเชี่ยวชาญ วิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ */}
                    {trackSelect.title}
                </h4>
                <p>คุณไม่มีสิทธิ์เข้ารับการคัดเลือกในปีนี้ ติดต่อเพิ่มเติมที่อีเมล ittrack@gmail.com </p>
            </div>
        )
    } else {
        return (
            <div className="relative flex flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
                {!trackSelect.id ?
                    <p>Loading...</p>
                    :
                    <>

                        {(trackSelect.has_finished || (new Date(trackSelect.expiredAt) < new Date())) ?
                            <p>
                                การคัดเลือกความเชี่ยวชาญ หลักสูตรเทคโนโลยีสารสนเทศ
                                <strong> จบลงแล้ว</strong> หากยังไม่ได้ทำการเลือก
                                ระบบจะทำการสุ่มให้ หากมีคำถามเพิ่มเติมติดต่อได้ที่ ittrack@mail.com
                            </p>
                            :
                            <>
                                <h4 className="block font-sans font-semibold leading-snug tracking-normal text-gray-900 antialiased text-center text-xl mb-3">
                                    {/* การคัดเลือกความเชี่ยวชาญ วิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ */}
                                    {trackSelect.title}
                                </h4>
                                <p className='text-center my-3 text-sm'>
                                    ตั้งแต่วันที่ {dmy(trackSelect.startAt)} - {dmy(trackSelect.expiredAt)}
                                </p>
                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-8 mb-2 w-83 max-w-screen-lg sm:w-63 "
                                    style={{ margin: '0 auto' }}>
                                    <div className="flex flex-col">
                                        <input type="hidden" name='track_selection_id' defaultValue={trackSelect.id} readOnly />
                                        <input type="hidden" name='stu_id' defaultValue={userData.stu_id} readOnly />

                                        <div className='mt-5'>
                                            <label className="block font-bold text-black text-base">รายละเอียดวิชาที่ใช้ในการคัดเลือกและเกรดที่ได้</label>
                                            <label className="block text-sm font-medium text-black mt-2 mb-5">* โปรดตรวจสอบรายละเอียดเกรดของแต่ละวิชา</label>
                                        </div>
                                        <div id='TrackSubjects'>
                                            {trackSubjects.map((subject, index) => (
                                                <div className='subject-item mb-5' key={index}>
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm text-black mb-2">
                                                        <p className='font-bold'>
                                                            {subject.subject_code}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-black">
                                                        <p className='w-full sm:w-[85%] mb-2'>
                                                            <span className='block mb-2'>
                                                                {subject.title_en}
                                                            </span>
                                                            <span className='block'>
                                                                {subject.title_th}
                                                            </span>
                                                        </p>
                                                        <div className="relative w-full sm:w-[15%]">
                                                            <input
                                                                className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                                placeholder=" "
                                                                type="text"
                                                                name={`subject_${subject.subject_code}`}
                                                                value={getEnrollmentGrade(subject.subject_code)}
                                                                readOnly
                                                            />
                                                            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                                เกรด
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-1 flex flex-col mt-5">
                                        <div>
                                            <label className="block font-bold text-black text-base">เลือกอันดับความเชี่ยวชาญ (แทรค) ที่ต้องการ</label>
                                            <label className="block text-sm font-medium text-black mb-5 mt-2">* อันดับแรกคืออันดับที่ต้องการมากที่สุด จากนั้นเลือกอันดับที่ต้องการรองจากอับดับแรก ในกรณีที่อับดับแรกเต็ม</label>
                                        </div>
                                        <div>
                                            {/* {JSON.stringify([orders.order1, orders.order2, orders.order3].filter(e => e))} <br /> */}
                                            {/* {[orders.order1, orders.order2, orders.order3].filter(e => e).length} <br /> */}
                                            {/* {JSON.stringify(tracks.filter((t) => ![orders.order1, orders.order2, orders.order3].includes(t.track)))} */}
                                        </div>
                                        <div>
                                            {tracks.map((e, index) => (
                                                <div key={index}>
                                                    <label className="block text-sm font-medium text-black mb-2">อันดับที่ {index + 1}</label>
                                                    <div className="relative h-11 w-full mb-4">
                                                        <select
                                                            onChange={() => handleChange(event.target.value, index)}
                                                            required={true}
                                                            name={`track_order_${index + 1}`}
                                                            value={
                                                                (orders[`order${index + 1}`]) ? orders[`order${index + 1}`] : ""
                                                            }
                                                            className="select-order bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-white dark:placeholder-black-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                                                            <option value="" disabled hidden>เลือกแทรค</option>
                                                            {tracks.map((track, index) => (
                                                                <option
                                                                    hidden={[orders.order1, orders.order2, orders.order3].includes(track.track)}
                                                                    key={index}
                                                                    value={track.track}
                                                                >
                                                                    {track.track}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='text-end mb-2'>
                                        <Button
                                            className='mb-1 w-fit'
                                            type='button'
                                            onClick={clearForm}
                                            startContent={
                                                <DeleteIcon className={"w-5 h-5"} />
                                            }
                                            color="primary">
                                            Clear
                                        </Button>
                                    </div>
                                    <div className="inline-flex items-center">
                                        <label
                                            className="relative -ml-2.5 flex cursor-pointer items-center rounded-full p-3"
                                            htmlFor="checkbox"
                                            data-ripple-dark="true"
                                        >
                                            <input
                                                onChange={() => setIsConfirm(!isConfirm)}
                                                type="checkbox"
                                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                                id="checkbox"
                                            />
                                            <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3.5 w-3.5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    stroke="currentColor"
                                                    strokeWidth="1"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                            </span>
                                        </label>
                                        <label
                                            className="mt-px cursor-pointer select-none font-light text-gray-700"
                                            htmlFor="checkbox"
                                        >
                                            <p className="flex items-center font-sans text-sm font-normal leading-normal text-gray-700 antialiased">
                                                ตรวจสอบข้อมูลเรียบร้อย (สามารถแก้ไขลำดับได้หลังจากยืนยัน จนถึงวันที่ {dmy(trackSelect.expiredAt)})
                                            </p>
                                        </label>
                                    </div>
                                    <button
                                        className="mt-4 block w-full select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        type="submit"
                                        data-ripple-light="true"
                                        disabled={!isConfirm && !processing}
                                    >
                                        {!processing ? "ตกลง" : "บันทึกข้อมูล..."}

                                    </button>

                                </form>
                            </>
                        }
                    </>
                }
            </div >
        )
    }
}

export default TrackSelectionForm