import { HomePage } from '@/app/components'

import React from 'react';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { hostname } from './api/hostname';

async function getData() {
    try {
        const res = await axios.get(`${hostname}/api/posts`)
        const data = res.data.data
        if (data.length == 0) return [{ id: 1, "ข้อมูล": "ไม่มีข้อมูล" }]

        return data
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return ([{ "ข้อมูล": "ไม่พบข้อมูล" }])
    }
}

const Page = async () => {
    const session = await getServerSession()
    const rootData = await getData()
    // console.log(rootData);
    console.log("Home page session: ", session);
    return (
        <>
            <HomePage data={rootData} />
        </>
    )
}

export default Page;