"use client"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineQuestionMark } from "react-icons/md";
import "./assessment.css"
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import dynamic from "next/dynamic";
const IoInformationCircle = dynamic(() => import('react-icons/io5').then(mod => mod.IoInformationCircle), { ssr: false });

const Assessments = ({ assessments, allAssessments, setAssessments, next, prev }) => {
     const handleAnswerChange = (assId, index) => {
          setAssessments(prevAssessment =>
               prevAssessment.map(assessment =>
                    assessment.assId === assId ? { ...assessment, index } : assessment
               )
          );
     };

     const buttonSizes = [5, 5, 5, 5, 5];
     const buttonColors = [
          { bgColor: '#32A474' },
          { bgColor: '#32A474' },
          { bgColor: '#9B9FAA' },
          { bgColor: '#886199' },
          { bgColor: '#886199' },
     ];

     return (
          <div>
               <div className="flex justify-end">
                    <div className="w-1/2 flex justify-between gap-2 px-10 mb-4">
                         <h2 className='text-black w-[20%] text-[.85em] text-center'>มากที่สุด</h2>
                         <h2 className='text-black w-[20%] text-[.85em] text-center'>ปานกลาง</h2>
                         <h2 className='text-black w-[20%] text-[.85em] text-center'>น้อยที่สุด</h2>
                    </div>

               </div>
               {allAssessments?.map((ass, index) => (
                    <div
                         key={ass.id}
                         className="my-0">
                         <div className='flex mx-auto max-w-7xl mb-8'>
                              <div className='w-1/2 flex justify-start gap-1 items-top'>
                                   <span className="text-gray-600 text-sm text-start">
                                        {ass.question}
                                   </span>
                                   {ass.desc &&
                                        <Popover
                                             key={`assDesc${index}`}
                                             placement="bottom"
                                             showArrow={true}>
                                             <PopoverTrigger className="h-fit">
                                                  <p className="flex justify-center items-center">
                                                       <IoInformationCircle className="w-4.5 h-4.5 cursor-pointer" />
                                                  </p>
                                             </PopoverTrigger>
                                             <PopoverContent className="rounded-[5px]">
                                                  <div className="px-1 py-2">
                                                       <div className="text-small font-bold mb-1">คำอธิบายเพิ่มเติม</div>
                                                       <div className="text-tiny">{ass.desc}</div>
                                                  </div>
                                             </PopoverContent>
                                        </Popover>
                                   }
                              </div>
                              <div className='w-1/2 flex justify-center items-start gap-16 text-2xl'>
                                   <div className='flex justify-center items-center gap-10 '>
                                        {[0, 1, 2, 3, 4].map(number => {
                                             const currentAssessment = assessments.find(assessment => assessment.assId === ass.id);
                                             const isSelected = currentAssessment?.index === number;
                                             return (
                                                  <button
                                                       style={{
                                                            borderColor: buttonColors[number].bgColor
                                                       }}
                                                       key={number}
                                                       type="button"
                                                       className="assessment-item border-2 rounded-full"
                                                       onClick={() => handleAnswerChange(ass.id, number)}
                                                  >
                                                       <label className="flex justify-center items-center cursor-pointer">
                                                            <span className={`transition w-${buttonSizes[number]} h-${buttonSizes[number]} flex items-center justify-center`}>
                                                                 <span
                                                                      style={{
                                                                           backgroundColor: isSelected ? buttonColors[number].bgColor : "transparent",
                                                                      }}
                                                                      className={`block rounded-full transition duration-400 w-${buttonSizes[number]} h-${buttonSizes[number]}`}
                                                                 ></span>
                                                            </span>
                                                       </label>
                                                  </button>
                                             );
                                        })}
                                   </div>
                              </div>
                              {index !== assessments?.length - 1 && <hr className='border-1' />}
                         </div>
                    </div>
               ))}
               <div className="w-full flex justify-between mt-8">
                    <div
                         onClick={prev}
                         className="ps-0 cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <MdKeyboardArrowLeft className="w-5 h-5" />
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Step 1</span>
                              <span className="text-base">คำถาม</span>
                         </div>
                    </div>
                    <div
                         onClick={next}
                         className="pe-0 cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Step 3</span>
                              <span className="text-base">อาชีพ</span>
                         </div>
                         <MdKeyboardArrowRight className="w-5 h-5" />
                    </div>
               </div>
          </div>
     )
}

export default Assessments