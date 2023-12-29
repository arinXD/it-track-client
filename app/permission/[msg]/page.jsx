import React from 'react'
import { Navbar, ContentWrap, Sidebar } from '@/app/components'
const PagePermission = async ({ params }) => {
    let msg = params.msg
    msg = msg.split("-")
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <div>
                    <p>
                        คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
                    </p>
                    <p>กรุณาเข้าสู่ระบบด้วย {msg.join(" ")}</p>
                </div>
            </ContentWrap>
        </>
    )
}

export default PagePermission