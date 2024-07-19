"use client"
import { useToggleSideBarStore } from '@/src/store'
import React from 'react'

const ContentWrap = ({ children, className }) => {
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)
    return (
        <div className={`${className} mt-16 p-4 md:p-8 ${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}> {/* เว้น side bar */}
            <div>
                {children}
            </div>
        </div>
    )
}

export default ContentWrap