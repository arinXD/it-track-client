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
                                        <h2>อาชีพภายในแบบฟอร์ม</h2>
                                        <div className="flex justify-end gap-4">
                                             <Button
                                                  isIconOnly
                                                  radius="full"
                                                  color="default"
                                                  onClick={onOpen}
                                                  aria-label="create">
                                                  <PlusIcon />
                                             </Button>
                                             <Button
                                                  startContent={<MdOutlineInventory2 />}
                                                  className="rounded-[5px]"
                                                  onClick={onOpenInventory}
                                             >
                                                  คลังอาชีพ
                                             </Button>
                                        </div>
                                   </div>
                                   <section className={`w-full grid grid-cols-${filterCareer?.length > 0 ? "3" : "1"} gap-4 mt-4`}>
                                        {
                                             filterCareer?.length > 0 ?
                                                  filterCareer.map((track, index) => (
                                                       <section
                                                            key={index}
                                                            className="w-full shadow-sm relative bg-white border-1 p-4 rounded-[5px]">
                                                            <div className="flex justify-between">
                                                                 <p className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-black">
                                                                      {track.track}
                                                                 </p>
                                                            </div>
                                                            <ul className="flex flex-col mt-2 gap-2 !h-[150px] overflow-y-auto">
                                                                 {track?.careers?.map((career, indexJ) => (
                                                                      <li
                                                                           className="flex justify-between items-center w-full border-1 h-fit rounded-[5px] p-2"
                                                                           key={indexJ}>
                                                                           <input readOnly type="hidden" name="careers[]" defaultValue={career?.id} />
                                                                           <p className="w-[80%] overflow-hidden text-ellipsis whitespace-nowrap"> {career?.name_en} </p>
                                                                           <Button
                                                                                isIconOnly
                                                                                variant="light"
                                                                                radius="full"
                                                                                color="default"
                                                                                onClick={() => removeSelectedCareer(career?.id)}
                                                                                aria-label="remove">
                                                                                <IoCloseOutline className="w-7 h-7" />
                                                                           </Button>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </section>
                                                  ))
                                                  :
                                                  <Empty
                                                       className='my-6'
                                                       description={
                                                            <span className='text-gray-300'>ไม่มีข้อมูล</span>
                                                       }
                                                  />
                                        }
                                   </section>
                              </>
                    }
               </section>
               <div className="my-[24px] flex gap-2 justify-end">
                    <Button
                         type="button"
                         variant="bordered"
                         className="rounded-[5px] border-blue-500 text-blue-500 border-1 hover:bg-blue-500 hover:text-white"
                         onClick={() => prev()}
                    >
                         Previous
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
                         Done
                    </Button>
               </div>
          </>
     )
}

export default CareerForm