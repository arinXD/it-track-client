import { ContentWrap, Navbar, Sidebar } from "@/app/components"

const layout = ({ children }) => {
     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    {children}
               </ContentWrap>
          </>
     )
}

export default layout