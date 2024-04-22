"use client"
import { getOptions } from '@/app/components/serverAction/TokenAction'
import { Input, Spinner, Textarea } from '@nextui-org/react'
import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { Empty } from 'antd';
import { inputClass } from '@/src/util/ComponentClass'
import UploadCover from './UploadCover'

const TrackForm = ({ track }) => {
    const [fetching, setFetching] = useState(false);
    const [trackData, settrackData] = useState({});
    const [coverImageFile, setCoverImageFile] = useState({});
    const [titleTh, setTitleTh] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [desc, setDesc] = useState(" ");

    useEffect(() => {
        // console.log(coverImageFile);
    }, [coverImageFile]);

    const getTrackData = useCallback(async () => {
        const url = `/api/tracks/${track}`
        const option = await getOptions(url, "GET")
        setFetching(true)
        try {
            const res = await axios(option)
            const trackData = res.data.data
            settrackData(trackData)
        } catch (error) {
            settrackData({})
        } finally {
            setFetching(false)
        }
    }, [])

    useEffect(() => {
        getTrackData()
    }, [])

    useEffect(() => {
        setTitleTh(trackData?.title_th)
        setTitleEn(trackData?.title_en)
    }, [trackData]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        console.log(e);
    }, [])

    return (
        <div>
            {
                fetching ?
                    <div className='w-full flex justify-center'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    <div>
                        {trackData && Object.keys(trackData).length !== 0 ?
                            <>
                                <div className='flex flex-row gap-6 justify-between'>
                                    <div className='w-1/2 flex flex-col space-y-3'>
                                        <UploadCover
                                            setCoverImageFile={setCoverImageFile}
                                        />
                                        <UploadCover
                                            setCoverImageFile={setCoverImageFile}
                                        />
                                    </div>
                                    <div className='w-1/2 flex flex-col space-y-10'>
                                        <div className='flex flex-col'>
                                            <Input
                                                type="text"
                                                variant="bordered"
                                                radius='sm'
                                                label="แทรค"
                                                labelPlacement="outside"
                                                value={trackData.track}
                                                isReadOnly
                                                classNames={inputClass}
                                                className='mb-4'
                                            />
                                            <Input
                                                type="text"
                                                variant="bordered"
                                                radius='sm'
                                                label="ชื่อแทรคภาษาไทย"
                                                labelPlacement="outside"
                                                value={titleTh}
                                                onValueChange={setTitleTh}
                                                classNames={inputClass}
                                                className='mb-4'
                                            />
                                            <Input
                                                type="text"
                                                variant="bordered"
                                                radius='sm'
                                                label="ชื่อแทรคภาษาอังกฤษ"
                                                labelPlacement="outside"
                                                value={titleEn}
                                                onValueChange={setTitleEn}
                                                classNames={inputClass}
                                            />
                                        </div>
                                        <div className='flex flex-col'>
                                            <Textarea
                                                variant="bordered"
                                                label="คำอธิบายแทรค"
                                                labelPlacement="outside"
                                                value={desc}
                                                onValueChange={setDesc}
                                                classNames={inputClass}
                                                className='mb-2'
                                            />
                                            <Textarea
                                                variant="bordered"
                                                label="ข้อมูลแทรค"
                                                labelPlacement="outside"
                                                value={desc}
                                                onValueChange={setDesc}
                                                classNames={inputClass}
                                                className='mb-2'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            <Empty className='my-4' />
                        }
                    </div>
            }
        </div>
    )
}

export default TrackForm