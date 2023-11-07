"use client"
import { useState, useEffect } from "react";
import React from 'react';
import { BiSearch } from 'react-icons/bi'

const TablePagination = (props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState(props.data);
    const [filteredData, setFilteredData] = useState(props.data);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const columns = Object.keys(props.data[0]);
    // const columns = ['id', "email", 'name']

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
            <div className="flex justify-end">
                <div className="rounded-e-none py-2 px-3 text-sm mb-3 text-gray-900 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <BiSearch className="w-5 h-5 text-white" />
                </div>
                <input
                    type="search"
                    id="search"
                    className="rounded-s-none pl-0 py-2 px-4 text-sm mb-3 text-gray-900 rounded-lg bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search..."
                    value={searchQuery}
                    style={{ width: '25%' }}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <table className="overflow-hidden w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} className="px-6 py-3">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {totalItems > 0 ? (
                        currentData.map((e) => (
                            <tr
                                key={e.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-700 dark:hover-bg-gray-600"
                            >
                                {columns.map((column, index) => (
                                    <td
                                        key={index}
                                        className={index === 0 ? "px-6 py-4 font-medium text-white whitespace-nowrap" : "text-white px-6 py-4"}
                                    >
                                        {e[column]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-700 dark:hover-bg-gray-600">
                            <td
                                colSpan={columns.length}
                                className="text-white px-6 py-4 text-center"
                            >
                                ไม่มีข้อมูล
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
            <div className="flex items-center justify-between border-t">
                <div className="flex flex-1 justify-between sm:hidden ">
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
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover-bg-indigo-500 hover-text-white focus:z-20 focus:outline-offset-0"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <ul className="flex justify-center ">
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
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover-bg-indigo-500 hover-text-white focus:z-20 focus:outline-offset-0 ${currentPage === index + 1 ? "bg-indigo-600 text-white" : ""
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
                        // {...totalItems > 0 ? "disabled" : ""}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover-bg-indigo-500 hover-text-white focus:z-20 focus:outline-offset-0"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TablePagination
