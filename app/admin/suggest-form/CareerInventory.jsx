"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Spinner } from "@nextui-org/react"
import { Checkbox, Empty, message } from 'antd';
import { SearchIcon } from "@/app/components/icons";
import { thinInputClass } from "@/src/util/ComponentClass";
import "../../../public/css/AntCheckBox.css"

const CareerInventory = ({ isOpen, onClose, defaultCareer, selectedCareers, setSelectedCareers }) => {
     const [filterValue, setFilterValue] = useState("");
     const [checkedItems, setCheckedItems] = useState({});
     const [selectCareerInventory, setSelectCareerInventory] = useState([]);

     const handleCheckboxChange = useCallback((e, careerId, career) => {
          const checked = e.target.checked
          setCheckedItems(prev => ({
               ...prev,
               [careerId]: checked
          }));
          setSelectCareerInventory((prev) => {
               if (checked) {
                    if (!prev.some(c => c.id === careerId)) {
                         return [...prev, career]
                    }
               } else {
                    return prev.filter((existCareer) => existCareer.id !== careerId)
               }
               return prev
          })
     }, [])

     const selectAllInTrack = useCallback((track) => {
          const updatedCheckedItems = { ...checkedItems };
          let updatedSelectedCareers = [...selectCareerInventory];

          const allChecked = track.careers.every(career => checkedItems[career.id]);

          track.careers.forEach((career) => {
               if (allChecked) {
                    updatedCheckedItems[career.id] = false;
                    updatedSelectedCareers = updatedSelectedCareers.filter(c => c.id !== career.id);
               } else {
                    updatedCheckedItems[career.id] = true;
                    if (!updatedSelectedCareers.some(c => c.id === career.id)) {
                         updatedSelectedCareers.push(career);
                    }
               }
          });

          setCheckedItems(updatedCheckedItems);
          setSelectCareerInventory(updatedSelectedCareers);
     }, [checkedItems, selectCareerInventory]);

     const onSearchChange = useCallback((value) => {
          if (value) {
               setFilterValue(value)
          } else {
               setFilterValue("")
          }
     }, [])

     const filteredItems = useMemo(() => {
          let filterData = defaultCareer.filter(career =>
               !selectedCareers.some(selectedCareer => selectedCareer.id === career.id)
          );

          if (filterData?.length < 0) return []

          if (filterValue) {
               filterData = filterData.filter((career) =>
                    career.name_th.toLowerCase().includes(filterValue.toLowerCase()) ||
                    career.name_en.toLowerCase().includes(filterValue.toLowerCase()) ||
                    career.track.toLowerCase().includes(filterValue.toLowerCase())
               )
          }
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
     }, [filterValue, defaultCareer, selectedCareers])

     const closeForm = useCallback(() => {
          setCheckedItems({})
          onClose()
     }, [])

     const addToSeletedCareer = useCallback(() => {
          setSelectedCareers(selectCareerInventory)
          closeForm()
     }, [selectCareerInventory])

     return (
          <Modal
               size={"5xl"}
               isOpen={isOpen}
               onClose={onClose}
          >
               <ModalContent>
                    {(onClose) => (
                         <>
                              <ModalHeader className="flex flex-col gap-1 border-b-1">
                                   <p className="mb-1">คลังอาชีพ</p>
                                   <Input
                                        isClearable
                                        className="w-full h-fit rounded-[5px]"
                                        placeholder="ค้นหาคำถาม"
                                        size="sm"
                                        classNames={thinInputClass}
                                        startContent={<SearchIcon />}
                                        value={filterValue}
                                        onValueChange={onSearchChange}
                                   />
                              </ModalHeader>
                              <ModalBody className="px-6 py-4 gap-0 block w-full h-full overflow-auto">
                                   {
                                        filteredItems?.length > 0 ?
                                             <section className={`w-full border-1 rounded-[5px] grid grid-cols-${filteredItems?.length >= 3 ? 3 : filteredItems?.length} gap-4 bg-gray-100 p-4`}>
                                                  {filteredItems.map((track, index) => (
                                                       <section
                                                            key={index}
                                                            className="w-full shadow-sm relative bg-white border-1 p-4 rounded-[5px]">
                                                            <div className="flex justify-between">
                                                                 <p className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
                                                                      {track.track}
                                                                 </p>
                                                                 <button
                                                                      onClick={() => selectAllInTrack(track)}
                                                                      className="px-2 text-[10px] border-1 rounded-[5px] bg-gray-100 active:scale-95"
                                                                 >
                                                                      {track.careers.every(career => checkedItems[career.id]) ? 'ลบทั้งหมด' : 'เลือกทั้งหมด'}
                                                                 </button>
                                                            </div>
                                                            <ul className="flex mt-2 flex-col gap-2 !h-[150px] overflow-y-auto">
                                                                 {track?.careers?.map((career, indexJ) => (
                                                                      <li
                                                                           className="w-full h-fit"
                                                                           key={indexJ}>
                                                                           <Checkbox
                                                                                id={`career-${career.id}`}
                                                                                value={career.id}
                                                                                checked={checkedItems[career.id] || false}
                                                                                onChange={(e) => handleCheckboxChange(e, career.id, career)}
                                                                                className="w-full cursor-pointer flex gap-2 border p-4 rounded-[5px] hover:border-blue-500 hover:border-2"
                                                                                name={career.id}
                                                                           >
                                                                                {career?.name_en}
                                                                           </Checkbox>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </section>
                                                  ))}
                                             </section>
                                             :
                                             <Empty
                                                  className='mt-8'
                                                  description={
                                                       <span className='text-gray-300'>ไม่มีข้อมูล</span>
                                                  }
                                             />
                                   }
                              </ModalBody>
                              <ModalFooter>
                                   <Button
                                        color="default"
                                        variant="light"
                                        className="rounded-[5px]"
                                        onPress={closeForm}>
                                        ยกเลิก
                                   </Button>
                                   <Button
                                        onClick={addToSeletedCareer}
                                        color="primary"
                                        className="rounded-[5px]">
                                        เพิ่ม
                                   </Button>
                              </ModalFooter>
                         </>
                    )}
               </ModalContent>
          </Modal>
     )
}

export default CareerInventory