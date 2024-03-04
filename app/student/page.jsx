"use client"
import React from 'react';
import { Navbar, Sidebar } from '@/app/components';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
const Page = () => {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/api/auth/sigin?callbackUrl=/student")
        }
    })

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <p>Student</p>
            </ContentWrap>
        </>
    )
}

export default Page;
