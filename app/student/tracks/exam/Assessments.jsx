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
          <div className="flex flex-col">
               <div className="flex justify-center lg:justify-end">
                    <div className="w-full lg:w-1/2 flex justify-between gap-2 md:px-10 mb-4 mt-4 md:mt-0">
                         <h2 className='text-black w-[25%] md:w-[20%] text-[.85em] text-center font-bold'>มากที่สุด</h2>
                         <h2 className='text-black w-[25%] md:w-[20%] text-[.85em] text-center font-bold'>ปานกลาง</h2>
                         <h2 className='text-black w-[25%] md:w-[20%] text-[.85em] text-center font-bold'>น้อยที่สุด</h2>
                    </div>

               </div>
               {allAssessments?.map((ass, index) => (
                    <div key={ass.id} className='flex flex-col lg:flex-row mx-auto w-full lg:max-w-7xl mb-8'>
                         <div className='w-full lg:w-1/2 flex justify-center lg:justify-start gap-1 lg:items-top'>
                              <span className="text-gray-600 text-normal lg:text-sm text-center lg:text-start">
                                   {ass.question}
                              </span>
                              {ass.desc &&
                                   <Popover
                                        key={`assDesc${index}`}
                                        placement="bottom"
                                        showArrow={true}>
                                        <PopoverTrigger className="h-fit">
                                             <p className="flex justify-center items-center">
                                                  <IoInformationCircle className="w-5 h-5 lg:w-4.5 lg:h-4.5 cursor-pointer" />
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
                         <div className='w-full my-4 lg:my-0 lg:w-1/2 flex justify-center items-start gap-16 text-2xl'>
                              <div className='flex justify-center items-center gap-5 md:gap-10 '>
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
                                                       <span className={`transition w-7 h-7 md:w-10 md:h-10 lg:w-5 lg:h-5 flex items-center justify-center`}>
                                                            <span
                                                                 style={{
                                                                      backgroundColor: isSelected ? buttonColors[number].bgColor : "transparent",
                                                                 }}
                                                                 className={`block rounded-full transition duration-400 w-7 h-7 md:w-10 md:h-10 lg:w-5 lg:h-5`}
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