import axios from "axios"
import SidebarDrawer from "../components/NavbarDrawer"
import NewsCard from "./NewsCard"
import { getOptions } from "../components/serverAction/TokenAction"
import { Empty } from "antd"

const getAllNews = async () => {
     const option = await getOptions("/api/news/published/all", "get")
     try {
          const data = (await axios(option)).data
          return data
     } catch {
          return []
     }
}

const Page = async () => {
     const news = await getAllNews()
     return (
          <section>
               <div className="min-h-screen bg-gray-50">
                    <SidebarDrawer />
                    <div className="pt-16">
                         <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                              <div className="text-center py-8">
                                   <h2 className="text-4xl font-extrabold text-gray-900">ข่าวสารประชาสัมพันธ์</h2>
                              </div>
                              {news.length > 0 ?
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                                        {news.map((item) => (
                                             <NewsCard
                                                  key={item.id}
                                                  news={item}
                                             />
                                        ))}
                                   </div>
                                   :
                                   <div className='my-4'>
                                        <Empty
                                             description="ไม่มีข่าวสารในขณะนี้"
                                        />
                                   </div>
                              }
                         </div>
                    </div>
               </div>
          </section>
     )
}

export default Page