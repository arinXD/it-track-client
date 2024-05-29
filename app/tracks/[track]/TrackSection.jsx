"use client"
import { useToggleSideBarStore } from '@/src/store'

const TrackSection = ({ children }) => {
     const toggleSideBar = useToggleSideBarStore((state) => state.toggle)
     return (
          <section className={`p-4 md:p-6 ${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}> {/* เว้น side bar */}
               {children}
          </section>
     )
}

export default TrackSection