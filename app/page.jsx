import { Navbar } from '@/app/components'
import dynamic from 'next/dynamic'

const News = dynamic(() => import('./components/News'), { ssr: false })

const Page = async () => {
    // const session = await getServerSession()
    // const rootData = await getData()
    // console.log("Home page session: ", session);
    return (
        <>
            <header>
                <Navbar />
            </header>
            <section className='mt-16'>
                <h1 className='mb-4'>ข่าวสารและประชาสัมพันธ์</h1>
                <News />
            </section>
        </>
    )
}

export default Page;