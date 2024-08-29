"use client"
import { PlusIcon } from "@/app/components/icons";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { Empty } from "antd";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlineInventory2 } from "react-icons/md";
import InsertCareer from "./InsertCareer";
import CareerInventory from "./CareerInventory";
import { IoCloseOutline } from "react-icons/io5";

const CareerForm = ({ prev, formStyle, tracks, formId, setCareers, creating, setCreateTrigger }) => {
     const { isOpen, onOpen, onClose } = useDisclosure();
     const { isOpen: isOpenInventory, onOpen: onOpenInventory, onClose: onCloseInventory } = useDisclosure();
     const [fetching, setFetching] = useState(false);
     const [defaultCareer, setDefaultCareer] = useState([]);
     const [selectedCareers, setSelectedCareers] = useState([]);
     const [existCareers, setExistCareers] = useState([])

     const getCareers = useCallback(async (formId) => {
          if (!formId) {
               const option = await getOptions(`/api/careers`, "get")
               try {
                    setFetching(true)
                    const res = await axios(option)
                    const careers = res.data.data
                    setDefaultCareer(careers)
               } catch (error) {
                    setDefaultCareer([])
               } finally {
                    setFetching(false)
               }
               return
          } else {
               const option1 = await getOptions(`/api/careers/in-forms/${formId}`, "get")
               const option2 = await getOptions(`/api/careers/not-in-forms/${formId}`, "get")
               try {
                    setFetching(true)
                    const [res1, res2] = await Promise.all([axios(option1), axios(option2)])
                    setExistCareers(res1.data.data)

                    const filteredDefaultCareers = res2.data.data.filter(
                         career => !selectedCareers.some(selected => selected.id === career.id)
                    )
                    setDefaultCareer(filteredDefaultCareers)
               } catch (error) {
                    setExistCareers([])
                    setDefaultCareer([])
               } finally {
                    setFetching(false)
               }
          }
     }, [selectedCareers])

     const filterCareer = useMemo(() => {
          let filterData = [
               ...existCareers,
               ...selectedCareers
          ]
          const groupedByTrack = filterData.reduce((acc, career) => {
               if (!acc[career.track]) {
                    acc[career.track] = []
               }
               acc[career.track].push(career)
               return acc
          }, {})

          filterData = Object.entries(groupedByTrack).map(([track, careers]) => ({
               track,
               careers
          }))

          return filterData
     }, [existCareers, selectedCareers])

     useEffect(() => {
          getCareers(formId)
     }, [formId])

     const removeSelectedCareer = useCallback((id) => {
          const isInSelected = selectedCareers.some(career => career.id === id);

          if (isInSelected) {
               setSelectedCareers(prevCareers => prevCareers.filter(career => career.id !== id));
          } else {
               const careerToMove = existCareers.find(career => career.id === id);
               if (careerToMove) {
                    setExistCareers(prevCareers => prevCareers.filter(career => career.id !== id));
                    setDefaultCareer(prevCareers => [...prevCareers, careerToMove]);
               }
          }
     }, [selectedCareers, existCareers]);

     return (
          <>
               <section style={formStyle}>
                    <InsertCareer
                         tracks={tracks}
                         getCareers={getCareers}
                         isOpen={isOpen}
                         onClose={onClose} />

                    <CareerInventory
                         isOpen={isOpenInventory}
                         onClose={onCloseInventory}
                         defaultCareer={defaultCareer}
                         selectedCareers={selectedCareers}
                         setSelectedCareers={setSelectedCareers}
                    />

                    {
                         fetching ?
                              <div className='w-full flex justify-center my-6'>
                                   <Spinner label="กำลังโหลด..." color="primary" />
                              </div>
                              :
                              <>
                                   <div className="flex justify-between">
                                        <h2 className="text-black">อาชีพภายในแบบฟอร์ม</h2>
                                        <div className="flex justify-end gap-4">
                                             <Button
                                                  isIconOnly
                                                  radius="full"
                                                  className={`text-blue-700 bg-white border border-blue-700 hover:bg-gray-200 transition-all`}
                                                  onClick={onOpen}
                                                  aria-label="create">
                                                  <PlusIcon />
                                             </Button>
                                             <Button
                                                  className={`rounded-[5px] text-blue-700 bg-white border border-blue-700 hover:bg-gray-200 transition-all`}
                                                  startContent={<MdOutlineInventory2 />}
                                                  onClick={onOpenInventory}
                                             >
                                                  คลังอาชีพ
                                             </Button>
                                        </div>
                                   </div>
                                   {filterCareer?.length > 0 ?
                                        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                             {filterCareer.map((track, index) => (
                                                  <div
                                                       key={index}
                                                       className="w-full border bg-white rounded-lg shadow-md p-4 relative"
                                                  >
                                                       <div className="flex justify-between items-center mb-2">
                                                            <p className="text-gray-800 font-medium truncate w-3/4">
                                                                 {track.track}
                                                            </p>
                                                       </div>
                                                       <ul className="flex flex-col mt-2 gap-2 max-h-[150px] overflow-y-auto">
                                                            {track?.careers?.map((career, indexJ) => (
                                                                 <li
                                                                      key={indexJ}
                                                                      className="flex justify-between items-center w-full bg-gray-100 rounded-lg p-2"
                                                                 >
                                                                      <input
                                                                           readOnly
                                                                           type="hidden"
                                                                           name="careers[]"
                                                                           defaultValue={career?.id}
                                                                      />
                                                                      <p className="text-gray-700 truncate w-3/4">
                                                                           {career?.name_en}
                                                                      </p>
                                                                      <button
                                                                           className="bg-white rounded-full p-1 hover:bg-gray-200 transition-colors"
                                                                           onClick={() => removeSelectedCareer(career?.id)}
                                                                           aria-label="remove"
                                                                      >
                                                                           <IoCloseOutline className="w-5 h-5 text-gray-500" />
                                                                      </button>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             ))}
                                        </section> : (
                                             <div className="flex justify-center items-center">
                                                  <Empty
                                                       description={<span className="text-default-300">ไม่มีข้อมูล</span>}
                                                  />
                                             </div>
                                        )
                                   }
                              </>
                    }
               </section>
               <div className="my-[24px] flex gap-2 justify-end">
                    <Button
                         type="button"
                         variant="bordered"
                         className="rounded-[5px] border-white text-black border-1 hover:border-blue-500 hover:text-blue-500"
                         onClick={() => prev()}
                    >
                         ย้อนกลับ
                    </Button>
                    <Button
                         isLoading={creating}
                         type="submit"
                         color="primary"
                         className="rounded-[5px]"
                         onClick={() => {
                              setCreateTrigger(true)
                              setCareers(filterCareer?.flatMap(career => career.careers.map(c => c.id)))
                         }}>
                         บันทึก
                    </Button>
               </div>
          </>
     )
}

export default CareerForm