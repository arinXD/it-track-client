"use client"
import { Radio, Space } from "antd"
import { MdKeyboardArrowRight, MdOutlineQuestionMark } from "react-icons/md";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

const Questions = ({ setQuestions, allQuestions, next }) => {
     const handleAnswerChange = (questionId, answerId) => {
          setQuestions(prevQuestions =>
               prevQuestions.map(question =>
                    question.qId === questionId ? { ...question, aId: answerId } : question
               )
          );
     };
     return (
          <section>
               <section>
                    {allQuestions?.map((q, index) => (
                         <div
                              key={q.id}
                              className="mb-6">
                              <div className="flex gap-2 items-center mb-1">
                                   <p className="font-bold">{index + 1}. </p>
                                   <p>{q.question}</p>
                                   {q.desc &&
                                        <Popover
                                             key={`qDesc${index}`}
                                             placement="right-start"
                                             showArrow={true}>
                                             <PopoverTrigger>
                                                  <p className="text-xs underline cursor-pointer">คำอธิบายเพิ่มเติม</p>
                                             </PopoverTrigger>
                                             <PopoverContent className="rounded-[5px]">
                                                  <div className="px-1 py-2">
                                                       <div className="text-small font-bold mb-1">คำอธิบายเพิ่มเติม</div>
                                                       <div className="text-tiny">{q.desc}</div>
                                                  </div>
                                             </PopoverContent>
                                        </Popover>
                                   }
                              </div>
                              <Radio.Group
                                   onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              >
                                   <Space direction="vertical">
                                        {q?.Answers.map((ans) => (
                                             <Radio key={ans.id} value={ans.id}>
                                                  {ans.answer}
                                             </Radio>
                                        ))}
                                   </Space>
                              </Radio.Group>
                         </div>
                    ))}
               </section>
               <div
                    className="w-full flex justify-end">
                    <div
                         onClick={next}
                         className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Step 2</span>
                              <span className="text-base">แบบประเมิน</span>
                         </div>
                         <MdKeyboardArrowRight className="w-5 h-5" />
                    </div>
               </div>
          </section>
     )
}

export default Questions