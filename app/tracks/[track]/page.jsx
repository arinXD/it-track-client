import { BreadCrumb, Navbar, Sidebar } from '@/app/components'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import SubjectList from './SubjectList'
import CoverImage from './CoverImage'
import TeacherList from './TeacherList'
import { Empty, Image } from 'antd'
import TrackSection from './TrackSection'
import { trackApply } from './apply'

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
    const { track: trackParam } = params
    const track = trackParam.replaceAll("-", " ")
    const applyList = trackApply[String(trackParam)?.split("-")[0]]
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

                            {/* information section */}
                            <section className='max-w-4xl mx-auto px-4 mt-10'>
                                {trackData?.information}
                            </section>

                            {/* รูปอธิบายเพิ่มเติม */}
                            <section className='max-w-4xl mx-auto px-4 mt-10 gap-1 grid grid-cols-6'>
                                {[1, 2, 3, 4, 5, 6].map(number => (
                                    <div
                                        key={`image-${number}`}
                                        className={`${number == 1 ? "col-span-4" : "col-span-2"} border border-black h-[200px]`}>
                                        <Image
                                            src={`/image/tracks/${String(trackParam)?.split("-")[0]}/${number}.png`}
                                            alt={`image-${String(trackParam)?.split("-")[0]}-${number}`}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                ))}
                            </section>

                            {/* การประยุกต์ใช้งาน */}
                            <section className='max-w-4xl mx-auto px-4 mt-10'>
                                <h3 className="text-lg font-semibold mb-2">ตัวอย่างการทำงาน</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {applyList?.map((apply, index) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            {apply}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* วิชา อาชีพ */}
                            <SubjectList
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