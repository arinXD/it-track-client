"use client"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import "./assessment.css"
import { useRef } from "react";

const Assessments = ({ assessments, allAssessments, setAssessments, next, prev }) => {
     const assessmentRefs = useRef([]);

     const handleAnswerChange = (assId, index) => {
          setAssessments(prevAssessment =>
               prevAssessment.map(assessment =>
                    assessment.assId === assId ? { ...assessment, index } : assessment
               )
          );
          const currentIndex = allAssessments.findIndex(ass => ass.id === assId);
          scrollToNextAssessment(currentIndex);
     };

     const scrollToNextAssessment = (currentIndex) => {
          const nextIndex = currentIndex + 1;
          if (nextIndex < allAssessments.length) {
               assessmentRefs.current[nextIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
               });
          }
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
                         ref={el => assessmentRefs.current[index] = el}
                         key={ass.id}
                         className="my-12">
                         <div className='mx-auto max-w-7xl my-12'>
                              <p className='text-center text-4xl text-gray-600'>{ass.question}</p>
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