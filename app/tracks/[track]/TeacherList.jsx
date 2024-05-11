import { Empty } from "antd"
import TeacherItem from "./TeacherItem"
import Image from "next/image"

const TeacherList = ({ teachers }) => {
    return (
        <section className="my-10">
            <h2 className="text-center font-bold text-3xl text-[#1C75BC] mb-3">คณาจารย์ประจำแทร็ก</h2>
            <div className="flex justify-center items-center">
                <hr className='w-12 my-3 border-1 border-[#cbcbcb]'></hr>
            </div>
            {
                teachers.length == 0 ?
                    <div className='py-8 flex items-center justify-center'>
                        <Empty description={"ไม่มีอาจารย์ประจำแทร็ก"} />
                    </div>
                    :
                    <>
                        <div className="flex flex-wrap justify-center items-center gap-4 w-full my-9 max-2xl:px-0">
                            {teachers.map((teacher, index) => (
                                <div key={index} className="">
                                    <Image
                                        width={800}
                                        height={800}
                                        src={teacher?.image}
                                        alt={teacher?.teacherName}
                                        className="rounded-md w-[200px] h-[200px]"
                                    />
                                    <p className="text-center">{teacher?.teacherName}</p>
                                </div>
                            ))}
                        </div>
                    </>
            }
        </section>
    )
}

export default TeacherList