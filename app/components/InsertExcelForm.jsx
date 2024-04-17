"use client"
import { useState, useEffect } from "react";
import { read, utils, writeFile } from "xlsx";
import axios from 'axios';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Pagination, } from '@nextui-org/react';
import { PlusIcon, DeleteIcon, SearchIcon } from "@/app/components/icons";
import '../style/excel.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FiDownload } from "react-icons/fi";

const swal = Swal.mixin({
    customClass: {
        confirmButton: "btn bg-blue-500 border-1 border-blue-500 text-white ms-3 hover:bg-blue-600 hover:border-blue-500",
        cancelButton: "btn border-1 text-blue-500 border-blue-500 bg-white hover:bg-gray-100 hover:border-blue-500"
    },
    buttonsStyling: false
});

const InsertExcelForm = ({ headers, hook, closeModal, callData, templateFileName }) => {
    const [data, setData] = useState([]);
    const [editingCell, setEditingCell] = useState(null);
    const [editingTbody, setEditingTbody] = useState(null);
    const [displayHeaders, setDisplayHeaders] = useState([]);
    const [originalHeaders, setOriginalHeaders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [inserting, setInserting] = useState(false)
    const [uploadingFile, setUploadingFile] = useState(false)

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

    const handleFileUpload = (e) => {
        e.preventDefault();
        const dropContainer = document.getElementById("dropcontainer")
        const fileInput = document.getElementById("fileInput")

        dropContainer.addEventListener("dragover", (e) => {
            e.preventDefault()
        }, false)

        dropContainer.addEventListener("dragenter", () => {
            dropContainer.classList.add("drag-active")
        })

        dropContainer.addEventListener("dragleave", () => {
            dropContainer.classList.remove("drag-active")
        })

        dropContainer.addEventListener("drop", (e) => {
            e.preventDefault()
            dropContainer.classList.remove("drag-active")
            fileInput.files = e.dataTransfer.files
        })

        const reader = new FileReader();
        let file;

        if (e.dataTransfer && e.dataTransfer.items) {
            // Handle file drop
            file = e.dataTransfer.items[0]?.getAsFile();
        } else if (e.target.files) {
            // Handle file input change
            file = e.target.files[0];
        }

        if (file) {
            setUploadingFile(true)
            reader.readAsBinaryString(file);
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = utils.sheet_to_json(sheet);
                setData(parsedData);

                // Set initial headers based on the first row
                if (parsedData.length > 0) {
                    const initialHeaders = Object.keys(parsedData[0]);
                    setDisplayHeaders([...initialHeaders]);
                    setOriginalHeaders([...initialHeaders]);
                } else {
                    showToastMessage(false, `ไม่มีข้อมูลในไฟล์ ${file.name}`);
                }
            };
            setUploadingFile(true)
        }
    };

    async function sendDataInBatches(formattedData, options) {
        const batchSize = 1000; 
        const numBatches = Math.ceil(formattedData.length / batchSize);
        const batchPromises = [];
    
        for (let i = 0; i < numBatches; i++) {
            const start = i * batchSize;
            const end = Math.min((i + 1) * batchSize, formattedData.length);
            const chunk = formattedData.slice(start, end);
            const requestOptions = { ...options, data: chunk };
            batchPromises.push(axios(requestOptions));
        }
    
        try {
            await Promise.all(batchPromises);
            return true
        } catch (error) {
            return false
        }
    }

    const handleInsertData = async () => {
        const { value } = await swal.fire({
            text: `ตรวจสอบข้อมูลเรียบร้อยแล้วหรือไม่ ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        });

        if (value) {
            // trim branch
            let formattedData = data.map(row => {
                const formattedRow = {};
                displayHeaders.forEach((header, index) => {
                    const headerTrim = header.trim()
                    formattedRow[headerTrim] = row[originalHeaders[index]];
                });
                return formattedRow;
            });

            // convert key to lowercase
            formattedData = formattedData.map(row => {
                return Object.fromEntries(
                    Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
                );
            });
            try {
                const { status, options } = await hook(formattedData)
                if (status) {
                    setInserting(true)
                    if (formattedData.length <= 250) {
                        options.data = formattedData
                        try {
                            const result = await axios(options)
                            const { message } = result.data
                            showToastMessage(true, message);
                        } catch (error) {
                            showToastMessage(false, "ไฟล์ใหย่โพด");
                        }
                    } else {
                        console.time('executionTime');
                        const batchStatus = await sendDataInBatches(formattedData, options)
                        console.timeEnd('executionTime');
                        if (batchStatus) {
                            showToastMessage(true, "เพิ่มข้อมูลสำเร็จ");
                        } else {
                            showToastMessage(false, "ไฟล์ใหย่โพด");
                        }
                    }
                    setInserting(false)
                } else {
                    showToastMessage(false, 'โปรดแก้ไขหัวตาราง');
                }
            } catch (error) {
                console.log(error);
            } finally {
                callData()
                handleClearFile();
                closeModal()
            }

        }
    };

    const handleClearFile = () => {
        setData([]);
        setEditingCell(null);
        setDisplayHeaders([]);
        setOriginalHeaders([]);
        document.getElementById("fileInput").value = null;
    };

    const handleDoubleClick = (rowIndex, columnIndex) => {
        setEditingCell({ rowIndex, columnIndex });
    };

    const handleCellBlur = () => {
        setEditingCell(null);
    };
    const handleCellBlurTbody = () => {
        setEditingTbody(null);
    };

    const handleCellChange = (e, rowIndex, columnIndex) => {
        if (editingCell && editingCell.columnIndex !== undefined) {
            const newHeaders = [...displayHeaders];
            newHeaders[editingCell.columnIndex] = e.target.value;
            setDisplayHeaders(newHeaders);
        }
    };
    const handleCellDoubleClick = (rowIndex, columnIndex) => {
        setEditingTbody({ rowIndex, columnIndex });
    };

    const handleCellInputChange = (e, rowIndex, columnIndex) => {
        if (editingTbody && editingTbody.columnIndex !== undefined) {
            const newData = [...data];
            newData[rowIndex][originalHeaders[columnIndex]] = e.target.value;
            setData(newData);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFileUpload(e);
    };

    useEffect(() => {
        // Attach the onDrop event listener to the document
        document.addEventListener("drop", handleDrop);

        // Clean up the event listener when the component is unmounted
        return () => {
            document.removeEventListener("drop", handleDrop);
        };
    }, []);

    useEffect(() => {
        const filteredResults = data.filter((row) =>
            Object.values(row).some(
                (value) =>
                    value &&
                    value
                        .toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )
        );
        setFilteredData(filteredResults);
    }, [data, searchQuery]);

    //Paginations
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(6);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const downloadTemplate = () => {
        try {
            const wb = utils.book_new();
            const headersCol = headers.map(header => header.label);
            const data = [{}];
            const ws = utils.json_to_sheet(data, { header: headersCol });
            utils.book_append_sheet(wb, ws, 'students');
            writeFile(wb, `${templateFileName}.xlsx`);
        } catch (error) {
            console.error('Error exporting Excel:', error);
        }
    };

    return (
        <div
            className="App"
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="drop-container" id="dropcontainer">
                <span className="drop-title">ลากไฟล์ลงที่นี่</span>
                หรือ
                <input
                    id="fileInput"
                    name="fileInput"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                />
            </div>
            {data.length == 0 && (
                <div className="mt-5 mx-auto w-fit">
                    <Button
                        isLoading={uploadingFile}
                        isDisabled={uploadingFile}
                        radius="sm"
                        className=""
                        onClick={downloadTemplate}
                        color="primary"
                        endContent={<FiDownload className="w-4 h-4 text-white" />}
                    >
                        {uploadingFile ?
                            <>กำลังอัพโหลดไฟล์</>
                            :
                            <>ดาวน์โหลด Template</>
                        }
                    </Button>
                </div>
            )}
            {data.length > 0 && (
                <>
                    <div className="flex flex-col md:flex-row justify-between gap-3 my-3">
                        <div className="flex justify-start">
                            <div className="flex justify-center items-center rounded-e-none py-2 px-3 text-sm text-gray-900 rounded-lg bg-gray-100">
                                <SearchIcon width={16} height={16} />
                            </div>
                            <input
                                type="search"
                                id="search"
                                name="search"
                                className="rounded-s-none pl-0 py-2 px-4 text-sm text-gray-900 rounded-lg bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ค้นหานักศึกษา"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <div className='flex justify-end'>
                            <div className="flex md:flex-row gap-3">
                                <Button
                                    isLoading={inserting}
                                    isDisabled={inserting}
                                    className=""
                                    onClick={handleInsertData}
                                    color="primary"
                                >
                                    เพิ่มข้อมูล
                                    <PlusIcon className={'w-4 h-4 text-white md:block md:w-6 md:h-6'} />
                                </Button>
                                <Button
                                    className="bg-red-400 text-white"
                                    onClick={handleClearFile}
                                >
                                    ล้างไฟล์
                                    <DeleteIcon className={'w-4 h-4 text-white hidden md:block md:w-5 md:h-5'} />
                                </Button>
                            </div>

                        </div>
                    </div>
                    <div className="relative overflow-x-auto sm:rounded-lg mb-3 border-1">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-black font-bold bg-gray-50">
                                <tr>
                                    {headers.map(header => (
                                        header?.required == true ?
                                            <th key={`header-${header.label}`} scope="col" className="px-4 py-3">
                                                <p className="flex gap-1">{header.label} <span className="text-red-500">*</span></p>
                                            </th>
                                            :
                                            <th key={`header-${header.label}`} scope="col" className="px-4 py-3">
                                                {header.label}
                                            </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>

                    <Table>
                        <TableHeader>
                            {displayHeaders.map((header, index) => (
                                <TableColumn key={header} onDoubleClick={() => handleDoubleClick(null, index)}>
                                    {editingCell && editingCell.columnIndex === index ? (
                                        <input
                                            id={`header-${index}`}
                                            name={`header-${index}`}
                                            value={header}
                                            type="text"
                                            onChange={(e) => handleCellChange(e, null, index)}
                                            onBlur={handleCellBlur}
                                            autoFocus
                                        />
                                    ) : (
                                        header
                                    )}
                                </TableColumn>
                            ))}
                        </TableHeader>
                        {currentData.length > 0 ? (
                            <TableBody>
                                {currentData.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {originalHeaders.map((originalHeader, columnIndex) => (
                                            <TableCell
                                                key={originalHeader}
                                                onDoubleClick={() => handleCellDoubleClick(rowIndex, columnIndex)}
                                            >
                                                {editingTbody &&
                                                    editingTbody.rowIndex === rowIndex &&
                                                    editingTbody.columnIndex === columnIndex ? (
                                                    <input
                                                        id={`cell-body-${rowIndex}`}
                                                        name={`cell-body-${rowIndex}`}
                                                        type="text"
                                                        value={row[originalHeader]}
                                                        onChange={(e) =>
                                                            handleCellInputChange(e, rowIndex, columnIndex)
                                                        }
                                                        onBlur={handleCellBlurTbody}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    row[originalHeader]
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={"ไม่มีข้อมูลนักศึกษา"}>{[]}</TableBody>
                        )}
                    </Table>
                    <Pagination
                        currentPage={currentPage}
                        onChange={(page) => handleChangePage(page)}
                        total={totalPages}
                        showControls
                        className='flex justify-center mt-3'
                    />
                </>
            )}
        </div>
    );
}

export default InsertExcelForm