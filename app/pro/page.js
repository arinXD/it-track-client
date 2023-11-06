"use client"
import { useState, useEffect } from "react";

export default function About() {
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        async function fetchData() {
            try {
                // const result = await fetch("http://localhost:4000/users")
                const result = await fetch(
                    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
                )
                const jsonData = await result.json();
                setData(jsonData);
                setFilteredData(jsonData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }

        fetchData();
    }, []);

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
            setCurrentPage(1); // Reset to the first page when searching.
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
                <input
                    type="search"
                    id="search"
                    className="p-4 pl-10 text-sm mb-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search"
                    value={searchQuery}
                    style={{ width: '30%' }}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3">No</th>
                        <th className="px-6 py-3">อีเมล</th>
                        <th className="px-6 py-3">ชื่อผู้ใช้</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((e) => (
                        <tr
                            key={e.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-700 dark:hover-bg-gray-600"
                        >
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {e.id}
                            </td>
                            <td className="px-6 py-4">{e.name_th}</td>
                            <td className="px-6 py-4">{e.name_en}</td>
                        </tr>
                    ))}
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
                                    // Show the first and last page
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
                                    // Show an ellipsis
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
