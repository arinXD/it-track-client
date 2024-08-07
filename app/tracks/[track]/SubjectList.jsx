// "use client"
// import Image from "next/image";

// const SubjectList = ({ track, subjects, careers }) => {

//     return (
//         <section className="grid grid-cols-2 gap-10 mt-20 mb-5 ">
//             <div className="flex justify-center lg:justify-end max-lg:col-span-2">
//                 <Image
//                     width={800}
//                     height={800}
//                     src={`/image/${track.track.toLowerCase()}.png`}
//                     onError={({ currentTarget }) => {
//                         currentTarget.onerror = null;
//                         currentTarget.src = "/image/track.png";
//                     }}
//                     alt={track?.track || "track"}
//                     className="object-cover w-[500px] h-[800px]"
//                 />
//             </div>
//             <div className="pr-48 max-2xl:pr-5 max-md:pr-0 max-md:px-5 mb-5 max-lg:col-span-2">
//                 <h3 className="font-semibold">วิชาเรียนประจำแทร็ก {track.title_th}</h3>
//                 <ul className="list-disc ps-4 ml-5">
//                     {subjects?.length > 0 && subjects.map((subject, index) => (
//                         <li key={index}>
//                             <div className="flex flex-col md:gap-2 md:block text-default-600 my-2">
//                                 <span >{subject?.title_en}</span> <span className="hidden md:inline-block"> - </span> <span >{subject?.title_th}</span>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>

//                 <h3 className="font-semibold mt-8">อาชีพแทร็ก {track.title_th}</h3>
//                 <ul className="list-disc ps-4 ml-5">
//                     {careers?.length > 0 && careers.map((careers, index) => (
//                         <li key={index}>
//                             <div className="flex flex-col md:gap-2 md:block text-default-600 my-2">
//                                 <span >{careers?.name_en}</span> <span className="hidden md:inline-block"> - </span> <span >{careers?.name_th}</span>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </section>
//     )
// }

// export default SubjectList
"use client"
import Image from "next/image";

const SubjectList = ({ track, subjects, careers }) => {
    return (
        <section className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-20">
                <div className="md:w-1/2">
                    <Image
                        width={400}
                        height={600}
                        src={`/image/${track.track.toLowerCase()}.png`}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "/image/track.png";
                        }}
                        alt={track?.track || "track"}
                        className="w-full h-auto object-cover"
                    />
                </div>
                <div className="md:w-1/2 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">วิชาเรียนประจำแทร็ก {track.title_th}</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {subjects?.map((subject, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                    {subject?.title_en} - {subject?.title_th}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">อาชีพแทร็ก {track.title_th}</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {careers?.map((career, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                    {career?.name_en} - {career?.name_th}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SubjectList