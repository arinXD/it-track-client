"use client"
import { useSearchParams } from "next/navigation";
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import ManageForm from "../ManageForm";
import { Suspense } from "react";
import SearchFallback from "@/app/components/SearchFallback";

const Page = () => {
     const formId = useSearchParams().get('id')
     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <div className='flex flex-col justify-center items-center w-full'>
                         <BreadCrumb />
                         <Suspense fallback={<SearchFallback />}>
                              <ManageForm formId={formId} />
                         </Suspense>

                    </div>
               </ContentWrap>
          </>
     )
}

export default Page