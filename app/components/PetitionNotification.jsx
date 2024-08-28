"use client"

import { DROPDOWN_MENU_CLASS } from "@/src/util/ComponentClass"
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react"
import { IoNotifications } from "react-icons/io5"

const PetitionNotification = () => {
     return (
          <div className="relative mx-2 flex flex-row gap-3">
               <div className='relative flex justify-center items-center gap-5'>
                    <Dropdown
                         radius="sm"
                         classNames={{
                              content: "p-0 border-small border-divider bg-background shadow-none",
                         }}
                    >
                         <DropdownTrigger>
                              <div className='flex justify-center items-center relative'>
                                   <IoNotifications className='w-6 h-5 active:scale-90 cursor-pointer' />
                                   <div className='w-3.5 h-3.5 rounded-full flex justify-center items-center text-white text-[9px] absolute bg-red-500 top-[-2px] right-[-2px]'>
                                        <p>2</p>
                                   </div>
                              </div>
                         </DropdownTrigger>
                         <DropdownMenu
                              aria-label="Noti menu"
                              disabledKeys={[]}
                              className="p-2"
                              variant="flat"
                              itemClasses={DROPDOWN_MENU_CLASS}
                         >
                              <DropdownSection
                                   title="การแจ้งเตือน"
                                   aria-label="noti-items"
                                   className="mb-0">
                                   <DropdownItem href='/profile' key="profile">
                                        <div className='flex gap-6 justify-between items-center'>
                                             <p className="text-black">คำร้องย้ายแทร็กของคุณได้รับการอนุมัติแล้ว</p>
                                             <div className='w-2 h-2 rounded-full bg-green-600'></div>
                                        </div>
                                        <p className="text-xs">4 ชั่วโมงก่อน</p>
                                   </DropdownItem>
                                   <DropdownItem href='/petition/request' key="write_petition">
                                        <div className='flex gap-6 justify-between items-center'>
                                             <p className="text-black">คำร้องย้ายแทร็กของคุณถูกปฏิเสธ</p>
                                             <div className='w-2 h-2 rounded-full bg-green-600'></div>
                                        </div>
                                        <p className="text-xs">4 ชั่วโมงก่อน</p>
                                   </DropdownItem>
                              </DropdownSection>
                         </DropdownMenu>
                    </Dropdown>
               </div>
          </div >
     )
}

export default PetitionNotification