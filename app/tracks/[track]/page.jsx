import { BreadCrumb, Navbar, Sidebar } from '@/app/components'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import SubjectList from './SubjectList'
import CoverImage from './CoverImage'
import TeacherList from './TeacherList'
import { Empty, Image } from 'antd'
import PreviewGroup from "antd/lib/image/PreviewGroup"
import TrackSection from './TrackSection'
import { trackApply } from './apply'
import { useMemo } from 'react'
import ImageCarousel from '@/app/components/ImageCarousel'

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

    const imagePaths = [1, 2, 3, 4, 5, 6, 7].map(
        number => `/image/tracks/${String(trackParam)?.split("-")[0]}/${number}.png`
    )

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
                            <section className='max-w-4xl mx-auto px-4'>
                                <BreadCrumb />
                            </section>
                            <TeacherList teachers={teachers} />

                            {/* information section */}
                            <section className='max-w-4xl mx-auto px-4 mt-10'>
                                {trackData?.information}
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

                            {/* รูปอธิบายเพิ่มเติม Mobile */}
                            <section className='max-w-4xl mx-auto px-4 mt-10 gap-1 md:hidden'>
                                <ImageCarousel images={imagePaths} />
                            </section>

                            {/* รูปอธิบายเพิ่มเติม Ipad, PC */}
                            <section className='max-w-4xl mx-auto px-4 mt-10 gap-1 md:grid grid-cols-6 hidden'>
                                <PreviewGroup>
                                    {imagePaths.map((path, index) => (
                                        <div
                                            key={`image-${index + 1}`}
                                            className={`col-span-6 ${[0, 6].includes(index) ? "md:col-span-4" : "md:col-span-2"} h-[200px]`}
                                        >
                                            <Image
                                                src={path}
                                                alt={`image-${String(trackParam)?.split("-")[0]}-${index + 1}`}
                                                className='w-full object-cover'
                                                width={"100%"}
                                                height={200}
                                            />
                                        </div>
                                    ))}
                                </PreviewGroup>
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