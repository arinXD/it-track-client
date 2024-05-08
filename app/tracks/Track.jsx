"use client"
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { Empty } from 'antd';
import Image from 'next/image';

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
                        <h1
                            style={{
                                fontSize: "clamp(20px, 5vw, 24px)",
                            }}
                            className='text-center sm:text-start font-bold text-3xl mb-6'>
                            แทร็กความเชี่ยวชาญ
                        </h1>
                        <ul className='space-y-6'>
                            {tracks.map((track, index) => (
                                <li key={index}
                                    className='flex flex-col sm:flex-row justify-start items-start gap-6 border-b-1 pb-4'>
                                    <div
                                        className='w-full sm:w-[250px] h-[180px] relative'>
                                        <Image
                                            priority={true}
                                            width={600}
                                            height={400}
                                            className='w-full h-full object-cover brightness-75'
                                            alt={track.track}
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
                                    <div className='flex flex-col items-start justify-between w-full h-full'>
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex flex-col gap-1'>
                                                <p className='font-bold text-lg'>{track.title_en}</p>
                                                <p>{track.title_th}</p>
                                            </div>
                                            <p className='text-default-500'>
                                                {track.desc}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/tracks/${track.track?.toLowerCase()}`}
                                            className='flex w-full sm:justify-start mt-4'>
                                            <Button
                                                radius='sm'
                                                className='!w-full'
                                                color={"primary"}
                                            >
                                                รายละเอียด
                                            </Button>
                                        </Link>
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