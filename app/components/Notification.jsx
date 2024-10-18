"use client"

import { DROPDOWN_MENU_CLASS } from "@/src/util/ComponentClass"
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/react"
import { useCallback, useEffect, useState } from "react"
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5"
import { getOptions } from "./serverAction/TokenAction"
import axios from "axios"
import { timeAgo } from "@/src/util/simpleDateFormatter"

export default function Notification({ email = null }) {
     const [fetching, setFetching] = useState(true);
     const [notifications, setNotifications] = useState([]);

     const getNotificationByEmail = useCallback(async (email) => {
          try {
               setFetching(true)
               const option = await getOptions(`/api/notifications/${email}`, "get")
               const noti = (await axios(option)).data?.data
               setNotifications(noti)
          } catch (error) {
               setNotifications([])
          } finally {
               setFetching(false)
          }
     }, [])

     useEffect(() => {
          if (email) {

               getNotificationByEmail(email)

               const interval = setInterval(() => {
                    getNotificationByEmail(email)
               }, 15000)

               return () => clearInterval(interval)
          }
     }, [email, getNotificationByEmail])

     const updateNotiRead = useCallback(async (id, destination) => {
          try {
               const option = await getOptions(`/api/notifications/${id}`, "patch")
               await axios(option)
          } catch (error) {
               console.log(error);
          } finally {
               window.location.href = destination
          }
     }, [])

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
                              <div className='active:scale-90 cursor-pointer flex justify-center items-center relative p-1 rounded-full'>
                                   <IoNotifications className='w-5 h-5 md:w-5 md:h-5' />
                                   {notifications?.length > 0 &&
                                        <div className='w-3.5 h-3.5 rounded-full flex justify-center items-center text-white text-[9px] absolute bg-red-500 top-[-2px] right-[-2px]'>
                                             <p>{notifications.length}</p>
                                        </div>
                                   }
                              </div>
                         </DropdownTrigger>
                         <DropdownMenu
                              aria-label="Noti menu"
                              disabledKeys={["empty", "loading"]}
                              className="p-2"
                              variant="flat"
                              itemClasses={DROPDOWN_MENU_CLASS}
                         >
                              <DropdownSection
                                   title="การแจ้งเตือน"
                                   aria-label="noti-items"
                                   className="mb-0">
                                   {fetching ?
                                        <DropdownItem key="loading">
                                             <div className='flex flex-col justify-between gap-2 items-center my-2'>
                                                  <span className='text-gray-600 text-sm'>Loading...</span>
                                             </div>
                                        </DropdownItem>
                                        :

                                        notifications?.length > 0 ?
                                             notifications.map(noti => (
                                                  <DropdownItem
                                                       onClick={() => updateNotiRead(noti.id, noti.destination)}
                                                       key={`notification-${noti.id}`}>
                                                       <div className='flex gap-6 justify-between items-center'>
                                                            <p className="text-black">{noti.text}</p>
                                                            <div className='w-2 h-2 rounded-full bg-green-600'></div>
                                                       </div>
                                                       <p className="text-xs mt-0.5">{timeAgo(noti.createdAt)}</p>
                                                  </DropdownItem>
                                             ))
                                             :
                                             <DropdownItem key="empty">
                                                  <div className='flex flex-col justify-between gap-2 items-center my-2'>
                                                       <IoNotificationsOutline className="w-6 h-6" />
                                                       <span className='text-gray-600 text-sm'>ไม่มีการแจ้งเตือนใหม่</span>
                                                  </div>
                                             </DropdownItem>
                                   }
                              </DropdownSection>
                         </DropdownMenu>
                    </Dropdown>
               </div>
          </div >
     )
}