"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useState } from 'react'
import Select from 'react-select';

const InsertSubjectModal = ({ isOpen, onClose }) => {
     const [inserting, setInserting] = useState(false)
     function closeForm() {
          onClose()
     }

     return (
          <>
               <Modal
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    size={"2xl"}
                    isOpen={isOpen}
                    onClose={closeForm}
                    classNames={{
                         body: "py-6",
                         backdrop: "bg-[#292f46]/50 backdrop-opacity-10",
                         base: "border-gray-300",
                         header: "border-b-[1.5px] border-gray-300",
                         footer: "border-t-[1.5px] border-gray-300",
                         closeButton: "hover:bg-white/5 active:bg-white/10",
                    }}
               >
                    <ModalContent>
                         {(onClose) => (
                              <>
                                   <form onSubmit={() => { }} className=''>
                                        <ModalHeader className="flex flex-col gap-1">
                                             <h2>เพิ่มวิชาในการคัดเลือกแทรค</h2>
                                             <span className='text-base font-normal'>แบบฟอร์มเพิ่มวิชาในการคัดเลือกแทรค</span>
                                        </ModalHeader>
                                        <ModalBody>
                                             <div className='flex flex-row gap-4 mt-0'>
                                             <label htmlFor="group">กลุ่มรายวิชา</label>
                                                  <Select
                                                       className='z-50'
                                                       id="group"
                                                       value={selectedGroup}
                                                       options={groups}
                                                       onChange={(selectedOption) => setSelectedGroup(selectedOption)}
                                                       isSearchable
                                                       isClearable
                                                  />
                                             </div>
                                        </ModalBody>
                                        <ModalFooter>
                                             <Button type='button' className='border-1 h-[16px] py-4' radius='sm' color="primary" variant='bordered' onPress={closeForm}>
                                                  ยกเลิก
                                             </Button>
                                             <Button disabled={inserting} isLoading={inserting} type='submit' className='h-[16px] py-4 ms-4' radius='sm' color="primary" variant='solid'>
                                                  เพิ่ม
                                             </Button>
                                        </ModalFooter>
                                   </form>
                              </>
                         )}
                    </ModalContent>
               </Modal>
          </>
     )
}

export default InsertSubjectModal