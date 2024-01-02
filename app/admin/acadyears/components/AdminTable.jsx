"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import React from 'react';
import { Button, Input } from "@nextui-org/react";
import { PlusIcon, EditIcon, DeleteIcon, SearchIcon } from "@/app/components/icons";
import { destroyAcadYear, destroyMultipleAcadYear } from './action';
import Swal from 'sweetalert2'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { dmy } from "@/src/util/dateFormater";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function checkCurrentYear(year) {
    const currentYear = new Date().getFullYear();
    if (year == currentYear + 543) {
        return true
    } else {
        return false
    }
}
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

export default function AdminTable({
    data, onOpenCreate, onOpenUpdate, callUpdate,
}) {
    const [initData, setInitData] = useState({})
    const [processStatus, setProcessStatus] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [checkedAll, setcheckedAll] = useState(false)
    const [itemsPerPage, setItemPerPage] = useState(10);
    let columns
    const modalRef = useRef()

    if (data.length > 0) {
        columns = Object.keys(data[0]);
    } else {
        columns = []
    }

    function clearInitData() {
        setInitData((prevData) => {
            const newData = { ...prevData };
            Object.keys(newData).forEach((acadyear) => {
                newData[acadyear] = false;
            });
            return newData;
        });
    }

    useEffect(() => {
        setFilteredData(data)
        clearInitData()
    }, [data])

    useEffect(() => {
        function checkIfClickedOutside(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                clearInitData()
            }
        }
        document.addEventListener("click", checkIfClickedOutside)
        return () => {
            document.removeEventListener("click", checkIfClickedOutside)
        }
    })

    useEffect(() => {
        const checkBoxs = document.querySelectorAll('.acadCheckbox')
        let status
        if (checkedAll) {
            status = true
        } else {
            status = false
        }
        for (const checkBox of checkBoxs) {
            checkBox.checked = status
        }
    }, [checkedAll])

    async function handlerDestroy(id) {
        setProcessStatus(prevStatus => ({ ...prevStatus, [id]: true }));
        const result = await destroyAcadYear(id);
        setProcessStatus(prevStatus => ({ ...prevStatus, [id]: false }));
        return result
    }
    async function handlerMultipleDestroy() {
        const form = document.forms["multipleDelete"]
        const acadCheckbox = form.querySelectorAll(".acadCheckbox")
        let formData = []
        acadCheckbox.forEach(e => {
            if (e.checked) {
                formData.push(e.value);
            }
        });
        if (!formData.length) return
        Swal.fire({
            // title: `ต้องการลบปีการศึกษา ${e["acadyear"]} หรือไม่ ?`,
            text: `ต้องการลบปีการศึกษา ${formData.join(", ")} หรือไม่ ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                document.querySelector("#checkAllBtn").checked = false
                setcheckedAll(false)
                acadCheckbox.forEach(e => {
                    e.checked = false
                });
                const { ok, message } = await destroyMultipleAcadYear(formData)
                showToastMessage(ok, message)
            }
        });
    }

    function handleSearch(query) {
        setSearchQuery(query);
        if (query) {
            const filtered = data.filter((item) =>
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(query.toLowerCase())
            );
            setFilteredData(filtered);
            setCurrentPage(1);
        } else {
            setFilteredData(data);
        }
    }

    function handleIconClick(acadyear) {
        if (initData[acadyear]) {
            clearInitData()
        } else {
            clearInitData()
            setInitData((prevData) => ({
                ...prevData,
                [acadyear]: !prevData[acadyear],
            }));
        }
    };

    useEffect(() => {
        totalItems = filteredData.length;
        totalPages = Math.ceil(totalItems / itemsPerPage);

        startIndex = (currentPage - 1) * itemsPerPage;
        endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        currentData = filteredData.slice(startIndex, endIndex);
    }, [itemsPerPage])

    let totalItems = filteredData.length;
    let totalPages = Math.ceil(totalItems / itemsPerPage);

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    let currentData = filteredData.slice(startIndex, endIndex);

    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row justify-end gap-3 mb-3">
                <div className="flex justify-end">
                    <div className="flex justify-center items-center rounded-e-none py-2 px-3 text-sm text-gray-900 rounded-lg bg-gray-100">
                        <SearchIcon width={16} height={16} />
                    </div>
                    <input
                        type="search"
                        id="search"
                        className="rounded-s-none pl-0 py-2 px-4 text-sm text-gray-900 rounded-lg bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search..."
                        value={searchQuery}
                        style={{ width: '100%' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div className="flex md:flex-row gap-3">
                    <Button
                        className="w-1/2"
                        onPress={onOpenCreate}
                        color="primary"
                    >
                        Add New
                        <PlusIcon className={'w-5 h-5 text-white hidden md:block md:w-6 md:h-6'} />
                    </Button>
                    <Button
                        className="bg-red-400 text-white w-1/2"
                        onClick={handlerMultipleDestroy}
                    >
                        Delete Select
                        <DeleteIcon className={'w-5 h-5 text-white hidden md:block md:w-8 md:h-8'} />
                    </Button>
                </div>
            </div>
            <ToastContainer />
            <form name="multipleDelete">
                <table className="w-full block md:table overflow-x-auto text-sm text-left text-gray-500">
                    {
                        data.length > 0 ?
                            (<>
                                <thead className="text-xs bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-center">
                                            <input type="checkbox" id="checkAllBtn" onChange={() => setcheckedAll(!checkedAll)} />
                                        </th>
                                        {columns.map((column, index) => (
                                            <th key={column} className="px-6 py-3 text-center">
                                                {column}
                                            </th>
                                        ))}
                                        <th key="action" className="px-6 py-3 text-center" colSpan={2}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {totalItems > 0 ? (
                                        currentData.map((e, i) => (
                                            <tr key={i} className="bg-white border-b">
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        className="acadCheckbox"
                                                        type="checkbox"
                                                        name="acadyears[]"
                                                        value={e["acadyear"]} />
                                                </td>
                                                {columns.map((column, index) => (
                                                    <td
                                                        key={`${column}-${i}`}
                                                        className="text-gray-900 px-6 py-4 text-center"
                                                    >
                                                        {
                                                            // current year
                                                            column === "acadyear" ?
                                                                (
                                                                    <div className="flex flex-col md:flex-row justify-center items-center gap-1 md:gap-3">
                                                                        {checkCurrentYear(e[column]) &&
                                                                            <span className="block text-sm text-gray-400 py-[.05em] px-[.4em] border border-gray-200 rounded-full">
                                                                                current
                                                                            </span>
                                                                        }
                                                                        <span className="block">{e[column]}</span>
                                                                    </div>
                                                                )
                                                                :
                                                                ["createdAt", "updatedAt"].includes(column) ?
                                                                    (<span>{dmy(e[column])}</span>)
                                                                    :
                                                                    (<span>{e[column]}</span>)
                                                        }
                                                    </td>
                                                ))}
                                                <td className="text-center" key={`action-${i}`}>
                                                    <div className="relative flex items-center justify-center cursor-pointer">
                                                        {/* <div className="p-1 bg-gray-700 text-white active:scale-90 border rounded-full">
                                                    </div> */}
                                                        <HiOutlineDotsVertical
                                                            onClick={() => handleIconClick(e.acadyear)}
                                                            className="w-6 h-6 active:scale-90" />
                                                        {
                                                            initData[e["acadyear"]] &&
                                                            <div
                                                                ref={modalRef}
                                                                className={`absolute z-50 select-none 
                                                            flex flex-col items-start justify-center 
                                                            gap-1 p-2 top-5 border border-gray-200 bg-white
                                                            rounded-md
                                                            `}>
                                                                <button
                                                                    type="button"
                                                                    className="w-full flex flex-row py-1 px-2 gap-2 justify-start items-center hover:border-s-2 hover:border-gray-600"
                                                                    onClick={
                                                                        async () => {
                                                                            await callUpdate(e["acadyear"])
                                                                            onOpenUpdate()
                                                                        }
                                                                    }
                                                                >
                                                                    <EditIcon className={"w-7 h-7"} />
                                                                    <p className="w-full text-start">
                                                                        Edit
                                                                    </p>
                                                                </button>
                                                                <button type="button" className="w-full flex flex-row py-1 px-2 gap-2 justify-start items-center group hover:border-s-2 hover:border-red-400"
                                                                    onClick={() => {
                                                                        Swal.fire({
                                                                            // title: `ต้องการลบปีการศึกษา ${e["acadyear"]} หรือไม่ ?`,
                                                                            text: `ต้องการลบปีการศึกษา ${e["acadyear"]} หรือไม่ ?`,
                                                                            icon: "warning",
                                                                            showCancelButton: true,
                                                                            confirmButtonColor: "#3085d6",
                                                                            cancelButtonColor: "#d33",
                                                                            confirmButtonText: "ตกลง",
                                                                            cancelButtonText: "ยกเลิก"
                                                                        }).then(async (result) => {
                                                                            if (result.isConfirmed) {
                                                                                const { ok, message } = await handlerDestroy(e["acadyear"])
                                                                                showToastMessage(ok, message)
                                                                            }
                                                                        });

                                                                    }}
                                                                    disabled={processStatus[e["acadyear"]]}
                                                                >
                                                                    <DeleteIcon className="w-7 h-7 text-red-400 group-hover:text-whites" />
                                                                    <p className="w-full text-red-400 text-start group-hover:text-whites">
                                                                        {processStatus[e["acadyear"]] ? "Deleting..." : "Delete"}
                                                                    </p>
                                                                </button>
                                                            </div>
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr key="no-data" className="bg-white border-b">
                                            <td
                                                key="data-action"
                                                colSpan={columns.length + 2}
                                                className="text-gray-900 px-6 py-4 text-center"
                                            >
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </>)
                            :
                            (<>
                                <thead className="text-xs bg-gray-50">
                                    <tr>
                                        <th key="no" className="px-6 py-3 text-center">
                                            acadyears
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b">
                                        <td className="text-gray-900 px-6 py-4 text-center">
                                            ไม่มีข้อมูลปีการศึกษา
                                        </td>
                                    </tr>
                                </tbody>
                            </>)
                    }
                </table>
            </form>
            <div className="flex items-center justify-between mt-3">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover-bg-gray-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-4">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing
                            <span className="font-medium"> {startIndex + 1} </span>
                            to
                            <span className="font-medium"> {endIndex} </span>
                            of
                            <span className="font-medium"> {totalItems} </span>
                            results
                        </p>
                    </div>
                </div>
                <div className="isolate -space-x-px rounded-md mt-4 items-center hidden sm:flex sm:flex-1 justify-end">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover-bg-blue-500 hover-text-gray-900 focus:z-20 focus:outline-offset-0"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <ul className="flex justify-center">
                        {Array.from({ length: totalPages }, (_, index) => {
                            if (
                                totalPages > 5 &&
                                index !== 0 &&
                                index !== totalPages - 1 &&
                                Math.abs(index - currentPage) > 2
                            ) {
                                if (index === 1 || index === totalPages - 2) {
                                    return (
                                        <li key={index}>
                                            <button
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover-bg-gray-50 focus:z-20 focus:outline-offset-0`}
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    );
                                } else if (index === 2 || index === totalPages - 3) {
                                    return (
                                        <li key={index}>
                                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover-bg-gray-50 focus:z-20 focus:outline-offset-0">...</span>
                                        </li>
                                    );
                                }
                                return null; // Hide other buttons
                            }
                            return (
                                <li key={index}>
                                    <button
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover-bg-blue-500 hover-text-gray-900 focus:z-20 focus:outline-offset-0 ${currentPage === index + 1 ? "bg-blue-600 text-white" : ""
                                            }`}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover-bg-blue-500 hover-text-gray-900 focus:z-20 focus:outline-offset-0"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div >
    );
};
