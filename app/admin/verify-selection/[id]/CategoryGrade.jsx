"use client"

import { useCallback, useEffect, useState, useMemo } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteSection, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { fetchData, fetchDataObj } from '../../action'
import { hostname } from '@/app/api/hostname';
import Select from 'react-select';
import { Input, Textarea, Switch, Tabs, Tab, Link, Card, CardBody, CardHeader } from "@nextui-org/react";
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction';
import { getAcadyears } from "@/src/util/academicYear";
import { toast } from 'react-toastify';
import { Empty, message } from 'antd';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { Checkbox } from "@nextui-org/checkbox";
import { tableClass } from '@/src/util/ComponentClass'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner, Tooltip } from '@nextui-org/react'

export default function CategoryGrade({ catIndex, categorie, highestIndex }) {
    const [cumlaude, setCumLaude] = useState("")
    return (
        <>
            <h2 className='bg-gray-200 border-gray-300 border-1 p-2 px-3 flex flex-row justify-between items-center mt-5 rounded-t-md text-lg text-default-800'>
                {catIndex + highestIndex + 2}. {categorie.category.category_title}
            </h2>
            <ul className='h-full overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                {categorie.subjectDetails.length > 0 ? (
                    <div className='bg-gray-100 rounded-md relative gap-2'>
                        <Table
                            classNames={tableClass}
                            removeWrapper
                            onRowAction={() => { }}
                            aria-label="subjects table">
                            <TableHeader>
                                <TableColumn>รหัสวิชา</TableColumn>
                                <TableColumn>ชื่อวิชา EN</TableColumn>
                                <TableColumn>ชื่อวิชา TH</TableColumn>
                                <TableColumn>หน่วยกิต</TableColumn>
                                <TableColumn></TableColumn>
                            </TableHeader>
                            <TableBody>
                                {categorie.subjectDetails.map((sbj, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{sbj.Subject.subject_code}</TableCell>
                                        <TableCell className="w-1/3">{sbj.Subject.title_en}</TableCell>
                                        <TableCell className="w-1/3">{sbj.Subject.title_th}</TableCell>
                                        <TableCell>{sbj.Subject.credit}</TableCell>
                                        <TableCell>
                                            {sbj.grade ? (
                                                <div className="relative ml-2 w-[70px]">
                                                    <input
                                                        className="peer h-fit w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                        placeholder=" "
                                                        type="text"
                                                        value={sbj.grade}
                                                        onChange={(e) => setCumLaude(e.target.value)}
                                                    />
                                                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-fit w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:!border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:!border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                        เกรด
                                                    </label>
                                                </div>
                                            ) : (
                                                <p></p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                ) : (
                    <li className='flex justify-center items-center h-full'>
                        <Empty />
                    </li>
                )}
            </ul>
        </>
    );
}