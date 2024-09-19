"use client"
import { simpleDMY } from "@/src/util/simpleDateFormatter"
import { sanitize } from "isomorphic-dompurify";
import Image from "next/image"
import Link from "next/link"
import "./news.css"

const News = ({ news = {}, allNews = [] }) => {
     return (
          news && Object?.keys(news).length > 0 ?
               <article className="bg-white max-w-4xl mx-auto overflow-hidden">
                    <div className="relative h-[400px]">
                         <Image
                              src={news?.image}
                              alt={news?.title}
                              layout="fill"
                              objectFit="cover"
                              priority
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                         <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
                                   {news?.title}
                              </h1>
                              <p className="text-sm md:text-base mb-2 opacity-90">
                                   {news?.desc}
                              </p>
                              <time className="text-xs md:text-sm opacity-75">
                                   เผยแพร่เมื่อ {simpleDMY(news?.updatedAt)}
                              </time>
                         </div>
                    </div>
                    <div className="px-6 py-8">
                         <div className="text-lg max-w-none">
                              <div dangerouslySetInnerHTML={{ __html: sanitize(news?.detail) }} />
                         </div>
                         {allNews?.length > 0 &&
                              <>
                                   <hr className="border mt-10 mb-5" />
                                   <div>
                                        <div className="flex gap-2 mb-4">
                                             <div className="w-1 bg-blue-500"></div>
                                             <p className="">ข่าวสารอื่นๆ</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                             {allNews.map((newsItem) => (
                                                  <Link
                                                       key={newsItem.id}
                                                       href={`/news/${newsItem.id}`}
                                                       className="block group hover:opacity-80 transition-all"
                                                  >
                                                       <div>
                                                            <Image
                                                                 src={newsItem?.image}
                                                                 alt="news-image"
                                                                 width={150}
                                                                 height={150}
                                                                 className="w-full object-cover h-[200px]"
                                                            />
                                                            <p className="text-sm mb-2 line-clamp-3 text-start">
                                                                 {newsItem.title}
                                                            </p>
                                                       </div>
                                                  </Link>
                                             ))}
                                        </div>
                                   </div>
                              </>
                         }
                    </div>
               </article>
               :
               <div
                    style={{ height: "calc(100vh - 128px)" }}
                    className="h-screen flex justify-center items-center flex-col gap-1">
                    <Image
                         src={"/image/security.png"}
                         alt="security"
                         width={150}
                         height={150}
                    />
                    <Image />
                    <div className="flex flex-col justify-center items-center gap-1">
                         <p className="text-xl font-bold">เนื้อหานี้ไม่พร้อมใช้งานในขณะนี้</p>
                         <p>เหตุการณ์นี้มักจะเกิดขึ้นเนื่องจากเนื้อหาข่าวถูกซ่อนหรือลบไปแล้ว</p>
                    </div>

               </div>
     )
}

export default News