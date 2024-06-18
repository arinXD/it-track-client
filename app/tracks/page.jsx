import { ContentWrap, Navbar, Sidebar } from '@/app/components'
import axios from 'axios'
import { getOptions } from '../components/serverAction/TokenAction'
import Track from './Track'

const getTracks = async () => {
    try {
        const URL = "/api/tracks/all"
        const option = await getOptions(URL, "GET")
        const response = await axios(option)
        return response.data.data
    } catch (error) { 
        return []
    }
}

const Page = async () => {
    const tracks = await getTracks()

    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <Track
                    tracks={tracks} />
            </ContentWrap>
        </>
    )
}

export default Page