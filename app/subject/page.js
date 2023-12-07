'use client';
// Subject.js
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '@/app/components';
import { TablePagination } from "../components";
import axios from "axios";
import { hostname } from '@/app/api/hostname'

async function fetchData() {
    try {
        const result = await axios.get(
            `${hostname}/api/subjects`
        )
        const data = result.data.data
        return data
    } catch (error) {
        console.log(error);
        return [{ "ข้อมูล": "ไม่มี" }]
    }
}

export default async function Subject() {
    const data = await fetchData()
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='mt-16'>
                <div className='p-8 sm:ml-72'>
                    <h2>Subjects:</h2>
                    <div>
                        <TablePagination data={data} />
                    </div>
                </div>
            </div>
        </>
    );
};

