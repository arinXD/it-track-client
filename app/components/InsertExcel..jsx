"use client"
import { useState, useEffect } from "react";
import { read, utils, writeFile } from "xlsx";
import axios from 'axios';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Pagination, } from '@nextui-org/react';
import { SearchIcon } from "@/app/components/icons";
import '../style/excel.css';
import { FiDownload, FiTrash } from "react-icons/fi";
import { message } from "antd";
import { swal } from "@/src/util/sweetyAlert";
import { UploadOutlined } from '@ant-design/icons';
import { IoMdSave } from "react-icons/io";

const InsertExcel = ({ headers, hook, templateFileName, startRow = 0, isFileFromREG = false }) => {
     const [data, setData] = useState([]);
     const [editingCell, setEditingCell] = useState(null);
     const [editingTbody, setEditingTbody] = useState(null);
     const [displayHeaders, setDisplayHeaders] = useState([]);
     const [originalHeaders, setOriginalHeaders] = useState([]);
     const [searchQuery, setSearchQuery] = useState('');
     const [filteredData, setFilteredData] = useState([]);
     const [inserting, setInserting] = useState(false)
     const [uploadingFile, setUploadingFile] = useState(false)

     useEffect(() => {
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
     }, [])

     const handleFileUpload = (e) => {
          e.preventDefault();
          const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
          const fileExtension = file.name.split('.').pop().toLowerCase();

          if (fileExtension !== 'xlsx') {
               message.warning("อนุญาตเฉพาะไฟล์ .xlsx")
               return
          }

          if (file) {
               setUploadingFile(true);
               const reader = new FileReader();
               reader.onload = (e) => {
                    try {
                         const data = new Uint8Array(e.target.result);
                         const workbook = read(data, { type: "array" });
                         const sheetName = workbook.SheetNames[0];
                         const sheet = workbook.Sheets[sheetName];
                         const parsedData = utils.sheet_to_json(sheet, { header: 1, raw: false });

                         const filteredData = parsedData.filter((row, index) => {
                              return row.some(cell => cell !== "") && index >= startRow;
                         });

                         if (filteredData.length > 1) {
                              const headers = isFileFromREG ?
                                   ["STUDENTCODE", "STUDENTNAME", "KKUMAIL", "PROGRAM"] :
                                   filteredData[0];
                              const rows = filteredData.slice(1);

                              setData(rows.map(row => {
                                   const rowData = {};
                                   headers.forEach((header, index) => {
                                        rowData[header] = row[index] || "";
                                   });
                                   if (isFileFromREG) {
                                        if (Object.values(rowData).filter(val => val).length === headers.length) {
                                             return rowData;
                                        } else {
                                             return {}
                                        }
                                   } else {
                                        return rowData;
                                   }
                              }));

                              setDisplayHeaders([...headers]);
                              setOriginalHeaders([...headers]);
                         } else {
                              message.warning(`ไม่มีข้อมูลในไฟล์ ${file.name}`);
                         }
                    } catch (error) {
                         message.error("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel กรุณาตรวจสอบรูปแบบไฟล์");
                    } finally {
                         setUploadingFile(false);
                    }
               };

               reader.onerror = (error) => {
                    message.error("เกิดข้อผิดพลาดในการอ่านไฟล์");
                    setUploadingFile(false);
               };

               reader.readAsArrayBuffer(file);
          }
     };

     async function sendDataInBatches(formattedData, options) {

          const batchSize = 200;
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
                         if (!header) return;
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
                                   return
                                   // const result = await axios(options)
                                   const { message: msg } = result.data
                                   message.success(msg);
                              } catch (error) {
                                   message.warning("ไฟล์มีขนาดใหญ่เกินไป");
                              }
                         } else {
                              const batchStatus = await sendDataInBatches(formattedData, options)
                              if (batchStatus) {
                                   message.success("เพิ่มข้อมูลสำเร็จ");
                              } else {
                                   message.warning("ไฟล์มีขนาดใหญ่เกินไป");
                              }
                         }
                         setInserting(false)
                    } else {
                         message.warning("โปรดแก้ไขหัวตาราง");
                    }
               } catch (error) {
                    console.log(error);
               } finally {
                    handleClearFile();
               }

          }
     };

     const handleClearFile = () => {
          document.getElementById("fileInput").value = null;
          setData([]);
          setEditingCell(null);
          setDisplayHeaders([]);
          setOriginalHeaders([]);
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
          document.addEventListener("drop", handleDrop);
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
     const rowsPerPage = 6
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
               const headersCol = headers.flatMap(header => header.items.map(item => item.label));
               const data = [{}];
               const ws = utils.json_to_sheet(data, { header: headersCol });
               utils.book_append_sheet(wb, ws, 'students');
               writeFile(wb, `${templateFileName}.xlsx`);
          } catch (error) {
               console.error('Error exporting Excel:', error);
          }
     };

     return (
          <section className="mt-4">
               <div
                    className="App"
                    onDragOver={(e) => e.preventDefault()}
               >
                    <details className="group mb-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                         <summary className="flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white font-semibold tracking-wide list-none [&::-webkit-details-marker]:hidden">
                              <span>คำแนะนำในการเตรียมไฟล์</span>
                              <svg
                                   className="w-5 h-5 transition-transform duration-300 group-open:rotate-180"
                                   fill="none"
                                   stroke="currentColor"
                                   viewBox="0 0 24 24"
                              >
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                         </summary>
                         <table className="w-full text-sm text-left">
                              <thead>
                                   <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-2.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">ชื่อคอลัมน์</th>
                                        <th className="px-4 py-2.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">คำอธิบาย</th>
                                        <th className="px-4 py-2.5 font-semibold text-gray-700 text-xs uppercase tracking-wider">ตัวอย่าง</th>
                                   </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                   {headers.map((header) => {
                                        const items = header.items.map((item, itemIndex) => (
                                             <tr key={`item-${itemIndex}`} className="hover:bg-gray-50 transition-colors duration-150 even:bg-gray-50/50">
                                                  <td className="px-4 py-2.5">
                                                       <div className="flex items-center gap-1">
                                                            {item?.required ? <span className="text-red-500 text-xs font-bold">*</span> : <span className="w-2"></span>}
                                                            <span className="text-gray-800 font-medium">{item.label}</span>
                                                       </div>
                                                  </td>
                                                  <td className="px-4 py-2.5 text-gray-600">{item.desc}</td>
                                                  <td className="px-4 py-2.5">
                                                       {item.example && <code className="text-xs bg-gray-100 text-blue-600 px-2 py-0.5 rounded-md font-mono">{item.example}</code>}
                                                  </td>
                                             </tr>
                                        ))
                                        const row = (
                                             <>
                                                  <tr key={header.groupTitle}>
                                                       <td
                                                            colSpan={3}
                                                            className="px-4 py-2.5 font-semibold text-blue-700 text-xs uppercase tracking-wider bg-gray-200"
                                                       >
                                                            {header.groupTitle}
                                                       </td>
                                                  </tr>
                                                  {items}
                                             </>
                                        )
                                        return row;
                                   })}
                              </tbody>
                         </table>
                    </details>
                    <div className={`drop-container ${data.length == 0 ? "flex" : "!hidden"}`} id="dropcontainer">
                         {!uploadingFile ?
                              <>
                                   <span className="drop-title">ลากไฟล์ลงที่นี่</span>
                                   หรือ
                                   <label className="w-fit bg-white/80 hover:border-blue-500 hover:text-blue-500 transition duration-75 cursor-pointer border-1 border-default-300 rounded-md px-3.5 py-1 text-default-700">
                                        <input
                                             style={{ display: "none" }}
                                             id="fileInput"
                                             name="fileInput"
                                             type="file"
                                             accept=".xlsx"
                                             onChange={handleFileUpload}
                                        />
                                        <UploadOutlined className='w-3.5 h-3.5' />
                                        <span className='ms-2.5 text-sm'>คลิกเพื่ออัปโหลดไฟล์ (.xlsx)</span>
                                   </label>
                              </>
                              :
                              <>กำลังอัปโหลดไฟล์...</>
                         }

                    </div>
                    {data.length == 0 && (
                         <div className="mt-5 mx-auto w-fit">
                              <Button
                                   isDisabled={uploadingFile}
                                   radius="sm"
                                   className=""
                                   onClick={downloadTemplate}
                                   color="primary"
                                   endContent={<FiDownload className="w-4 h-4 text-white" />}
                              >
                                   ดาวน์โหลด Template
                              </Button>
                         </div>
                    )}
                    {data.length > 0 && (
                         <section>
                              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                   <div className="flex justify-start w-full">
                                        <div className="flex justify-center items-center rounded-e-none py-2 px-3 text-sm text-gray-900 rounded-lg bg-gray-100">
                                             <SearchIcon width={16} height={16} />
                                        </div>
                                        <input
                                             type="search"
                                             id="search"
                                             name="search"
                                             className="w-full rounded-s-none pl-0 py-2 px-4 text-sm text-gray-900 rounded-lg bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                             placeholder="ค้นหาข้อมูล"
                                             value={searchQuery}
                                             onChange={(e) => handleSearchChange(e.target.value)}
                                        />
                                   </div>
                                   <div className='flex justify-end'>
                                        <div className="flex md:flex-row gap-4">
                                             <Button
                                                  variant="bordered"
                                                  className="rounded-[5px] border-1 text-gray-400 border-gray-400"
                                                  onClick={handleClearFile}
                                                  startContent={<FiTrash className="w-4 h-4 text-gray-400" />}
                                             >
                                                  เคลียร์ไฟล์
                                             </Button>
                                             <Button
                                                  isLoading={inserting}
                                                  isDisabled={inserting}
                                                  className="rounded-[5px]"
                                                  onClick={handleInsertData}
                                                  color="primary"
                                                  startContent={<IoMdSave className="w-[20px] h-[20px]" />}
                                             >
                                                  บันทึก
                                             </Button>
                                        </div>

                                   </div>
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
                         </section>
                    )}
               </div>
          </section>
     )
}

export default InsertExcel