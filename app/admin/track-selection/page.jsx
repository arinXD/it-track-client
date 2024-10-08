"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import TrackSelectTable from './TrackSelectTable';
import CreateModal from './CreateModal';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchData } from '../action'
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction'
import { useDisclosure } from "@nextui-org/react";
import { getAcadyears } from '@/src/util/academicYear';
import { message } from 'antd';

const Page = () => {

    const swal = useCallback(Swal.mixin({
        customClass: {
            confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
            cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
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

    const [trackSelection, setTrackSelection] = useState([])
    const acadyear = getAcadyears()
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)

    const { isOpen, onOpen, onClose } = useDisclosure();

    const callTrackSelection = useCallback(async function () {
        let trackSelections = await fetchData("/api/tracks/selects")
        setTrackSelection(trackSelections)
    }, [])

    const callSubject = useCallback(async function () {
        let subjects = await fetchData("/api/subjects")
        const filterSubjects = subjects.filter(subject => subject.subject_code.includes('SC') || subject.subject_code.includes('CP'))
        setSubjects(filterSubjects)
    }, [])

    const init = useCallback(async () => {
        await callTrackSelection()
        await callSubject()
        setLoading(false)
    }, [])

    useEffect(() => {
        init()
    }, [])

    const handleOpen = useCallback(function () {
        onOpen()
    }, [])

    const handleSubmit = useCallback(async function (formData) {
        try {
            const url = "/api/tracks/selects"
            const options = await getOptions(url, "POST", formData)
            const result = await axios(options)
            const { message: msg } = result.data

            // refresh track selection data
            await callTrackSelection()
            onClose()
            message.success(msg)
            return
        } catch (error) {
            const msg = error?.response?.data?.message
            message.warning(msg)
            return
        }
    }, [])

    const handleDelete = useCallback(async function (acadyear) {
        swal.fire({
            text: `ต้องการลบการคัดแทร็กปีการศึกษา ${acadyear} หรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = `/api/tracks/selects/${acadyear}`
                const options = await getOptions(url, 'DELETE')
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        showToastMessage(ok, message)
                        callTrackSelection()
                    })
                    .catch(error => {
                        const message = error.response.data.message
                        showToastMessage(false, message)
                    })
            }
        });
    }, [])

    const handleStartSelect = useCallback(async function ({ id, hasFinished }) {
        swal.fire({
            text: `ต้องการ${hasFinished ? "เปลี่ยนสถานะการคัดเลือก" : "เริ่มคัดเลือก"}หรือไม่?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = `/api/tracks/selects/selected/${id}`
                const options = await getOptions(url, 'PUT')
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        callTrackSelection()
                        showToastMessage(ok, message)
                    })
                    .catch(error => {
                        console.log(error);
                        const message = error?.response?.data?.message
                        showToastMessage(false, message)
                    })
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

                <ToastContainer />

                {/* Create modal */}
                <CreateModal
                    acadyear={acadyear}
                    subjects={subjects}
                    handleSubmit={handleSubmit}
                    isOpen={isOpen}
                    onClose={onClose} />

                {/* table */}
                <TrackSelectTable
                    swal={swal}
                    loading={loading}
                    handleDelete={handleDelete}
                    handleOpen={handleOpen}
                    trackSelection={trackSelection}
                    handleStartSelect={handleStartSelect}
                    callTrackSelection={callTrackSelection}
                    showToastMessage={showToastMessage}
                />



            </ContentWrap>
        </>
    )
}

export default Page