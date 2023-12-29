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
                <div>
                    <p>หาความเหมาะสมในอาชีพ</p>
                </div>
            </ContentWrap>
        </>
    )
}

export default Page;