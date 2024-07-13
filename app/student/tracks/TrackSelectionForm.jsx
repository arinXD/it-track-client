"use client"
import axios from 'axios'
import { useState, useEffect, useReducer, useCallback } from 'react'
import { createTrackSelection } from './action'
import Swal from 'sweetalert2'
import { Button, Spinner } from "@nextui-org/react";
import { DeleteIcon } from '@/app/components/icons'
import confetti from 'canvas-confetti';
import TMonlicaEmail from '@/app/components/TMonlicaEmail'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import Link from 'next/link'
import { simpleDMY, simpleDMYHM } from '@/src/util/simpleDateFormatter'
import { Result } from 'antd'
import { SmileOutlined } from '@ant-design/icons';

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
    const [loading, setLoading] = useState(true)
    const [trackResult, setTrackResult] = useState("")
    const [isConfirm, setIsConfirm] = useState(false)
    const [trackSelect, setTrackSelect] = useState({})
    const [trackSubjects, setTrackSubjects] = useState([])
    const [tracks, setTracks] = useState([])
    const [orders, dispatch] = useReducer(OrderReducer, initOrder);
    const [processing, isProcessing] = useState(false)
    const [hasSelected, setHasSelected] = useState(false);

    const getEnrollmentGrade = (subjectCode) => {
        // ต้องการหา subjectCode ใน enrollments
        const enrollment = enrollments.find(e => e?.Subject?.subject_code === subjectCode);
        if (enrollment) {
            return enrollment.grade;
        }
        return "ไม่มีเกรด";
    }

    const handleConfetti = () => {
        confetti({
            particleCount: 200,
            spread: 180,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#fbbf24', '#f97316', '#a78bfa', '#60a5fa', '#84cc16'],
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        isProcessing(true)
        const formData = new FormData(event.target)
        const result = await createTrackSelection(formData)
        const data = result.data
        if (result.ok) {
            setHasSelected(true)

            // จุดพลุฉลอง
            handleConfetti()
            const swal = Swal.mixin({
                customClass: {
                    confirmButton: "btn rounded-md bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
                    cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
                },
                buttonsStyling: false
            });

            swal.fire({
                title: "บันทึกข้อมูลการคัดเลือก",
                text: `บันทึกข้อมูลการคัดเลือกของคุณ ณ วันที่ ${simpleDMYHM(data.updatedAt)}`,
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง"
            }).then(result => {
                if (result.isConfirmed) {
                    swal.fire({
                        title: "ขออนุญาตผู้ใช้ทำแบบสอบถาม",
                        text: `ขออนุญาตผู้ใช้ทำแบบสอบถามเพื่อนำ feedback มาปรับปรุงแก้ไขเว็บไซต์ให้มีประสิทธิภาพต่อไป`,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "ยินยอม",
                        cancelButtonText: "ไม่ยินยอม",
                        reverseButtons: true
                    }).then(result => {
                        if (result.isConfirmed) {
                            window.open("https://docs.google.com/forms/d/e/1FAIpQLSdJ2NQilMU1IGdekQIkiZZ3uvZ09Ef1XXA7MOuNHhDptqjnHg/viewform?usp=sf_link")
                        }
                    })
                }
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
        isProcessing(false)
    }

    const fetchData = async function () {
        try {
            let URL = `/api/tracks/selects/${userData.acadyear}`
            let option = await getOptions(URL, "GET")
            const response = await axios(option)

            URL = `/api/tracks/all`
            option = await getOptions(URL, "GET")
            const trackResponse = await axios(option)

            URL = `/api/students/${userData.stu_id}/track/select`
            option = await getOptions(URL, "GET")
            const selectDataResponse = await axios(option)

            const selectedData = selectDataResponse.data.data
            const data = response.data.data;
            const trackData = trackResponse.data.data
            if (selectedData) {
                setHasSelected(true)
                setTrackResult(selectedData.Track)
                for (let index = 1; index < 4; index++) {
                    const type = `SET_ORDER_${index}`
                    dispatch({
                        type,
                        payload: selectedData[`track_order_${index}`]
                    });
                }
            } else {
                setHasSelected(false)
                dispatch({
                    type: "CLEAR_ORDER",
                });
            }

            setTrackSelect(data);
            if (data?.Subjects) {
                setTrackSubjects(data.Subjects)
            } else {
                setTrackSubjects([])
            }
            setTracks(trackData)
        } catch (error) {
            console.log(error);
            setTrackSelect({});
            setTrackSubjects([])
            setTracks([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [userData])


    const handleChange = useCallback(async (value, index) => {
        const type = `SET_ORDER_${index + 1}`;
        dispatch({
            type,
            payload: value,
        });
    }, [])

    const clearForm = useCallback(() => {
        dispatch({
            type: "CLEAR_ORDER",
        });
    }, [])

    useEffect(() => {
        if ([orders.order1, orders.order2, orders.order3].filter(e => e).length === 2) {
            const trackArr = [orders.order1, orders.order2, orders.order3]
            let c = trackArr.findIndex((track) => !track)
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

    useEffect(() => {
        if ((trackSelect?.has_finished || (new Date(trackSelect?.expiredAt) < new Date())) && trackResult) handleConfetti();
    }, [trackResult, trackSelect])

    if (userData?.program !== "IT") {
        <div className='text-center'>
            <h4
                style={{
                    fontSize: "clamp(16px, 5vw, 24px)",
                    margin: "auto"
                }}
                className="md:!mt-4 max-w-screen-md block font-semibold leading-snug tracking-normal text-gray-900 antialiased text-center text-2xl !mb-3">
                {trackSelect?.title}
            </h4>
            <div>
                คุณไม่มีสิทธิ์เข้ารับการคัดเลือกแทร็กในหลักสูตรเทคโนโลยีสารสนเทศ ติดต่อ <TMonlicaEmail />
            </div>
        </div>
    }

    else {
        return (
            <div className="relative flex flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
                {loading ?
                    <div className='w-full flex justify-center h-[70vh]'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    !(trackSelect?.id) ?
                        <>
                            <h4
                                style={{
                                    fontSize: "clamp(16px, 5vw, 24px)",
                                    margin: "auto"
                                }}
                                className="md:!mt-4 block font-semibold leading-snug tracking-normal text-gray-900 antialiased text-center text-2xl !mb-3">
                                การคัดเลือกความเชี่ยวชาญ วิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ ปีการศึกษา 2566
                            </h4>
                            <p
                                style={{
                                    fontSize: "clamp(8px, 4vw, 16px)",
                                    margin: "auto"
                                }}
                                className='text-center mb-3 text-lg text-default-600'>
                                เริ่มคัดเลือกแทร็กตั้งแต่วันที่ 13 พฤษภาคม 2567 - 20 พฤษภาคม 2567 <br />
                                ประกาศผลวันที่ 23 พฤษภาคม 2567
                            </p>
                        </>
                        :
                        <>
                            {(trackSelect?.has_finished || new Date(trackSelect?.expiredAt) < new Date() || new Date(trackSelect?.startAt) > new Date()) ?
                                trackResult ?
                                    (
                                        <div className='flex flex-col justify-center items-center h-[70vh]'>
                                            <Result
                                                icon={<SmileOutlined />}
                                                title={`แทร็กของคุณ คือ ${trackResult?.title_en}`}
                                                subTitle={<p className='text-lg'>{trackResult?.title_th}</p>}
                                            />
                                            <Link href={`/tracks/${trackResult?.track?.toLowerCase()}`} className='text-blue-500 block'>รายละเอียดแทร็ก</Link>
                                        </div>
                                    )
                                    :
                                    new Date(trackSelect?.startAt) > new Date() ?
                                        <>
                                            <h4
                                                style={{
                                                    fontSize: "clamp(16px, 5vw, 24px)",
                                                    margin: "auto"
                                                }}
                                                className="md:!mt-4 max-w-screen-md block font-semibold leading-snug tracking-normal text-gray-900 antialiased text-center text-2xl !mb-3">
                                                {trackSelect?.title}
                                            </h4>
                                            <p
                                                style={{
                                                    fontSize: "clamp(8px, 4vw, 16px)",
                                                    margin: "auto"
                                                }}
                                                className='text-center mb-3 text-lg font-semibold text-gray-900'>
                                                เริ่มคัดเลือกแทร็กตั้งแต่วันที่ {simpleDMY(trackSelect.startAt)} - {simpleDMY(trackSelect.expiredAt)} <br />
                                                ประกาศผลวันที่ 23 พฤษภาคม 2567
                                            </p>
                                        </>
                                        :
                                        <>
                                            <h4
                                                style={{
                                                    fontSize: "clamp(16px, 5vw, 24px)",
                                                    margin: "auto"
                                                }}
                                                className="md:!mt-4 max-w-screen-md block font-semibold leading-snug tracking-normal text-gray-900 antialiased text-center text-2xl !mb-3">
                                                {trackSelect?.title}
                                            </h4>
                                            <p
                                                style={{
                                                    fontSize: "clamp(8px, 4vw, 16px)",
                                                    margin: "auto"
                                                }}
                                                className='text-center mb-3 text-lg font-semibold text-gray-900'>
                                                เริ่มคัดเลือกแทร็กตั้งแต่วันที่ {simpleDMY(trackSelect.startAt)} - {simpleDMY(trackSelect.expiredAt)} <br />
                                                ประกาศผลวันที่ 23 พฤษภาคม 2567
                                            </p>
                                            <div
                                                className='text-center my-5 text-[.85rem]'>
                                                การคัดเลือกความเชี่ยวชาญ หลักสูตรเทคโนโลยีสารสนเทศ&nbsp;
                                                <strong className='underline decoration-pink-500 underline-offset-2 decoration-2'>จบลงแล้ว</strong> หากยังไม่ได้ทำการเลือก
                                                ระบบจะทำการสุ่มให้ หากมีคำถามเพิ่มเติมติดต่อ <TMonlicaEmail />
                                            </div>
                                        </>

                                :
                                <>
                                    <h4
                                        style={{
                                            fontSize: "clamp(16px, 5vw, 24px)",
                                            margin: "auto"
                                        }}
                                        className="md:!mt-4 max-w-screen-md block font-semibold leading-snug tracking-normal text-gray-900 antialiased text-center text-2xl !mb-3">
                                        {trackSelect?.title}
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: "clamp(8px, 4vw, 16px)",
                                            margin: "auto"
                                        }}
                                        className='text-center mb-3 text-lg font-semibold text-gray-900'>
                                        ตั้งแต่วันที่ {simpleDMY(trackSelect.startAt)} - {simpleDMY(trackSelect.expiredAt)}
                                    </p>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-8 mb-2 max-w-screen-lg"
                                        style={{ margin: '0 auto' }}>
                                        <div className="flex flex-col">
                                            <input type="hidden" name='track_selection_id' defaultValue={trackSelect.id} readOnly />
                                            <input type="hidden" name='stu_id' defaultValue={userData.stu_id} readOnly />

                                            <div className='mt-5 text-center'>
                                                <label className="block font-bold text-black text-base">รายละเอียดวิชาที่ใช้ในการคัดเลือกและเกรดที่ได้</label>
                                                <label className="block text-sm font-medium text-black mt-2 mb-5">
                                                    <span className='text-red-500 font-bold'>*</span>
                                                    <span> โปรดตรวจสอบรายละเอียดเกรดของแต่ละวิชา หากตรวจสอบแล้วเกรดไม่ถูกต้องสามารถติดต่อ: </span>
                                                    <span className='text-red-500 font-bold'> *</span>
                                                    <br />
                                                    [ FB: <Link
                                                        className="text-blue-500"
                                                        href={`https://www.facebook.com/Arinchawut`}
                                                        size="sm"
                                                        target='_blank'
                                                        isexternal="true">
                                                        Arin Chawut
                                                    </Link> , &nbsp;
                                                    FB: <Link
                                                        className="text-blue-500"
                                                        href={`https://www.facebook.com/kiok127523`}
                                                        size="sm"
                                                        target='_blank'
                                                        isexternal="true">
                                                        Phubes Komutiban
                                                    </Link> ]
                                                </label>
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
                                                <label className="block font-bold text-black text-base">เลือกลำดับความเชี่ยวชาญ (แทร็ก) ที่ต้องการ</label>
                                                <label className="block text-sm font-medium mb-5 mt-2 text-default-500">
                                                    การคัดเลือกแทร็กจะเริ่มเลือกจากคนที่มีเกรดสูงที่สุดไปหาน้อยที่สุด หากแทร็กที่เลือกลำดับที่ 1 เต็ม จะได้แทร็กลำดับที่ 2 หรือลำดับที่ 3 ตามแทร็กที่ว่าง <br /> หากนักศึกษาไม่ดำเนินการในระยะเวลาที่กำหนด จะถือว่า <span className='italic font-bold'>สละสิทธิ์</span>  ในการเลือก และถือว่าให้ทางหลักสูตรดำเนินการแทน
                                                </label>
                                            </div>
                                            <div>
                                                {tracks.map((e, index) => (
                                                    <div key={index}>
                                                        <label className="block text-sm font-medium text-black mb-2">ลำดับที่ {index + 1}</label>
                                                        <div className="relative h-11 w-full mb-4">
                                                            <select
                                                                onChange={() => handleChange(event.target.value, index)}
                                                                required={true}
                                                                name={`track_order_${index + 1}`}
                                                                id={`track_order_${index + 1}`}
                                                                value={
                                                                    (orders[`order${index + 1}`]) ? orders[`order${index + 1}`] : ""
                                                                }
                                                                className="select-order bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-white dark:placeholder-black-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                                                                <option value="" disabled hidden>เลือกแทร็ก</option>
                                                                {tracks.map((track, index) => (
                                                                    <option
                                                                        style={{
                                                                            display: `${[orders.order1, orders.order2, orders.order3].includes(track.track) ? "none" : "block"}`
                                                                        }}
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
                                                radius='sm'
                                                className='mb-1 w-fit'
                                                type='button'
                                                onClick={clearForm}
                                                startContent={
                                                    <DeleteIcon className={"w-5 h-5"} />
                                                }
                                                color="primary">
                                                เคลียร์ฟอร์ม
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
                                                <p className="flex items-center text-sm font-normal leading-normal text-gray-700 antialiased">
                                                    ตรวจสอบข้อมูลเรียบร้อย (สามารถแก้ไขลำดับได้หลังจากยืนยัน จนถึงวันที่ {simpleDMY(trackSelect.expiredAt)})
                                                </p>
                                            </label>
                                        </div>
                                        <Button
                                            radius='sm'
                                            className='bg-blue-500 mt-4 block w-full text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                                            type="submit"
                                            disabled={!isConfirm || processing}
                                        >
                                            {
                                                !hasSelected ?
                                                    !processing ? "บันทึกข้อมูล" : "บันทึกข้อมูล..."
                                                    :
                                                    !processing ? "แก้ไข" : "แก้ไข..."
                                            }
                                        </Button>
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