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