import { BreadCrumb, Navbar, Sidebar } from '@/app/components'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import SubjectList from './SubjectList'
import CoverImage from './CoverImage'
import TeacherList from './TeacherList'
import { Empty } from 'antd'
import TrackSection from './TrackSection'

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

const getCareers = async (track) => {
    try {
        const URL = `/api/careers/tracks/${track}`
        const option = await getOptions(URL, "GET")
        const response = await axios(option)
        return response.data.data
    } catch (error) {
        return []
    }
}

const Page = async ({ params }) => {
    const { track } = params
    const [trackData, teachers, subjects, careers] = await Promise.all([getTrack(track), getTeachers(track), getSubjects(track), getCareers(track)])
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
                        <TrackSection>
                            <BreadCrumb />
                            <TeacherList teachers={teachers} />
                            <SubjectList
                                track={trackData}
                                subjects={subjects}
                                careers={careers} />
                        </TrackSection>
                    </>
                    :
                    <div className='mt-16 md:ml-[240px] pt-10 flex items-center justify-center'>
                        <Empty />
                    </div>
            }
        </>
    )
}

export default Page