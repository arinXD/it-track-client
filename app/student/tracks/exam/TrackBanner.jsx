"use client"

const TrackBanner = ({ tracks, form }) => {
    return (
        <div className={`bg-[#33A474] mt-16 px-8 pb-8 bg-imgs`}>
            <div className=' mx-auto max-w-2xl text-center py-12 lg:py-20'>
                <h1 className='text-4xl font-bold tracking-tight text-white sm:text-5xl'>{form?.title}</h1>
                <h2 className='mt-6 text-2xl leading-8 tracking-tighter text-white dark:text-gray-300'>{form?.desc}</h2>
            </div>
            <div className='px-4 pb-4 mx-auto max-w-screen-xl lg:px-6'>
                <div className='space-y-8 grid lg:grid-cols-3  sm:gap-6 xl:gap-10 lg:space-y-0'>
                    {tracks?.map((track, index) => (
                        <div key={index} className='flex flex-col p-6 mx-auto max-w-lg text-gray-900 bg-white rounded-lg border border-gray-100 shadow xl:p-8 text-center'>
                            <img src={`/image/${track.track.toLowerCase()}.png`} alt="" className='p-4 mb-2 md:mb-4 max-h-60 w-full object-contain rounded-lg' width={512} height={512} />
                            <h3 className='mt-4 mb-4 text-2xl font-semibold'>{track?.track.toLowerCase() !== "network" ? track?.title_en : "Systems, Network, Security and IoTs"}</h3>
                            <p className='font-light text-gray-500'>{track?.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrackBanner