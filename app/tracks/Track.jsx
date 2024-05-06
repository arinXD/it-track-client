"use client"
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { Empty } from 'antd';

const Track = ({ tracks }) => {
    useEffect(() => {
        AOS.init();
    }, [])
    return (
        <>
            {
                tracks?.length == 0 ?
                    <div className='pt-10 flex items-center justify-center'>
                        <Empty />
                    </div>
                    :
                    <>
                        <h1 className='font-bold text-3xl mb-6'>
                            แทร็กความเชี่ยวชาญ
                        </h1>
                        <ul>
                            {tracks.map((track, index) => (
                                <li key={index}
                                    className='flex justify-start items-start gap-6 mb-6 border-b-1 pb-4'>
                                    <div
                                        className='w-[250px] h-[180px] relative'>
                                        <img
                                            className='w-full h-full object-cover rounded-md brightness-75'
                                            src={track.img} />
                                        <p
                                            style={{
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)"
                                            }}
                                            className='w-full font-bold text-white absolute uppercase px-10 text-xl text-center'>
                                            {track.track}
                                        </p>
                                    </div>
                                    <div className='flex flex-col items-start justify-between w-full h-[180px]'>
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex flex-col gap-1'>
                                                <p className='font-bold'>{track.title_en}</p>
                                                <p>{track.title_th}</p>
                                            </div>
                                            <p>
                                                {track.desc}
                                            </p>
                                        </div>
                                        <div>
                                            <Link href={`/tracks/${track.track?.toLowerCase()}`}>
                                                <Button
                                                    radius='md'
                                                    className='w-fit'
                                                >
                                                    รายละเอียด
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
            }
        </>
    )
}

export default Track