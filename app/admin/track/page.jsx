"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'
import TrackTable from './TrackTable'

const Page = () => {
    const [fetching, setFetching] = useState(false);
    const [tracks, setTracks] = useState([])

    const init = useCallback(async function () {
        try {
            setFetching(true)
            const tracks = await fetchData("/api/tracks/all")
            setTracks(tracks)
        } catch (error) {
            setTracks([])
        }finally{
            setFetching(false)
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

                <TrackTable
                    fetching={fetching}
                    tracks={tracks}
                    callBack={init}
                />
            </ContentWrap>
        </>
    )
}

export default Page