"use client"
import { useCallback, useEffect, useState, useMemo } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import Swal from 'sweetalert2';
import { fetchData } from '../action'
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { useDisclosure } from "@nextui-org/react";
import { getAcadyears } from '@/src/util/academicYear';
import Link from 'next/link'
import { dmy } from '@/src/util/dateFormater'
import { Tooltip, Chip, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import { Icon } from '@iconify/react';
import { Loading } from '@/app/components';
import axios from 'axios';
import { hostname } from '@/app/api/hostname';
import { Empty, message } from 'antd';
import { floorGpa, calGrade, isNumber } from '@/src/util/grade';
import { tableClass, tableClassCondition } from '@/src/util/ComponentClass'
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Page = () => {

    const [sumStatus, setSumStatus] = useState([]);
    const [verifyselect, setVerifySelect] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [student, setStudent] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');

    const [datass, setData] = useState([]);
    const acadyears = getAcadyears()
    const [selectAcadYear, setSelectAcadYear] = useState(acadyears[0])

    const fetch = useCallback(async (acadyear) => {
        if (!acadyear) return; // Prevent fetching if no acadyear is selected

        try {
            const url = `/api/verifies/approve/dashboard/${acadyear}`;
            const option = await getOptions(url, "GET");
            const res = await axios(option);
            const des = res.data.data;
            setData(des);

            // Log the entire response
            console.log(des);

            // Filter the data based on the selected program
            const filteredData = selectedProgram
                ? des.filter(item => item.Student.program === selectedProgram)
                : des;

            // Calculate status counts from filtered data
            const statusCount = filteredData.reduce((acc, item) => {
                const status = item.status;
                // Initialize the status count if not present
                if (!acc[status]) {
                    acc[status] = 0;
                }
                // Increment the count for the current status
                acc[status]++;
                return acc;
            }, {}); // {} is the initial accumulator

            console.log(statusCount);
            setSumStatus(statusCount);

            const studentDetailsList = filteredData.map(item => {
                if (item.Student && item.StudentVerifyDetails && item.StudentVerifyDetails.length > 0) {
                    // Combine the Student info and StudentVerifyDetails for each item
                    return {
                        Student: {
                            id: item.Student.id,
                            stu_id: item.Student.stu_id,
                            first_name: item.Student.first_name,
                            last_name: item.Student.last_name,
                            program: item.Student.program,
                            email: item.Student.email
                        },
                        StudentVerifyDetails: item.StudentVerifyDetails.map(detail => ({
                            group_subject_id: detail.group_subject_id,
                            grade: detail.grade
                        }))
                    };
                }
                return null;
            }).filter(Boolean);

            console.log(studentDetailsList);

            setVerifySelect(studentDetailsList);

        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }, [selectedProgram]); // Add selectProgram as a dependency

    const callStudent = useCallback(async () => {
        try {
            const URL = `/api/students`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const pro = response.data.data;

            setStudent(pro);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, []);

    const callprogram = useCallback(async () => {
        try {
            const URL = `/api/programs`;
            const option = await getOptions(URL, "GET");
            const response = await axios(option);
            const pro = response.data.data;

            console.log(pro);

            setPrograms(pro);

        } catch (error) {
            console.log("fetch error:", error);
        }
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                await callprogram();
                await callStudent();

                if (selectAcadYear) {
                    await fetch(selectAcadYear); // Await the fetch call when an acadyear is selected
                }
            } catch (error) {
                console.error('Error in fetching data:', error); // Handle any errors
            }
        };

        fetchData(); // Call the async function
    }, [selectAcadYear, fetch]); // Add fetch and selectAcadYear as dependencies

    const statusLabels = {
        0: 'รอการส่งแบบฟอร์มมาอีกครั้ง',
        1: 'คำร้องใหม่',
        2: 'อาจารย์อนุมัติ',
        3: 'เจ้าหน้าที่อนุมัติ',
    };

    const statusLabels2 = {
        0: 'ไม่ได้รับการอนุมัติ (รอการส่งแบบฟอร์มมาอีกครั้ง)',
        3: 'จบการศึกษา',
    };

    // Prepare chart data for ApexCharts

    const colors = ['#F4538A', "#7EA1FF", '#FAA300', "#BBF7D0"]
    const chartData = {
        series: [
            {
                name: 'Count of Statuses',
                data: [
                    sumStatus[0] || 0,
                    sumStatus[1] || 0,
                    sumStatus[2] || 0,
                    sumStatus[3] || 0,
                ], // Ensure to count for all statuses
            },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            title: {
                text: `นักศึกษาที่ยื่นแบบฟอร์มตรวจสอบจบต่อปีการศึกษา ${selectAcadYear ? selectAcadYear : ""}`,
            },
            xaxis: {
                categories: Object.keys(statusLabels).map(status => statusLabels[status]), // Map status numbers to labels
            },
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    distributed: true,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            dataLabels: {
                enabled: true,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
        },
    };

    const chartDatafrom = {
        series: [
            {
                name: 'Count of Statuses',
                data: [
                    sumStatus[0] || 0, // Count for status 0
                    sumStatus[3] || 0, // Count for status 3
                ], // Ensure to count only for status 0 and status 3
            },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            title: {
                text: 'นักศึกษาที่ยื่นแบบฟอร์มตรวจสอบจบ จบการศึกษา และ ไม่ได้รับการอนุมัติ',
            },
            xaxis: {
                categories: [statusLabels2[0], statusLabels2[3]], // Map status numbers to labels for status 0 and 3
            },
            colors: ['#F4538A', "#BBF7D0"],
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    distributed: true,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            dataLabels: {
                enabled: true,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            }, // Colors for status 0 and status 3
        },
    };


    return (
        <div className='mt-6'>
            <select
                name="select-acadyear"
                id="selectAcadyear"
                onInput={(event) => setSelectAcadYear(event.target.value)} // Update the selected acadyear
                defaultValue=""
                style={{
                    height: "32px",
                }}
                className="max-lg:w-1/2 px-2 pe-3 py-1 border-1 rounded-lg text-sm mr-3"
            >
                <option value="">ปีการศึกษา</option>
                {acadyears.map((acadyear) => (
                    <option key={acadyear} value={acadyear}>
                        {acadyear}
                    </option>
                ))}
            </select>

            <select
                name="select-program"
                id="selectProgram"
                onChange={(event) => setSelectedProgram(event.target.value)} // Update the selected program
                value={selectedProgram} // Controlled component
                style={{ height: "32px" }}
                className="max-lg:w-1/2 px-2 pe-3 py-1 border-1 rounded-lg text-sm"
            >
                <option value="">ทั้งหมด</option>
                {programs.map((program) => (
                    <option key={program.program} value={program.program}>
                        {program.program} {/* Assuming each program has a name property */}
                    </option>
                ))}
            </select>

            <div className='grid grid-cols-1 lg:grid-cols-2 mt-[20px]'>
                <div>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height={chartData.options.chart.height}
                    />
                </div>
                <div>
                    <Chart
                        options={chartDatafrom.options}
                        series={chartDatafrom.series}
                        type="bar"
                        height={chartDatafrom.options.chart.height}

                    />
                </div>
            </div>

            <p className='mb-3 mt-[20px]'>จำนวนนักศึกษาที่ยื่นเข้ามา : {verifyselect.length}</p>
            <div className='p-4 rounded-[10px] border'>
                <Table
                    className='overflow-x-auto'
                    removeWrapper
                    onRowAction={() => { }}
                    aria-label="subjects table"
                >
                    <TableHeader>
                        <TableColumn>รหัสนักศึกษา</TableColumn>
                        <TableColumn>ชื่อ</TableColumn>
                        <TableColumn>นามสกุล</TableColumn>
                        <TableColumn>หลักสูตร</TableColumn>
                        <TableColumn>อีเมล</TableColumn>
                    </TableHeader>
                    {verifyselect.length > 0 ? (
                        <TableBody>
                            {verifyselect.map(({ Student }, index) => (
                                <TableRow key={index}>
                                    <TableCell>{Student.stu_id}</TableCell>
                                    <TableCell>{Student.first_name}</TableCell>
                                    <TableCell>{Student.last_name}</TableCell>
                                    <TableCell>{Student.program}</TableCell>
                                    <TableCell>{Student.email}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody emptyContent={"ไม่มีนักศึกษากรอกแบบฟอร์ม"}>{[]}</TableBody>
                    )}
                </Table>
            </div>
        </div>
    );
}

export default Page