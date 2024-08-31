import { BreadCrumb, ContentWrap, Navbar, Sidebar } from "@/app/components"
import SidebarDrawer from "../components/NavbarDrawer"

const layout = ({ children }) => {
     return (
          <>
               <header>
                    <SidebarDrawer />
               </header>
               <div className="mt-16">
                    {children}
               </div>
          </>
     )
}

export default layout