"use client"
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { Spinner } from '@nextui-org/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const Page = () => {
    const [delTracks, setdelTracks] = useState([]);
    const [fetching, setfetching] = useState(true);

    const getDeletedTracks = useCallback(async () => {
        setfetching(true)
        const option = await getOptions("/api/tracks/deleted", "GET")
        try {
            const response = await axios(option)
            const deletedTracks = response.data.data
            setdelTracks(deletedTracks)
        } catch (error) {
            setdelTracks([])
        } finally {
            setfetching(false)
        }
    }, [])

    useEffect(() => {
        getDeletedTracks()
    }, [])

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <section className='border p-4 rounded-[10px] w-full'>
                    {
                        fetching ?
                            <div className='w-full flex justify-center my-4'>
                                <Spinner label="กำลังโหลด..." color="primary" />
                            </div>
                            :
                            <div>
                                {JSON.stringify(delTracks)}
                            </div>
                    }
                </section>

            </ContentWrap>
        </>
    )
}

export default Page