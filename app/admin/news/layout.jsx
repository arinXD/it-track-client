import { ContentWrap, Navbar, Sidebar, BreadCrumb } from "@/app/components"

const layout = ({ children }) => {
     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <BreadCrumb />
                    {children}
               </ContentWrap>
          </>
     )
}

export default layout