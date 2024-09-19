"use client"
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { simpleDMYHM, simpleDmyhm } from "@/src/util/simpleDateFormatter";
import { Button } from "@nextui-org/react"
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { message } from "antd";
import { swal } from "@/src/util/sweetyAlert";
import { useSession } from "next-auth/react";

const PetitionDetail = ({ id, current, isApprovable = false }) => {
     const { data: session } = useSession();
     const [petition, setPetition] = useState({});
     const [fetching, setFetching] = useState(true);
     const [isApproving, setIsApproving] = useState(false);
     const [isRejecting, setIsRejecting] = useState(false);
     const [responseText, setResponseText] = useState("");
     const [isApprovableState, setIsApprovableState] = useState(isApprovable);

     useEffect(() => {
          async function getPetitionById(id) {
               setFetching(true)
               try {
                    const option = await getOptions(`/api/petitions/${id}`, "get")
                    const data = (await axios(option)).data?.data
                    setIsApprovableState(data?.status == 0)
                    setPetition(data)
               } catch (errr) {
                    setPetition({})
               } finally {
                    setFetching(false)
               }
          }
          getPetitionById(id)
     }, [])

     const handleApprove = useCallback(async (pid, email, status, text) => {
          let responseText = text ? text : null
          let msg
          if (status == 1) {
               msg = "อนุมัติ"
          } else {
               msg = "ปฏิเสธ"
          }
          swal.fire({
               text: `ต้อง${msg}คำร้องหรือไม่ ?`,
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "ตกลง",
               cancelButtonText: "ยกเลิก",
               reverseButtons: true
          }).then(async (result) => {
               if (result.isConfirmed) {
                    try {
                         if (status == 1) {
                              setIsApproving(true)
                         } else {
                              setIsRejecting(true)
                         }
                         const option = await getOptions(`/api/petitions/approves/${pid}/${email}/${status}`, "put", { responseText })
                         await axios(option)
                         window.location.href = "/admin/petitions/" + current
                    } catch (error) {
                         message.error(`มีบางอย่างผิดพลาด ไม่สามารถ${msg}คำร้องได้`)
                    } finally {
                         setIsApproving(false)
                         setIsRejecting(false)
                    }
               }
          });

     }, [current])

     return (
          <section className="grid grid-cols-8 gap-6">
               <section className="border rounded-lg col-span-5 shadow">
                    <div className="p-2 bg-white border-b flex items-center rounded-tr-lg rounded-tl-lg">
                         <Link href={`/admin/petitions/${current}`}>
                              <Button
                                   isIconOnly
                                   className="rounded-full border-0 border-gray-100 hover:bg-gray-200"
                                   variant="bordered"
                                   type="button"
                                   size="sm"
                              >
                                   <IoArrowBack className="w-4 h-4" />
                              </Button>
                         </Link>
                    </div>
                    <div className="p-6 flex flex-col">
                         {fetching ?
                              <p className="text-center my-2">Loading...</p>
                              :
                              <form>
                                   <div className="flex justify-start items-start gap-6 mb-2">
                                        <div
                                             className="w-10 h-10"
                                        />
                                        <h1 className="text-2xl ">{petition?.title}</h1>
                                   </div>

                                   <div className="flex justify-start items-start gap-6">
                                        <Image
                                             className="w-10 h-10 rounded-full"
                                             src={petition?.Sender?.image}
                                             width={200}
                                             height={200}
                                             onError={({ currentTarget }) => {
                                                  currentTarget.onerror = null;
                                                  currentTarget.src = "/image/error_image.png";
                                             }}
                                        />
                                        <div
                                             className="w-full">
                                             <div className="flex justify-between items-center">
                                                  <input type="hidden" name="id" readOnly value={petition?.id} />
                                                  <h1 className="flex gap-2 items-center">
                                                       <span className="font-bold">{petition?.Sender?.Student?.first_name} {petition?.Sender?.Student?.last_name}</span>
                                                       <span className="text-sm text-default-400">{`<${petition?.Sender?.email}>`}</span>
                                                  </h1>
                                                  <div>
                                                       <div className="flex items-center gap-1">
                                                            <div className={`rounded-full w-3 h-3 ${petition?.status == 0 ? "bg-yellow-600" : petition?.status == 1 ? "bg-green-600" : "bg-red-600"}`}></div>
                                                            <p className="text-xs">
                                                                 {petition?.status == 0 ? "รอการยืนยัน" : petition?.status == 1 ? "อนุมัติ" : "ปฏิเสธ"}
                                                            </p>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="space-y-4">
                                                  <p className="text-sm text-default-800">{petition?.createdAt && simpleDmyhm(petition?.createdAt)}</p>
                                                  <p className="py-4">{petition?.detail}</p>

                                                  <hr />
                                                  <div className="flex justify-between">
                                                       <div className="flex items-center gap-6">
                                                            <div>
                                                                 <p className="text-xs text-gray-500">แทร็กเดิม</p>
                                                                 <p>{petition?.oldTrack}</p>
                                                            </div>
                                                            <IoArrowForward className="w-4 h-4" />
                                                            <div>
                                                                 <p className="text-xs text-gray-500">แทร็กที่ต้องการย้าย</p>
                                                                 <p>{petition?.newTrack}</p>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </form>
                         }
                    </div>
               </section>
               {/* parent */}
               <section className="col-span-3 border rounded-lg shadow flex flex-col">
                    <div className="flex p-2 border-b items-center h-[55px]">
                         <h1 className="mx-4">{isApprovableState ? "การอนุมัติ" : "สถานะการอนุมัติ"}</h1>
                    </div>
                    {/* child */}
                    <div className="px-6 py-4 flex flex-col justify-between h-full">
                         {!isApprovableState &&
                              <div className="flex flex-col gap-4 w-full h-full">
                                   <div>
                                        <h3 className="font-medium">ผู้อนุมัติ</h3>
                                        <p>{petition?.Approver?.Teacher?.prefix} {petition?.Approver?.Teacher?.teacherName}</p>
                                   </div>
                                   <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                             <span className="text-gray-500">ลงนามโดย</span>
                                             <span>{petition?.Approver?.Teacher?.teacherName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                             <span className="text-gray-500">เวลา</span>
                                             <span>{simpleDMYHM(petition?.actionTime)}</span>
                                        </div>
                                   </div>
                                   {petition?.responseText && (
                                        <div className="flex flex-col h-full">
                                             <h3 className="font-medium mb-2">ความคิดเห็น</h3>
                                             <p className="p-3 bg-gray-100 rounded-md text-sm h-full">{petition?.responseText}</p>
                                        </div>
                                   )}
                              </div>
                         }
                         {isApprovableState &&
                              <>
                                   <div className="h-full flex flex-col mb-4">
                                        <p className="mb-1">ความคิดเห็น</p>
                                        <textarea
                                             className="border rounded-md w-full text-sm p-2 h-full font-normal"
                                             value={responseText}
                                             onInput={e => setResponseText(e.target.value)}
                                        ></textarea>
                                   </div>
                                   <div className="flex justify-between gap-4 mt-auto">
                                        <Button
                                             onClick={() => handleApprove(petition.id, session?.user?.email, 2, responseText)}
                                             variant="bordered"
                                             type="button"
                                             className="w-full rounded-[5px] border-1 border-blue-700 text-blue-700 hover:bg-gray-100"
                                             isLoading={isRejecting}>
                                             ปฎิเสธ
                                        </Button>
                                        <Button
                                             onClick={() => handleApprove(petition.id, session?.user?.email, 1, responseText)}
                                             type="button"
                                             className="w-full rounded-[5px] bg-blue-500 text-white"
                                             isLoading={isApproving}>
                                             อนุมัติ
                                        </Button>
                                   </div>
                              </>

                         }
                    </div>
               </section>
          </section>
     )
}

export default PetitionDetail