
// group.js
// import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '@/app/components';
import { TablePagination } from "../../components/TablePagination";
import axios from "axios";
import { hostname } from '@/app/api/hostname'

async function fetchData() {
    try {
        const result = await axios.get(
            `${hostname}/api/groups`
        )
        const data = result.data.data
        return data
    } catch (error) {
        console.log(error);
        return [{ "ข้อมูล": "ไม่มี" }]
    }
}

export default function Group() {
    const data =  fetchData()
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
                            {/* {data.map((e, index) =>(
                                <li key={index} >{e.id}</li>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
