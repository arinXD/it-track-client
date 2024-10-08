"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Steps, message, theme } from 'antd';
import { Spinner } from "@nextui-org/react";
import SuggestForm from "./SuggestForm";
import Question from "./Question";
import Assesstion from "./Assesstion";
import CareerForm from "./CareerForm";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { IoIosCloseCircle } from "react-icons/io";

const ManageForm = ({ formId }) => {
     const [createTrigger, setCreateTrigger] = useState(false);
     const [creating, setCreating] = useState(false);
     const [fetching, setFetching] = useState(false);
     const [fetchingFormData, setfetchingFormData] = useState(false);

     const [suggestForm, setSuggestForm] = useState({
          title: "แบบทดสอบกลุ่มความเชี่ยวชาญ",
          desc: "ค้นพบความเชี่ยวชาญหลักสูตรไอทีล่าสุด! ยกระดับทักษะของคุณด้วยความเชี่ยวชาญที่ล้ำสมัย นำทางไปสู่อนาคตของความสำเร็จทางเทคโนโลยี"
     });
     const [questions, setQuestions] = useState([]);
     const [assesstion, setAssesstion] = useState([]);
     const [careers, setCareers] = useState([]);

     const [tracks, setTracks] = useState([]);
     const { token } = theme.useToken()
     const [current, setCurrent] = useState(0)
     const steps = useMemo(() => ([
          {
               title: 'Step 1',
               description: 'ข้อมูลแบบฟอร์ม',
          },
          {
               title: 'Step 2',
               description: 'เพิ่มคำถามในแบบฟอร์ม',
          },
          {
               title: 'Step 3',
               description: 'เพิ่มความชอบ',
          },
          {
               title: 'Finish',
               description: 'เพิ่มอาชีพ',
          },
     ]), [])

     const getForm = useCallback(async (formId) => {
          if (!formId) {
               setfetchingFormData(false)
               return
          }
          const option = await getOptions(`/api/suggestion-forms/get-form/${formId}`, "get")
          try {
               setfetchingFormData(true)
               const res = await axios(option)
               setSuggestForm({
                    title: res?.data?.data?.title,
                    desc: res?.data?.data?.desc,
               })
          } catch (error) {
               setSuggestForm({})
          } finally {
               setfetchingFormData(false)
          }
     }, [])

     useEffect(() => {
          getForm(formId)
     }, [formId])

     const getTracks = useCallback(async () => {
          const option = await getOptions(`/api/tracks/all`, "get")
          try {
               setFetching(true)
               const res = await axios(option)
               setTracks(res.data.data)
          } catch (error) {
               setTracks([])
          } finally {
               setFetching(false)
          }
     }, [])

     useEffect(() => {
          getTracks()
     }, [])

     const next = useCallback(() => {
          setCurrent(prev => prev + 1);
     }, [])
     const prev = useCallback(() => {
          setCurrent(prev => prev - 1);
     }, [])

     const items = useMemo(() => steps.map((item) => ({
          key: item.title,
          title: item.title,
          description: item.description,
     })), [])

     const contentStyle = useMemo(() => (({
          color: token.colorTextTertiary,
          backgroundColor: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
          border: `1px dashed ${token.colorBorder}`,
          marginTop: 16,
          padding: "1rem"
     })), [])

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!createTrigger) return
          if (!Object.values(suggestForm).every(value => value)) { message.warning("จำเป็นต้องเพิ่มข้อมูลแบบฟอร์ม"); setCurrent(0); return; }
          if (!questions.length) { message.warning("จำเป็นต้องเพิ่มคำถาม"); setCurrent(1); return; }
          if (!assesstion.length) { message.warning("จำเป็นต้องเพิ่มความชอบ"); setCurrent(2); return; }
          if (!careers.length) { message.warning("จำเป็นต้องเพิ่มอาชีพ"); setCurrent(3); return; }
          const formData = {
               id: formId,
               ...suggestForm,
               Questions: questions,
               Assesstions: assesstion,
               Careers: careers
          }

          const option = await getOptions("/api/suggestion-forms/", "POST", formData)
          try {
               setCreating(true)
               await axios(option)
               const msg = formId ? "แก้ไขแบบฟอร์มสำเร็จ" : "สร้างแบบฟอร์มสำเร็จ"
               message.success(msg)
               setTimeout(() => {
                    window.location.href = "/admin/suggest-form"
               }, 1500);
          } catch (error) {
               console.log(error);
               const errMessage = error?.response?.data?.message
               const inequalityInfo = error?.response?.data?.inequalityInfo
               if (inequalityInfo?.items?.length > 0) {
                    // message.error("resr")
                    toast.custom(() => (
                         <div>
                              <div className='border p-4 rounded-md bg-white shadow-md text-black text-sm'>
                                   <p className="flex justify-start items-center gap-1.5">
                                        <IoIosCloseCircle className="text-red-500 w-4 h-4" />
                                        <span>ไม่สามารถสร้างแบบฟอร์มได้ {errMessage}</span>
                                   </p>
                                   <ul className="ms-[36px] list-disc mt-2">
                                        {inequalityInfo?.items?.map((info, index) => (
                                             <li key={index}>แทร็ก {info.track} ต้องการ {info.difference} {inequalityInfo.type}</li>
                                        ))}
                                   </ul>
                              </div>
                         </div>
                    ));
               }
               setCreating(false)
          } finally {
               setCreateTrigger(false)
          }

     };

     return (
          <section className="w-full">
               <Toaster />
               <Steps
                    className="my-8"
                    current={current}
                    onChange={setCurrent}
                    items={items} />
               <form
                    onSubmit={handleSubmit}>
                    <section className="w-full">
                         {
                              fetching ?
                                   <div className='w-full flex justify-center my-6'>
                                        <Spinner label="กำลังโหลด..." color="primary" />
                                   </div>
                                   :
                                   <>
                                        <section className={`w-full ${current === 0 ? "block" : "hidden"}`}>
                                             {
                                                  formId && <input type="hidden" name="id" defaultValue={formId} readOnly />
                                             }
                                             <SuggestForm
                                                  next={next}
                                                  fetching={fetchingFormData}
                                                  suggestForm={suggestForm}
                                                  setSuggestForm={setSuggestForm}
                                                  formStyle={contentStyle}
                                                  formId={formId} />
                                        </section>
                                        <section className={`w-full ${current === 1 ? "block" : "hidden"}`}>
                                             <Question
                                                  prev={prev}
                                                  next={next}
                                                  formStyle={contentStyle}
                                                  questions={questions}
                                                  setQuestions={setQuestions}
                                                  tracks={tracks}
                                                  formId={formId} />
                                        </section>
                                        <section className={`w-full ${current === 2 ? "block" : "hidden"}`}>
                                             <Assesstion
                                                  prev={prev}
                                                  next={next}
                                                  formStyle={contentStyle}
                                                  tracks={tracks}
                                                  assesstion={assesstion}
                                                  setAssesstion={setAssesstion}
                                                  formId={formId} />
                                        </section>
                                        <section className={`w-full ${current === 3 ? "block" : "hidden"}`}>
                                             <CareerForm
                                                  setCreateTrigger={setCreateTrigger}
                                                  creating={creating}
                                                  setCareers={setCareers}
                                                  prev={prev}
                                                  formStyle={contentStyle}
                                                  tracks={tracks}
                                                  formId={formId} />
                                        </section>
                                   </>
                         }
                    </section>
               </form>
          </section>
     )
}

export default ManageForm