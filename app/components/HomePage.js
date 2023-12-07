"use client"
import React, { useState, useEffect } from 'react';
import TablePagination from './TablePagination';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Navbar, Sidebar, ContentWrap } from '@/app/components'

const HomePage = ({ data }) => {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <div>
                    <div data-aos="fade-up" className='mt-3'>
                        <TablePagination data={data} />
                    </div>
                </div>
            </ContentWrap>
        </>

    );
};

export default HomePage;