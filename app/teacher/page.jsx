'use client';
import React from 'react';
import { ContentWrap, Navbar, Sidebar } from '@/app/components'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
const Page = () => {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/api/auth/sigin?callbackUrl=/teacher")
        }
    })

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <p>Teacher</p>
            </ContentWrap>
        </>
    )
}

export default Page;