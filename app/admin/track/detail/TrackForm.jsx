"use client"
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { Button, Input, Spinner, Textarea } from '@nextui-org/react'
import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { Empty, message } from 'antd';
import { inputClass } from '@/src/util/ComponentClass'
import UploadCover from './UploadCover'
import { hostname } from '@/app/api/hostname'

const TrackForm = ({ track }) => {
    const [fetching, setFetching] = useState(true);
    const [trackData, settrackData] = useState({});
    const [titleTh, setTitleTh] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [desc, setDesc] = useState(" ");
    const [information, setInformation] = useState("");
    const [coverImageFile, setCoverImageFile] = useState({});
    const [trackImageFile, setTrackImageFile] = useState({});
    const [uploadProgressImg, setuploadProgressImg] = useState(0);
    const [uploadProgressCover, setuploadProgressCover] = useState(0);
    const [inserting, setInserting] = useState(false);

    const getTrackData = useCallback(async () => {
        const url = `/api/tracks/${track}/get-track`
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
        setDesc(trackData?.desc)
        setInformation(trackData?.information)
    }, [trackData]);

    const handleSubmit = useCallback(async (e) => {
        setInserting(true)
        e.preventDefault()
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData.entries());
        const option = await getOptions(`/api/tracks/${formDataObject.track}`, "PUT", formDataObject)
        const token = await getToken()
        const headers = {
            'Content-Type': 'multipart/form-data',
            'authorization': `${token}`,
        }

        try {
            await axios(option)

            if (trackImageFile instanceof Blob || trackImageFile instanceof File) {
                const formData = new FormData();
                formData.append('image', trackImageFile)
                await axios.post(`${hostname}/api/tracks/${formDataObject.track}/image/img`, formData, {
                    headers,
                    onUploadProgress: (progressObj) => {
                        setuploadProgressImg(progressObj.progress * 100)
                    }
                });
            }

            if (coverImageFile instanceof Blob || coverImageFile instanceof File) {
                const formData = new FormData();
                formData.append('image', coverImageFile);
                await axios.post(`${hostname}/api/tracks/${formDataObject.track}/image/coverImg`, formData, {
                    headers,
                    onUploadProgress: (progressObj) => {
                        setuploadProgressCover(progressObj.progress * 100)
                    }
                });
            }

            await getTrackData()
            message.success("แก้ไขข้อมูลสำเร็จ")
        } catch (error) {
            console.log(error);
            message.error("แก้ไขข้อมูลไม่สำเร็จ")
        } finally {
            setuploadProgressImg(0)
            setuploadProgressCover(0)
            setCoverImageFile({})
            setTrackImageFile({})
            setInserting(false)
        }

    }, [coverImageFile,
        trackImageFile])

    return (
        <div>
            {
                fetching ?
                    <div className='w-full flex justify-center my-6 border p-6 rounded-[10px]'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
                    :
                    <div className='mt-4 border p-6 rounded-[10px] w-full'>
                        {trackData && Object.keys(trackData).length !== 0 ?
                            <>
                                <div className='flex flex-col gap-6'>
                                    <div className='w-full flex flex-col-reverse md:flex-row gap-6'>
                                        <UploadCover
                                            containerWidth="w-full md:w-[20%]"
                                            src={trackData?.img}
                                            label="ภาพแทร็ก"
                                            width="w-full"
                                            setImageFile={setTrackImageFile}
                                            uploadProgress={uploadProgressImg}
                                        />
                                        <UploadCover
                                            containerWidth="w-full md:w-[80%]"
                                            src={trackData?.coverImg}
                                            label="ภาพหน้าปก"
                                            width="w-full"
                                            setImageFile={setCoverImageFile}
                                            uploadProgress={uploadProgressCover}
                                        />

                                    </div>
                                    <div className='flex flex-col justify-center sm:flex-row gap-6'>
                                        <form
                                            onSubmit={handleSubmit}
                                            className='w-full grid grid-cols-2 gap-4'>
                                            <Input
                                                name='track'
                                                type="text"
                                                variant="bordered"
                                                radius='sm'
                                                label="แทร็ก"
                                                labelPlacement="outside"
                                                value={trackData.track}
                                                isReadOnly
                                                classNames={inputClass}
                                                className='col-span-2'
                                                isRequired
                                            />
                                            <Input
                                                name='title_th'
                                                type="text"
                                                variant="bordered"
                                                radius='sm'
                                                label="ชื่อแทร็กภาษาไทย"
                                                labelPlacement="outside"
                                                value={titleTh}
                                                onValueChange={setTitleTh}
                                                classNames={inputClass}
                                                className='col-span-2 md:col-span-1'
                                                isRequired
                                            />
                                            <Input
                                                name='title_en'
                                                type="text"
                                                variant="bordered"
                                                radius='sm'
                                                label="ชื่อแทร็กภาษาอังกฤษ"
                                                labelPlacement="outside"
                                                value={titleEn}
                                                onValueChange={setTitleEn}
                                                classNames={inputClass}
                                                className='col-span-2 md:col-span-1'
                                                isRequired
                                            />
                                            <Textarea
                                                name='desc'
                                                variant="bordered"
                                                label="คำอธิบายแทร็ก"
                                                labelPlacement="outside"
                                                value={desc}
                                                onValueChange={setDesc}
                                                classNames={inputClass}
                                                className='col-span-2'
                                            />
                                            <Textarea
                                                name='information'
                                                variant="bordered"
                                                label="ข้อมูลแทร็ก"
                                                labelPlacement="outside"
                                                value={information}
                                                onValueChange={setInformation}
                                                classNames={inputClass}
                                                className='col-span-2'
                                            />
                                            <div className='col-span-2 flex justify-end'>
                                                <Button
                                                    type='submit'
                                                    radius='sm'
                                                    color='primary'
                                                    className='bg-primary-500 rounded-[5px] mt-4'
                                                    isDisabled={inserting}
                                                    isLoading={inserting}
                                                >
                                                    {
                                                        inserting ?
                                                            "กำลังบันทึก..."
                                                            :
                                                            "บันทึก"
                                                    }
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                            :
                            <Empty
                                description="ไม่พบข้อมูลแทร็ก"
                                className='my-4' />
                        }
                    </div>
            }
        </div>
    )
}

export default TrackForm