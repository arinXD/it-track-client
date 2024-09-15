"use client"
import { useEffect, useMemo, useState } from 'react'
import SidebarDrawer from './components/NavbarDrawer'
import './homepage.css';
import Footer from './components/Footer';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const tracks = [
     { name: 'BIT', icon: '💼', description: 'เทคโนโลยีสารสนเทศทางธุรกิจ ' },
     { name: 'Web and Mobile', icon: '📱', description: 'การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่และเว็บ' },
     { name: 'Network', icon: '🌐', description: 'ระบบ เครือข่าย ความมั่นคงเทคโนโลยีสารสนเทศ และอินเทอร์เน็ตของสรรพสิ่ง' },
]

const mockNews = [
     {
          id: 1,
          title: "การรับสมัครนักศึกษาใหม่ ปีการศึกษา 2024",
          desc: "เปิดรับสมัครนักศึกษาใหม่สำหรับหลักสูตร IT ประจำปีการศึกษา 2024 แล้ววันนี้",
          image: "https://img.freepik.com/premium-psd/billboard-mockup-shoe-store_53876-12220.jpg"
     },
     {
          id: 2,
          title: "งานสัมมนาเทคโนโลยี AI ในอุตสาหกรรม IT",
          desc: "ร่วมฟังการบรรยายจากผู้เชี่ยวชาญด้าน AI และการประยุกต์ใช้ในวงการ IT",
          image: "https://img.freepik.com/premium-psd/billboard-mockup-shoe-store_53876-12220.jpg"
     },
     {
          id: 3,
          title: "โครงการฝึกงานภาคฤดูร้อนกับบริษัทชั้นนำ",
          desc: "โอกาสพิเศษสำหรับนักศึกษาชั้นปีที่ 3 ในการฝึกงานกับบริษัท IT ชั้นนำของประเทศ",
          image: "https://img.freepik.com/premium-psd/billboard-mockup-shoe-store_53876-12220.jpg"
     },
     {
          id: 4,
          title: "การแข่งขันพัฒนาแอปพลิเคชันระดับประเทศ",
          desc: "เชิญชวนนักศึกษาร่วมการแข่งขันพัฒนาแอปพลิเคชันเพื่อชิงรางวัลมูลค่ารวมกว่า 100,000 บาท",
          image: "https://img.freepik.com/premium-psd/billboard-mockup-shoe-store_53876-12220.jpg"
     },
     {
          id: 5,
          title: "การปรับปรุงหลักสูตร IT ประจำปี 2024",
          desc: "แนะนำหลักสูตรใหม่ที่ทันสมัยตอบโจทย์ตลาดแรงงานในยุคดิจิทัล",
          image: "https://img.freepik.com/premium-psd/billboard-mockup-shoe-store_53876-12220.jpg"
     },
     {
          id: 6,
          title: "กิจกรรม IT Open House 2024",
          desc: "พบกับนิทรรศการผลงานนักศึกษาและกิจกรรมที่น่าสนใจมากมายในงาน IT Open House ประจำปี",
          image: "https://img.freepik.com/premium-psd/billboard-mockup-shoe-store_53876-12220.jpg"
     }
];

