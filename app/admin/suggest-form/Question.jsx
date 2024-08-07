"use client"
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdOutlineInventory2 } from "react-icons/md";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Spinner } from "@nextui-org/react"
import { Checkbox, Empty } from 'antd';
import { PlusIcon, SearchIcon } from "@/app/components/icons";
import { thinInputClass } from "@/src/util/ComponentClass";
import { IoCloseOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

const Question = ({ formId }) => {
     const questionRefs = useRef([]);
     const [defaultQuestionBank, setDefaultQuestionBank] = useState([]);
     const [filterValue, setFilterValue] = useState("");
     const { isOpen, onOpen, onClose } = useDisclosure();
     const [fetching, setFetching] = useState(false);
     const [questions, setQuestions] = useState([]);
     const [questionsBank, setQuestionsBank] = useState([]);

     const getQuestions = useCallback(async (formId) => {
          if (!formId) {
               try {
                    setFetching(true)
                    const option = await getOptions(`/api/questions`, "get")
                    const res = await axios(option)
                    const allQuestions = res.data.data
                    setQuestionsBank(allQuestions)
                    setDefaultQuestionBank(allQuestions)
               } catch (error) {
                    setQuestionsBank([])
                    setDefaultQuestionBank([])
               } finally {
                    setFetching(false)
               }
               return
          }
          try {
               setFetching(true)
               const option1 = await getOptions(`/api/questions/in-form/${formId}`, "get")
               const option2 = await getOptions(`/api/questions/not-in-form/${formId}`, "get")
               const option3 = await getOptions(`/api/questions`, "get")
               const [res1, res2, res3] = await Promise.all([axios(option1), axios(option2), axios(option3)]);
               const questionsInForm = res1.data.data
               const questionsNotInForm = res2.data.data
               const allQuestions = res3.data.data
               setQuestions(questionsInForm)
               setQuestionsBank(questionsNotInForm)
               setDefaultQuestionBank(allQuestions)
          } catch (error) {
               setQuestions([])
               setQuestionsBank([])
               setDefaultQuestionBank([])
          } finally {
               setFetching(false)
          }
     }, [])


     useEffect(() => {
          getQuestions(formId)
     }, [formId])

     const onSearchChange = useCallback((value) => {
          if (value) {
               setFilterValue(value)
          } else {
               setFilterValue("")
          }
     }, [])

     const filteredItems = useMemo(() => {
          let filterData = [...questionsBank]

          if (filterValue) {
               filterData = filterData.filter((q) =>
                    q.question.toLowerCase().includes(filterValue.toLowerCase())
               )
          }
          return filterData
     }, [filterValue, questionsBank])

     const createQuestion = useCallback(() => {
          setQuestions((prevQuestions) => {
               const id = prevQuestions.length + 1
               const newId = `new${id}`

               const newQuestion = {
                    id: newId,
                    question: `คำถามที่ ${id}`,
                    Answers: [{
                         id: null,
                         answer: `ตัวเลือกที่ 1`,
                         isCorrect: false,
                    }]
               }

               const updatedQuestions = [...prevQuestions, newQuestion]
               questionRefs.current = updatedQuestions.map((_, i) => questionRefs.current[i] || createRef())

               setTimeout(() => {
                    questionRefs.current[updatedQuestions.length - 1].current.scrollIntoView({ behavior: 'smooth' })
               }, 100)

               return updatedQuestions
          })
     }, [])

     const removeQuestion = useCallback((questionIndex, qid) => {
          setQuestions((prevQuestions) => {
               questionRefs.current = prevQuestions
                    .filter((_, index) => index !== questionIndex)
                    .map((_, i) => questionRefs.current[i])

               return prevQuestions.filter((_, index) => index !== questionIndex)
          })
          const filterQID = defaultQuestionBank.filter(q => q.id === qid)
          console.log(qid);
          if (filterQID.length > 0) {
               setQuestionsBank(prev => {
                    return [
                         ...prev,
                         ...filterQID
                    ]
               })
          }
     }, [defaultQuestionBank])

     const addMoreAnswer = useCallback((qid) => {
          setQuestions((prevQuestions) => {
               return prevQuestions.map((q) => {
                    if (q.id === qid) {
                         const newAnswer = {
                              id: null,
                              answer: `ตัวเลือกที่ ${(q.Answers.length || 0) + 1}`,
                              isCorrect: false,
                         }

                         return {
                              ...q,
                              Answers: [...q.Answers, newAnswer]
                         }
                    }
                    return q
               })
          })
     }, [])

     const removeAnswer = useCallback((questionId, answerIndex) => {
          setQuestions((prevQuestions) => {
               return prevQuestions.map((q) => {
                    if (q.id === questionId) {
                         const newAnswers = q.Answers.filter((_, index) => index !== answerIndex)
                         return {
                              ...q,
                              Answers: newAnswers
                         }
                    }
                    return q
               })
          })
     }, [])

     const [selectedQuestions, setSelectedQuestions] = useState([])

     const selectQuestion = useCallback((e, id) => {
          const isChecked = e.target.checked
          setSelectedQuestions((prev) => {
               if (isChecked) {
                    if (!prev.includes(id)) {
                         return [...prev, id]
                    }
               } else {
                    return prev.filter((qId) => qId !== id)
               }
               return prev
          })
     }, [])

     const addToQuestion = useCallback(() => {
          setQuestionsBank((prevQuestionsBank) => {
               const questionsToAdd = selectedQuestions.map((id) =>
                    prevQuestionsBank.find(q => q.id === id)
               ).filter(Boolean)

               if (questionsToAdd.length > 0) {
                    setQuestions((prevQuestions) => [...prevQuestions, ...questionsToAdd])

                    const remainingQuestionsBank = prevQuestionsBank.filter(q => !selectedQuestions.includes(q.id))
                    setSelectedQuestions([])

                    return remainingQuestionsBank
               }
               return prevQuestionsBank
          })
          onClose()
     }, [selectedQuestions])

     const closeForm = useCallback(() => {
          setSelectedQuestions([])
          onClose()
     }, [])

     return (
          <section>
               <Modal
                    size={"5xl"}
                    isOpen={isOpen}
                    onClose={onClose}
               >
                    <ModalContent>
                         {(onClose) => (
                              <>
                                   <ModalHeader className="flex flex-col gap-1 border-b-1">
                                        <p className="mb-1">คลังคำถาม</p>
                                        <Input
                                             isClearable
                                             className="w-full h-fit rounded-[5px]"
                                             placeholder="ค้นหาคำถาม"
                                             size="sm"
                                             classNames={thinInputClass}
                                             startContent={<SearchIcon />}
                                             value={filterValue}
                                             onValueChange={onSearchChange}
                                        />
                                   </ModalHeader>
                                   <ModalBody className="py-4">
                                        <section className="!h-[350px] overflow-y-auto flex flex-col gap-2">
                                             {
                                                  filteredItems?.length > 0 ?
                                                       filteredItems.map((q, index) => (
                                                            <Checkbox
                                                                 onChange={(e) => selectQuestion(e, q.id)}
                                                                 key={index}
                                                                 className="w-full cursor-pointer flex gap-2 border p-4 rounded-[5px]"
                                                                 name={`questionBank[]`}
                                                            >
                                                                 <div className="w-full flex flex-col gap-2">
                                                                      <p>
                                                                           {q.question}
                                                                      </p>
                                                                      <ol className="ms-4 text-start">
                                                                           {q?.Answers.map((ans, j) => (
                                                                                <li
                                                                                     className={`text-start ${ans.isCorrect ? "text-green-700" : ""}`}
                                                                                     key={j}>
                                                                                     <span className="inline-block me-1.5 w-[15px]">{j + 1}. </span>
                                                                                     <span>{ans.answer}</span>
                                                                                </li>
                                                                           ))}
                                                                      </ol>
                                                                 </div>
                                                            </Checkbox>
                                                       ))
                                                       :
                                                       <Empty
                                                            className='mt-8'
                                                            description={
                                                                 <span className='text-gray-300'>ไม่มีข้อมูล</span>
                                                            }
                                                       />
                                             }

                                        </section>
                                   </ModalBody>
                                   <ModalFooter>
                                        <Button
                                             color="default"
                                             variant="light"
                                             className="rounded-[5px]"
                                             onPress={closeForm}>
                                             ยกเลิก
                                        </Button>
                                        <Button
                                             onClick={addToQuestion}
                                             color="primary"
                                             className="rounded-[5px]">
                                             เพิ่ม
                                        </Button>
                                   </ModalFooter>
                              </>
                         )}
                    </ModalContent>
               </Modal>
               {
                    fetching ?
                         <div className='w-full flex justify-center my-6'>
                              <Spinner label="กำลังโหลด..." color="primary" />
                         </div>
                         :
                         <>
                              <div className="flex justify-between">
                                   <h2>คำถามภายในแบบฟอร์ม</h2>
                                   <div className="flex justify-end gap-4">
                                        <Button
                                             isIconOnly
                                             radius="full"
                                             color="default"
                                             onClick={createQuestion}
                                             aria-label="create">
                                             <PlusIcon />
                                        </Button>
                                        <Button
                                             startContent={<MdOutlineInventory2 />}
                                             className="rounded-[5px]"
                                             onClick={onOpen}
                                        >
                                             คลังคำถาม
                                        </Button>
                                   </div>
                              </div>
                              <div id="questionsWrap">
                                   {
                                        questions?.length > 0 ?
                                             <div className="flex flex-col gap-4 mt-4">
                                                  {
                                                       questions.map((q, index) => (
                                                            <div
                                                                 key={index}
                                                                 ref={questionRefs.current[index]}
                                                                 className="w-full bg-white border-1 p-4 flex flex-col rounded-[5px]">
                                                                 <div className="flex justify-between items-center">
                                                                      <div className="flex items-center justify-between w-1/2">
                                                                           <input readOnly type="hidden" name="qID[]" defaultValue={q.id} />
                                                                           <input
                                                                                className="text-black p-2 border-b-black border-b bg-gray-100 w-full outline-none focus:border-b-blue-500 focus:border-b-2"
                                                                                type="text"
                                                                                name="qTitle[]"
                                                                                defaultValue={q.question} />
                                                                      </div>
                                                                      <select
                                                                           className="border-1 border-gray-200 rounded-[5px] p-2"
                                                                           name=""
                                                                           id="" defaultValue={q.track}>
                                                                           <option value="">Selected Track</option>
                                                                           <option value="BIT">BIT</option>
                                                                           <option value="Web and Mobile">Web and Mobile</option>
                                                                           <option value="Network">Network</option>
                                                                      </select>
                                                                 </div>
                                                                 <ul className="mt-4 flex flex-col gap-4" id={`q${q.id}`}>
                                                                      {
                                                                           q?.Answers?.map((ans, j) => (
                                                                                <li
                                                                                     key={j}
                                                                                     className="flex flex-row justify-between gap-4">
                                                                                     <div className="flex gap-4 w-full items-center">
                                                                                          <div>
                                                                                               <input
                                                                                                    className="w-6 h-6 cursor-pointer"
                                                                                                    type="radio"
                                                                                                    name={`answersQ${q.id}`}
                                                                                                    defaultChecked={ans.isCorrect} />
                                                                                          </div>
                                                                                          <input readOnly type="hidden" name="aID[]" defaultValue={ans?.id} />
                                                                                          <input
                                                                                               className="text-black w-full outline-none focus:border-b-blue-500 focus:border-b-2"
                                                                                               type="text"
                                                                                               name="answers[]"
                                                                                               defaultValue={ans.answer}
                                                                                          />
                                                                                     </div>
                                                                                     <Button
                                                                                          isIconOnly
                                                                                          variant="light"
                                                                                          radius="full"
                                                                                          color="default"
                                                                                          onClick={() => removeAnswer(q.id, j)}
                                                                                          aria-label="remove">
                                                                                          <IoCloseOutline className="w-7 h-7" />
                                                                                     </Button>
                                                                                </li>
                                                                           ))
                                                                      }
                                                                 </ul>
                                                                 <div className="flex gap-4 mt-4">
                                                                      <div className="rounded-full border-2 w-7 h-7 border-gray-300"></div>
                                                                      <p
                                                                           onClick={() => addMoreAnswer(q.id)}
                                                                           className="hover:cursor-text hover:border-b border-b-gray-300">เพิ่มตัวเลือก</p>
                                                                 </div>
                                                                 <hr className="mt-8 mb-4" />
                                                                 <div className="flex justify-end items-center gap-2">
                                                                      <div className="flex gap-2">
                                                                           <input
                                                                                defaultChecked={true}
                                                                                type="checkbox"
                                                                                className="w-4 h-4"
                                                                                name={`enableQ${q.id}`}
                                                                           />
                                                                           <span className="text-sm">ใช้งาน</span>
                                                                      </div>
                                                                      <Button
                                                                           isIconOnly
                                                                           variant="light"
                                                                           radius="full"
                                                                           color="default"
                                                                           className="p-2"
                                                                           onClick={() => removeQuestion(index, q.id)}
                                                                           aria-label="remove">
                                                                           <FaRegTrashAlt className="w-5 h-5" />
                                                                      </Button>
                                                                 </div>
                                                            </div>
                                                       ))
                                                  }
                                             </div>
                                             :
                                             <Empty
                                                  className='my-6'
                                                  description={
                                                       <span className='text-gray-300'>ไม่มีข้อมูล</span>
                                                  }
                                             />
                                   }
                              </div>
                         </>
               }

          </section >
     )
}

export default Question