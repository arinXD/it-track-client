"use client"
import Link from 'next/link';
import { useState } from 'react';

const TabsComponent = ({ current = "", tabs }) => {
     const [activeTab, setActiveTab] = useState(current);

     return (
          <div className="w-full mt-4 mb-6">
               <div className="flex gap-2 border-b border-gray-200 relative">
                    {tabs.map(({ key, label, icon }, index) => (
                         <Link
                              href={`create?tab=${key}`}
                              key={index}
                              className={`text-sm p-2 flex justify-center items-center gap-2 focus:outline-none relative ${activeTab === key ? 'text-blue-500' : 'text-gray-500'
                                   }`}
                              onClick={() => setActiveTab(key)}
                         >
                              {icon}
                              {label}
                              <div
                                   className={`absolute bottom-0 left-0 w-full h-0.5 ${activeTab === key ? 'bg-blue-500' : 'bg-transparent'
                                        }`}
                                   style={{ transform: 'translateY(50%)' }}
                              />
                         </Link>
                    ))}
               </div>
          </div>
     );
};

export default TabsComponent