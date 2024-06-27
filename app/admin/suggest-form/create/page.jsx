"use client"
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import ManageForm from "../ManageForm";

const Page = () => {
     const formId = null
     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <div className='flex flex-col justify-center items-center w-full'>
                         <BreadCrumb />
                         <ManageForm formId={formId} />

                    </div>
               </ContentWrap>
          </>
     )
}

export default Page