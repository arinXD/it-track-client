"use client"
import { useToggleSideBarStore } from '@/src/store'
import Image from 'next/image'

const CoverImage = ({ track }) => {
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)
    return (
        <>
            <section className={`mt-16 h-[350px] relative ${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}>
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
                            fontSize: "clamp(8px, 3.5vw, 24px)",
                            margin: "auto"
                        }}
                        className='block leading-[2em]'>
                        {track?.title_en}
                    </span>
                    <span
                        style={{
                            fontSize: "clamp(8px, 3.5vw, 24px)",
                            margin: "auto"
                        }}
                        className='block leading-[2em]'>
                        {track?.title_th}
                    </span>
                    <span
                        style={{
                            fontSize: "clamp(6px, 3vw, 16px)",
                            margin: "auto"
                        }}
                        className='block leading-[2em] text-lg mt-3 text-default-200 font-normal'>
                        {track?.desc}
                    </span>
                </p>
            </section>
        </>
    )
}

export default CoverImage