'use client';
import React, { useEffect, useState } from 'react'
import '../../../style/exam.css';
import { Navbar, Sidebar, ContentWrap } from '@/app/components';
const Page = () => {
    const data = [
        {
            question: 'คุณทำความรู้จักเพื่อนใหม่เป็นประจำ',
        },
        {
            question: 'คุณทำความรู้จักเพื่อนใหม่เป็นประจำ',
        },
    ]
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='bg-[#33A474] mt-16 px-8 sm:ml-[240px] bg-imgs'>
                <div className=' mx-auto max-w-2xl text-center py-12 lg:py-20'>
                    <h1 className='text-4xl font-bold tracking-tight text-white sm:text-5xl'>แบบทดสอบกลุ่มความเชี่ยวชาญ</h1>
                    <h2 className='mt-6 text-2xl leading-8 tracking-tighter text-white dark:text-gray-300'>ค้นพบความเชี่ยวชาญหลักสูตรไอทีล่าสุด! ยกระดับทักษะของคุณด้วยความเชี่ยวชาญที่ล้ำสมัย นำทางไปสู่อนาคตของความสำเร็จทางเทคโนโลยี</h2>
                </div>
                <div className=' px-4 mx-auto max-w-screen-xl lg:px-6'>
                    <div className='className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0"'>
                        <div className='flex flex-col p-6 mx-auto max-w-lg text-gray-900 bg-white rounded-lg border border-gray-100 shadow xl:p-8 text-center'>
                            <img src="/network.png" alt="" className='p-4 mb-2 md:mb-4 max-h-60 w-full object-contain rounded-lg' width={512} height={512} />
                            <h3 className='mt-4 mb-4 text-2xl font-semibold'>Systems, Network, <br></br>Security and IoTs</h3>
                            <p className='font-light text-gray-500'>เน้นด้านระบบเครือข่าย ความมั่นคงปลอดภัย และอินเทอร์เน็ตของสรรพสิ่ง</p>
                        </div>
                        <div className='flex flex-col p-6 mx-auto max-w-lg text-gray-900 bg-white rounded-lg border border-gray-100 shadow xl:p-8 text-center'>
                            <img src="/web.png" alt="" className='p-4 mb-2 md:mb-4 max-h-60 w-full object-contain rounded-lg' width={512} height={512} />
                            <h3 className='mt-4 mb-4 text-2xl font-semibold'>Mobile and Web Application Development</h3>
                            <p className='font-light text-gray-500'>เน้นในด้านการพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่และเว็บ</p>
                        </div>
                        <div className='flex flex-col p-6 mx-auto max-w-lg text-gray-900 bg-white rounded-lg border border-gray-100 shadow xl:p-8 text-center'>
                            <img src="/bi.png" alt="" className='p-4 mb-2 md:mb-4 max-h-60 w-full object-contain rounded-lg' width={512} height={512} />
                            <h3 className='mt-4 mb-4 text-2xl font-semibold'>Business Information Technology</h3>
                            <p className='font-light text-gray-500'>เน้นเรียนเกี่ยวกับเทคโนโลยีสารสนเทศที่ใช้ในการสนับสนุนและพัฒนาธุรกิจ</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-8 px-8 sm:ml-[240px]'>
                {data.map((question, index) => (
                    <div key={index} className='mx-auto max-w-7xl my-12'>
                        <p className='text-center text-4xl text-gray-600'>{question.question}</p>
                        <div className='flex justify-center items-center gap-16 text-2xl'>
                            <h2 className='text-green-800'>ฉันเห็นด้วย</h2>
                            <div className='flex justify-center items-center gap-12 my-20'>
                                <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
                                    <span className="w-20 h-20 flex items-center justify-center border border-gray-300 rounded-full">
                                        <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
                                        <span className="block rounded-full transition duration-400 hover:bg-green-800 w-20 h-20"></span>
                                    </span>
                                </label>
                                <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
                                    <span className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full">
                                        <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
                                        <span className="block rounded-full transition duration-400 hover:bg-green-800 w-14 h-14"></span>
                                    </span>
                                </label>
                                <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
                                    <span className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full">
                                        <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
                                        <span className="block rounded-full transition duration-400 hover:bg-gray-600 w-10 h-10"></span>
                                    </span>
                                </label>
                                <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
                                    <span className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full">
                                        <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
                                        <span className="block rounded-full transition duration-400 hover:bg-purple-900 w-14 h-14"></span>
                                    </span>
                                </label>
                                <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
                                    <span className="w-20 h-20 flex items-center justify-center border border-gray-300 rounded-full">
                                        <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
                                        <span className="block rounded-full transition duration-400 hover:bg-purple-900 w-20 h-20"></span>
                                    </span>
                                </label>
                            </div>
                            <h2 className='text-purple-800'>ฉันไม่เห็นด้วย</h2>
                        </div>
                        <hr className='border-1 border-gray-300' />
                    </div>
                ))}
            </div>
        </>
    )
}

export default Page;