"use client"
import { useCallback, useEffect, useMemo } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Empty } from 'antd';
import { Card, CardFooter, Image } from "@nextui-org/react";
import { useRouter, } from 'next/navigation'

const Track = ({ tracks }) => {

    const router = useMemo(() => useRouter(), [])

    const linkTo = function (url) {
        router.push(url);
        router.refresh()
    }

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
                    <div className='my-[30px] px-8 max-lg:px-4'>
                        <h1
                            style={{             //min def max
                                fontSize: "clamp(45px, 3vw, 30px)",
                            }}
                            className='text-center sm:text-start font-bold text-3xl mb-8'>
                            แทร็กความเชี่ยวชาญ
                        </h1>
                        <p className='text-center sm:text-start text-lg mb-8'>
                            ค้นพบแทร็กหลักสูตรไอทีล่าสุด! ยกระดับทักษะของคุณด้วยความเชี่ยวชาญที่ล้ำสมัย นำทางไปสู่อนาคตของความสำเร็จทางเทคโนโลยี
                        </p>
                        <div className='grid grid-cols-12 gap-4'>
                            {tracks.map((track, index) => {
                                let colSpan;
                                if (index === 0) {
                                    colSpan = 'col-span-7';
                                } else if (index === 1) {
                                    colSpan = 'col-span-5';
                                } else {
                                    colSpan = 'col-span-12';
                                }

                                return (
                                    <div key={index} className={`w-full grid max-lg:col-span-12 ${colSpan}`}>
                                        <Card
                                            key={index}
                                            shadow="none"
                                            isPressable
                                            onClick={() => linkTo(`/tracks/${track.track?.toLowerCase()}`)}
                                            radius='none'
                                            isFooterBlurred
                                            className="group relative w-full h-[400px] max-xl:h-[250px]">
                                            <Image
                                                radius='none'
                                                removeWrapper
                                                width={1000}
                                                height={1000}
                                                unoptimized="true"
                                                className="z-0 w-full h-full object-cover"
                                                quality={100}
                                                alt={track.track}
                                                src={track.img} />
                                            <CardFooter className="flex-col justify-center h-full text-white bg-opacity-60 bg-black text-small absolute bottom-[-30em] group-hover:bottom-0 ease-in-out duration-400">
                                                <span className='text-3xl font-extrabold'>{track.track}</span>
                                                <hr className='w-10 mt-7 mb-5 border-2 border-gray-500'></hr>
                                                <span className='text-2xl text-default-300'>{track.title_th}</span>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                        {/* <ul className='space-y-6'>
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
                                            className='flex w-full md:w-fit sm:justify-start mt-4'>
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
                        </ul> */}
                    </div >
            }
        </>
    )
}

export default Track