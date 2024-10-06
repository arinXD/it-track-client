"use client"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { CloseCircleOutlined } from '@ant-design/icons';
import { Result, Spin, Typography } from 'antd';
import { Button } from "@nextui-org/react";
import { BiCheckCircle } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { GoCheckCircle } from "react-icons/go";
import { useMemo } from "react";
const Summarize = ({ prev, setCurrent, summarize, summarizing }) => {
     const { Paragraph, Text } = Typography;

     const isSummarize = useMemo(() => (Object.values(summarize).every(value => value)), [summarize])

     return (
          <section>
               <Result
                    className="test-result p-2 md:p-4"
                    status={isSummarize ? "success" : "warning"}
                    title={isSummarize ? "ยืนยันเพื่อสรุปผล" : "ไม่สามารถสรุปผลได้"}
                    subTitle="โปรดตรวจสอบว่าตอบคำถาม แบบสอบถาม และความชอบครบถ้วนก่อนสรุปผล"
                    extra={
                         isSummarize &&
                         [
                              <Button
                                   key={"summarizingButton"}
                                   type="submit"
                                   className="rounded-[5px]"
                                   color="primary"
                                   isDisabled={summarizing}
                              >
                                   ยืนยัน
                              </Button>,
                         ]}
               >
                    <Spin
                         className="p-0"
                         spinning={summarizing}>
                         <Paragraph>
                              <Text
                                   strong
                                   style={{
                                        fontSize: 16,
                                   }}
                              >
                                   {summarize.questions &&
                                        summarize.assessments &&
                                        summarize.careers ?
                                        "เนื้อหาที่คุณครบถ้วน"
                                        :
                                        "เนื้อหาที่คุณส่งมาไม่มีข้อมูลต่อไปนี้"
                                   }
                              </Text>
                         </Paragraph>
                         <Paragraph className="flex flex-col md:flex-row lg:justify-start lg:items-center gap-2.5">
                              <div className="flex items-center gap-2">
                                   {summarize.questions ?
                                        <GoCheckCircle className="w-[15px] h-[15px] text-green-600 inline-block" />
                                        :
                                        <CloseCircleOutlined className="text-red-500" />
                                   }
                                   <span>Step 1) ตอบคำถาม{!summarize.questions && "ไม่"}ครบ </span>
                              </div>
                              {!summarize.questions && <a onClick={() => setCurrent(0)}>ตอบคำถาม</a>}
                         </Paragraph>
                         <Paragraph className="flex flex-col md:flex-row lg:justify-start lg:items-center gap-2.5">
                              <div className="flex items-center gap-2">
                                   <div>
                                        {summarize.assessments ?
                                             <GoCheckCircle className="w-[15px] h-[15px] text-green-600 inline-block" />
                                             :
                                             <CloseCircleOutlined className="text-red-500" />
                                        }
                                   </div>
                                   <span>Step 2) ตอบแบบประเมินความชอบ{!summarize.assessments && "ไม่"}ครบ</span>
                              </div>
                              {!summarize.assessments && <a onClick={() => setCurrent(1)}>ตอบแบบประเมิน</a>}
                         </Paragraph>
                         <Paragraph className="flex flex-col md:flex-row lg:justify-start lg:items-center gap-2.5">
                              <div className="flex items-center gap-2">
                                   {summarize.careers ?
                                        <GoCheckCircle className="w-[15px] h-[15px] text-green-600 inline-block" />
                                        :
                                        <CloseCircleOutlined className="text-red-500" />
                                   }
                                   <span>Step 3) {!summarize.careers && "ไม่"}เลือกอาชีพที่ชอบ</span>
                              </div>
                              {!summarize.careers && <a onClick={() => setCurrent(2)}>เลือกอาชีพ</a>}
                         </Paragraph>
                    </Spin>
               </Result>
               <div className="w-full flex justify-between">
                    <div
                         onClick={prev}
                         className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <MdKeyboardArrowLeft className="w-5 h-5" />
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Step 3</span>
                              <span className="text-base">ความชอบ</span>
                         </div>
                    </div>
               </div>
          </section>
     )
}

export default Summarize