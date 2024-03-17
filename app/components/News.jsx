"use client"
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Card1 from './Card1';
import { Card, CardHeader, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import Link from 'next/link';

function linkTo(url) {
    window.open(url, "_blank")
}

const News = ({ data }) => {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <>
            <div className="w-full gap-4 grid grid-cols-12 grid-rows-2">
                <Card
                    shadow="none"
                    isPressable
                    onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-2-16-openhouse-online2024")}
                    radius='none'
                    isFooterBlurred
                    className="group relative w-full h-[300px] col-span-12 sm:col-span-7">
                    <Image
                        radius='none'
                        removeWrapper
                        alt="Relaxing app background"
                        className="z-0 w-full h-full object-cover"
                        src="https://api.computing.kku.ac.th//storage/images/2024-2-6-1708057759-1.jpeg"
                    />
                    <CardFooter className="text-start text-white bg-opacity-60 bg-black text-small justify-start absolute bottom-[-7em] group-hover:bottom-0 ease-in-out duration-400">
                        <span>วิทยาลัยการคอมพิวเตอร์ มข. เข้าร่วมกิจกรรม Open House Online 2024</span>
                    </CardFooter>
                </Card>
                <Card
                    shadow="none"
                    isPressable
                    onClick={() => linkTo("https://computing.kku.ac.th/content/news/cprobot")}
                    radius='none'
                    isFooterBlurred
                    className="group relative w-full h-[300px] col-span-12 sm:col-span-5">
                    <Image
                        removeWrapper
                        radius='none'
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://api.computing.kku.ac.th//storage/images/1688714511-cover.jpeg"
                    />
                    <CardFooter className="text-start text-white bg-opacity-60 bg-black text-small justify-start absolute bottom-[-7em] group-hover:bottom-0 ease-in-out duration-400">
                        <span>มข. จับมือ บ.เอเอ็ม หุ่นซีพีอาร์ จำกัด แถลงข่าวเปิดตัวหุ่น CPRobot: หุ่น CPR อัจฉริยะ ฝึกฝนทักษะการช่วยฟื้นคืนชีพ</span>
                    </CardFooter>
                </Card>
                <Card
                    shadow="none"
                    isPressable
                    onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-10-28-cp-ranking-2024")}
                    radius='none'
                    isFooterBlurred
                    className="group relative col-span-12 sm:col-span-4 h-[300px]">
                    <Image
                        removeWrapper
                        radius='none'
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://api.computing.kku.ac.th//storage/images/2023-10-6-1698423518-1.jpeg"
                    />
                    <CardFooter className="text-start text-white bg-opacity-60 bg-black text-small justify-start absolute bottom-[-7em] group-hover:bottom-0 ease-in-out duration-400">
                        <span>วิทยาลัยการคอมพิวเตอร์ มข. ติดอับดับที่ 2 ของไทยจากการประกาศผล Times Higher Education World University Rankings by Subject ปี 2024</span>
                    </CardFooter>
                </Card>
                <Card
                    shadow="none"
                    isPressable
                    onClick={() => linkTo("https://computing.kku.ac.th/content/news/2023-12-27")}
                    radius='none'
                    isFooterBlurred
                    className="group relative col-span-12 sm:col-span-4 h-[300px]">
                    <Image
                        removeWrapper
                        radius='none'
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://api.computing.kku.ac.th//storage/images/2023-12-5-1703740438-1.jpeg"
                    />
                    <CardFooter className="text-start text-white bg-opacity-60 bg-black text-small justify-start absolute bottom-[-7em] group-hover:bottom-0 ease-in-out duration-400">
                        <span>นักศึกษาระดับบัณฑิตศึกษา วิทยาลัยการคอมพิวเตอร์ มข. คว้าทุนวิจัย ณ ต่างประเทศ</span>
                    </CardFooter>
                </Card>
                <Card
                    shadow="none"
                    isPressable
                    onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-1-18-60-years-kku")}
                    radius='none'
                    isFooterBlurred
                    className="group relative col-span-12 sm:col-span-4 h-[300px]">
                    <Image
                        removeWrapper
                        radius='none'
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://api.computing.kku.ac.th//storage/images/2024-1-5-1705555590-1.jpeg"
                    />
                    <CardFooter className="text-start text-white bg-opacity-60 bg-black text-small justify-start absolute bottom-[-7em] group-hover:bottom-0 ease-in-out duration-400">
                        <span>วิทยาลัยการคอมพิวเตอร์ มข. ขอแสดงความยินดีกับ คณบดีวิทยาลัยการคอมพิวเตอร์ คณาจารย์ และอาจารย์อาวุโส ที่ได้รับรางวัลเชิดชูเกียรติครบรอบ 60 ปีมหาวิทยาลัยขอนแก่น</span>
                    </CardFooter>
                </Card>
            </div>

            {/* column */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-5 justify-center'>
                <div data-aos="fade-up" className=''>
                    <div
                        shadow="none"
                        isPressable
                        onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-3-16-olympic-camp")}
                        radius='none'
                        isFooterBlurred
                        className="group relative w-full h-full col-span-12 sm:col-span-7 pb-4 cursor-pointer">
                        <Image
                            radius='none'
                            removeWrapper
                            alt="Relaxing app background"
                            className="group-hover:opacity-80 z-0 w-full h-[200px] object-cover"
                            src="https://api.computing.kku.ac.th//storage/images/2024-3-7-1710589126-1.jpeg"
                        />
                        <div className="p-0 pt-2 text-start text-white bg-white text-small justify-start">
                            <div className='w-full'
                            >
                                <p className='text-lg group-hover:underline mb-2 text-black font-bold text-[1.15em]'>วิทยาลัยการคอมพิวเตอร์ มข. เข้าร่วมกิจกรรม Open House Online 2024</p>
                                <p className='text-black'>
                                    วิทยาลัยการคอมพิวเตอร์ มข. จัดค่ายโอลิมปิกวิชาการ สาขาคอมพิวเตอร์ ค่าย 2 ระหว่างวันที่ 16 - 31 มีนาคม 2567 ณ ศูนย์ สอวน. วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-aos="fade-up" className=''>
                    <div
                        shadow="none"
                        isPressable
                        onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-3-14")}
                        radius='none'
                        isFooterBlurred
                        className="group relative w-full h-full col-span-12 sm:col-span-7 pb-4 cursor-pointer">
                        <Image
                            radius='none'
                            removeWrapper
                            alt="Relaxing app background"
                            className="group-hover:opacity-80 z-0 w-full h-[200px] object-cover"
                            src="https://api.computing.kku.ac.th//storage/images/2024-3-5-1710415376-2.jpeg"
                        />
                        <div className="p-0 pt-2 text-start text-white bg-white text-small justify-start">
                            <div
                                className='w-full'
                            >
                                <p className='group-hover:underline mb-2 text-black font-bold text-[1.15em]'>
                                    อ. ดร.เพชร อิ่มทองคำ และ นักศึกษาระดับปริญญาเอก เข้าร่วมงาน Fourth International Research Workshop in Computer Science and Information Systems @ Thailand
                                </p>
                                <p
                                    className='text-black'
                                >
                                    อ. ดร.เพชร อิ่มทองคำ และ นักศึกษาระดับปริญญาเอก สาขาวิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ เข้าร่วมงาน Fourth International Research Workshop in Computer Science and Information Systems @ Thailand
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-aos="fade-up" className=''>
                    <div
                        shadow="none"
                        isPressable
                        onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-3-5-atc-rpd")}
                        radius='none'
                        isFooterBlurred
                        className="group relative w-full h-full col-span-12 sm:col-span-7 pb-4 cursor-pointer">
                        <Image
                            radius='none'
                            removeWrapper
                            alt="Relaxing app background"
                            className="group-hover:opacity-80 z-0 w-full h-[200px] object-cover"
                            src="https://api.computing.kku.ac.th//storage/images/2024-3-3-1709604503-1.jpeg"
                        />
                        <div className="p-0 pt-2 text-start text-white bg-white text-small justify-start">
                            <div
                                className='w-full'
                            >
                                <p className='group-hover:underline mb-2 text-black font-bold text-[1.15em]'>
                                    ผศ. ดร.สุมณฑา เกษมวิลาศ ได้รับเชิญให้เข้าร่วมงาน The Third ASEAN TVET Council (ATC) Regional Policy Dialogue (RPD) on “Reskilling and Upskilling in ASEAN”
                                </p>
                                <p
                                    className='text-black'
                                >
                                    ผศ. ดร.สุมณฑา เกษมวิลาศ ได้รับเชิญให้เข้าร่วมงาน The Third ASEAN TVET Council (ATC) Regional Policy Dialogue (RPD) on “Reskilling and Upskilling in ASEAN” ณ บาหลี ประเทศอินโดนีเซีย วันที่ 28-29 กุมภาพันธ์ พ.ศ. 2567
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-aos="fade-up" className=''>
                    <div
                        shadow="none"
                        isPressable
                        onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-3-24-hp")}
                        radius='none'
                        isFooterBlurred
                        className="group relative w-full h-full col-span-12 sm:col-span-7 pb-4 cursor-pointer">
                        <Image
                            radius='none'
                            removeWrapper
                            alt="Relaxing app background"
                            className="group-hover:opacity-80 z-0 w-full h-[200px] object-cover"
                            src="https://api.computing.kku.ac.th//storage/images/2024-3-3-1710233189-1.jpeg"
                        />
                        <div className="p-0 pt-2 text-start text-white bg-white text-small justify-start">
                            <div
                                className='w-full'
                            >
                                <p className='group-hover:underline mb-2 text-black font-bold text-[1.15em]'>
                                    หลักสูตรเทคโนโลยีสารสนเทศ ได้จัดกิจกรรมเสริมหลักสูตร อบรมหัวข้อ การบริหารจัดการระบบเครือข่ายไร้สาย ร่วมกับบริษัท ฮิวเลตต์-แพคการ์ด (ประเทศไทย) จำกัด
                                </p>
                                <p
                                    className='text-black'
                                >
                                    หลักสูตรเทคโนโลยีสารสนเทศ วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น ได้จัดกิจกรรมเสริมหลักสูตร อบรมหัวข้อ การบริหารจัดการระบบเครือข่ายไร้สาย ร่วมกับบริษัท ฮิวเลตต์-แพคการ์ด (ประเทศไทย) จำกัด
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-aos="fade-up" className=''>
                    <div
                        shadow="none"
                        isPressable
                        onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-3-4-aucc-2024")}
                        radius='none'
                        isFooterBlurred
                        className="group relative w-full h-full col-span-12 sm:col-span-7 pb-4 cursor-pointer">
                        <Image
                            radius='none'
                            removeWrapper
                            alt="Relaxing app background"
                            className="group-hover:opacity-80 z-0 w-full h-[200px] object-cover"
                            src="https://api.computing.kku.ac.th//storage/images/2024-3-2-1709535185-1.jpeg"
                        />
                        <div className="p-0 pt-2 text-start text-white bg-white text-small justify-start">
                            <div
                                className='w-full'
                            >
                                <p className='group-hover:underline mb-2 text-black font-bold text-[1.15em]'>
                                    วิทยาลัยการคอมพิวเตอร์ มข. ได้ส่งตัวแทนนักศึกษาเข้าร่วมนำเสนอผลงาน ในงานประชุมวิชาการ ระดับปริญญาตรีด้านคอมพิวเตอร์ภูมิภาคอาเซียน ครั้งที่ 12
                                </p>
                                <p
                                    className='text-black'
                                >
                                    วิทยาลัยการคอมพิวเตอร์ มข. ได้ส่งตัวแทนนักศึกษาเข้าร่วมนำเสนอผลงาน ในงานประชุมวิชาการ ระดับปริญญาตรีด้านคอมพิวเตอร์ภูมิภาคอาเซียน ครั้งที่ 12 , The 12th ASEAN Undergraduate Conference in Computing (AUCC 2024)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-aos="fade-up" className=''>
                    <div
                        shadow="none"
                        isPressable
                        onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-3-4-mou-aucc-ajcc")}
                        radius='none'
                        isFooterBlurred
                        className="group relative w-full h-full col-span-12 sm:col-span-7 pb-4 cursor-pointer">
                        <Image
                            radius='none'
                            removeWrapper
                            alt="Relaxing app background"
                            className="group-hover:opacity-80 z-0 w-full h-[200px] object-cover"
                            src="https://api.computing.kku.ac.th//storage/images/2024-3-2-1709551289-1.jpeg"
                        />
                        <div className="p-0 pt-2 text-start text-white bg-white text-small justify-start">
                            <div
                                className='w-full'
                            >
                                <p className='group-hover:underline mb-2 text-black font-bold text-[1.15em]'>
                                    ผศ. ดร.มัลลิกา วัฒนะ ได้เป็นตัวแทนวิทยาลัยการคอมพิวเตอร์ เข้าร่วมพิธีลงนามความร่วมมือทางวิชาการ โครงการประชุมวิชาการระดับปริญญาตรี ด้านคอมพิวเตอร์ภูมิภาคเอเชีย  และการประชุมวิชาการความร่วมมือทางด้านคอมพิวเตอร์ภูมิภาคเอเชีย
                                </p>
                                <p
                                    className='text-black'
                                >
                                    ผศ. ดร.มัลลิกา วัฒนะ ได้เป็นตัวแทนวิทยาลัยการคอมพิวเตอร์ เข้าร่วมพิธีลงนามความร่วมมือทางวิชาการ (MOU) โครงการประชุมวิชาการระดับปริญญาตรี ด้านคอมพิวเตอร์ภูมิภาคเอเชีย  และการประชุมวิชาการความร่วมมือทางด้านคอมพิวเตอร์ภูมิภาคเอเชีย
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-aos="fade-up" className=''>
                    <div
                        shadow="none"
                        isPressable
                        onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-2-17-q1")}
                        radius='none'
                        isFooterBlurred
                        className="group relative w-full h-full col-span-12 sm:col-span-7 pb-4 cursor-pointer">
                        <Image
                            radius='none'
                            removeWrapper
                            alt="Relaxing app background"
                            className="group-hover:opacity-80 z-0 w-full h-[200px] object-cover"
                            src="https://api.computing.kku.ac.th//storage/images/2024-2-7-1708184927-2.jpeg"
                        />
                        <div className="p-0 pt-2 text-start text-white bg-white text-small justify-start">
                            <div
                                className='w-full'
                            >
                                <p className='group-hover:underline mb-2 text-black font-bold text-[1.15em]'>
                                    วิทยาลัยการคอมพิวเตอร์ มข. ขอแสดงความยินดีกับ อ. ดร.เพชร อิ่มทองคำ ในโอกาสที่บทความวิจัยได้รับการตีพิมพ์เผยแพร่ในวารสารวิชาการระดับนานาชาติ
                                </p>
                                <p
                                    className='text-black'
                                >
                                    วิทยาลัยการคอมพิวเตอร์ มข. ขอแสดงความยินดีกับ อ. ดร.เพชร อิ่มทองคำ ในโอกาสที่บทความวิจัยได้รับการตีพิมพ์เผยแพร่ในวารสารวิชาการระดับนานาชาติ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-aos="fade-up" className=''>
                    <div
                        shadow="none"
                        isPressable
                        onClick={() => linkTo("https://computing.kku.ac.th/content/news/2024-1-17-phet")}
                        radius='none'
                        isFooterBlurred
                        className="group relative w-full h-full col-span-12 sm:col-span-7 pb-4 cursor-pointer">
                        <Image
                            radius='none'
                            removeWrapper
                            alt="Relaxing app background"
                            className="group-hover:opacity-80 z-0 w-full h-[200px] object-cover"
                            src="https://api.computing.kku.ac.th//storage/images/2024-1-4-1705480125-1.jpeg"
                        />
                        <div className="p-0 pt-2 text-start text-white bg-white text-small justify-start">
                            <div
                                className='w-full'
                            >
                                <p className='group-hover:underline mb-2 text-black font-bold text-[1.15em]'>
                                    วิทยาลัยการคอมพิวเตอร์ มข. ขอแสดงความยินดีกับ อ. ดร.เพชร อิ่มทองคำ ในโอกาสที่บทความวิจัยได้รับการตีพิมพ์เผยแพร่ในวารสารวิชาการระดับนานาชาติ
                                </p>
                                <p
                                    className='text-black'
                                >
                                    วิทยาลัยการคอมพิวเตอร์ มข. ขอแสดงความยินดีกับ อ. ดร.เพชร อิ่มทองคำ ในโอกาสที่บทความวิจัยได้รับการตีพิมพ์เผยแพร่ในวารสารวิชาการระดับนานาชาติ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <Link href={"https://computing.kku.ac.th/index"} target='_blank'>
                    <Button radius='sm' color='primary'>อ่านเพิ่มเติม</Button>
                </Link>
            </div>
        </>

    );
};

export default News;