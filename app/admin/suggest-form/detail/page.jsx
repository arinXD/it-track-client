"use client"
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import { message, Steps, theme } from 'antd';
import { Button } from "@nextui-org/react";
import SuggestForm from "./SuggestForm";

const Page = () => {
     const formId = useSearchParams().get('id')
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

     

     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <div className='flex flex-col justify-center items-center w-full'>
                         <BreadCrumb />
                         <section className="w-full">
                              <Steps
                                   className="my-8"
                                   current={current}
                                   onChange={setCurrent}
                                   items={items} />
                              <form style={contentStyle}>
                                   <section className="w-full">
                                        <section className={`w-full p-4 ${current === 0 ? "block" : "hidden"}`}>
                                             <SuggestForm
                                                  formId={formId}
                                             />
                                        </section>
                                        <section className={`w-full p-4 ${current === 1 ? "block" : "hidden"}`}>
                                             เพิ่มคำถาม
                                        </section>
                                        <section className={`w-full p-4 ${current === 2 ? "block" : "hidden"}`}>
                                             เพิ่มแบบสอบถาม
                                        </section>
                                        <section className={`w-full p-4 ${current === 3 ? "block" : "hidden"}`}>
                                             เพิ่มอาชีพ
                                        </section>
                                   </section>
                              </form>
                              <div className="my-[24px] flex gap-2 justify-end">
                                   {current > 0 && (
                                        <Button
                                             variant="bordered"
                                             className="rounded-[5px] border-blue-500 text-blue-500 border-1 hover:bg-blue-500 hover:text-white"
                                             onClick={() => prev()}
                                        >
                                             Previous
                                        </Button>
                                   )}
                                   {current < steps.length - 1 && (
                                        <Button
                                             color="primary"
                                             className="rounded-[5px]"
                                             onClick={() => next()}>
                                             Next
                                        </Button>
                                   )}
                                   {current === steps.length - 1 && (
                                        <Button
                                             color="primary"
                                             className="rounded-[5px]"
                                             onClick={() => message.success('Processing complete!')}>
                                             Done
                                        </Button>
                                   )}
                              </div>
                         </section>
                    </div>
               </ContentWrap>
          </>
     )
}

export default Page