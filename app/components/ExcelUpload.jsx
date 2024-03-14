"use client"

// ExcelUpload.js
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Pagination,
  Skeleton
} from '@nextui-org/react';

import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import '../style/excel.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function ExcelUpload({ onDataInsertXlsx, onClearFile }) {
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editingTbody, setEditingTbody] = useState(null);
  const [displayHeaders, setDisplayHeaders] = useState([]);
  const [originalHeaders, setOriginalHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [fileName, setFileName] = useState('')

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
      // prevent default to allow drop
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
      reader.readAsBinaryString(file);
      setFileName(file.name);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setData(parsedData);

        // Set initial headers based on the first row
        if (parsedData.length > 0) {
          const initialHeaders = Object.keys(parsedData[0]);
          setDisplayHeaders([...initialHeaders]);
          setOriginalHeaders([...initialHeaders]);
          showToastMessage(true, `เพิ่มไฟล์ ${file.name} สำเร็จ`);
        } else {
          showToastMessage(false, `ไม่มีข้อมูลในไฟล์ ${file.name}`);
        }
      };
    }
  };
  const handleInsertSubject = async () => {
    const { value } = await Swal.fire({
      text: `ตรวจสอบวิชาเรียบร้อยแล้วหรือไม่ ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก"
    });

    if (value) {
      try {
        const formattedData = data.map(row => {
          const formattedRow = {};
          displayHeaders.forEach((header, index) => {
            // Remove spaces from subject_code
            if (header === 'subject_code') {
              formattedRow[header] = row[originalHeaders[index]].replace(/\s/g, '');
            } else {
              formattedRow[header] = row[originalHeaders[index]];
            }
          });
          return formattedRow;
        });

        // Check if subject_code is present and not null for each row
        if (formattedData.every(row => row.subject_code !== undefined && row.subject_code !== null)) {
          // Check if any subject_code is null or contains spaces
          console.log('DATA', formattedData);
          if (formattedData.some(row => !row.subject_code.trim())) {
            showToastMessage(false, 'Code is null or contains spaces');
          } else {
            const result = await axios.post(`${hostname}/api/subjects/insertSubjectsFromExcel`, formattedData);
            console.log('DATA', formattedData);

            onDataInsertXlsx();

            // Check for duplicate subjects
            const duplicates = result.data.duplicates;
            const Notduplicates = result.data.data;
            if (duplicates.length > 0) {
              const duplicateCodes = duplicates.map(subject => subject.subject_code).join(', ');
              showToastMessage(false, `วิชาที่ซ้ำ: ${duplicateCodes}`);
              if (duplicateCodes.length > 0) {
                const notDuplicateCodes = Notduplicates.map(subject => subject.subject_code).join(', ');
                showToastMessage(true, `เพิ่มวิชา ${notDuplicateCodes} สำเร็จ`);
              }
              else {
                return;
              }
            } else {
              const NotduplicateCodes = Notduplicates.map(subject => subject.subject_code).join(', ');
              showToastMessage(true, `เพิ่มวิชา ${NotduplicateCodes} สำเร็จ`);
            }

            handleClearFile();
          }
        } else {
          showToastMessage(false, 'หัวตารางไม่ตรงกับ Database');
        }
      } catch (error) {
        console.error('Error inserting subjects:', error);
        showToastMessage(false, 'รหัสวิชาซ้ำ');
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

  return (
    <div
      className="App"
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="drop-container" id="dropcontainer">
        <span className="drop-title">Drop files here</span>
        or
        <input
          id="fileInput"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>

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
                className="rounded-s-none pl-0 py-2 px-4 text-sm text-gray-900 rounded-lg bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className='flex justify-end'>
              <div className="flex md:flex-row gap-3">
                <Button
                  className="w-1/2 ml-3"
                  onClick={handleInsertSubject}
                  color="primary"
                >
                  เพิ่มลงฐานข้อมูล
                  <PlusIcon className={'w-5 h-5 text-white md:block md:w-6 md:h-6'} />
                </Button>
                <Button
                  className="bg-red-400 text-white w-1/2"
                  onClick={handleClearFile}
                >
                  ล้างไฟล์
                  <DeleteIcon className={'w-5 h-5 text-white hidden md:block md:w-5 md:h-5'} />
                </Button>
              </div>

            </div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-3">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-black font-bold bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    semester
                  </th>
                  <th scope="col" className="px-6 py-3">
                    subject_code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    title_th
                  </th>
                  <th scope="col" className="px-6 py-3">
                    title_en
                  </th>
                  <th scope="col" className="px-6 py-3">
                    information
                  </th>
                  <th scope="col" className="px-6 py-3">
                    credit
                  </th>
                  <th scope="col" className="px-6 py-3">
                    acadyear
                  </th>
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
              <TableBody emptyContent={"ไม่มีข้อมูลวิชา"}>{[]}</TableBody>
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

export default ExcelUpload;