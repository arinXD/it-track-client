"use client"
import Image from "next/image"
import { Checkbox, Link, User, Chip, cn } from "@nextui-org/react";
import { useCallback, useState } from "react";

const Careers = ({ next, prev, careers, setCareers, allCareers, }) => {
     const handleSelectCareer = useCallback((careerId) => {
          setCareers(prev => {
               if (prev.includes(careerId)) {
                    return prev.filter(cid => cid !== careerId)
               } else {
                    return [...prev, careerId]
               }
          })
     }, [])
     return (
          <section className="flex flex-col flex-wrap gap-4">
               {JSON.stringify(careers)}
               <p>อาชีพที่คาดหวัง</p>
               <section className="flex flex-row flex-wrap gap-4" >
                    {
                         allCareers?.map(career => (
                              <div
                                   key={career.id}
                                   onClick={() => handleSelectCareer(career.id)}
                                   className={`${careers.includes(career.id) && "!border-blue-700"} text-center border-2 p-4 rounded-[5px] cursor-pointer hover:border-blue-500/50 active:scale-95 focus:scale-95`}
                              >
                                   <Image
                                        src={career.image}
                                        width={120}
                                        height={120}
                                        alt={career.name_en}
                                        className="rounded-[2px]"
                                   />
                                   <div className="mt-4">
                                        <p className="mb-1">{career.name_en}</p>
                                        <p>{career.name_th}</p>
                                   </div>
                              </div>
                         ))
                    }
               </section>
          </section>
     )
}

export default Careers