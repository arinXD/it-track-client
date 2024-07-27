"use client"
import { ContentWrap, Navbar, Sidebar } from '@/app/components';
const Page = () => {

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
