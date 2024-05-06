import { BreadCrumb, Navbar, Sidebar } from '@/app/components'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import SubjectList from './SubjectList'
import CoverImage from './CoverImage'
import TeacherList from './TeacherList'
import { Empty } from 'antd'

const getTrack = async (track) => {
    try {
        const URL = `/api/tracks/${track}/get-track`
        const option = await getOptions(URL, "GET")
        const response = await axios(option)
        return response.data.data
    } catch (error) {
        return {}
    }
}
const getTeachers = async (track) => {
    try {
        const URL = `/api/teachers/tracks/${track}`
        const option = await getOptions(URL, "GET")
        const response = await axios(option)
        return response.data.data
    } catch (error) {
        return []
    }
}
const getSubjects = async (track) => {
    try {
        const URL = `/api/subjects/tracks/${track}`
        const option = await getOptions(URL, "GET")
        const response = await axios(option)
        return response.data.data
    } catch (error) {
        return []
    }
}

const Page = async ({ params }) => {
    const { track } = params
    const trackData = await getTrack(track)
    const teachers = await getTeachers(track)
    const subjects = await getSubjects(track)
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            {
                trackData && Object?.keys(trackData).length > 0 ?
                    <>
                        <CoverImage track={trackData} />
                        <section className='py-8 px-16 sm:ml-[240px]'>
                            <BreadCrumb />
                            <TeacherList teachers={teachers} />
                            <SubjectList
                                track={trackData}
                                subjects={subjects} />
                        </section>
                    </>
                    :
                    <div className='mt-16 sm:ml-[240px] pt-10 flex items-center justify-center'>
                        <Empty />
                    </div>
            }
        </>
    )
}

export default Page