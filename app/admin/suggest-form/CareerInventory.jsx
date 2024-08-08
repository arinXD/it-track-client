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
                                   <section className="w-full">
                                        {filteredItems?.length > 0 ? (
                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 rounded-lg p-4">
                                                  {filteredItems.map((track, index) => (
                                                       <div
                                                            key={index}
                                                            className="bg-white rounded-lg shadow-md p-4 relative"
                                                       >
                                                            <div className="flex justify-between items-center mb-2">
                                                                 <p className="text-gray-800 font-medium truncate w-full">
                                                                      {track.track}
                                                                 </p>
                                                                 <button
                                                                      onClick={() => selectAllInTrack(track)}
                                                                      className="w-28 px-2 py-1 text-xs rounded-md bg-gray-200 active:scale-95 hover:bg-gray-300 transition-colors"
                                                                 >
                                                                      {track.careers.every(career => checkedItems[career.id])
                                                                           ? 'ลบทั้งหมด'
                                                                           : 'เลือกทั้งหมด'}
                                                                 </button>
                                                            </div>
                                                            <ul className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                                                                 {track?.careers?.map((career, indexJ) => (
                                                                      <li key={indexJ}>
                                                                           <Checkbox
                                                                                id={`career-${career.id}`}
                                                                                value={career.id}
                                                                                checked={checkedItems[career.id] || false}
                                                                                onChange={(e) =>
                                                                                     handleCheckboxChange(e, career.id, career)
                                                                                }
                                                                                className="w-full cursor-pointer flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-3 hover:border-blue-500 hover:border-2 transition-colors"
                                                                                name={career.id}
                                                                           >
                                                                                {career?.name_en}
                                                                           </Checkbox>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  ))}
                                             </div>
                                        ) : (
                                             <div className="mt-8 text-gray-400">ไม่มีข้อมูล</div>
                                        )}
                                   </section>
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