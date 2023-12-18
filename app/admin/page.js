'use client';
import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '../components';
import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';

const Page = () => {
    const acadLinks = [
        { href: "/admin/acadyears", lable: "ปีการศึกษา" },
        { href: "/admin/program", lable: "หลักสูตร" },
        { href: "/admin/category", lable: "หมวดหมู่วิชา" },
        { href: "/admin/group", lable: "กลุ่มวิชา" },
        { href: "/admin/subgroup", lable: "กลุ่มย่อยวิชา" },
        { href: "/admin/subject", lable: "วิชา" },
    ]
    const tracks = [
        { href: "/admin/track", lable: "ข้อมูลแทรค" },
        { href: "/admin/track/selection", lable: "คัดเลือกแทรค" },
        { href: "/admin/track/student", lable: "รายชื่อนักศึกษาภายในแทรค" },
    ]
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <h1 className='text-xl font-bold my-3'>Admin Panel</h1>
                <div className='flex flex-col space-y-6 mt-6'>
                    <div>
                        <h2>ทั่วไป</h2>
                        <ul className='grid grid-cols-4 gap-2 mt-2'>
                            {acadLinks.map((e, index) => (
                                <li key={index} className='border border-gray-300 rounded-md'>
                                    <Link className='block w-full px-3 py-2' href={e.href}>{e.lable}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>แทรค</h2>
                        <ul className='grid grid-cols-4 gap-2 mt-2'>
                            {tracks.map((e, index) => (
                                <li key={index} className='border border-gray-300 rounded-md'>
                                    <Link className='block w-full px-3 py-2' href={e.href}>{e.lable}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </ContentWrap>
        </>
    )
}

export default Page;