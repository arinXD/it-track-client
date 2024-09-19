"use client"
import { useToggleSideBarStore } from '@/src/store'

const TrackSection = ({ children }) => {
     const toggleSideBar = useToggleSideBarStore((state) => state.toggle)

     return (
          <section className={`px-4 py-6 transition-all duration-300 ${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}>
               {children}
          </section>
     )
}

export default TrackSection