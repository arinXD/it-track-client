"use client"

import SidebarDrawer from "../components/NavbarDrawer"

const Page = () => {
     return (
          <section>
               <div className="min-h-screen bg-gray-50">
                    <SidebarDrawer />
                    <div className="border pt-16">
                         <div className="border  bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-start py-4">
                                   <h2 className="text-4xl font-extrabold text-gray-900">ข่าวสารประชาสัมพันธ์</h2>
                              </div>
                         </div>
                    </div>
               </div>
          </section>
     )
}

export default Page