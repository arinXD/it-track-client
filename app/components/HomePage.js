"use client"
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, ContentWrap, TablePagination } from '@/app/components'
import AOS from 'aos';
import 'aos/dist/aos.css';
// import { signToken } from './serverAction/TokenAction';

const HomePage = ({ data }) => {
    // async function callToken() {
    //     const token = await signToken({ email: "rakuzanoat@gmail.com" })
    //     return token
    // }
    // const [token, setToken] = useState("")
    // useEffect(() => {
    //     setToken(callToken())
    // }, [])
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
                    <div data-aos="fade-up" className=''>
                        <TablePagination data={data} />
                    </div>
                </div>
            </ContentWrap>
        </>

    );
};

export default HomePage;