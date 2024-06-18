"use client"
import { useToggleSideBarStore } from '@/src/store'
import React from 'react'

const ContentWrap = ({ children }) => {
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)
    return (
        <div className='mt-16'> {/* เว้น nav */}
            <div className={`p-4 md:p-6 ${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}> {/* เว้น side bar */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ContentWrap