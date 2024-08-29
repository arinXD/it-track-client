'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { HiOutlineUserGroup, HiUserGroup, HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi2";
import { GoHome, GoHomeFill } from "react-icons/go";
import { MdAdminPanelSettings, MdOutlineAdminPanelSettings, MdOutlineQuiz, MdQuiz } from "react-icons/md";
import { useSession } from "next-auth/react"
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import { useToggleSideBarStore } from '@/src/store';
import { Tooltip } from 'antd';
import { useMemo } from 'react';

const SidebarLink = ({ href, activeIcon, icon, label, isActive, toggleSideBar }) => (
    <Tooltip placement="right" title={!toggleSideBar && label}>
        <Link
            href={href}
            className={`${isActive ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-200"} py-3 flex items-center px-3 rounded-[5px] group`}
        >
            {isActive ? activeIcon : icon}
            {toggleSideBar && <span className="ml-5 text-[13px]">{label}</span>}
        </Link>
    </Tooltip>
);

const Sidebar = () => {
    const { data: session } = useSession();
    const url = usePathname();
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)

    const links = useMemo(() => ([
        {
            href: "/",
            activeIcon: <GoHomeFill className="w-5 h-5" />,
            icon: <GoHome className="w-5 h-5" />,
            label: "หน้าหลัก",
            condition: true
        },
        {
            href: "/admin",
            activeIcon: <MdAdminPanelSettings className="w-5 h-5 text-white" />,
            icon: <MdOutlineAdminPanelSettings className="w-5 h-5" />,
            label: session?.user?.role === "admin" ? "Admin Panel" : "Teacher Panel",
            condition: session?.user?.role === "admin" || session?.user?.role === "teacher"
        },
        {
            href: "/tracks",
            activeIcon: <HiUserGroup className="w-5 h-5" />,
            icon: <HiOutlineUserGroup className="w-5 h-5" />,
            label: "แทร็ก",
            condition: true
        },
        {
            href: "/student/tracks",
            activeIcon: <AiFillEdit className="w-5 h-5" />,
            icon: <AiOutlineEdit className="w-5 h-5" />,
            label: "คัดเลือกแทร็ก",
            condition: session?.user?.role === "student"
        },
        {
            href: "/student/tracks/exam",
            activeIcon: <MdQuiz className="w-5 h-5" />,
            icon: <MdOutlineQuiz className="w-5 h-5" />,
            label: "แนะนำแทร็ก",
            condition: true
        },
        {
            href: "/student/verify",
            activeIcon: <HiAcademicCap className="w-5 h-5" />,
            icon: <HiOutlineAcademicCap className="w-5 h-5" />,
            label: "ตรวจสอบสำเร็จการศึกษา",
            condition: session?.user?.role === "student"
        }
    ]), [session])

    return (
        <aside
            style={{ top: "65px" }}
            id="default-sidebar"
            className={`border-r border-r-gray-200/80 fixed top-16 left-0 z-50 ${toggleSideBar ? "w-[240px]" : ""} h-screen transition-transform -translate-x-full md:translate-x-0`}
            aria-label="Sidebar"
        >
            <div className="h-full px-4 py-4 overflow-y-auto bg-white">
                <ul className="font-medium space-y-1">
                    {links.map((link, index) => {
                        if (!link.condition) return null;
                        const isActive = url === link.href || (url.startsWith("/admin") && link.href.includes("/admin"));
                        return (
                            <li key={index}>
                                <SidebarLink
                                    href={link.href}
                                    activeIcon={link.activeIcon}
                                    icon={link.icon}
                                    label={link.label}
                                    isActive={isActive}
                                    toggleSideBar={toggleSideBar}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar