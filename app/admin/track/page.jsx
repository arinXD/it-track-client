"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData } from '../action'
import TrackTable from './TrackTable'
import InsertTrackModal from './InsertTrackModal'
import { useDisclosure } from '@nextui-org/react'

const Page = () => {
    const [fetching, setFetching] = useState(false);
    const [tracks, setTracks] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure();

    const init = useCallback(async function () {
        try {
            setFetching(true)
            setTimeout(async () => {
                const tracks = await fetchData("/api/tracks/all")
                setFetching(false)
                setTracks(tracks)
            }, 1500);
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

                {/* insert */}
                <InsertTrackModal
                    isOpen={isOpen}
                    onClose={onClose}
                />

                <TrackTable
                    fetching={fetching}
                    tracks={tracks}
                    openInsertModal={onOpen}
                />
            </ContentWrap>
        </>
    )
}

export default Page