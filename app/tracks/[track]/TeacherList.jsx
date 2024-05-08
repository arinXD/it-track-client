import { Empty } from "antd"
import TeacherItem from "./TeacherItem"
import Image from "next/image"

const TeacherList = ({ teachers }) => {
    return (
        <section className="my-5">
            <h2 className="text-center font-bold text-3xl text-[#1C75BC] mb-3">คณาจารย์ประจำแทรค</h2>
            {
                teachers.length == 0 ?
                    <div className='py-8 flex items-center justify-center'>
                        <Empty description={"ไม่มีอาจารย์ประจำแทรค"} />
                    </div>
                    :
                    <>
                        <div className="grid justify-items-center max-lg:justify-items-center grid-cols-4 gap-4 px-80 my-9 max-2xl:px-0">
                            {teachers.map((teacher, index) => (
                                <div key={index} className="grid col-span-1 max-lg:col-span-2 ">
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