import Image from 'next/image'

const CoverImage = ({ track }) => {
    return (
        <>
            <section className='mt-16 md:ml-[240px] h-[300px] relative'>
                <Image
                    width={1000}
                    height={500}
                    src={track?.coverImg || "/bgimg.png"}
                    alt={track?.track}
                    className="w-full h-full object-cover brightness-50" />
                <p
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                    className='w-full font-bold text-white absolute uppercase px-10 text-4xl text-center'
                >
                    <span
                        style={{
                            fontSize: "clamp(16px, 5vw, 24px)",
                            margin: "auto"
                        }}
                        className='block'>
                        {track?.title_en}
                    </span>
                    <span
                        style={{
                            fontSize: "clamp(16px, 5vw, 24px)",
                            margin: "auto"
                        }}
                        className='block'>
                        {track?.title_th}
                    </span>
                    <span
                        style={{
                            fontSize: "clamp(8px, 4vw, 16px)",
                            margin: "auto"
                        }}
                        className='block text-lg mt-3 text-default-200 font-normal'>
                        {track?.desc}
                    </span>
                </p>
            </section>
        </>
    )
}

export default CoverImage