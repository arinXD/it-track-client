"use client"
import React, { useState, useEffect } from 'react';
import TablePagination from './TablePagination';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = (props) => {
    const data = props.data

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div>
            <div data-aos="fade-up" className='mt-3'>
                <TablePagination data={data} />
            </div>
        </div>
    );
};

export default HomePage;