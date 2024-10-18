"use client"

import { getOptions } from "@/app/components/serverAction/TokenAction";
import { Button } from "@nextui-org/react";
import { message } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

const Page = () => {
     const { data: session } = useSession();
     const [fetching, setFetching] = useState(true);
     const [oldTrack, setOldTrack] = useState("");
     const [title, setTitle] = useState("");
     const [tracks, setTracks] = useState([]);
     const [sending, setSending] = useState(false);
     const [hasSend, setHasSend] = useState(true);
     const [isError, setIsError] = useState(false);

     const getOldTrack = async (stdId) => {
          const option = await getOptions(`/api/selections/stu-id/${stdId}`, 'get')
          try {
               const { result } = (await axios(option)).data.data
               setOldTrack(result)
          } catch (error) {
               setOldTrack("")
          }
     }

     const hasSendPetition = async (email) => {
          try {
               const option = await getOptions(`/api/petitions/users/${email}/has-send`, "get")
               const { hasSend } = (await axios(option)).data.data
               setHasSend(hasSend)
          } catch {
               setIsError(true)
          }
     }

     const init = useCallback(async (stdId) => {
          setFetching(true)
          await getOldTrack(stdId)
          setFetching(false)
     }, [])

     useEffect(() => {
          const stuId = session?.user?.stu_id
          if (stuId != undefined && !oldTrack) {
               console.log(stuId);
               init(stuId)
          }
     }, [session?.user?.stu_id, oldTrack])

     useEffect(() => {
          const email = session?.user?.email
          if (email != undefined) {
               hasSendPetition(email)
          }
     }, [session?.user?.email])

     useEffect(() => {
          async function getTracks() {
               const option = await getOptions(`/api/tracks/all`, 'get')
               try {
                    const data = (await axios(option)).data.data
                    setTracks(data.map(track => track.track))
               } catch (error) {
                    setTracks([])
               }
          }
          getTracks()
     }, [])

     const handleSubmit = useCallback(async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target);
          const formDataObject = Object.fromEntries(formData.entries());

          if (Object.values(formDataObject).filter(value => !value).length > 0) {
               message.error("กรอกข้อมูลให้ครบทุกช่อง")
               return
          }
          const option = await getOptions("/api/petitions/", "post", formDataObject)
          try {
               setSending(true)
               await axios(option)
               message.success("ส่งคำร้องย้ายแทร็กสำเร็จ")
               setTimeout(() => {
                    window.location.href = '/petition/request'
               }, 1500);
          } catch (error) {
               message.error("มีบางอย่างผิดพลาด ส่งคำร้องย้ายแทร็กไม่สำเร็จ")
               setSending(false)
          }
     }, [])

     return (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
               <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Link href="/petition/request" className="mr-2">
                         <IoArrowBack className="text-gray-600 hover:text-gray-800" />
                    </Link>
                    เขียนคำร้องย้ายแทร็ก
               </h1>
               <form onSubmit={handleSubmit} className="space-y-6">
                    <input readOnly type="hidden" name="senderEmail" value={session?.user?.email} />

                    <div className="space-y-2">
                         <label htmlFor="title" className="block text-sm font-medium text-gray-700">หัวเรื่อง</label>
                         <input
                              id="title"
                              name="title"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              type="text"
                              placeholder="กรอกหัวเรื่อง"
                              value={title}
                              onInput={(e) => setTitle(e.target.value)}
                         />
                    </div>

                    <div className="space-y-2">
                         <label htmlFor="detail" className="block text-sm font-medium text-gray-700">เหตุผล</label>
                         <textarea
                              id="detail"
                              name="detail"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              rows="5"
                              placeholder="กรอกรายละเอียด"
                         ></textarea>
                    </div>

                    <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700">แทร็กเดิม</label>
                         <input
                              name="oldTrack"
                              type="text"
                              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                              readOnly
                              value={oldTrack || "ยังไม่ได้คัดเลือกแทร็ก"}
                         />
                    </div>

                    <div className="space-y-2">
                         <label htmlFor="newTrack" className="block text-sm font-medium text-gray-700">แทร็กที่ต้องการย้าย</label>
                         <select
                              id="newTrack"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              name="newTrack"
                              defaultValue={tracks[0]}
                         >
                              {tracks.map(track => (
                                   <option key={track}
                                        disabled={track?.toLowerCase() == oldTrack?.toLowerCase()}
                                        value={track}>{track}</option>
                              ))}
                         </select>
                    </div>

                    {fetching ? <p className="text-sm text-gray-400">กำลังโหลด...</p>
                         : !oldTrack ? <p className="text-sm text-red-500 italic">จำเป็นต้องคัดเลือกแทร็กก่อนยื่นคำร้อง</p>
                              : hasSend ? <p className="text-sm text-gray-400 italic">คุณสามารถยื่นคำร้องได้เพียงแค่รอบเดียว</p>
                                   : isError ? <p className="text-sm text-red-500 italic">ไม่สามารถยื่นคำร้องได้ในขณะนี้ โปรดลองใหม่ภายหลัง</p>
                                        : undefined
                    }

                    <div className="flex gap-4">
                         <Button
                              className="rounded-[5px] bg-blue-600 hover:bg-blue-700 text-white"
                              type="submit"
                              size="md"
                              isLoading={sending}
                              isDisabled={!oldTrack || hasSend || isError || fetching}
                         >
                              ส่งคำร้อง
                         </Button>
                         <Link href="/petition/request">
                              <Button
                                   className="text-default-500 rounded-[5px] border-1 border-white hover:border-blue-500 hover:text-blue-500"
                                   variant="bordered"
                                   size="md"
                              >
                                   ยกเลิก
                              </Button>
                         </Link>
                    </div>
               </form>
          </div>
     )
}

export default Page