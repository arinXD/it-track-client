"use client"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineQuestionMark } from "react-icons/md";
import "./assessment.css"
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

const Assessments = ({ assessments, allAssessments, setAssessments, next, prev }) => {
     const handleAnswerChange = (assId, index) => {
          setAssessments(prevAssessment =>
               prevAssessment.map(assessment =>
                    assessment.assId === assId ? { ...assessment, index } : assessment
               )
          );
     };

     const buttonSizes = [14, 12, 10, 12, 14];
     const buttonColors = [
          { bgColor: '#32A474' },
          { bgColor: '#32A474' },
          { bgColor: '#9B9FAA' },
          { bgColor: '#886199' },
          { bgColor: '#886199' },
     ];

     return (
          <div>
               {allAssessments?.map((ass, index) => (
                    <div
                         key={ass.id}
                         className="my-12">
                         <div className='mx-auto max-w-7xl my-12'>
                              <p className='flex justify-center gap-4 items-center'>
                                   <span className="text-gray-600 text-4xl text-center">{ass.question}</span>
                                   {ass.desc &&
                                        <Popover
                                             key={`assDesc${index}`}
                                             placement="right-start"
                                             showArrow={true}>
                                             <PopoverTrigger>
                                                  <button
                                                       style={{
                                                            padding: "4px"
                                                       }}
                                                       className="w-6 h-6 active:scale-95 rounded-full bg-black flex justify-center items-center"
                                                       isIconOnly>
                                                       <MdOutlineQuestionMark
                                                            className="w-3 h-3 text-white" />
                                                  </button>
                                             </PopoverTrigger>
                                             <PopoverContent className="rounded-[5px]">
                                                  <div className="px-1 py-2">
                                                       <div className="text-small font-bold mb-1">คำอธิบายเพิ่มเติม</div>
                                                       <div className="text-tiny">{ass.desc}</div>
                                                  </div>
                                             </PopoverContent>
                                        </Popover>
                                   }
                              </p>
                              <div className='flex justify-center items-center gap-16 text-2xl'>
                                   <h2 className='text-[#32A474] w-[20%] text-[.85em] text-center'>ฉันเห็นด้วย</h2>
                                   <div className='flex justify-center items-center gap-16 my-20 w-[50%]'>
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
                                   <h2 className='text-[#886199] w-[20%] text-[.85em] text-center'>ฉันไม่เห็นด้วย</h2>
                              </div>
                              {index !== assessments?.length - 1 && <hr className='border-1' />}
                         </div>
                    </div>
               ))}
               <div className="w-full flex justify-between">
                    <div
                         onClick={prev}
                         className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <MdKeyboardArrowLeft className="w-5 h-5" />
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Step 1</span>
                              <span className="text-base">แบบทดสอบ</span>
                         </div>
                    </div>
                    <div
                         onClick={next}
                         className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Step 3</span>
                              <span className="text-base">ความชอบ</span>
                         </div>
                         <MdKeyboardArrowRight className="w-5 h-5" />
                    </div>
               </div>
          </div>
     )
}

export default Assessments