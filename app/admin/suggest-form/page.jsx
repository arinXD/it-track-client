"use client"
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from "@/app/components"
import { useCallback, useEffect, useState } from 'react'
import SuggestFormTable from "./SuggestFormTable"
import { fetchData } from "../action"

const Page = () => {
     const [fetching, setFetching] = useState(false);
     const [forms, setForms] = useState([]);

     const getSuggestForm = useCallback(async function () {
          try {
               setFetching(true)
               const resForms = await fetchData("/api/suggestion-forms")
               setForms(resForms)
          } catch (error) {
               setForms([])
          } finally {
               setFetching(false)
          }
     }, [])

     useEffect(() => {
          getSuggestForm()
     }, [])
     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <BreadCrumb />

                    <SuggestFormTable
                         fetching={fetching}
                         forms={forms}
                         callBack={getSuggestForm} />

               </ContentWrap>
          </>
     )
}

export default Page