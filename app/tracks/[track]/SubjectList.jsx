import { FaCircle } from "react-icons/fa6"

const SubjectList = ({ track, subjects }) => {
    return (
        <section className="my-5">
            <h3>วิชาเรียนประจำแทรค {track.title_th}</h3>
            <ul className="list-disc ps-4">
                {subjects.map((subject, index) => (
                    <li
                        key={index}>
                        <span>{subject?.title_en}</span>
                        <span>{subject?.title_th}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default SubjectList