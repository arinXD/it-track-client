"use client"

// // ExcelUpload.js
// import React, { useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';

// const ExcelUpload = ({ onUpload }) => {
//     const onDrop = useCallback(
//         async (acceptedFiles) => {
//             const file = acceptedFiles[0];
//             const formData = new FormData();
//             formData.append('file', file);

//             try {
//                 const response = await axios.post('http://localhost:4000/api/subjects', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//                 onUpload(response.data);
//             } catch (error) {
//                 console.error('Error uploading file:', error);
//             }
//         },
//         [onUpload]
//     );

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' });

//     return (
//         <div>
//             <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
//                 <input {...getInputProps()} />
//                 <p>Drag 'n' drop an Excel file here, or click to select one</p>
//             </div>
//         </div>
//     );
// };

// export default ExcelUpload;

import { useState } from "react";
import * as XLSX from "xlsx";

function ExcelUpload() {

  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  }

  return (
    <div className="App">

      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
      />

      {data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br /><br />
      ... webstylepress ...
    </div>
  );
}

export default ExcelUpload;
