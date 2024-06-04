'use client';
import { useState } from 'react'
import { signOut } from "next-auth/react"
import Image from 'next/image'
import Link from 'next/link';
import { useSession } from "next-auth/react"
import { MdOutlineLogout } from "react-icons/md";
import { Skeleton } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import { HiOutlineUserGroup, HiUserGroup, HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi2";
import { GoHome, GoHomeFill } from "react-icons/go";
import { MdOutlineQuiz, MdQuiz } from "react-icons/md";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/react";
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import { RxHamburgerMenu } from "react-icons/rx";
import "../style/hamburgers.css"
import { useToggleSideBarStore } from '@/src/store';

const Navbar = () => {
    const links = [
        {
            href: "/",
            activeIcon: <GoHomeFill className="w-5 h-5" />,
            icon: <GoHome className="w-5 h-5" />,
            label: "หน้าหลัก"
        },
        {
            href: "/tracks",
            activeIcon: <HiUserGroup className="w-5 h-5" />,
            icon: <HiOutlineUserGroup className="w-5 h-5" />,
            label: "แทร็ก"
        },
        {
            href: "/student/tracks",
            activeIcon: <AiFillEdit className="w-5 h-5" />,
            icon: <AiOutlineEdit className="w-5 h-5" />,
            label: "คัดเลือกแทร็ก"
        },
        {
            href: "/student/tracks/exam",
            activeIcon: <MdQuiz className="w-5 h-5" />,
            icon: <MdOutlineQuiz className="w-5 h-5" />,
            label: "แนะนำแทร็ก"
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
    const [toggleSideBar, setToggle] = useToggleSideBarStore((state) => [state.toggle, state.setToggle])
    const url = usePathname();

    function navstupid() {
        setOpenToggle(!openToggle)
        document.querySelector('#navstupid').classList.toggle('!top-0')
    }

    return (
        <nav className="fixed top-0 left-0 z-40 w-full">
            <div className="px-2 md:px-2 z-50 relative bg-white/60 backdrop-blur-md shadow-sm">
                <div className="relative flex h-16 items-center justify-between p-2">
                    <div className="flex flex-1 items-center justify-center md:justify-start gap-0">
                        <div
                            onClick={setToggle}
                            className={`hidden md:block rounded-full ${toggleSideBar ? "p-2":"p-3"} cursor-pointer hover:bg-gray-200 active:bg-gray-300`}>
                            <RxHamburgerMenu
                                className='w-5 h-5' />
                        </div>
                        <div className="flex flex-shrink-0 gap-1 items-center">
                            <Link href="/" className="flex items-center p-2 md:ps-0 text-gray-900 rounded-lg ">
                                <img className="h-6 mb-[0.4rem] w-auto ml-[10px]" src="/new_logo.svg" alt="it kku" />
                            </Link>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                        <button
                            onClick={() => navstupid()}
                            className={`hamburger hamburger--spin${openToggle ? " is-active " : " "}`}
                            type="button">
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 hidden md:flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
                        <div className="relative ml-3 flex flex-row gap-3">
                            {status == "authenticated" ?
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
                                                <DropdownItem key="logout" onClick={() => signOut()}>
                                                    <div className='flex gap-3 items-center'>
                                                        <MdOutlineLogout className='w-5 h-5' />
                                                        <span>ออกจากระบบ</span>
                                                    </div>
                                                </DropdownItem>
                                            </DropdownSection>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                :
                                <div className='relative hidden md:flex justify-center items-center gap-2'>
                                    <Skeleton className="w-[40px] h-[40px] rounded-full" />
                                </div>

                            }
                        </div >
                    </div >
                </div >
            </div >
            {
                <div className="md:hidden relative w-50" id="mobile-menu">
                    <div className="absolute space-y-1 p-2 border-y-1 w-full border-y-gray-200" id='navstupid'
                        style={{
                            background: 'white',
                            top: '-450px',
                            left: '0px',
                            WebkitTransition: '0.3s',
                            MozTransition: '0.3s',
                            OTransition: '0.3s',
                            transition: '0.3s',
                            zIndex: '0'
                        }}>
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
                            <Link href={link.href}
                                className={`${url == link.href || (url === "/admin" && link.href === "/" && session?.user?.role === "admin") ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center p-2 rounded-lg group`}
                                onClick={() => navstupid()}
                                key={index}
                            >
                                {url == link.href || (url === "/admin" && link.href === "/" && session?.user?.role === "admin") ?
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