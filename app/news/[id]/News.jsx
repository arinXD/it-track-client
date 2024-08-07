"use client"
import { simpleDMY } from "@/src/util/simpleDateFormatter"
import { Empty } from "antd"
import { sanitize } from "dompurify"
import Image from "next/image"
import Link from "next/link"

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
                         <hr className=" border my-10" />
                         <div>
                              <p className="mb-4">ข่าวอื่นๆ</p>
                              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                   {allNews?.length > 0 && allNews.map((newsItem) => (
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
                                                  <p className="font-semibold text-sm mb-2 line-clamp-3 text-justify">
                                                       {newsItem.title}
                                                  </p>
                                                  {/* <span className="text-sm font-medium text-blue-300 group-hover:text-blue-200 transition-colors duration-300">Read More →</span> */}
                                             </div>
                                        </Link>
                                   ))}
                              </div>
                         </div>
                    </div>
               </article>
               :
               <Empty
                    className='my-4'
                    description="นั่นแน่! I got chuuu!"
               />
     )
}

export default News