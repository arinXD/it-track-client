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

import { useDropzone } from 'react-dropzone';
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import '../style/excel.css';

function ExcelUpload({ onDataInsertXlsx, onClearFile }) {
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editingTbody, setEditingTbody] = useState(null);
  const [displayHeaders, setDisplayHeaders] = useState([]);
  const [originalHeaders, setOriginalHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

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

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setData(parsedData);

        // Set initial headers based on the first row
        const initialHeaders = Object.keys(parsedData[0]);
        setDisplayHeaders([...initialHeaders]);
        setOriginalHeaders([...initialHeaders]);
      };
    }
  };
  const handleInsertSubject = async () => {
    try {

      const formattedData = data.map(row => {
        const formattedRow = {};
        displayHeaders.forEach((header, index) => {
          formattedRow[header] = row[originalHeaders[index]];
        });
        return formattedRow;
      });

      const result = await axios.post(`${hostname}/api/subjects/insertSubjectsFromExcel`, formattedData);
      console.log('Inserted subjects:', result.data.data);

      onDataInsertXlsx();
      handleClearFile();
    } catch (error) {
      console.error('Error inserting subjects:', error);
      // Handle error if needed
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
    // Filter data based on searchQuery
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const filteredRows = data.filter((row) => {
      return originalHeaders.some((header) =>
        row[header].toLowerCase().includes(lowerCaseSearchQuery)
      );
    });
    setFilteredData(filteredRows);
  }, [data, originalHeaders, searchQuery]);

  return (
    <div
      className="App"
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="drop-container" id="dropcontainer">
        <span class="drop-title">Drop files here</span>
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='flex justify-end'>
              <div className="flex md:flex-row gap-3">
                <Button
                  className="w-1/2 ml-3"
                  onClick={handleInsertSubject}
                  color="primary"
                >
                  Add to Database
                  <PlusIcon className={'w-5 h-5 text-white hidden md:block md:w-6 md:h-6'} />
                </Button>
                <Button
                  className="bg-red-400 text-white w-1/2"
                  onClick={handleClearFile}
                >
                  Clear File
                  <DeleteIcon className={'w-5 h-5 text-white hidden md:block md:w-5 md:h-5'} />
                </Button>
              </div>

            </div>
          </div>
          {data.length > 0 ? (
            <Table
              removeWrapper>
              <TableHeader>
                {displayHeaders.map((header, index) => (
                  <TableColumn key={index} onDoubleClick={() => handleDoubleClick(null, index)}>
                    {editingCell && editingCell.columnIndex === index ? (
                      <input
                        value={header}
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
              {filteredData.length > 0 ? (
                <TableBody>
                  {filteredData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {originalHeaders.map((originalHeader, columnIndex) => (
                        <TableCell
                          key={columnIndex}
                          onDoubleClick={() => handleCellDoubleClick(rowIndex, columnIndex)}
                        >
                          {editingTbody &&
                            editingTbody.rowIndex === rowIndex &&
                            editingTbody.columnIndex === columnIndex ? (
                            <input
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
                <TableBody emptyContent="ไม่มีข้อมูลวิชา" />
              )}
            </Table>
          ) : (
            // Skeleton for loading state
            <Skeleton rows={5} height={40} />
          )}

        </>
      )}
    </div>
  );
}

export default ExcelUpload;