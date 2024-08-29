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
     const [oldTrack, setOldTrack] = useState("");
     const [title, setTitle] = useState("");
     const [tracks, setTracks] = useState([]);
     const [sending, setSending] = useState(false);

     const getOldTrack = useCallback(async () => {
          const option = await getOptions(`/api/selections/stu-id/${session?.user?.stu_id}`, 'get')
          try {
               const { result } = (await axios(option)).data.data
               setOldTrack(result)
          } catch (error) {
               setOldTrack("")
          }
     }, [session?.user?.stu_id])

     useEffect(() => {
          if (session?.user?.email != undefined && !oldTrack) {
               getOldTrack()
          }
     }, [session?.user?.email, getOldTrack, oldTrack])

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

                    {!oldTrack && (
                         <p className="text-sm text-red-500">จำเป็นต้องคัดเลือกแทร็กก่อนยื่นคำร้อง</p>
                    )}

                    <div className="flex gap-4">
                         <Button
                              className="rounded-[5px] bg-blue-600 hover:bg-blue-700 text-white"
                              type="submit"
                              size="md"
                              isLoading={sending}
                              isDisabled={!oldTrack}
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
// "use client"

// import { getOptions } from "@/app/components/serverAction/TokenAction";
// import { Button, Link } from "@nextui-org/react";
// import { message } from "antd";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { useCallback, useEffect, useState } from "react";

// const Page = () => {
//      const { data: session } = useSession();
//      const [oldTrack, setOldTrack] = useState("");
//      const [title, setTitle] = useState("");
//      const [tracks, setTracks] = useState([]);
//      const [sending, setSending] = useState(false);

//      const getOldTrack = useCallback(async () => {
//           const option = await getOptions(`/api/selections/${session?.user?.stu_id}`, 'get')
//           try {
//                const { result } = (await axios(option)).data.data
//                setOldTrack(result)
//           } catch (error) {
//                setOldTrack("")
//           }

//      }, [session?.user?.stu_id])

//      useEffect(() => {
//           if (session?.user?.email != undefined && !oldTrack) {
//                getOldTrack()
//           }
//      }, [session?.user?.email])

//      useEffect(() => {
//           async function getTracks() {
//                const option = await getOptions(`/api/tracks/all`, 'get')
//                try {
//                     const data = (await axios(option)).data.data
//                     setTracks(data.map(track => track.track))
//                } catch (error) {
//                     setTracks([])
//                }
//           }
//           getTracks()
//      }, [])

//      const handleSubmit = useCallback(async (e) => {
//           e.preventDefault()
//           const formData = new FormData(e.target);
//           const formDataObject = Object.fromEntries(formData.entries());

//           if (Object.values(formDataObject).filter(value => !value).length > 0) {
//                message.error("กรอกข้อมูลให้ครบทุกช่อง")
//                return
//           }
//           const option = await getOptions("/api/petitions/", "post", formDataObject)
//           try {
//                setSending(true)
//                await axios(option)
//                message.success("ส่งคำร้องย้ายแทร็กสำเร็จ")
//                setTimeout(() => {
//                     window.location.href = '/petition/request'
//                }, 1500);
//           } catch (error) {
//                message.error("มีบางอย่างผิดพลาด ส่งคำร้องย้ายแทร็กไม่สำเร็จ")
//                setSending(false)
//           }
//      }, [])


//      return (
//           <section>
//                <h1 className="bg-gray-100 p-2 border mb-4 rounded-[5px]">เขียนคำร้องย้ายแทร็ก</h1>
//                <form
//                     onSubmit={handleSubmit}
//                     className="border rounded-[5px] p-4">
//                     {/* sender */}
//                     <input readOnly type="hidden" name="senderEmail" value={session?.user?.email} />

//                     <div className="flex gap-2">
//                          {/* title */}
//                          <input
//                               name="title"
//                               className="mb-2 w-full block border-b pb-1 focus:outline-none"
//                               type="text"
//                               placeholder="หัวเรื่อง"
//                               value={title}
//                               onInput={(e) => setTitle(e.target.value)} />
//                     </div>

//                     {/* detail */}
//                     <textarea
//                          name="detail"
//                          className="w-full focus:outline-none"
//                          cols="30"
//                          rows="5"></textarea>
//                     <hr className="mb-2" />

//                     {/* oldTrack */}
//                     <div className="flex gap-2 mb-2">
//                          <label className="">แทร็กเดิม</label>
//                          <input
//                               name="oldTrack"
//                               type="text"
//                               className="focus:outline-none"
//                               readOnly
//                               value={oldTrack || "ยังไม่ได้คัดเลือกแทร็ก"}
//                          />
//                     </div>

//                     {/* newTrack */}
//                     <div className="flex gap-2 mb-4 items-center">
//                          <label className="">แทร็กที่ต้องการย้าย</label>
//                          <select
//                               className="border rounded-[5px] px-1"
//                               name="newTrack"
//                               defaultValue={tracks[0]}
//                          >
//                               {tracks.map(track => (
//                                    <option key={track}
//                                         disabled={track?.toLowerCase() == oldTrack?.toLowerCase()}
//                                         value={track}>{track}</option>
//                               ))}
//                          </select>
//                     </div>
//                     {!oldTrack &&
//                          <p className="my-4 text-xs"><span className="text-red-500"> จำเป็นต้องคัดเลือกแทร็กก่อนยื่นคำร้อง</span></p>
//                     }
//                     <hr className="mb-4" />
//                     <div className="flex gap-4">
//                          <Button
//                               className="rounded-[5px]"
//                               color="primary"
//                               type="submit"
//                               size="sm"
//                               isLoading={sending}
//                               isDisabled={!oldTrack}
//                          >
//                               ส่ง
//                          </Button>
//                          <Link href="/petition/request">
//                               <Button
//                                    className="rounded-[5px] border-1 border-white hover:border-blue-500 hover:text-blue-500"
//                                    variant="bordered"
//                                    type="button"
//                                    size="sm"
//                               >
//                                    ยกเลิก
//                               </Button>
//                          </Link>
//                     </div>

//                </form>
//           </section>
//      )
// }

// export default Page