const HomePage = ({ news = mockNews }) => {
     const backgroundList = useMemo(() => (["neuro.jpg", "neuro2.jpg", "neuro3.jpg"]), []);
     const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

     useEffect(() => {
          const intervalId = setInterval(() => {
               setCurrentBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundList.length);
          }, 10000);

          return () => clearInterval(intervalId);
     }, [backgroundList]);

     return (
          <div className="min-h-screen bg-gray-50 ">
               <SidebarDrawer
               />
               {/* Hero */}
               <section className="bg-gradient-to-r pt-16 from-blue-600 to-indigo-700 text-white relative overflow-hidden">
                    <div
                         className={`background`}
                         style={{
                              backgroundImage: `url(/backgrounds/${backgroundList[currentBackgroundIndex]})`,
                         }}
                    />
                    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                         <div className="text-center">
                              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome to KKU IT</h1>
                              <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto">ค้นพบความเชี่ยวชาญหลักสูตรไอทีล่าสุด! ยกระดับทักษะของคุณด้วยความเชี่ยวชาญที่ล้ำสมัย นำทางไปสู่อนาคตของความสำเร็จทางเทคโนโลยี</p>
                         </div>
                    </div>
               </section>
               {news?.length > 0 ?
                    <section id="news" className="py-20 bg-white">
                         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-12">
                                   <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">ข่าวสารประชาสัมพันธ์</h2>
                                   <p className="mt-4 text-xl text-gray-600">อัปเดตข่าวสารประชาสัมพันธ์</p>
                              </div>
                              <div className={`grid grid-cols-1 gap-8 sm:grid-cols-${news.length < 3 ? news.length : 3} md:grid-cols-${news.length < 3 ? news.length : 3} lg:grid-cols-${news.length < 4 ? news.length : 4}`}>
                                   {news.map((newsItem, index) => (
                                        <Link
                                             key={newsItem.id}
                                             href={`/news/${newsItem.id}`}
                                             className="block group"
                                        >
                                             <div
                                                  style={{
                                                       backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) -10%, rgba(0,0,0,0) 80%), url(${newsItem.image})`,
                                                       backgroundPosition: "center",
                                                       backgroundRepeat: "no-repeat",
                                                       backgroundSize: "cover",
                                                  }}
                                                  className="relative flex flex-col justify-end h-[300px] overflow-hidden transition duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-xl"
                                             >
                                                  {index === 0 &&
                                                       <div className='absolute top-0 left-0 text-white px-6 py-2 bg-[#FF005B]'>
                                                            ล่าสุด
                                                       </div>
                                                  }
                                                  <div className="p-6 text-white">
                                                       <p className="font-semibold text-lg mb-2 line-clamp-2">{newsItem.title}</p>
                                                       <p className="text-sm line-clamp-2 mb-4">{newsItem.desc}</p>
                                                       <span className="text-sm font-medium text-blue-300 group-hover:text-blue-200 transition-colors duration-300">ข้อมูลเพิ่มเติม →</span>
                                                  </div>
                                             </div>
                                        </Link>
                                   ))}
                              </div>
                              <div className='flex justify-center w-full'>
                                   <Link href={"/news"} className='mt-8 text-center inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'>
                                        อ่านข่าวทั้งหมด
                                   </Link>
                              </div>
                         </div>
                    </section>
                    : (
                         undefined
                    )}

               {/* Track */}
               <section section id="tracks" className="py-20 bg-gradient-to-r pt-16 from-blue-600 to-indigo-700" >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center">
                              <h2 className="text-3xl font-extrabold text-white sm:text-4xl"> <code>Choose Your Track!</code></h2>
                              <p className="mt-4 text-xl text-white">สำรวจและค้นหาความเชี่ยวชาญที่ตรงกับเป้าหมายทางอาชีพของคุณ</p>
                         </div>
                         <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                              {tracks.map((track, index) => (
                                   <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
                                        <div className="p-6">
                                             <div className="text-4xl mb-4">{track.icon}</div>
                                             <h3 className="text-2xl font-semibold text-gray-900">{track.name}</h3>
                                             <p className="mt-2 text-gray-600">{track.description}</p>
                                             <a href={`/tracks/${track.name.toLocaleLowerCase()}`} className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
                                                  รายละเอียด
                                                  <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                  </svg>
                                             </a>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* Assessment */}
               <section section id="assessment" className="bg-gray-100 py-20" >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="bg-white rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
                              <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                                   <div className="lg:self-center">
                                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                             <span className="block">ค้นหาแทร็กในอุดมคติของคุณ</span>
                                        </h2>
                                        <p className="mt-4 text-lg leading-6 text-gray-600">
                                             ทำการประเมินของเราเพื่อดูว่าแทร็กใดสอดคล้องกับทักษะและความสนใจของคุณมากที่สุด
                                        </p>
                                        <a href="#" className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                             เริ่มทำแบบทดสอบ
                                             <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                             </svg>
                                        </a>
                                   </div>
                              </div>
                              <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
                                   <img className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20" src="/image/designer.jpg" alt="Track Assessment" />
                              </div>
                         </div>
                    </div>
               </section>

               {/* Verification */}
               <section section id="assessment" className="bg-gray-100 pb-20" >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="bg-white rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
                              <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                                   <div className="lg:self-center">
                                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                             <span className="block">ตรวจสอบสำเร็จการศึกษาที่นี่</span>
                                        </h2>
                                        <p className="mt-4 text-lg leading-6 text-gray-600">
                                             ตรวจสอบเกรดของคุณและยื่นพิจารณาสำเร็จการศึกษาได้ทันที
                                        </p>
                                        <a href="/student/verify" className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                             ตรวจสอบสำเร็จการศึกษา
                                             <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                             </svg>
                                        </a>
                                   </div>
                              </div>
                              <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
                                   <img className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20" src="/image/diploma.jpg" alt="Track Assessment" />
                              </div>
                         </div>
                    </div>
               </section>

               <Footer />
          </div >
     )
}

export default HomePage