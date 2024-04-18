"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'
import TrackTable from './TrackTable'
import { Spinner } from '@nextui-org/react'

const Page = () => {
    const [fetching, setFetching] = useState(false);
    const [tracks, setTracks] = useState([])

    const init = useCallback(async function () {
        try {
            setFetching(true)
            const tracks = await fetchData("/api/tracks")
            setFetching(false)
            setTracks(tracks)
        } catch (error) {
            setTracks([])
        }
    }, [])

    useEffect(() => {
        init()
    }, [])
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                {
                    fetching ?
                        <div className='w-full flex justify-center h-[70vh]'>
                            <Spinner label="กำลังโหลด..." color="primary" />
                        </div>
                        :
                        <TrackTable
                            tracks={tracks}
                        />
                }
            </ContentWrap>
        </>
    )
}

export default Page