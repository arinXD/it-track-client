// group.js
// import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, TablePagination } from '@/app/components';
import axios from "axios";
import { hostname } from '@/app/api/hostname'

async function fetchData() {
    try {
        const result = await axios.get(
            `${hostname}/api/groups`
        )
        let data = result.data.data
        data = data.length > 0 ? data : [{ "ข้อมูล": "ไม่มี" }]
        return data
    } catch (error) {
        console.log(error.response.data.message);
        return [{ "ข้อมูล": "ไม่มี" }]
    }
}

export default async function Group() {
    const data = await fetchData()
    console.log(data)
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='mt-16'>
                <div className='p-8 sm:ml-72'>
                    <h1>Group:</h1>
                    <div>
                        <div>
                            <TablePagination data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

