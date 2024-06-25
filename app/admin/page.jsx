import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '../components';
import React from 'react';
import Link from 'next/link';
import { IoBook } from "react-icons/io5";
import { BiSolidCategory, BiSolidBook } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { HiAcademicCap, HiUserGroup } from 'react-icons/hi2';
import { AiFillEdit } from 'react-icons/ai';
import { IoMdCheckboxOutline } from "react-icons/io";

const Page = async () => {
    const masker = {
        maskImage: 'url("/masker/grit.png")',
    }
    const categories = [
        {
            title: "ทั่วไป",
            links: [
                // { href: "/admin/acadyears", lable: "ปีการศึกษา" },
                {
                    href: "/admin/program", lable: "หลักสูตร",
                    icon: <IoBook style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/programcode", lable: "รหัสหลักสูตร",
                    icon: <IoBook style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/category", lable: "หมวดหมู่วิชา",
                    icon: <BiSolidCategory style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/group", lable: "กลุ่มวิชา",
                    icon: <BiSolidBook style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/subgroup", lable: "กลุ่มย่อยวิชา",
                    icon: <BiSolidBook style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/subject", lable: "วิชา",
                    icon: <BiSolidBook style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/students", lable: "รายชื่อนักศึกษา",
                    icon: <BsFillPersonFill style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
            ]
        },
        {
            title: "แทร็ก",
            links: [
                {
                    href: "/admin/track", lable: "ข้อมูลแทรค",
                    icon: <HiUserGroup style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/track-selection", lable: "คัดเลือกแทรค",
                    icon: <AiFillEdit style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/trackstudent", lable: "รายชื่อนักศึกษาภายในแทรค",
                    icon: <BsFillPersonFill style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
            ]
        },
        {
            title: "แนะนำแทร็ก",
            links: [
                {
                    href: "/admin/suggest-form", lable: "แบบฟอร์มแนะนำแทร็ก",
                    icon: <IoMdCheckboxOutline  style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
            ]
        },
        {
            title: "ตรวจสอบจบ",
            links: [
                {
                    href: "/admin/verify", lable: "แบบฟอร์มตรวจสอบจบ",
                    icon: <HiAcademicCap style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
                {
                    href: "/admin/verify-selection", lable: "อนุมัติจบการศึกษา",
                    icon: <HiAcademicCap style={masker} className='w-20 h-20 group-hover:scale-110 transition-transform text-[#333333]' />
                },
            ]
        }
    ]

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <div className='flex flex-col space-y-8 mt-8'>
                    {
                        categories.map((category, index) => (
                            <div key={index}
                                className='first:mt-0'>
                                <h2 className="font-bold text-2xl mb-4">{category.title}</h2>
                                <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-6'>
                                    {category.links.map((link, index) => (
                                        <li key={index}>
                                            <Link className='block group'
                                                href={link.href}>
                                                <div
                                                    className='bg-[#ebecee] p-3 h-36 flex justify-center items-center'>
                                                    {link.icon}
                                                </div>
                                                <p className='text-[#2C2F31] mt-1.5'>
                                                    {link.lable}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    }
                </div>
            </ContentWrap>
        </>
    )
}

export default Page;