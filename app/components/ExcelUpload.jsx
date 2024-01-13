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

function ExcelUpload({ onDataInsertXlsx, onClearFile }) {
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editingTbody, setEditingTbody] = useState(null);
  const [displayHeaders, setDisplayHeaders] = useState([]);
  const [originalHeaders, setOriginalHeaders] = useState([]);

  const handleFileUpload = (e) => {
    e.preventDefault();

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
  return (
    <div
      className="App"
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        id="fileInput"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />

      {data.length > 0 && (
        <>
          {data.length > 0 ? (
            <Table>
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
              <TableBody>
                {data.map((row, rowIndex) => (
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
            </Table>
          ) : (
            // Skeleton for loading state
            <Skeleton rows={5} height={40} />
          )}
          <button onClick={handleInsertSubject}>Add to Database</button>
          <button onClick={handleClearFile}>Clear File</button>
        </>
      )}
    </div>
  );
}

export default ExcelUpload;