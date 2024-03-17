import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import React from 'react'
import StudentTable from './StudentTable'

const Page = () => {
     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <BreadCrumb />
                    <div>
                         <StudentTable />
                    </div>
               </ContentWrap>
          </>
     )
}

export default Page