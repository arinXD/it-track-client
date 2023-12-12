'use client';
import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '../components';
import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';

const Page = () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <p>Admin Panel</p>
                <ul>
                    <li>
                        <Link className='text-blue-500 cursor-pointer underline' href={"/admin/acadyears"}>ปีการศึกษา</Link>
                    </li>
                    <li>
                        <Link className='text-blue-500 cursor-pointer underline' href={"/admin/category"}>หมวดหมู่วิชา</Link>
                    </li>
                    <li>
                        <Link className='text-blue-500 cursor-pointer underline' href={"/admin/group"}>กลุ่มวิชา</Link>
                    </li>
                    <li>
                        <Link className='text-blue-500 cursor-pointer underline' href={"/admin/subgroup"}>กลุ่มย่อยวิชา</Link>
                    </li>
                    <li>
                        <Link className='text-blue-500 cursor-pointer underline' href={"/admin/subject"}>วิชา</Link>
                    </li>
                </ul>
            </ContentWrap>
        </>
    )
}

export default Page;