"use client"

import { Checkbox, message } from "antd"
import Petitionbar from "./Petitionbar"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button, Spinner } from "@nextui-org/react"
import { simpleDM } from "@/src/util/simpleDateFormatter"
import Link from "next/link"
import { getOptions } from "../components/serverAction/TokenAction"
import axios from "axios"
import { swal } from "@/src/util/sweetyAlert"
import { RiArrowGoBackLine, RiDeleteBin6Line } from "react-icons/ri";

const PetitionList = ({
     cb = async () => { }, current, fetching, title, data, handleDelete,
     emptyContent, isRetrievable = false
}) => {
     const [petitions, setPetitions] = useState(data);
     const [checkList, setCheckList] = useState([]);
     const [pending, setPending] = useState(false);

     useEffect(() => {
          setPetitions(data)
     }, [data])

     useEffect(() => {
          const newCheckList = petitions.map(pet => ({ id: pet.id, checked: false }));
          setCheckList(newCheckList);
     }, [petitions]);

     const handleSingleCheck = useCallback((id) => {
          setCheckList(prevList =>
               prevList.map(item =>
                    item.id === id ? { ...item, checked: !item.checked } : item
               )
          );
     }, [])

     const handleSelectAll = useCallback((e) => {
          const isChecked = e.target.checked;
          setCheckList(prevList =>
               prevList.map(item => ({ ...item, checked: isChecked }))
          );
     }, [])

     const isAllChecked = useMemo(() => (checkList.every(item => item.checked) && checkList.length), [checkList])
     const someChecked = useMemo(() => (checkList.some(item => item.checked)), [checkList])

     const handleDeleteSelected = useCallback(async () => {
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
                    setPending(true)
                    const selectedIds = checkList.filter(item => item.checked).map(item => item.id);
                    await handleDelete(selectedIds);
                    setCheckList([])
                    setPending(false)
               }
          });
     }, [checkList, handleDelete]);

     const handleRetrived = useCallback(async () => {
          const selectedIds = checkList.filter(item => item.checked).map(item => item.id);
          try {
               setPending(true)
               const option = await getOptions("/api/petitions/retrieves/multiple", "put", selectedIds)
               await axios(option)
               message.success("กู้คืนคำร้องสำเร็จ")
               await cb()
          } catch (error) {
               console.log(error);
               message.error("ลบคำร้องผิดพลาด")
          } finally {
               setPending(false)
          }
          setCheckList([])
     }, [checkList])

     return (
          <section className="w-full">
               <h1 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h1>
               <div className="grid grid-cols-6">
                    <Petitionbar className="col-span-1" />
                    <div className="col-span-5 bg-white rounded-lg shadow-sm border rounded-tl-none rounded-bl-none">
                         <div className="flex items-center justify-between p-4 border-b">
                              <div className="flex items-center">
                                   <Checkbox
                                        checked={isAllChecked}
                                        onChange={handleSelectAll}
                                        className="text-blue-600"
                                   />
                                   <span className="ml-3 text-sm text-gray-600">เลือกทั้งหมด</span>
                              </div>
                              <div className="flex gap-3">
                                   {isRetrievable && (
                                        <Button
                                             isIconOnly
                                             className="rounded-full border-0 border-gray-100 bg-gray-300"
                                             variant="bordered"
                                             size="sm"
                                             onClick={handleRetrived}
                                             isDisabled={!someChecked || pending}>
                                             <RiArrowGoBackLine />
                                        </Button>
                                   )}
                                   <Button
                                        isIconOnly
                                        className="rounded-full border-0 border-gray-100 bg-gray-300"
                                        variant="bordered"
                                        size="sm"
                                        onClick={handleDeleteSelected}
                                        isDisabled={!someChecked || pending}>
                                        <RiDeleteBin6Line className="w-4 h-4" />
                                   </Button>
                              </div>
                         </div>
                         {pending || fetching ? (
                              <div className="flex justify-center items-center h-64">
                                   <Spinner />
                              </div>
                         ) : (
                              <ul className="divide-y divide-gray-200">
                                   {petitions?.length === 0 ? (
                                        <li className="text-center py-8 text-gray-500">{emptyContent}</li>
                                   ) : (
                                        petitions.map((petition, key) => (
                                             <li key={key} className="hover:bg-gray-50 transition-colors ">
                                                  <div className="flex items-center px-4 py-4">
                                                       <Checkbox
                                                            checked={checkList.find(item => item.id === petition.id)?.checked || false}
                                                            onChange={() => handleSingleCheck(petition.id)}
                                                            className="text-blue-600 mr-4"
                                                       />
                                                       <Link
                                                            className="w-full grid grid-cols-8 gap-4 items-center"
                                                            href={`/petition/${current}/${petition.id}`}>
                                                            <span className="w-full col-span-2 font-medium text-gray-900 truncate">
                                                                 {petition.title}
                                                            </span>
                                                            <span className="w-full col-span-4 text-gray-500 truncate overflow-hidden">
                                                                 {petition.detail}
                                                            </span>
                                                            <span className="w-full col-span-1 justify-start flex text-gray-500 truncate text-center">
                                                                 <div className="flex items-center gap-1">
                                                                      <div className={`rounded-full w-2 h-2 ${petition?.status == 0 ? "bg-yellow-600" : petition?.status == 1 ? "bg-green-600" : "bg-red-600"}`}></div>
                                                                      <p className="text-xs">
                                                                           {petition?.status == 0 ? "รอการยืนยัน" : petition?.status == 1 ? "อนุมัติ" : "ปฏิเสธ"}
                                                                      </p>
                                                                 </div>
                                                            </span>
                                                            <span className="w-full col-span-1 text-right text-sm text-gray-400">
                                                                 {simpleDM(petition.createdAt)}
                                                            </span>
                                                       </Link>
                                                  </div>
                                             </li>
                                        ))
                                   )}
                              </ul>
                         )}
                    </div>
               </div>
          </section>
     );
};

export default PetitionList