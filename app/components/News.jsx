"use client"
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Card1 from './Card1';

const News = ({ data }) => {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <>
            <div className='grid grid-cols-3 gap-6 my-6 justify-center'>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>

                <div data-aos="fade-up" className=''>
                    <Card1 />

                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
            </div>
        </>

    );
};

export default News;