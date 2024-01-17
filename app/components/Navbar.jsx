'use client';
import React, { useEffect, useState } from 'react'
import { signIn, signOut } from "next-auth/react"
import Image from 'next/image'
import Link from 'next/link';
import { useSession } from "next-auth/react"
import { RiSettings5Fill } from "react-icons/ri";
import { MdOutlineLogout } from "react-icons/md";
import { Button } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import { HiOutlineUserGroup, HiUserGroup, HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi2";
import { GoHome, GoHomeFill } from "react-icons/go";
import { MdOutlineQuiz, MdQuiz } from "react-icons/md";

const Navbar = () => {
    const links = [
        {
            href: "/",
            activeIcon: <GoHomeFill className="w-5 h-5" />,
            icon: <GoHome className="w-5 h-5" />,
            label: "หน้าหลัก"
        },
        {
            href: "/student/tracks",
            activeIcon: <HiUserGroup className="w-5 h-5" />,
            icon: <HiOutlineUserGroup className="w-5 h-5" />,
            label: "คัดเลือกความเชี่ยวชาญ"
        },
        {
            href: "/student/tracks/exam",
            activeIcon: <MdQuiz className="w-5 h-5" />,
            icon: <MdOutlineQuiz className="w-5 h-5" />,
            label: "หาแทรคที่เหมาะสม"
        },
        {
            href: "/student/verify",
            activeIcon: <HiAcademicCap className="w-5 h-5" />,
            icon: <HiOutlineAcademicCap className="w-5 h-5" />,
            label: "ตรวจสอบสำเร็จการศึกษา"
        },
    ]
    const { data: session, status } = useSession();
    const [openToggle, setOpenToggle] = useState(false)
    const [profileToggle, setProfileToggle] = useState(false)
    const url = usePathname();

    const toggleProfile = () => {
        setTimeout(() => {
            if (profileToggle) {
                setProfileToggle(false)
            } else {
                setProfileToggle(true)
            }
        }, 50)
    }
    // useEffect(() => {
    //     window.onclick = () => {
    //         if (profileToggle) {
    //             setProfileToggle(false)
    //         }
    //     }
    // })
    return (
        <nav className="bg-white fixed top-0 left-0 z-40 w-full border-b">
            <div className="px-2 sm:px-6 lg:ps-5 lg:pe-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            onClick={() => setOpenToggle(!openToggle)}
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>

                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:justify-start gap-4">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="flex items-center p-2 text-gray-900 rounded-lg ">
                                <img className="h-8 w-auto" src="/logo.png" alt="it kku" />
                                <span className="ml-3 text-gray-900 font-bold"><code>KKU it track</code></span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="">
                                <form>
                                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                            </svg>
                                        </div>
                                        <input type="search" id="default-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none" placeholder="Search somthing..." required />
                                        {/* <button type="submit" className="text-white absolute end-1.5 bottom-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1">Search</button> */}
                                    </div>
                                </form>

                                {/* <a href="#" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Dashboard</a>
                                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Team</a>
                                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Projects</a>
                                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Calendar</a> */}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
                        <div className="relative ml-3 flex flex-row gap-3">
                            {status == "authenticated" ?
                                <div className='relative hidden sm:flex justify-center items-center gap-5'>
                                    {
                                        session?.user?.role === "admin" &&
                                        <Link href="/admin">
                                            <Button className='bg-amber-400 text-white font-medium text-sm h-9'>
                                                Admin panel
                                            </Button>
                                        </Link>
                                    }
                                    <Image
                                        onClick={toggleProfile}
                                        className='rounded-full border-1 border-slate-300 active:scale-90 cursor-pointer'
                                        src={session?.user?.image}
                                        // src={'/image/user.png'}
                                        width={40} height={40}
                                        alt="user image"
                                    />
                                    <div className={`${profileToggle ? "block" : "hidden"} rounded absolute border w-[280px] p-4 top-[41px] right-0 bg-white`}>
                                        <div className="flex gap-4 items-start mb-3 border-b pb-3">
                                            <Image
                                                className='rounded-full border-1 border-slate-300'
                                                src={session?.user?.image}
                                                width={45} height={45}
                                                alt="user image"
                                            />
                                            <div className='w-full'>
                                                <div>{session.user.name}</div>
                                                <div className='text-sm text-gray-500'>{session.user.email}</div>
                                                <div className='mt-2'>
                                                    <Link href={"/"} className='text-sm text-blue-500'>ดูโปรไฟล์</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-3 cursor-pointer mb-1 rounded-md p-2 hover:bg-gray-200'>
                                            <div className='p-[.3rem] bg-gray-800 text-white rounded-full'>
                                                <RiSettings5Fill className='w-6 h-6' />
                                            </div>
                                            <button className=''>cPanel</button>
                                        </div>
                                        <div className='flex gap-3 cursor-pointer rounded-md p-2 hover:bg-gray-200' onClick={() => signOut()}>
                                            <div className='p-[.3rem] bg-gray-800 text-white rounded-full'>
                                                {/* <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /> */}
                                                <MdOutlineLogout className='w-6 h-6' />
                                            </div>
                                            <button className=''>Sign out</button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='relative hidden sm:flex justify-center items-center gap-2'>
                                    <div className='w-[40px] h-[40px] border-1 rounded-full bg-gray-200'>

                                    </div>
                                </div>

                            }
                            {
                                status == "unauthenticated" &&
                                <div>
                                    <button onClick={() => signIn()} className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded active:scale-90'>
                                        เข้าสู่ระบบ
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {openToggle &&
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 p-2 border-t-1 border-t-gray-200">
                        {session &&
                            <div className="flex gap-4 items-start mb-1 border-b-1 border-b-gray-200 py-3 p-2">
                                <Image
                                    className='rounded-full border-1 border-slate-300'
                                    src={session?.user?.image}
                                    width={45} height={45}
                                    alt="user image"
                                />
                                <div className='w-full'>
                                    <div>
                                        <div>{session?.user?.name}</div>
                                        <div className='text-sm text-gray-500'>{session?.user?.email}</div>
                                    </div>
                                    <div className='mt-2 flex flex-row gap-4 justify-start items-center'>
                                        <Link href={"/"} className='text-sm text-blue-500 border-1 border-blue-500 p-1 px-2 rounded-md'>ดูโปรไฟล์</Link>
                                        {session?.user?.role == "admin" &&
                                            <Link onClick={() => setOpenToggle(false)} href={"/admin"} className='text-sm text-amber-400 rounded-md p-1 px-2 border-1 border-amber-400'>Admin Panel</Link>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {links.map((link, index) => (
                            index == 0 && session?.user?.role == "admin" ?
                                <Link href={"/admin"}
                                    className={`${url.includes("admin") ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                                    onClick={() => setOpenToggle(false)}
                                    key={index}
                                >
                                    {url.includes("admin") ?
                                        <>{link.activeIcon}</>
                                        :
                                        <>{link.icon}</>
                                    }
                                    <span className="ml-3 text-sm">Admin Panel</span>
                                </Link>
                                :
                                <Link href={link.href}
                                    className={`${url == link.href ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                                    onClick={() => setOpenToggle(false)}
                                    key={index}
                                >
                                    {url == link.href ?
                                        <>{link.activeIcon}</>
                                        :
                                        <>{link.icon}</>
                                    }
                                    <span className="ml-3 text-sm">{link.label}</span>
                                </Link>
                        ))}
                        <div className='border-t-1 border-t-gray-200 cursor-pointer'
                            onClick={() => signOut()}>
                            <div className='flex rounded-md p-2 py-3 hover:bg-gray-200 mt-1'>
                                <div className='text-gray-900'>
                                    <MdOutlineLogout className='w-5 h-5' />
                                </div>
                                <button className='ml-3 text-sm'>Sign out</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </nav >
    )
}

export default Navbar