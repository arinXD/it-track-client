"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { Button, Input } from "@nextui-org/react";
import { PlusIcon, EditIcon, DeleteIcon } from "@/app/components/icons";
import { destroyAcadYear } from './action';
import { useRouter, usePathname } from 'next/navigation'

function checkCurrentYear(year) {
    const currentYear = new Date().getFullYear();
    if (year == currentYear + 543) {
        return (
            <span className="inline-block ms-4 text-sm text-gray-400 py-[.15em] px-[.7em] border border-gray-200 rounded-full">
                current year
            </span>
        )
    } else {
        return null
    }
}


export default function AdminTable({ data, pathname, onOpen }) {

    async function handlerDestroy(id) {
        const result = await destroyAcadYear(id)
        if (result) {
            console.log(result);
            console.log(url);
            router.push(url);
        }
    }
    
    const router = useRouter()
    const url = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const columns = Object.keys(data[0]);

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

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentData = filteredData.slice(startIndex, endIndex);

    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-end gap-4">
                <div className="flex justify-end">
                    <div className="rounded-e-none py-2 px-3 text-sm mb-3 text-gray-900 rounded-lg bg-gray-100">
                        <BiSearch className="w-5 h-5 text-gray-900" />
                    </div>
                    <input
                        type="search"
                        id="search"
                        className="rounded-s-none pl-0 py-2 px-4 text-sm mb-3 text-gray-900 rounded-lg bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search..."
                        value={searchQuery}
                        style={{ width: '100%' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <Button onPress={onOpen} color="primary" endContent={<PlusIcon />}>
                    Add New
                </Button>
            </div>
            <table className="overflow-hidden w-full text-sm text-left text-gray-500">
                <thead className="text-xs bg-gray-50">
                    <tr>
                        <th key="no" className="px-6 py-3">
                            No.
                        </th>
                        {columns.map((column, index) => (
                            <th key={column} className="px-6 py-3">
                                {column}
                            </th>
                        ))}
                        <th key="action" className="px-6 py-3" colSpan={2}>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {totalItems > 0 ? (
                        currentData.map((e, i) => (
                            <tr key={i} className="bg-white border-b">
                                <td
                                    key={`number-${i}`}
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    {i + 1}
                                </td>
                                {columns.map((column, index) => (
                                    <td
                                        key={`${column}-${i}`}
                                        className="text-gray-900 px-6 py-4"
                                    >
                                        {
                                            // current year
                                            column === "acadyear" ?
                                                (<>{e[column]} {checkCurrentYear(e[column])}</>)

                                                :
                                                (<>{e[column]}</>)
                                        }
                                    </td>
                                ))}
                                <td key={`action-${i}`}>
                                    <div className="flex flex-row items-center gap-3">
                                        <Link href={`${pathname}/${e["acadyear"]}`}>
                                            <Button className="bg-yellow-300" startContent={<EditIcon className="w-5 h-5" />}>
                                                Edit
                                            </Button>
                                        </Link>

                                        <Link href={"#"}>
                                            <Button onClick={() => handlerDestroy(e["acadyear"])} className="bg-red-500 text-white" startContent={<DeleteIcon className="w-5 h-5" />}>
                                                Delete
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr key="no-data" className="bg-white border-b">
                            <td
                                key="data-action"
                                colSpan={columns.length}
                                className="text-gray-900 px-6 py-4 text-center"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="flex items-center justify-between border-t">
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
        </div>
    );
};
