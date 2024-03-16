"use client"
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Card1 from './Card1';
import { Card, CardHeader, CardBody, CardFooter, Image, Button } from "@nextui-org/react";

function linkTo(url) {
    window.open(url, "_blank")
}

const News = ({ data }) => {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <>
            <div className="w-full gap-2 grid grid-cols-12 grid-rows-2">
                <Card
                    shadow="none"
                    isPressable
                    onPress={() => linkTo("https://computing.kku.ac.th/content/news/2024-10-28-cp-ranking-2024")}
                    radius='sm'
                    className="border-1 border-gray-200 col-span-12 sm:col-span-4 h-[300px] relative overflow-hidden object-contain"
                    style={{ backgroundImage: "url('https://api.computing.kku.ac.th//storage/images/2023-10-6-1698423518-1.jpeg')" }}
                >
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            ประกาศ ข่าวสาร
                        </p>
                        <h4 className="text-white text-start font-medium text-large z-10 relative">
                            วิทยาลัยการคอมพิวเตอร์ มข. ติดอับดับที่ 2 ของไทยจากการประกาศผล Times Higher Education World University Rankings by Subject ปี 2024
                        </h4>
                    </CardHeader>
                </Card>
                <Card shadow="none" isPressable onPress={() => linkTo("")} radius='sm' className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">Plant a tree</p>
                        <h4 className="text-white font-medium text-large">Contribute to the planet</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        radius='sm'
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                    />
                </Card>
                <Card shadow="none" isPressable onPress={() => linkTo("")} radius='sm' className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">Supercharged</p>
                        <h4 className="text-white font-medium text-large">Creates beauty like a beast</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        radius='sm'
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                    />
                </Card>
                <Card shadow="none" isPressable onPress={() => linkTo("")} radius='sm' isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">New</p>
                        <h4 className="text-black font-medium text-2xl">Acme camera</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        radius='sm'
                        alt="Card example background"
                        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                        src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                    />
                    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                        <div>
                            <p className="text-black text-tiny">Available soon.</p>
                            <p className="text-black text-tiny">Get notified.</p>
                        </div>
                        <Button className="text-tiny" color="primary" radius="full" size="sm">
                            Notify Me
                        </Button>
                    </CardFooter>
                </Card>
                <Card shadow="none" isPressable onPress={() => linkTo("")} radius='sm' isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
                        <h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>
                    </CardHeader>
                    <Image
                        radius='sm'
                        removeWrapper
                        alt="Relaxing app background"
                        className="z-0 w-full h-full object-cover"
                        src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                    />
                    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                        <div className="flex flex-grow gap-2 items-center">
                            <Image
                                alt="Breathing app icon"
                                className="rounded-full w-10 h-11 bg-black"
                                src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
                            />
                            <div className="flex flex-col">
                                <p className="text-tiny text-white/60">Breathing App</p>
                                <p className="text-tiny text-white/60">Get a good night's sleep.</p>
                            </div>
                        </div>
                        <Button radius="full" size="sm">Get App</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-6 justify-center'>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>

                <div data-aos="fade-up" className=''>
                    <Card1 />

                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
                <div data-aos="fade-up" className=''>
                    <Card1 />
                </div>
            </div>
        </>

    );
};

export default News;