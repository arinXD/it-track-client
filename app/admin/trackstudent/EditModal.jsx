"use client"
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const INIT_FORM_DATA = {
     stu_id: "",
     track_order_1: null,
     track_order_2: null,
     track_order_3: null,
     result: null,
}
const SELECT_STYLE = {
     WebkitAppearance: 'none',
     MozAppearance: 'none',
     background: 'white',
     backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
     backgroundRepeat: 'no-repeat',
     backgroundPositionX: '99%',
     backgroundPositionY: '8px',
     border: '1px solid #dfdfdf',
     paddingRight: '1.7rem'
}

const EditModal = ({ cb, tracks, id, isOpen, onClose }) => {
     const [formData, setFormData] = useState(INIT_FORM_DATA);
     const [fetching, setFetching] = useState(false);
     const [updating, setUpdating] = useState(false);

     const getSelectionData = useCallback(async (id) => {
          setFetching(true)
          const option = await getOptions(`/api/selections/id/${id}`, 'get')
          try {
               const res = await axios(option)
               const data = (res.data?.data)
               setFormData({
                    stu_id: data?.stu_id,
                    track_order_1: data?.track_order_1,
                    track_order_2: data?.track_order_2,
                    track_order_3: data?.track_order_3,
                    result: data?.result,
               })
          } catch (error) {
               console.log(error);
               setFormData(INIT_FORM_DATA)
          } finally {
               setFetching(false)
          }
     }, [])

     useEffect(() => {
          if (id) getSelectionData(id)
     }, [id])

     const handleValue = useCallback((e) => {
          const name = e.target.name
          const value = e.target.value
          setFormData(prev => ({
               ...prev,
               [name]: value
          }))
     }, [])

     const handleSubmit = useCallback(async (e) => {
          e.preventDefault()
          const dataLength = [formData.track_order_1, formData.track_order_2, formData.track_order_3].filter(data => data).length
          if (dataLength > 0) {
               if (dataLength < 3) {
                    message.warning("กำหนดอันดับให้ครบ")
                    return
               }
               else if ([...new Set([formData.track_order_1, formData.track_order_2, formData.track_order_3])].length < 3) {
                    message.warning("แทร็กต้องต่างกัน")
                    return
               }
          }
          const option = await getOptions(`/api/selections/${id}`, "put", formData)
          try {
               setUpdating(true)
               await axios(option)
               const searchItem = localStorage.getItem("search-students-track")
               if (searchItem) {
                    const { acadyear } = JSON.parse(searchItem)
                    await cb(acadyear)
               }
               await getSelectionData(id)
               onClose()
          } catch (error) {
               console.log(error);
               message.error("มีบางอย่างผิดพลาด ไม่สามารถแก้ไขข้อมูลได้")
          } finally {
               setUpdating(false)
          }
     }, [formData, id])

     return (
          <Modal
               size={"2xl"}
               isOpen={isOpen}
               onClose={onClose}
          >
               <ModalContent>
                    {(onClose) => (
                         <form onSubmit={handleSubmit}>
                              <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                              <ModalBody>
                                   {fetching ?
                                        <div className="flex justify-center items-center">
                                             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                        </div>
                                        :
                                        <>
                                             <Input
                                                  type="text"
                                                  isReadOnly
                                                  variant="bordered"
                                                  radius='sm'
                                                  name="stu_id"
                                                  className="bg-gray-100 rounded-md"
                                                  label="รหัสนักศึกษา (อ่านเท่านั้น)"
                                                  labelPlacement="outside"
                                                  placeholder="กรอกรหัสนักศึกษา"
                                                  value={formData.stu_id}
                                                  onChange={handleValue}
                                             />
                                             <div className="flex mt-4 mb-3 gap-4 max-md:flex-col max-md:my-0">
                                                  <div className="w-full">
                                                       <label htmlFor="track_order_1" className="block text-sm mb-[6px]">เลือกอับดับ 1</label>
                                                       <select
                                                            defaultValue={""}
                                                            name="track_order_1"
                                                            onChange={handleValue}
                                                            value={formData.track_order_1}
                                                            style={{
                                                                 width: "100%",
                                                                 height: "40px",
                                                                 ...SELECT_STYLE
                                                            }}
                                                            className="px-2 pe-3 py-1 border-1 rounded-lg text-sm"
                                                       >
                                                            <option value="" disabled hidden>เลือกแทร็ก</option>
                                                            {tracks.map((track) => (
                                                                 <option key={track} value={track}>
                                                                      {track}
                                                                 </option>
                                                            ))}
                                                       </select>
                                                  </div>
                                                  <div className="w-full">
                                                       <label htmlFor="track_order_2" className="block text-sm mb-[6px]">เลือกอับดับ 2</label>
                                                       <select
                                                            defaultValue={""}
                                                            name="track_order_2"
                                                            onChange={handleValue}
                                                            value={formData.track_order_2}
                                                            style={{
                                                                 width: "100%",
                                                                 height: "40px",
                                                                 ...SELECT_STYLE
                                                            }}
                                                            className="px-2 pe-3 py-1 border-1 rounded-lg text-sm"
                                                       >
                                                            <option value="" disabled hidden>เลือกแทร็ก</option>
                                                            {tracks.map((track) => (
                                                                 <option key={track} value={track}>
                                                                      {track}
                                                                 </option>
                                                            ))}
                                                       </select>
                                                  </div>
                                                  <div className="w-full">
                                                       <label htmlFor="track_order_3" className="block text-sm mb-[6px]">เลือกอับดับ 3</label>
                                                       <select
                                                            defaultValue={""}
                                                            name="track_order_3"
                                                            onChange={handleValue}
                                                            value={formData.track_order_3}
                                                            style={{
                                                                 width: "100%",
                                                                 height: "40px",
                                                                 ...SELECT_STYLE
                                                            }}
                                                            className="px-2 pe-3 py-1 border-1 rounded-lg text-sm"
                                                       >
                                                            <option value="" disabled hidden>เลือกแทร็ก</option>
                                                            {tracks.map((track) => (
                                                                 <option key={track} value={track}>
                                                                      {track}
                                                                 </option>
                                                            ))}
                                                       </select>
                                                  </div>
                                             </div>
                                             <div>
                                                  <label htmlFor="result" className="block text-sm mb-[6px]">แทร็กที่ได้</label>
                                                  <select
                                                       name="result"
                                                       id="result"
                                                       onChange={handleValue}
                                                       value={formData.result}
                                                       style={{
                                                            width: "100%",
                                                            height: "40px",
                                                            ...SELECT_STYLE
                                                       }}
                                                       className="px-2 pe-3 py-1 border-1 rounded-lg text-sm"
                                                  >
                                                       <option value="" disabled hidden>แทร็ก</option>
                                                       {tracks.map((track) => (
                                                            <option key={track} value={track}>
                                                                 {track}
                                                            </option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </>
                                   }
                              </ModalBody>
                              <ModalFooter>
                                   <Button
                                        variant="bordered"
                                        type="button"
                                        className="rounded-[5px] border-1 border-white hover:border-blue-700 hover:text-blue-700"
                                        onPress={onClose}>
                                        ยกเลิก
                                   </Button>
                                   <Button
                                        type="submit"
                                        isLoading={updating}
                                        className="rounded-[5px] bg-blue-500 text-white">
                                        บันทึก
                                   </Button>
                              </ModalFooter>
                         </form>
                    )}
               </ModalContent>
          </Modal>
     )
}

export default EditModal