'use client';
import React from 'react';
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
const Page = () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <div className='text-center'>
                    <h1 className='text-5xl my-9'>แบบทดสอบกลุ่มความเชี่ยวชาญ</h1>
                </div>
            </ContentWrap>
        </>
    )
}

export default Page;