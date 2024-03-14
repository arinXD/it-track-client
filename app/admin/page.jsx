import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '../components';
import React from 'react';
import Link from 'next/link';

const Page = async () => {
    const acadLinks = [
        // { href: "/admin/acadyears", lable: "ปีการศึกษา" },
        { href: "/admin/program", lable: "หลักสูตร" },
        { href: "/admin/programcode", lable: "รหัสหลักสูตร" },
        { href: "/admin/category", lable: "หมวดหมู่วิชา" },
        { href: "/admin/group", lable: "กลุ่มวิชา" },
        { href: "/admin/subgroup", lable: "กลุ่มย่อยวิชา" },
        { href: "/admin/subject", lable: "วิชา" },
        { href: "/admin/students", lable: "รายชื่อนักศึกษา" },
    ]

    const tracks = [
        { href: "/admin/track", lable: "ข้อมูลแทรค" },
        { href: "/admin/track-selection", lable: "คัดเลือกแทรค" },
    ]
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <div className='flex flex-col space-y-5 mt-5'>
                    <div>
                        <h2>ทั่วไป</h2>
                        <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2'>
                            {acadLinks.map((e, index) => (
                                <li key={index} className='bg-blue-800 text-white rounded-md overflow-hidden'>
                                    <Link className='block w-full px-3 py-2' href={e.href}>{e.lable}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>แทรค</h2>
                        <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2'>
                            {tracks.map((e, index) => (
                                <li key={index} className='bg-blue-800 text-white rounded-md overflow-hidden'>
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