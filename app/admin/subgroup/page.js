

// subgroup.js
import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar } from '@/app/components';

export default async function SubGroup() {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='mt-16'>
                <div className='p-8 sm:ml-72'>
                    <h1>SubGroup:</h1>
                    <div>
                        
                    </div>
                </div>
            </div>
        </>
    );
};

