// "use client"
// import { useToggleSideBarStore } from '@/src/store'
// import Image from 'next/image'

// const CoverImage = ({ track }) => {
//     const toggleSideBar = useToggleSideBarStore((state) => state.toggle)
//     return (
//         <>
//             <section className={`mt-16 h-[350px] relative ${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}>
//                 <Image
//                     width={1000}
//                     height={500}
//                     src={track?.coverImg || "/bgimg.png"}
//                     alt={track?.track}
//                     className="w-full h-full object-cover brightness-50" />
//                 <p
//                     style={{
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)"
//                     }}
//                     className='w-full font-bold text-white absolute uppercase px-10 text-4xl text-center'
//                 >
//                     <span
//                         style={{
//                             fontSize: "clamp(8px, 3.5vw, 24px)",
//                             margin: "auto"
//                         }}
//                         className='block leading-[2em]'>
//                         {track?.title_en}
//                     </span>
//                     <span
//                         style={{
//                             fontSize: "clamp(8px, 3.5vw, 24px)",
//                             margin: "auto"
//                         }}
//                         className='block leading-[2em]'>
//                         {track?.title_th}
//                     </span>
//                     <span
//                         style={{
//                             fontSize: "clamp(6px, 3vw, 16px)",
//                             margin: "auto"
//                         }}
//                         className='block leading-[2em] text-lg mt-3 text-default-200 font-normal'>
//                         {track?.desc}
//                     </span>
//                 </p>
//             </section>
//         </>
//     )
// }

// export default CoverImage
"use client"
import { useToggleSideBarStore } from '@/src/store'
import Image from 'next/image'

const CoverImage = ({ track }) => {
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)

    return (
        <section className={`relative h-64 mt-16 transition-all duration-300 ${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}>
            <Image
                fill
                src={track?.coverImg || "/bgimg.png"}
                alt={track?.track}
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white px-4">
                    <h1 className="text-2xl font-bold mb-2">
                        {track?.title_en}<br />{track?.title_th}
                    </h1>
                    <p className="text-sm max-w-xl">{track?.desc}</p>
                </div>
            </div>
        </section>
    )
}

export default CoverImage