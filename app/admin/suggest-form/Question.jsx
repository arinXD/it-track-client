"use client"
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdOutlineInventory2 } from "react-icons/md";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Spinner, Chip, Select, SelectItem } from "@nextui-org/react"
import { Checkbox, Empty, message } from 'antd';
import { DeleteIcon, DeleteIcon2, PlusIcon, SearchIcon } from "@/app/components/icons";
import { SELECT_STYLE, thinInputClass } from "@/src/util/ComponentClass";
import { IoCloseOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

const Question = ({ formId, tracks, questions, setQuestions, next, prev, formStyle }) => {
     const questionRefs = useRef([]);
     const [defaultQuestionBank, setDefaultQuestionBank] = useState([]);
     const [filterValue, setFilterValue] = useState("");
     const { isOpen, onOpen, onClose } = useDisclosure();
     const [fetching, setFetching] = useState(false);
     const [questionsBank, setQuestionsBank] = useState([]);
     const [searchTrack, setSearchTrack] = useState("all");
     const [searchValue, setSearchValue] = useState("");

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

     const updateQuestionInventory = useCallback(async (formId) => {
          if (!formId) {
               try {
                    const option = await getOptions(`/api/questions`, "get")
                    const res = await axios(option)
                    const allQuestions = res.data.data
                    setQuestionsBank(allQuestions)
               } catch (error) {
                    setQuestionsBank([])
               }
               return
          }
          try {
               const option = await getOptions(`/api/questions/not-in-form/${formId}`, "get")
               const questionsNotInForm = (await axios(option)).data.data
               setQuestionsBank(questionsNotInForm)
          } catch (error) {
               setQuestionsBank([])
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
          let filterData = [...questionsBank];

          if (searchTrack !== "all") {
               filterData = filterData.filter((q) =>
                    q.track.toLowerCase().includes(searchTrack.toLowerCase())
               );
          }

          if (filterValue) {
               filterData = filterData.filter((q) =>
                    q.question.toLowerCase().includes(filterValue.toLowerCase())
               );
          }

          return filterData;
     }, [filterValue, questionsBank, searchTrack]);

     const createQuestion = useCallback(() => {
          setQuestions((prevQuestions) => {
               const id = prevQuestions.length + 1
               const newId = `newQuestion${id}`

               const newQuestion = {
                    id: newId,
                    question: `คำถามที่ ${id}`,
                    Answers: [{
                         id: `newAnswer${(prevQuestions?.Answers?.length || 0) + 1}`,
                         answer: `ตัวเลือกที่ 1`,
                         isCorrect: true,
                    }],
                    track: "BIT",
                    isEnable: true,
                    desc: null
               }

               const updatedQuestions = [newQuestion, ...prevQuestions]
               questionRefs.current = updatedQuestions.map((_, i) => questionRefs.current[i] || createRef())

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
                              id: `newAnswer${(q?.Answers?.length || 0) + 1}`,
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
               let questionsToAdd = selectedQuestions.map((id) =>
                    prevQuestionsBank.find(q => q.id === id)
               ).filter(Boolean)
               questionsToAdd = questionsToAdd.map(q => ({ ...q, isEnable: true }))

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

     const handleTrackChange = useCallback((questionId, newTrack) => {
          setQuestions(prevQuestions =>
               prevQuestions.map(q =>
                    q.id === questionId ? { ...q, track: newTrack } : q
               )
          );
     }, []);

     const [messageApi, contextHolder] = message.useMessage();
     const deleteQuestion = useCallback(async (qid) => {
          if (confirm("ต้องการลบคำถามหรือไม่ ?")) {
               try {
                    messageApi.open({
                         key: 'updatable',
                         type: 'loading',
                         content: 'กำลังลบคำถาม',
                    });
                    const option = await getOptions(`/api/questions/${qid}`, "delete")
                    const { message: msg } = (await axios(option)).data

                    await updateQuestionInventory(formId)

                    messageApi.open({
                         key: 'updatable',
                         type: 'success',
                         content: msg,
                         duration: 2,
                    });
               } catch (error) {
                    message.warning("ไม่สามารถลบคำถามได้")
               }
          }

     }, [formId])

     const handleSearch = useCallback((value) => {
          setSearchValue(value);
     }, [])

     const trackItems = useMemo(() => ["all", ...tracks.map(t => t.track)], [tracks])
     const [trackFilter, setTrackFilter] = useState('all');

     const filteredQuestions = useMemo(() => {
          return questions.filter((q) => {
               const matchesSearch = q.question.toLowerCase().includes(searchValue.toLowerCase());
               const matchesTrack = trackFilter === 'all' || q.track === trackFilter;
               return matchesSearch && matchesTrack;
          });
     }, [questions, searchValue, trackFilter]);

     const handleTrackFilter = useCallback((value) => {
          setTrackFilter(value);
     }, [])

     return (
          <>
               <section style={formStyle}>
                    {contextHolder}
                    <Modal
                         size={"5xl"}
                         isOpen={isOpen}
                         onClose={onClose}
                    >
                         <ModalContent>
                              {(onClose) => (
                                   <>
                                        <ModalHeader className="flex items-end gap-1">
                                             <div className="w-full flex flex-col gap-1">
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
                                             </div>
                                             <div>
                                                  <p className="text-[10px] mb-0 text-gray-800 h-fit">แทร็ก</p>
                                                  <select
                                                       className="border-1 !text-xs !font-normal border-gray-200 rounded-[8px] p-2"
                                                       style={{
                                                            ...SELECT_STYLE,
                                                            height: "32px",
                                                            backgroundPositionY: "3px",
                                                       }}
                                                       onChange={(e) => setSearchTrack(e.target.value)}
                                                       value={searchTrack}>
                                                       <option value="all">ทั้งหมด</option>
                                                       {tracks?.map((track, tIndex) => (
                                                            <option key={tIndex} value={track.track}>{track.track}</option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </ModalHeader>
                                        <ModalBody className="my-0 border-y p-0">
                                             <section className="!h-[350px] overflow-y-auto grid grid-cols-1">
                                                  {
                                                       filteredItems?.length > 0 ?
                                                            filteredItems.map((q, index) => (
                                                                 <div key={index} className="first-of-type:mt-4 last-of-type:mb-4 my-2">
                                                                      <div className="w-[80%] mx-auto border p-4 rounded-[5px]">
                                                                           <div className="w-full flex justify-between items-center border-b pb-4 mb-4">
                                                                                <p className="w-[80%] whitespace-break-spaces mb-0 text-sm">{q.question}</p>
                                                                                <div className="w-[20%] flex justify-end items-center gap-4">
                                                                                     <Chip
                                                                                          className="!p-1 !text-xs rounded-md"
                                                                                          color={q?.track?.split(" ")[0]?.toLowerCase() === "bit" ? "secondary" : q?.track?.split(" ")[0]?.toLowerCase() === "network" ? "primary" : "success"} variant="flat">
                                                                                          {q?.track?.split(" ")[0]}
                                                                                     </Chip>
                                                                                     <Button
                                                                                          onClick={() => deleteQuestion(q.id)}
                                                                                          isIconOnly size="sm" className="bg-red-100 text-red-500">
                                                                                          <DeleteIcon className={"w-4 h-4"} />
                                                                                     </Button>
                                                                                </div>
                                                                           </div>
                                                                           <Checkbox
                                                                                onChange={(e) => selectQuestion(e, q.id)}
                                                                                key={index}
                                                                                className="w-full ant-qs-ck relative cursor-pointer flex gap-4"
                                                                                name={`questionBank[]`}
                                                                           >
                                                                                <ol className="text-start">
                                                                                     {q?.Answers.map((ans, j) => (
                                                                                          <li
                                                                                               className={`text-start ${ans.isCorrect ? "text-green-700" : ""}`}
                                                                                               key={j}>
                                                                                               <span className="inline-block me-1.5 w-[15px]">{j + 1}. </span>
                                                                                               <span>{ans.answer}</span>
                                                                                          </li>
                                                                                     ))}
                                                                                </ol>
                                                                           </Checkbox>
                                                                      </div>
                                                                 </div>
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
                                   <h2 className="text-black mb-4">คำถามภายในแบบฟอร์ม ({questions?.length} ข้อ)</h2>
                                   <div className="w-full grid grid-cols-8 gap-4">
                                        <Input
                                             type="text"
                                             placeholder="ค้นหาคำถาม"
                                             value={searchValue}
                                             classNames={{
                                                  ...thinInputClass,
                                                  innerWrapper: [
                                                       "bg-white",
                                                  ],
                                             }}
                                             onValueChange={handleSearch}
                                             onClear={() => handleSearch("")}
                                             className="col-span-8 md:col-span-4 !w-full !text-xs"
                                             startContent={<SearchIcon />}
                                        />

                                        <Select
                                             classNames={{
                                                  label: "!text-xs",
                                                  trigger: "border-1 h-10 !text-xs bg-white",
                                             }}
                                             variant="bordered"
                                             placeholder="เลือกแทร็ก"
                                             className="col-span-8 md:col-span-2 w-full"
                                             selectedKeys={[trackFilter]}
                                             onChange={(e) => handleTrackFilter(e.target.value)}
                                        >
                                             {trackItems.map(track => (
                                                  <SelectItem key={track} value={track}>
                                                       {track === 'all' ? 'ทั้งหมด' : track}
                                                  </SelectItem>
                                             ))}
                                        </Select>
                                        <div className="col-span-8 md:col-span-2 grid grid-cols-4 max-md:place-items-center">
                                             <Button
                                                  isIconOnly
                                                  radius="full"
                                                  className={`col-span-1 text-blue-700 bg-white border border-blue-700 hover:bg-gray-200 transition-all`}
                                                  onClick={createQuestion}
                                                  aria-label="create">
                                                  <PlusIcon />
                                             </Button>
                                             <Button
                                                  startContent={<MdOutlineInventory2 />}
                                                  color="default"
                                                  className={`col-span-3 rounded-[5px] text-blue-700 bg-white border border-blue-700 hover:bg-gray-200 transition-all max-md:w-full`}
                                                  onClick={onOpen}
                                             >
                                                  คลังคำถาม
                                             </Button>
                                        </div>
                                   </div>
                                   <div id="questionsWrap">
                                        {
                                             filteredQuestions?.length > 0 ?
                                                  <div className="flex flex-col gap-4 mt-4">
                                                       {
                                                            filteredQuestions.map((q, index) => (
                                                                 <div
                                                                      key={index}
                                                                      ref={questionRefs.current[index]}
                                                                      className="w-full bg-white rounded-lg shadow-md p-4 flex flex-col border">
                                                                      <div className="flex justify-between items-center max-md:gap-2 max-md:flex-col-reverse">
                                                                           <div className="flex items-center justify-between w-full md:w-1/2">
                                                                                <input readOnly type="hidden" name="question_ID[]" value={q.id} />
                                                                                <input
                                                                                     className="text-black p-2 border-b-black border-b bg-blue-50 w-full outline-none focus:border-b-blue-500 focus:border-b-2"
                                                                                     type="text"
                                                                                     name={`qTitle_${q.id}`}
                                                                                     value={q.question}
                                                                                     onChange={(e) => {
                                                                                          setQuestions(prevQuestions =>
                                                                                               prevQuestions.map(question =>
                                                                                                    question.id === q.id ? { ...question, question: e.target.value } : question
                                                                                               )
                                                                                          );
                                                                                     }}
                                                                                />
                                                                           </div>
                                                                           <select
                                                                                className="border-1 border-gray-200 rounded-[5px] p-2 max-md:w-full"
                                                                                name={`trackOf_${q.id}`}
                                                                                style={{
                                                                                     ...SELECT_STYLE
                                                                                }}
                                                                                onChange={(e) => handleTrackChange(q.id, e.target.value)}
                                                                                value={q.track}>
                                                                                {tracks?.map((track, tIndex) => (
                                                                                     <option key={tIndex} value={track.track}>{track.track}</option>
                                                                                ))}
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
                                                                                                         name={`correctAnswers_${q.id}`}
                                                                                                         checked={ans.isCorrect}
                                                                                                         onChange={() => {
                                                                                                              setQuestions(prevQuestions =>
                                                                                                                   prevQuestions.map(question =>
                                                                                                                        question.id === q.id ? {
                                                                                                                             ...question,
                                                                                                                             Answers: question.Answers.map((a, index) => ({
                                                                                                                                  ...a,
                                                                                                                                  isCorrect: index === j
                                                                                                                             }))
                                                                                                                        } : question
                                                                                                                   )
                                                                                                              );
                                                                                                         }}
                                                                                                    />
                                                                                               </div>
                                                                                               <input readOnly type="hidden" name={`answersOfQuestion_${q.id}[]`} value={ans?.id} />
                                                                                               <input
                                                                                                    className="text-black w-full outline-none focus:border-b-blue-500 focus:border-b-2"
                                                                                                    type="text"
                                                                                                    name={`answerOf_${ans?.id}_${q.id}`}
                                                                                                    value={ans.answer}
                                                                                                    onChange={(e) => {
                                                                                                         setQuestions(prevQuestions =>
                                                                                                              prevQuestions.map(question =>
                                                                                                                   question.id === q.id ? {
                                                                                                                        ...question,
                                                                                                                        Answers: question.Answers.map((a, index) =>
                                                                                                                             index === j ? { ...a, answer: e.target.value } : a
                                                                                                                        )
                                                                                                                   } : question
                                                                                                              )
                                                                                                         );
                                                                                                    }}
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
                                                                      <div className="flex justify-between items-end">
                                                                           <div className="flex flex-col w-full">
                                                                                <label className="text-xs">คำอธิบาย (optional)</label>
                                                                                <input
                                                                                     className="text-black text-sm w-full p-2 border-b-black border-b bg-white outline-none focus:border-b-blue-500 focus:border-b-2"
                                                                                     type="text"
                                                                                     placeholder="เพิ่มคำอธิบาย"
                                                                                     name={`qDesc_${q.id}`}
                                                                                     value={q.desc}
                                                                                     onChange={(e) => {
                                                                                          setQuestions(prevQuestions =>
                                                                                               prevQuestions.map(question =>
                                                                                                    question.id === q.id ? { ...question, desc: e.target.value } : question
                                                                                               )
                                                                                          );
                                                                                     }}
                                                                                />
                                                                           </div>
                                                                           <div className="flex justify-end items-center gap-2 w-full">
                                                                                <div
                                                                                     onClick={(e) => {
                                                                                          setQuestions(prevQuestions =>
                                                                                               prevQuestions.map(question =>
                                                                                                    question.id === q.id ? { ...question, isEnable: !question.isEnable } : question
                                                                                               )
                                                                                          );
                                                                                     }}
                                                                                     className="flex items-center gap-2 w-fit cursor-pointer select-none">
                                                                                     <input
                                                                                          checked={q.isEnable}
                                                                                          type="checkbox"
                                                                                          className="w-4 h-4"
                                                                                          name={`qEnable_${q.id}`}
                                                                                          onChange={(e) => {
                                                                                               setQuestions(prevQuestions =>
                                                                                                    prevQuestions.map(question =>
                                                                                                         question.id === q.id ? { ...question, isEnable: e.target.checked } : question
                                                                                                    )
                                                                                               );
                                                                                          }}
                                                                                     />
                                                                                     <span className="text-sm w-fit">ใช้งาน</span>
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
               <div className="my-[24px] flex gap-2 justify-end">
                    <Button
                         type="button"
                         variant="bordered"
                         className="rounded-[5px] border-white text-black border-1 hover:border-blue-500 hover:text-blue-500"
                         onClick={() => prev()}
                    >
                         ย้อนกลับ
                    </Button>
                    <Button
                         type="button"
                         color="primary"
                         className="rounded-[5px]"
                         onClick={() => next()}>
                         ต่อไป
                    </Button>
               </div>
          </>
     )
}

export default Question