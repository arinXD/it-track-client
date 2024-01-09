"use client"
import React, { useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import TrackSelectTable from './TrackSelectTable';
import CreateModal from './CreateModal';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchData } from '../action'
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { getToken } from '@/app/components/serverAction/TokenAction'
import { useDisclosure } from "@nextui-org/react";

const Page = () => {
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

    const [trackSelection, setTrackSelection] = useState([])
    const [acadyear, setAcadyear] = useState([])
    const [subjects, setSubjects] = useState([])

    const { isOpen, onOpen, onClose } = useDisclosure();

    async function callData() {
        let data = await fetchData("/api/tracks/selects")
        const acadData = await fetchData("/api/acadyear")
        let subjData = await fetchData("/api/subjects")
        subjData = subjData.filter(element => element.subject_code.includes('SC') || element.subject_code.includes('CP'))
        setTrackSelection(data)
        setAcadyear(acadData)
        setSubjects(subjData)
    }

    useEffect(() => {
        callData()
    }, [])

    function handleOpen() {
        onOpen()
    }

    async function handleSubmit(formData) {
        const token = await getToken()
        try {
            const options = {
                url: `${hostname}/api/tracks/selects`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    "authorization": `${token}`,
                },
                data: formData
            };
            const result = await axios(options)
            const { ok, message } = result.data
            await callData()
            showToastMessage(ok, message)
            return
        } catch (error) {
            const message = error?.response?.data?.message
            showToastMessage(false, message)
            return
        }
    }

    async function handleDelete(acadyear) {
        Swal.fire({
            text: `ต้องการลบการคัดแทรคปีการศึกษา ${acadyear} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = await getToken()
                const options = {
                    url: `${hostname}/api/tracks/selects/${acadyear}`,
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "authorization": `${token}`,
                    },
                };
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        showToastMessage(ok, message)
                        await callData()
                    })
                    .catch(error => {
                        const message = error.response.data.message
                        showToastMessage(false, message)
                    })
            }
        });
    }

    async function handleSelectedDel(acad) {
        if (acad.length == 0) return
        Swal.fire({
            text: `ต้องการลบการคัดแทรคปีการศึกษา ${acad.join(", ")} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = await getToken()
                const options = {
                    url: `${hostname}/api/tracks/selects/del/selected`,
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        "authorization": `${token}`,
                    },
                    data: {
                        acadArr: acad
                    }
                };
                axios(options)
                    .then(async result => {
                        const { ok, message } = result.data
                        showToastMessage(ok, message)
                        await callData()
                        // Select All
                        const selectAllElement = document.querySelectorAll('[aria-label="Select All"]')
                        const selectElement = document.querySelectorAll('[aria-label="Select"]')
                        selectElement.forEach(element => {
                            if (element.tagName === "input") {
                                element.checked = false
                            } else {
                                element.setAttribute("data-selected", false)
                            }
                        });
                        selectAllElement.forEach(element => {
                            if (element.tagName === "input") {
                                element.checked = false
                            } else {
                                element.setAttribute("data-selected", false)
                            }
                        });
                    })
                    .catch(error => {
                        const message = error.response.data.message
                        showToastMessage(false, message)
                    })
            }
        });
    }

    async function handleStartSelect(id) {
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
        axios(options)
            .then(async result => {
                const { ok, message } = result.data
                showToastMessage(ok, message)
                await callData()
            })
            .catch(error => {
                const message = error.response.data.message
                showToastMessage(false, message)
            })
    }

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
                    handleDelete={handleDelete}
                    handleOpen={handleOpen}
                    trackSelection={trackSelection}
                    handleSelectedDel={handleSelectedDel}
                    handleStartSelect={handleStartSelect}
                />



            </ContentWrap>
        </>
    )
}

export default Page