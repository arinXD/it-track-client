"use client"
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'

const Page = () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <div>
                    restore
                </div>
            </ContentWrap>
        </>
    )
}

export default Page