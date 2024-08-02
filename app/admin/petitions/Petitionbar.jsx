"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { GoArchive } from "react-icons/go";
import { IoCheckmarkCircleSharp, IoCloseCircle } from "react-icons/io5";

const Petitionbar = ({ className }) => {
     const url = usePathname();
     const current = useMemo(() => (url.split("/").filter(e => e).slice(-1)), [url])

     const menuItems = [
          {
               href: "all", label: "คำร้องใหม่", icon: (className) => (<GoArchive className="mr-3 h-4 w-4" />)
          },
          {
               href: "approved", label: "คำร้องที่อนุมัติ", icon: (className) => (
                    <div className="relative mr-3" >
                         <GoArchive className="h-4 w-4" />
                         <IoCheckmarkCircleSharp className={`${className} absolute top-[-1px] right-[-2px] w-3 h-3 bg-white rounded-full`} />
                    </div >
               )
          },
          {
               href: "rejected", label: "คำร้องที่ปฏิเสธ", icon: (className) => (
                    <div className="relative mr-3">
                         <GoArchive className="h-4 w-4" />
                         <IoCloseCircle className={`${className} absolute top-[-1px] right-[-2px] w-3 h-3 bg-white rounded-full`} />
                    </div>
               )
          },
     ];

     return (
          <aside className={`${className} bg-white shadow-sm border rounded-lg overflow-hidden rounded-tr-none rounded-br-none border-r-0`}>
               <nav className="p-4">
                    <ul className="space-y-1">
                         {menuItems.map((item) => {
                              const isActive = current == item.href;
                              return (
                                   <li key={item.href}>
                                        <Link
                                             href={item.href}
                                             className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                                        ${isActive
                                                       ? "bg-blue-100 text-blue-700"
                                                       : "text-gray-700 hover:bg-gray-100"
                                                  }`}
                                        >
                                             {item.icon(isActive
                                                  ? "!bg-blue-100 !text-blue-700"
                                                  : "text-gray-700 hover:bg-gray-100")}
                                             {item.label}
                                        </Link>
                                        {item.href === "write" && <hr className="my-3" />}
                                   </li>
                              );
                         })}
                    </ul>
               </nav>
          </aside>
     )
}

export default Petitionbar