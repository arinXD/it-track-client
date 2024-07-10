"use client"
import { Radio, Space } from "antd"
import { useRef } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

const Questions = ({ questions, setQuestions, allQuestions, next }) => {
     const questionsRef = useRef([])
     const handleAnswerChange = (questionId, answerId) => {
          setQuestions(prevQuestions =>
               prevQuestions.map(question =>
                    question.qId === questionId ? { ...question, aId: answerId } : question
               )
          );
          const currentIndex = allQuestions.findIndex(q => q.id === questionId);
          scrollToNextQuestions(currentIndex);
     };
     const scrollToNextQuestions = (currentIndex) => {
          const nextIndex = currentIndex + 1;
          if (nextIndex < allQuestions.length) {
               questionsRef.current[nextIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
               });
          }
     };
     return (
          <section>
               {JSON.stringify(questions)}
               {allQuestions?.map((q, index) => (
                    <div
                         ref={r => questionsRef.current[index] = r}
                         key={q.id}
                         className="mb-6">
                         <p className="mb-2">
                              <span className="font-bold">{index + 1}. </span>
                              <span>{q.question}</span>
                         </p>
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