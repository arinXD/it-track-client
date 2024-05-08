import Image from "next/image"

const TeacherItem = ({ teacher }) => {
    return (
        <div className="flex flex-col w-full md:w-1/2 lg:w-[200px]">
            <Image
                width={800}
                height={800}
                src={teacher?.image}
                alt={teacher?.teacherName}
                className="rounded-md w-[200px] h-[200px]"
            />
            <p className="text-center">{teacher?.teacherName}</p>
        </div>
    )
}

export default TeacherItem