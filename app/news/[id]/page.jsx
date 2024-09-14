import NavbarDrawer from "@/app/components/NavbarDrawer"
import News from "./News"
import axios from "axios"
import { getOptions } from "@/app/components/serverAction/TokenAction"

async function getNewsById(id) {
     const option = await getOptions(`/api/news/published/single/${id}`, "get")
     try {
          const news = (await axios(option)).data
          return news
     } catch (error) {
          return {}
     }
}

async function getAllNews() {
     const option = await getOptions(`/api/news/published/all`, "get")
     try {
          const news = (await axios(option)).data
          return news
     } catch (error) {
          return []
     }
}

const Page = async ({ params }) => {
     const { id } = params
     const [news, allNews] = await Promise.all([getNewsById(id), getAllNews()])
     let filterNews = []
     if (allNews?.length > 0) {
          filterNews = allNews.filter(newItem => newItem.id !== news.id)
     }
     return (
          <section>
               <div className="min-h-screen bg-gray-100 pb-10">
                    <NavbarDrawer />
                    <div className="pt-16">
                         <News
                              news={news}
                              allNews={filterNews}
                         />
                    </div>
               </div>
          </section>
     )
}

export default Page