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
                    status={isSummarize ? "success" : "warning"}
                    title={isSummarize ? "ยืนยันเพื่อสรุปผล" : "ไม่สามารถสรุปผลได้"}
                    subTitle="โปรดตรวจสอบว่าตอบคำถาม แบบสอบถาม และความชอบครบถ้วนก่อนสรุปผล"
                    extra={
                         isSummarize &&
                         [
                              <Button
                                   type="submit"
                                   className="rounded-[5px]"
                                   color="primary"
                                   isDisabled={summarizing}
                              >
                                   ยืนยัน
                              </Button>,
                         ]}
               >
                    <Spin spinning={summarizing}>
                         <Paragraph>
                              <Text
                                   strong
                                   style={{
                                        fontSize: 16,
                                   }}
                              >
                                   The content you submitted has the following missing:
                              </Text>
                         </Paragraph>
                         <Paragraph className="flex justify-start items-center gap-2.5">
                              {
                                   summarize.questions ?
                                        <GoCheckCircle className="w-[15px] h-[15px] text-green-600 inline-block" />
                                        :
                                        <CloseCircleOutlined className="text-red-500" />
                              }
                              <span>Step 1) Answer all of questions. </span>
                              {!summarize.questions && <a onClick={() => setCurrent(0)}>Go to questions.</a>}
                         </Paragraph>
                         <Paragraph className="flex justify-start items-center gap-2.5">
                              {
                                   summarize.assessments ?
                                        <GoCheckCircle className="w-[15px] h-[15px] text-green-600 inline-block" />
                                        :
                                        <CloseCircleOutlined className="text-red-500" />
                              }
                              <span>Step 2) Answer all of assessments.</span>
                              {!summarize.assessments && <a onClick={() => setCurrent(1)}>Go to assessments.</a>}
                         </Paragraph>
                         <Paragraph className="flex justify-start items-center gap-2.5">
                              {
                                   summarize.careers ?
                                        <GoCheckCircle className="w-[15px] h-[15px] text-green-600 inline-block" />
                                        :
                                        <CloseCircleOutlined className="text-red-500" />
                              }
                              <span>Step 3) Answer careers.</span>
                              {!summarize.careers && <a onClick={() => setCurrent(2)}>Go to careers.</a>}
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
                    <div

                         className="cursor-pointer flex flex-row items-center gap-4 opacity-60 hover:opacity-100 transition-all rounded-none p-4"
                    >
                         <div className="flex flex-col">
                              <span className="text-sm text-default-400">Final</span>
                              <span className="text-base">สรุปผล</span>
                         </div>
                         <MdKeyboardArrowRight className="w-5 h-5" />
                    </div>
               </div>
          </section>
     )
}

export default Summarize