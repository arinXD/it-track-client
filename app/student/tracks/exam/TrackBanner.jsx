"use client"

import Image from "next/image";

const TrackBanner = ({ tracks, form }) => {
    return (
        <div className={`bg-[#33A474] mt-16 bg-imgs px-12 pb-12`}>
            <section className="max-w-4xl mx-auto">
                <div className='mx-auto max-w-2xl text-center py-12 lg:py-20'>
                    <h1 style={{lineHeight:"1.3em"}} className='text-4xl font-bold tracking-tight text-white sm:text-5xl'>{form?.title || "แบบทดสอบกลุ่มความเชี่ยวชาญ"}</h1>
                    <h2 className='mt-6 text-2xl leading-8 tracking-tighter text-white dark:text-gray-300'>{form?.desc || "ค้นพบความเชี่ยวชาญหลักสูตรไอทีล่าสุด! ยกระดับทักษะของคุณด้วยความเชี่ยวชาญที่ล้ำสมัย นำทางไปสู่อนาคตของความสำเร็จทางเทคโนโลยี"}</h2>
                </div>
                <div className='mx-auto max-w-screen-xl'>
                    <div className='space-y-8 grid gap-8 md:grid-cols-2 md:space-y-0 lg:grid-cols-3 lg:space-y-0 lg:gap-8'>
                        {tracks?.map((track, index) => (
                            <div key={index} className='w-full flex flex-col p-6 mx-auto max-w-lg text-gray-900 bg-white rounded-lg border border-gray-100 shadow xl:p-8 text-center'>
                                <Image
                                    src={`/image/${track.track.toLowerCase()}.png`}
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = "/image/track.png";
                                    }}
                                    alt={track.track.toLowerCase()}
                                    className='p-4 mb-2 md:mb-4 h-44 w-full object-contain rounded-lg'
                                    width={512}
                                    height={512} />
                                <h3 className='mt-4 mb-4 text-xl font-semibold'>{track?.track.toLowerCase() !== "network" ? track?.title_en : "Systems, Network, Security and IoTs"}</h3>
                                <p className='font-light text-gray-500 text-sm'>{track?.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TrackBanner