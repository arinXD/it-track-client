import axios from 'axios';
import HomePage from './HomePage';
import { getOptions } from './components/serverAction/TokenAction';

async function getNews() {
    const option = await getOptions("/api/news/published/all", "get")
    try {
        const news = (await axios(option)).data
        return news.slice(0, 4)
    } catch (error) {
        return []
    }
}

const Page = async () => {
    const news = await getNews()
    return (
        <HomePage
            news={news}
        />
    )
}

export default Page;