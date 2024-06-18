const SubjectList = ({ track, subjects }) => {
    return (
        <section className="grid grid-cols-2 gap-10 mt-20 mb-5 ">
            <div className="flex justify-center lg:justify-end max-lg:col-span-2">
                <img
                    src={`/${track?.track?.toLowerCase()}.png`} alt={track.track}
                    className="object-cover w-[500px]" />
            </div>
            <div className="pr-48 max-2xl:pr-5 max-md:pr-0 max-md:px-5 mb-5 max-lg:col-span-2">
                <h3 className="font-semibold">วิชาเรียนประจำแทร็ก {track.title_th}</h3>
                <ul className="list-disc ps-4 ml-5">
                    {subjects?.length > 0 && subjects.map((subject, index) => (
                        <li key={index}>
                            <div className="flex flex-col md:gap-2 md:block text-default-600 my-2">
                                <span >{subject?.title_en}</span> <span className="hidden md:inline-block"> - </span> <span >{subject?.title_th}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default SubjectList