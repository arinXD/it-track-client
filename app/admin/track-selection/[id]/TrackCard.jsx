"use client"
import React, { useMemo } from 'react'
import Link from "next/link"

const TrackCard = ({ target, color, title, studentArr }) => {
    const card = useMemo(() => {
        return (
            <Link href={target} className="flex flex-row text-center rounded-l-full">
                <div className={`bg-${color}-500 p-4 rounded-l-full grid place-content-center`}>
                    <div className="rounded-full flex relative justify-center items-center">
                        <div className="w-[5.5em] h-[5.5em] bg-white rounded-full flex justify-center items-center">
                            <p className='text-3xl text-black'>{studentArr?.students?.length}</p>
                        </div>
                    </div>
                </div>
                <div className={`w-full py-4 pr-4 ps-2 col-span-2 flex rounded-e-lg bg-${color}-400 text-white`}>
                    <table className='table-auto mx-auto'>
                        <thead>
                            <tr className=''>
                                <th className='text-base'>{title}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className='flex flex-col gap-2 mt-3'>
                                        <div className='flex justify-between items-center'><span>โครงการปกติ </span> <span>{studentArr?.normal} <span className='ms-3'>คน</span></span></div>
                                        <div className='flex justify-between items-center'><span>โครงการพิเศษ</span> <span> {studentArr?.vip} <span className='ms-3'>คน</span></span></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Link>
        )
    }, [target, color, title, studentArr])
    return (
        <>
            {card}
        </>
    )
}

export default TrackCard