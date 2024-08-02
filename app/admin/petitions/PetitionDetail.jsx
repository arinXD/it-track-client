"use client"
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { simpleDmyhm } from "@/src/util/simpleDateFormatter";
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
     const [fetching, setFetching] = useState(false);
     const [isApproving, setIsApproving] = useState(false);
     const [isRejecting, setIsRejecting] = useState(false);

     useEffect(() => {
          async function getPetitionById(id) {
               setFetching(true)
               try {
                    const option = await getOptions(`/api/petitions/${id}`, "get")
                    const data = (await axios(option)).data?.data
                    setPetition(data)
               } catch (errr) {
                    setPetition({})
               } finally {
                    setFetching(false)
               }
          }
          getPetitionById(id)
     }, [])

     const handleApprove = useCallback(async (pid, email, status) => {
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
                         const option = await getOptions(`/api/petitions/approves/${pid}/${email}/${status}`, "put")
                         await axios(option)
                         window.location.href = "/admin/petitions/" + current
                    } catch (error) {
                         message.error(`มีบางอย่างผิดพลาด ไม่สามารถ${msg}คำร้องได้`)
                    }finally{
                         setIsApproving(false)
                         setIsRejecting(false)
                    }
               }
          });

     }, [current])

     return (
          <section className="border rounded-lg">
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
                                                  {isApprovable &&
                                                       <div className="flex gap-4">
                                                            <Button
                                                                 onClick={() => handleApprove(petition.id, session?.user?.email, 2)}
                                                                 variant="bordered"
                                                                 type="button"
                                                                 className="rounded-[5px] border-1 border-white hover:border-blue-700 hover:text-blue-700"
                                                                 isLoading={isRejecting}>
                                                                 ปฎิเสธ
                                                            </Button>
                                                            <Button
                                                                 onClick={() => handleApprove(petition.id, session?.user?.email, 1)}
                                                                 type="button"
                                                                 className="rounded-[5px] bg-blue-500 text-white"
                                                                 isLoading={isApproving}>
                                                                 อนุมัติ
                                                            </Button>
                                                       </div>
                                                  }
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </form>
                    }
               </div >
          </section >
     )
}

export default PetitionDetail