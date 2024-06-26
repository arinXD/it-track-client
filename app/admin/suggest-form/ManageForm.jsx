"use client"
import { useMemo, useState } from "react";
import { message, Steps, theme } from 'antd';
import { Button } from "@nextui-org/react";
import SuggestForm from "./SuggestForm";
import Question from "./Question";

const ManageForm = ({ formId }) => {
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
               description: 'เพิ่มแบบประเมิณตนเอง',
          },
          {
               title: 'Finish',
               description: 'เพิ่มอาชีพ',
          },
     ]), [])

     const next = () => {
          setCurrent(current + 1);
     };
     const prev = () => {
          setCurrent(current - 1);
     };

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
     })), [])


     const handleSubmit = async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const formDataObject = {};
          formData.forEach((value, key) => {
               if (formDataObject[key]) {
                    if (!Array.isArray(formDataObject[key])) {
                         formDataObject[key] = [formDataObject[key]];
                    }
                    formDataObject[key].push(value);
               } else {
                    formDataObject[key] = value;
               }
          });

          console.log(formDataObject);
     };

     return (
          <section className="w-full">
               <Steps
                    className="my-8"
                    current={current}
                    onChange={setCurrent}
                    items={items} />
               <form
                    onSubmit={handleSubmit}>
                    <section
                         style={contentStyle}
                         className="w-full">
                         <section className={`w-full p-4 ${current === 0 ? "block" : "hidden"}`}>
                              <SuggestForm
                                   formId={formId}
                              />
                         </section>
                         <section className={`w-full p-4 ${current === 1 ? "block" : "hidden"}`}>
                              <Question
                                   formId={formId}
                              />
                         </section>
                         <section className={`w-full p-4 ${current === 2 ? "block" : "hidden"}`}>
                              เพิ่มแบบสอบถาม
                         </section>
                         <section className={`w-full p-4 ${current === 3 ? "block" : "hidden"}`}>
                              เพิ่มอาชีพ
                         </section>
                    </section>
                    <div className="my-[24px] flex gap-2 justify-end">
                         {current > 0 && (
                              <Button
                                   type="button"
                                   variant="bordered"
                                   className="rounded-[5px] border-blue-500 text-blue-500 border-1 hover:bg-blue-500 hover:text-white"
                                   onClick={() => prev()}
                              >
                                   Previous
                              </Button>
                         )}
                         {current < steps.length - 1 && (
                              <Button
                                   type="button"
                                   color="primary"
                                   className="rounded-[5px]"
                                   onClick={() => next()}>
                                   Next
                              </Button>
                         )}
                         {current === steps.length - 1 && (
                              <Button
                                   type="submit"
                                   color="primary"
                                   className="rounded-[5px]"
                                   onClick={() => message.success('Processing complete!')}>
                                   Done
                              </Button>
                         )}
                    </div>
               </form>
          </section>
     )
}

export default ManageForm