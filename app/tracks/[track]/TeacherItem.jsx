import Image from "next/image"

const TeacherItem = ({ teacher }) => {
    return (
        <div className="grid col-span-1 max-md:col-span-2">
            <Image
                width={800}
                height={800}
                src={teacher?.image}
                alt={teacher?.teacherName}
                className="rounded-md w-[200px] h-[200px] sm:w-[100px] sm:h-[100px]"
            />
            <p className="text-center">{teacher?.teacherName}</p>
        </div>
    )
}

export default TeacherItem