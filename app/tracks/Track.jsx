"use client"
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Empty } from 'antd';
import { Card, CardFooter, Image } from "@nextui-org/react";
import Link from 'next/link';

const Track = ({ tracks }) => {
    useEffect(() => {
        AOS.init();
    }, []);
    return (
        <>
            {
                tracks?.length == 0 ?
                    <div className='pt-10 flex items-center justify-center'>
                        <Empty />
                    </div>
                    :
                    <div className='my-[20px] px-8 max-lg:px-4'>
                        <h1
                            style={{             //min def max
                                fontSize: "clamp(45px, 3vw, 30px)",
                            }}
                            className='text-center md:text-start font-bold text-3xl mb-[16px] md:mb-[8px] leading-[4rem]'>
                            แทร็กความเชี่ยวชาญ
                        </h1>
                        <p
                            style={{
                                fontSize: "clamp(8px, 3.5vw, 16px)",
                            }}
                            className='text-center md:text-start text-default-600 text-lg mb-8'>
                            ค้นพบแทร็กหลักสูตรไอทีล่าสุด! ยกระดับทักษะของคุณด้วยความเชี่ยวชาญที่ล้ำสมัย นำทางไปสู่อนาคตของความสำเร็จทางเทคโนโลยี
                        </p>
                        <div className='grid grid-cols-12 gap-4'>
                            {tracks.map((track, index) => {
                                let colSpan;
                                let duration
                                if (index === 0) {
                                    colSpan = 'col-span-7';
                                    duration = "500"
                                } else if (index === 1) {
                                    colSpan = 'col-span-5';
                                    duration = "700"
                                } else {
                                    colSpan = 'col-span-12';
                                    duration = "750"
                                }

                                return (
                                    <Link
                                        href={`/tracks/${String(track?.track).toLowerCase().replace(/ /g, "-")}`}
                                        data-aos="fade-up"
                                        data-aos-duration={duration}
                                        key={index}
                                        className={`w-full grid max-lg:col-span-12 ${colSpan}`}>
                                        <Card
                                            key={index}
                                            shadow="none"
                                            isPressable
                                            radius='none'
                                            isFooterBlurred
                                            className="group relative w-full h-[400px] max-xl:h-[250px]">
                                            <Image
                                                style={{
                                                    imageRendering: ""
                                                }}
                                                loading='lazy'
                                                radius='none'
                                                removeWrapper
                                                width={1000}
                                                height={1000}
                                                unoptimized="true"
                                                className="z-0 w-full h-full object-cover brightness-75"
                                                quality={100}
                                                alt={track.track}
                                                src={track.img} />
                                            <p
                                                style={{
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)"
                                                }}
                                                className='w-full font-bold text-white absolute uppercase px-10 text-xl text-center md:text-3xl'>
                                                {track.track}
                                            </p>
                                            <CardFooter className="flex-col justify-center h-full text-white bg-opacity-60 bg-black text-small absolute bottom-[-30em] group-hover:bottom-0 ease-in-out duration-400">
                                                <span className='text-3xl font-extrabold'>{track.track}</span>
                                                <hr className='w-10 mt-7 mb-5 border-2 border-gray-500'></hr>
                                                <span className='text-2xl text-default-300'>{track.title_th}</span>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div >
            }
        </>
    )
}

export default Track