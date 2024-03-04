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
import { HiOutlineBars3, HiOutlineUserGroup, HiUserGroup, HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi2";
import { GoQuestion, GoHome, GoHomeFill } from "react-icons/go";
import { MdOutlineQuiz, MdQuiz } from "react-icons/md";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, User } from "@nextui-org/react";

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
    const url = usePathname();

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
                        <div className="flex flex-shrink-0 gap-1 items-center">
                            <div className='sm:block'>
                                <HiOutlineBars3 className='w-6 h-6 ms-2.5' />
                            </div>
                            <Link href="/" className="flex items-center p-2 text-gray-900 rounded-lg ">
                                <img className="h-6 mb-2 w-auto" src="/regular_logo.svg" alt="it kku" />
                            </Link>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
                        <div className="relative ml-3 flex flex-row gap-3">
                            {status == "authenticated" ?
                                <div className='relative hidden sm:flex justify-center items-center gap-5'>
                                    {
                                        session?.user?.role === "admin" &&
                                        <Link href="/admin">
                                            <Button className='rounded-[5px] bg-blue-500 text-white font-medium text-sm h-9'>
                                                Admin panel
                                            </Button>
                                        </Link>
                                    }
                                    <Dropdown
                                        radius="sm"
                                        classNames={{
                                            content: "p-0 border-small border-divider bg-background shadow-none",
                                        }}
                                    >
                                        <DropdownTrigger>
                                            <Image
                                                id='user-profile'
                                                className='rounded-full active:scale-90 cursor-pointer'
                                                src={session?.user?.image}
                                                width={40} height={40}
                                                alt="user image"
                                            />
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            aria-label="Custom item styles"
                                            disabledKeys={["profile"]}
                                            className="p-2"
                                            variant="flat"
                                            itemClasses={{
                                                base: [
                                                    "rounded-md",
                                                    "text-default-500",
                                                    "transition-opacity",
                                                    "data-[hover=true]:text-foreground",
                                                    "data-[hover=true]:bg-default-100",
                                                    "dark:data-[hover=true]:bg-default-50",
                                                    "data-[selectable=true]:focus:bg-default-50",
                                                    "data-[pressed=true]:opacity-70",
                                                    "data-[focus-visible=true]:ring-default-500",
                                                ],
                                            }}
                                        >
                                            <DropdownSection aria-label="Profile & Actions" showDivider>
                                                <DropdownItem
                                                    isReadOnly
                                                    key="profile"
                                                    className="h-14 gap-2 opacity-100"
                                                >
                                                    <div className="flex gap-3 items-center">
                                                        <Image
                                                            className='rounded-full'
                                                            src={session?.user?.image}
                                                            width={40} height={40}
                                                            alt="user image"
                                                        />
                                                        <div className='w-full'>
                                                            <p className='text-medium text-default-900'>{session.user.name}</p>
                                                            <p className='text-small text-default-500'>{session.user.email}</p>
                                                        </div>
                                                    </div>
                                                </DropdownItem>
                                            </DropdownSection>
                                            <DropdownSection
                                                aria-label="Help & Feedback"
                                                className="mb-0"
                                            >
                                                <DropdownItem key="help_and_feedback" className='mb-1'>
                                                    <div className='flex gap-3 items-center'>
                                                        <GoQuestion className='w-5 h-5' />
                                                        <span>Help & Feedback</span>

                                                    </div>
                                                </DropdownItem>
                                                <DropdownItem key="logout" onClick={() => signOut()}>
                                                    <div className='flex gap-3 items-center'>
                                                        <MdOutlineLogout className='w-5 h-5' />
                                                        <span>Log Out</span>
                                                    </div>
                                                </DropdownItem>
                                            </DropdownSection>
                                        </DropdownMenu>
                                    </Dropdown>
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
                        </div >
                    </div >
                </div >
            </div >
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