"use client"

import Link from "next/link"
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { RiInboxArchiveLine, RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";

const Petitionbar = ({ className }) => {
     const url = usePathname();
     const current = useMemo(() => (url.split("/").filter(e => e).slice(-1)), [url])

     const menuItems = [
          { href: "write", label: "เขียนคำร้อง", icon: RiPencilLine },
          { href: "request", label: "กล่องคำร้อง", icon: RiInboxArchiveLine },
          { href: "trash", label: "ถังขยะ", icon: RiDeleteBin6Line },
     ];

     return (
          <aside className={`${className} bg-white shadow-sm border rounded-lg overflow-hidden xl:rounded-tr-none xl:rounded-br-none xl:border-r-0 max-xl:mb-4`}>
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
                                             <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-400"}`} />
                                             {item.label}
                                        </Link>
                                        {item.href === "write" && <hr className="my-3"/>}
                                   </li>
                              );
                         })}
                    </ul>
               </nav>
          </aside>
     )
}

export default Petitionbar