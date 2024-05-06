import { Empty } from "antd"
import TeacherItem from "./TeacherItem"

const TeacherList = ({ teachers }) => {
    return (
        <section className="my-5">
            <h2 className="text-center font-bold text-3xl text-[#1C75BC]">คณาจารย์ประจำแทรค</h2>
            {
                teachers.length == 0 ?
                    <div className='py-8 flex items-center justify-center'>
                        <Empty description={"ไม่มีอาจารย์ประจำแทรค"} />
                    </div>
                    :
                    <>
                        <ul className="flex gap-4">
                            {teachers.map((teacher, index) => (
                                <TeacherItem key={index} teacher={teacher} />
                            ))}
                        </ul>
                    </>
            }
        </section>
    )
}

export default TeacherList