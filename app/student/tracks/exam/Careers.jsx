"use client"
import Image from "next/image"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useCallback, useState } from "react";
import { Tooltip } from "antd";
import { MdOutlineQuestionMark } from "react-icons/md";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";

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
               <p className="mt-4 mb-2">อาชีพที่คาดหวัง</p>
               <section className="grid grid-cols-4 gap-4 mb-4" >
                    {
                         allCareers?.map(career => (
                              <div className="relative group">
                                   {career.desc &&
                                        <Popover
                                             placement="right-start"
                                             showArrow={true}>
                                             <PopoverTrigger>
                                                  <button
                                                       style={{
                                                            padding: "5px"
                                                       }}
                                                       className="z-50 group-active:scale-85 group-active:top-2.5 group-active:right-2.5 absolute top-2 right-2 rounded-full bg-black"
                                                       isIconOnly>
                                                       <MdOutlineQuestionMark
                                                            className="w-3 h-3 text-white" />
                                                  </button>
                                             </PopoverTrigger>
                                             <PopoverContent className="rounded-[5px]">
                                                  <div className="px-1 py-2">
                                                       <div className="text-small font-bold mb-1">คำอธิบายอาชีพ</div>
                                                       <div className="text-tiny">{career.desc}</div>
                                                  </div>
                                             </PopoverContent>
                                        </Popover>}
                                   <div
                                        key={career.id}
                                        onClick={() => handleSelectCareer(career.id)}
                                        className={`relative flex flex-col justify-center items-center ${careers.includes(career.id) && "!border-blue-700"} text-center border-2 p-4 rounded-[5px] cursor-pointer hover:border-blue-500/50 focus:scale-95 active:scale-95`}
                                   >
                                        <Image
                                             src={career.image}
                                             width={120}
                                             height={120}
                                             alt={career.name_en}
                                             className="rounded-[2px] h-[100px] w-[120px] object-cover !select-none"
                                        />
                                        <div className="mt-4 w-full">
                                             <Tooltip
                                                  placement="top"
                                                  title={career.name_en} >
                                                  <p title={career.name_en} className="mb-1 w-full whitespace-nowrap overflow-hidden text-ellipsis">{career.name_en}</p>
                                             </Tooltip>
                                             <p>{career.name_th}</p>
                                        </div>
                                   </div>
                              </div>
                         ))
                    }
               </section>
               <div className="w-full flex justify-between">
                    <div
                         onClick={prev}
                         className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <MdKeyboardArrowLeft className="w-5 h-5" />
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Step 2</span>
                              <span className="text-base">แบบประเมิน</span>
                         </div>
                    </div>
                    <div
                         onClick={next}
                         className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Final</span>
                              <span className="text-base">สรุปผล</span>
                         </div>
                         <MdKeyboardArrowRight className="w-5 h-5" />
                    </div>
               </div>
          </section>
     )
}

export default Careers