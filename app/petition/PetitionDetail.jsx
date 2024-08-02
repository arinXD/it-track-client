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
import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";

const PetitionDetail = ({
     id, handleDelete = async () => { }, current,
     isEditable = false, isDeletable = false
}) => {
     const [petition, setPetition] = useState({});
     const [fetching, setFetching] = useState(false);
     const [isEditing, setIsEditing] = useState(false);
     const [isUpdating, setIsUpdating] = useState(false);

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

     const handleInputChange = (e) => {
          const { name, value } = e.target;
          setPetition(prev => ({
               ...prev,
               [name]: value
          }));
     };

     const deletePetition = useCallback(async () => {
          swal.fire({
               text: `ต้องการลบคำร้องหรือไม่ ?`,
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "ตกลง",
               cancelButtonText: "ยกเลิก",
               reverseButtons: true
          }).then(async (result) => {
               if (result.isConfirmed) {
                    await handleDelete()
               }
          });
     }, [])

     const handleEdit = useCallback(async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target);
          const formDataObject = Object.fromEntries(formData.entries());
          console.log(formDataObject);

          if (Object.values(formDataObject).filter(value => !value).length > 0) {
               message.error("กรอกข้อมูลให้ครบทุกช่อง")
               return
          }

          try {
               setIsUpdating(true)
               const id = formDataObject.id
               delete formDataObject.id
               const option = await getOptions(`/api/petitions/${id}`, "put", formDataObject)
               await axios(option)
               message.success("แก้ไขข้อมูลคำร้องสำเร็จ")
          } catch (error) {
               message.error("มีบางอย่างผิดพลาด แก้ไขข้อมูลคำร้องสำเร็จ")
          } finally {
               setIsUpdating(false)
               setIsEditing(false)
          }
     }, [])

     return (
          <section className="border rounded-lg">
               <div className="p-2 bg-white border-b flex items-center rounded-tr-lg rounded-tl-lg">
                    <Link href={`/petition/${current}`}>
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
                    <div className="ms-10 flex gap-1 items-center">
                         {isEditable &&
                              <div
                                   onClick={() => setIsEditing(prev => !prev)}
                                   className="cursor-pointer rounded-full p-2 hover:bg-gray-200">
                                   <RiPencilLine className="w-4 h-4" />
                              </div>
                         }
                         {isDeletable &&
                              <div className="cursor-pointer rounded-full p-2 hover:bg-gray-200">
                                   <RiDeleteBin6Line
                                        onClick={deletePetition}
                                        className="w-4 h-4" />
                              </div>
                         }
                         {isEditing && <p className="text-xs ms-1">โหมด: แก้ไข</p>}

                    </div>
               </div>
               <div className="p-6 flex flex-col">
                    {fetching ?
                         <p className="text-center my-2">Loading...</p>
                         :
                         <form
                              onSubmit={handleEdit}>
                              {/* {JSON.stringify(petition)} */}
                              <div className="flex justify-start items-start gap-6 mb-2">
                                   <div
                                        className="w-10 h-10"
                                   />
                                   {isEditing ?
                                        <input
                                             className="text-2xl border-b pb-1 w-full focus:outline-none"
                                             type="text"
                                             name="title"
                                             value={petition.title}
                                             onChange={handleInputChange} />
                                        :
                                        <h1 className="text-2xl ">{petition?.title}</h1>
                                   }
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
                                             {isEditing ?
                                                  <textarea
                                                       name="detail"
                                                       className="w-full focus:outline-none"
                                                       cols="30"
                                                       rows="5"
                                                       value={petition.detail}
                                                       onChange={handleInputChange}
                                                  ></textarea>
                                                  :
                                                  <p className="py-4">{petition?.detail}</p>
                                             }

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
                                                  {isEditing &&
                                                       <Button
                                                            type="submit"
                                                            isLoading={isUpdating}>
                                                            บันทึก
                                                       </Button>
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