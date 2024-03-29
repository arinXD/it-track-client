"use client"
import React, { useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'

const Page = () => {
    const [tracks, setTracks] = useState([])

    useEffect(()=>{
        async function init() {
            try {
                const tracks = await fetchData("/api/tracks")
                setTracks(tracks)
            } catch (error) {
                setTracks([])
            }
        }
        init()
    },[])
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

export default Page