import { HomePage, Navbar, Sidebar } from '@/app/components'

import React from 'react';
import axios from 'axios';
import { getServerSession } from 'next-auth';

async function getData() {
    try {
        const res = await axios.get("http://localhost:4000/api/posts")
        const data = res.data.data
        if (data.length == 0) return [{ id: 1, "ข้อมูล": "ไม่มีข้อมูล" }]

        return data
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        return ([{ "ข้อมูล": "ไม่พบข้อมูล" }])
    }
}

const Home = async () => {
    const session = await getServerSession()
    const rootData = await getData()
    // console.log(rootData);
    console.log(session);
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='mt-16'> {/* เว้น nav */}
                <div className='p-8 sm:ml-72'> {/* เว้น side bar */}
                    <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                    <HomePage data={rootData} />
                </div>
            </div>
        </>
    )
}

export default Home;