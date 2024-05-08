'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { HiOutlineUserGroup, HiUserGroup, HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi2";
import { GoHome, GoHomeFill } from "react-icons/go";
import { MdOutlineQuiz, MdQuiz } from "react-icons/md";
import { useSession } from "next-auth/react"
import { Icon } from '@iconify/react';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';

const Sidebar = () => {
    const { data: session } = useSession();
    const url = usePathname();
    return (
        <>
            <aside style={{ top: "65px" }} id="default-sidebar" className="border-r fixed top-16 left-0 z-50 w-[240px] h-screen transition-transform -translate-x-full md:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-white">
                    <ul className="font-medium space-y-1">
                        <li className="">
                            {session?.user?.role == "admin" ?
                                <>
                                    <Link href={"/admin"}
                                        className={`${url.includes("admin") ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
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
                                        <span className="ml-3 text-sm">หน้าหลัก</span>
                                    </Link>
                                </>
                                :
                                <Link href={"/"}
                                    className={`${url == "/" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
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
                                    <span className="ml-3 text-sm">หน้าหลัก</span>
                                </Link>
                            }
                        </li>
                        <li>
                            {session?.user?.role == "admin" &&
                                <Link href={"/dashboard"}
                                    className={`${url.includes("dashboard") ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                                >
                                    {url.includes("dashboard") ?
                                        <Icon icon="mingcute:chart-pie-2-fill"
                                            className="w-5 h-5 text-white" />
                                        :
                                        <Icon icon="mingcute:chart-pie-2-line"
                                            className="w-5 h-5" />
                                    }
                                    <span className="ml-3 text-sm">Dashboard</span>
                                </Link>
                            }
                        </li>
                        <li className="">
                            <Link href={"/tracks"}
                                className={`${url.includes("/tracks") && url.startsWith("/tracks") ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                            >
                                {url.includes("/tracks") && url.startsWith("/tracks") ?
                                    <HiUserGroup
                                        className="w-5 h-5" />
                                    :
                                    <HiOutlineUserGroup
                                        className="w-5 h-5" />
                                }
                                <span className="ml-3 text-sm">แทรค</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link href={"/student/tracks"}
                                className={`${url == "/student/tracks" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                            >
                                {url == "/student/tracks" ?
                                    <AiFillEdit
                                        className="w-5 h-5" />
                                    :
                                    <AiOutlineEdit
                                        className="w-5 h-5" />
                                }
                                <span className="ml-3 text-sm">คัดเลือกแทรค</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link href={"/student/tracks/exam"}
                                className={`${url == "/student/tracks/exam" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                            >
                                {url == "/student/tracks/exam" ?
                                    <MdQuiz
                                        className="w-5 h-5" />
                                    :
                                    <MdOutlineQuiz
                                        className="w-5 h-5" />
                                }
                                <span className="ml-3 text-sm">แนะนำแทรค</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link href={"/student/verify"}
                                className={`${url == "/student/verify" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                            >
                                {url == "/student/verify" ?
                                    <HiAcademicCap className="w-5 h-5" />
                                    :
                                    <HiOutlineAcademicCap className="w-5 h-5" />
                                }
                                <span className="ml-3 text-sm">ตรวจสอบสำเร็จการศึกษา</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    )
}

export default Sidebar