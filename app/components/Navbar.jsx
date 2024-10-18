'use client';
import React, { useCallback, useMemo, useState } from 'react'
import { signOut, useSession } from "next-auth/react"
import Image from 'next/image'
import Link from 'next/link';
import { MdEditDocument, MdOutlineQuiz, MdQuiz, MdAdminPanelSettings, MdOutlineAdminPanelSettings, MdOutlineLogout } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { HiOutlineUserGroup, HiUserGroup, HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi2";
import { GoHome, GoHomeFill } from "react-icons/go";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Skeleton } from "@nextui-org/react";
import { AiFillEdit, AiOutlineEdit, AiFillNotification } from 'react-icons/ai';
import { RxHamburgerMenu } from "react-icons/rx";
import "../style/hamburgers.css"
import { useToggleSideBarStore } from '@/src/store';
import NextTopLoader from 'nextjs-toploader';
import { Icon } from '@iconify/react';
import { FaUser } from "react-icons/fa6";
import { BiSolidExit } from "react-icons/bi";
import { DROPDOWN_MENU_CLASS } from '@/src/util/ComponentClass';
import { FaHistory } from 'react-icons/fa';
import Notification from './Notification';

const Navbar = () => {
    const { data: session, status } = useSession();
    const [openToggle, setOpenToggle] = useState(false)
    const [toggleSideBar, setToggle] = useToggleSideBarStore((state) => [state.toggle, state.setToggle])
    const url = usePathname();

    const links = useMemo(() => [
        {
            href: "/",
            label: "หน้าหลัก",
            condition: true
        },
        {
            href: "/admin",
            label: session?.user?.role === "admin" ? "Admin Panel" : "Teacher Panel",
            condition: session?.user?.role === "admin" || session?.user?.role === "teacher"
        },
        {
            href: "/student/verify",
            label: "ตรวจสอบสำเร็จการศึกษา",
            condition: session?.user?.role === "student"
        },
        {
            href: "/tracks",
            label: "แทร็ก",
            condition: true
        },
        {
            href: "/student/tracks",
            label: "คัดเลือกแทร็ก",
            condition: session?.user?.role === "student"
        },
        {
            href: "/student/tracks/exam",
            label: "แนะนำแทร็ก",
            condition: true
        },
        {
            href: "/petition/request",
            label: "ยื่นคำร้องย้ายแทร็ก",
            condition: session?.user?.role === "student"
        },
        {
            href: "/summary-history",
            label: "ประวัติการแนะนำแทร็ก",
            condition: true
        },
    ], [session]);

    const mobileNav = useCallback(function () {
        setOpenToggle(prevOpenToggle => !prevOpenToggle);
        document.querySelector('#mobileNav').classList.toggle('!top-0')
    }, [])

    const renderUserProfile = useCallback(() => {
        if (status === "authenticated") {
            return (
                <div className='relative flex justify-center items-center gap-5'>
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
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = "/image/admin.png";
                                }}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Menu"
                            disabledKeys={[]}
                            className="p-2"
                            variant="flat"
                            itemClasses={DROPDOWN_MENU_CLASS}
                        >
                            <DropdownSection aria-label="Profile & Actions" showDivider>
                                <DropdownItem
                                    href='/profile'
                                    isReadOnly
                                    key="profile"
                                    className="h-14 gap-2 opacity-100"
                                >
                                    <div className="flex gap-3 items-center">
                                        <Image
                                            className='rounded-full'
                                            src={session?.user?.image}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = "/image/admin.png";
                                            }}
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
                            <DropdownSection aria-label="Help & Feedback" className="mb-0">
                                <DropdownItem href='/profile' key="profile">
                                    <div className='flex gap-3 items-center'>
                                        <div className='w-5 h-5 flex items-center justify-center'>
                                            <FaUser className='w-4 h-4' />
                                        </div>
                                        <span>ข้อมูลของฉัน</span>
                                    </div>
                                </DropdownItem>
                                <DropdownItem href='/summary-history' key="summary-history">
                                    <div className='flex gap-3 items-center'>
                                        <div className='w-5 h-5 flex items-center justify-center'>
                                            <FaHistory className='w-4 h-4' />
                                        </div>
                                        <span>ประวัติการแนะนำแทร็ก</span>
                                    </div>
                                </DropdownItem>
                                {session?.user?.role === "student" &&
                                    <DropdownItem href='/petition/request' key="write_petition">
                                        <div className='flex gap-3 items-center'>
                                            <div className='w-5 h-5 flex items-center justify-center'>
                                                <MdEditDocument className='w-5 h-5' />
                                            </div>
                                            <span>ยื่นคำร้องย้ายแทร็ก</span>
                                        </div>
                                    </DropdownItem>
                                }
                                <DropdownItem href='/help-feedback' key="help_and_feedback">
                                    <div className='flex gap-3 items-center'>
                                        <div className='w-5 h-5 flex items-center justify-center'>
                                            <AiFillNotification className='w-5 h-5' />
                                        </div>
                                        <span>แจ้งปัญหา</span>
                                    </div>
                                </DropdownItem>
                                <DropdownItem key="logout" onClick={() => signOut()}>
                                    <div className='flex gap-3 items-center'>
                                        <div className='w-5 h-5 flex items-center justify-center'>
                                            <BiSolidExit className='w-5 h-5' />
                                        </div>
                                        <span>ออกจากระบบ</span>
                                    </div>
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            );
        }
        return <Skeleton className="w-[40px] h-[40px] rounded-full" />;
    }, [session, status]);

    const mobileProfile = useCallback(() => {
        return (
            <Link
                href={"/profile"}
                onClick={mobileNav}
                className="flex gap-4 items-start mb-3 border-b-1 border-b-gray-200 py-3 p-2">
                <Image
                    className='rounded-full'
                    src={session?.user?.image || "/image/admin.png"}
                    width={45} height={45}
                    alt="user image"
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/image/admin.png";
                    }}
                />
                <div className='w-full'>
                    <div>
                        <div>{session?.user?.name}</div>
                        <div className='text-sm text-gray-500'>{session?.user?.email}</div>
                    </div>
                </div>
            </Link>
        )
    }, [session])

    return (
        <nav style={{ zIndex: 900 }} className="fixed top-0 left-0 w-full">
            <NextTopLoader
                color='#3b82f6'
                height={3}
                shadow="none"
                showSpinner={false}
                crawl={true}
            />
            <div style={{ zIndex: 800 }} className="px-2 relative bg-white/80 backdrop-blur-md shadow-sm">
                <div className="relative flex h-16 items-center justify-between p-2">
                    <div className="flex flex-1 items-center justify-center md:justify-start gap-0">
                        <div
                            onClick={setToggle}
                            className={`hidden md:block rounded-full p-3 cursor-pointer hover:bg-gray-200 active:bg-gray-300`}>
                            <RxHamburgerMenu
                                className='w-5 h-5' />
                        </div>
                        <div className="flex flex-shrink-0 gap-1 items-center">
                            <Link
                                href="/"
                                className="flex items-center p-2 md:ps-0 text-gray-900 rounded-lg active:scale-95">
                                <img className="h-6 mb-[0.4rem] w-auto ml-[10px]" src="/logo.svg" alt="it kku" />
                            </Link>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                        <button
                            onClick={() => mobileNav()}
                            className={`hamburger hamburger--spin${openToggle ? " is-active " : " "}`}
                            type="button">
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                    {/* <div className='absolute inset-y-0 right-0 flex items-center md:hidden'>
                        <Notification email={session?.user?.email} />
                    </div> */}
                    <div className="absolute inset-y-0 right-0 flex items-center md:pr-2 sm:static sm:inset-auto sm:pr-0">

                        {/* Noti */}
                        <Notification email={session?.user?.email} />

                        {/* User profile */}
                        <div className="relative hidden ml-3 md:flex flex-row gap-3">
                            {renderUserProfile()}
                        </div>

                    </div>
                </div>
            </div>
            {
                <div className={`md:hidden relative w-50`} id="mobile-menu">
                    <div className="h-fit absolute space-y-1 p-2 w-full border-b" id='mobileNav'
                        style={{
                            background: 'white',
                            transform: openToggle ? 'translateY(0)' : 'translateY(-100%)',
                            left: '0px',
                            WebkitTransition: '0.3s',
                            MozTransition: '0.3s',
                            OTransition: '0.3s',
                            transition: '0.3s',
                            zIndex: '0'
                        }}>
                        {mobileProfile()}
                        {links.map((link, index) => {
                            if (!link.condition) return null;
                            const isActive = url === link.href || (url.startsWith("/admin") && link.href.includes("/admin"));
                            return (
                                <Link
                                    href={link.href}
                                    className={`${isActive ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                                    onClick={() => mobileNav()}
                                    key={index}
                                >
                                    <span className="ml-3 text-sm">{link.label}</span>
                                </Link>)
                        })}
                        <div className='border-t-1 !mt-3  cursor-pointer'
                            onClick={() => signOut()}>
                            <div className='flex rounded-md p-2 py-3 hover:bg-gray-200 mt-2'>
                                <div className='text-gray-900'>
                                    <MdOutlineLogout className='w-5 h-5' />
                                </div>
                                <button className='ml-3 text-sm'>ออกจากระบบ</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </nav >
    )
}

export default Navbar