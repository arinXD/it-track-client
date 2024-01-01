import React from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'

const page = async () => {
    const tracks = await fetchData("/api/tracks")
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <div>
                    <h1>Track</h1>
                    <ul>
                        {tracks.length > 0 ? tracks.map((track, index) => (
                            <li key={index}>{`${index + 1})`} {track.title_en}</li>
                        )) :
                            <li>ไม่มีข้อมูลแทรค</li>}
                    </ul>
                </div>
            </ContentWrap>
        </>
    )
}

export default page