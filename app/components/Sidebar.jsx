'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { HiOutlineUserGroup, HiUserGroup, HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi2";
import { GoHome, GoHomeFill } from "react-icons/go";
import { MdOutlineQuiz, MdQuiz } from "react-icons/md";
import { useSession } from "next-auth/react"
import { Icon } from '@iconify/react';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import { useToggleSideBarStore } from '@/src/store';
import { Tooltip } from 'antd';

const Sidebar = () => {
    const { data: session } = useSession();
    const url = usePathname();
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)
    return (
        <>
            <aside
                style={{ top: "65px" }}
                id="default-sidebar"
                className={`border-r border-r-gray-200/80 fixed top-16 left-0 z-50 ${toggleSideBar ? "w-[240px]" : ""} h-screen transition-transform -translate-x-full md:translate-x-0`}
                aria-label="Sidebar">
                <div className="h-full px-4 py-4 overflow-y-auto bg-white">
                    <ul className="font-medium space-y-1">
                        <li className="">
                            {session?.user?.role == "admin" || session?.user?.role == "teacher" ?
                                <>
                                    <Tooltip placement="right" title={!toggleSideBar && "หน้าหลัก"}>
                                        <Link href={"/admin"}
                                            className={`${url.includes("admin") ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center ${toggleSideBar ? "px-2" : "px-3"} rounded-lg group`}
                                        >
                                            {url.includes("admin") ?
                                                <GoHomeFill
                                                    className="w-5 h-5"
                                                    set="bulk" stroke="bold" />
                                                :
                                                <GoHome
                                                    className="w-5 h-5"
                                                    set="bulk" stroke="bold" />
                                            }
                                            {
                                                toggleSideBar &&
                                                <span className="ml-5 text-sm">หน้าหลัก</span>
                                            }
                                        </Link>
                                    </Tooltip>
                                </>
                                :
                                <Tooltip placement="right" title={!toggleSideBar && "หน้าหลัก"}>
                                    <Link href={"/"}
                                        className={`${url == "/" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center ${toggleSideBar ? "px-2" : "px-3"} rounded-lg group`}
                                    >
                                        {url == "/" ?
                                            <GoHomeFill
                                                className="w-5 h-5"
                                                set="bulk" stroke="bold" />
                                            :
                                            <GoHome
                                                className="w-5 h-5"
                                                set="bulk" stroke="bold" />
                                        }
                                        {
                                            toggleSideBar &&
                                            <span className="ml-5 text-sm">หน้าหลัก</span>
                                        }
                                    </Link>
                                </Tooltip>
                            }
                        </li>
                        {(session?.user?.role == "admin" || session?.user?.role == "teacher") &&
                            <li>
                                <Tooltip placement="right" title={!toggleSideBar && "Dashboard"}>
                                    <Link href={"/dashboard"}
                                        className={`${url.includes("dashboard") ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center ${toggleSideBar ? "px-2" : "px-3"} rounded-lg group`}
                                    >
                                        {url.includes("dashboard") ?
                                            <Icon icon="mingcute:chart-pie-2-fill"
                                                className="w-5 h-5 text-white" />
                                            :
                                            <Icon icon="mingcute:chart-pie-2-line"
                                                className="w-5 h-5" />
                                        }
                                        {
                                            toggleSideBar &&
                                            <span className="ml-5 text-sm">Dashboard</span>
                                        }
                                    </Link>
                                </Tooltip>
                            </li>
                        }
                        <li className="">
                            <Tooltip placement="right" title={!toggleSideBar && "แทร็ก"}>
                                <Link href={"/tracks"}
                                    className={`${url.includes("/tracks") && url.startsWith("/tracks") ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center ${toggleSideBar ? "px-2" : "px-3"} rounded-lg group`}
                                >
                                    {url.includes("/tracks") && url.startsWith("/tracks") ?
                                        <HiUserGroup
                                            className="w-5 h-5" />
                                        :
                                        <HiOutlineUserGroup
                                            className="w-5 h-5" />
                                    }
                                    {
                                        toggleSideBar &&
                                        <span className="ml-5 text-sm">แทร็ก</span>
                                    }
                                </Link>
                            </Tooltip>
                        </li>
                        <li className="">
                            <Tooltip placement="right" title={!toggleSideBar && "คัดเลือกแทร็ก"}>
                                <Link href={"/student/tracks"}
                                    className={`${url == "/student/tracks" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center ${toggleSideBar ? "px-2" : "px-3"} rounded-lg group`}
                                >
                                    {url == "/student/tracks" ?
                                        <AiFillEdit
                                            className="w-5 h-5" />
                                        :
                                        <AiOutlineEdit
                                            className="w-5 h-5" />
                                    }
                                    {
                                        toggleSideBar &&
                                        <span className="ml-5 text-sm">คัดเลือกแทร็ก</span>
                                    }
                                </Link>
                            </Tooltip>
                        </li>
                        <li className="">
                            <Tooltip placement="right" title={!toggleSideBar && "แนะนำแทร็ก"}>
                                <Link href={"/student/tracks/exam"}
                                    className={`${url == "/student/tracks/exam" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center ${toggleSideBar ? "px-2" : "px-3"} rounded-lg group`}
                                >
                                    {url == "/student/tracks/exam" ?
                                        <MdQuiz
                                            className="w-5 h-5" />
                                        :
                                        <MdOutlineQuiz
                                            className="w-5 h-5" />
                                    }
                                    {
                                        toggleSideBar &&
                                        <span className="ml-5 text-sm">แนะนำแทร็ก</span>
                                    }
                                </Link>
                            </Tooltip>
                        </li>
                        <li className="">
                            <Tooltip placement="right" title={!toggleSideBar && "ตรวจสอบสำเร็จการศึกษา"}>
                                <Link href={"/student/verify"}
                                    className={`${url == "/student/verify" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center ${toggleSideBar ? "px-2" : "px-3"} rounded-lg group`}
                                >
                                    {url == "/student/verify" ?
                                        <HiAcademicCap className="w-5 h-5" />
                                        :
                                        <HiOutlineAcademicCap className="w-5 h-5" />
                                    }
                                    {
                                        toggleSideBar &&
                                        <span className="ml-5 text-sm">ตรวจสอบสำเร็จการศึกษา</span>
                                    }
                                </Link>
                            </Tooltip>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    )
}

export default Sidebar