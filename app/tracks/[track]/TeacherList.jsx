"use client"
import { Empty } from "antd"
import Image from "next/image"
import { useEffect, useMemo } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const TeacherList = ({ teachers }) => {
    const duration = useMemo(() => 500, [])
    useEffect(() => {
        AOS.init();
    }, []);
    return (
        <section className="mt-16 md:mt-10">
            <h2 className="text-center font-bold text-3xl text-[#1C75BC] mb-3">คณาจารย์ประจำแทร็ก</h2>
            <div className="flex justify-center items-center">
                <hr className='w-12 my-3 border-1 border-[#cbcbcb]'></hr>
            </div>
            {
                teachers.length == 0 ?
                    <div className='py-8 flex items-center justify-center'>
                        <Empty description={"ไม่มีอาจารย์ประจำแทร็ก"} />
                    </div>
                    :
                    <>
                        <div className="flex flex-wrap justify-center items-center gap-10 w-full my-4 max-2xl:px-0">
                            {teachers.length > 0 && teachers?.map((teacher, index) => (
                                <div
                                    data-aos="fade-up"
                                    data-aos-duration={duration + (index * 200)}
                                    key={index}>
                                    <Image
                                        width={800}
                                        height={800}
                                        src={teacher?.TeacherTrack?.image || ""}
                                        alt={teacher?.name}
                                        className="rounded-md w-[200px] h-[200px]"
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src = "/image/error_image.png";
                                        }}
                                    />
                                    <p className="text-center">{teacher.prefix}{teacher?.name || "N/A"} {teacher?.surname}</p>
                                </div>
                            ))}
                        </div>
                    </>
            }
        </section>
    )
}

export default TeacherList