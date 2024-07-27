import { ContentWrap, Navbar, Sidebar } from '@/app/components'

const Page = async () => {
     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <h1 className='mb-4'>Help & Feedback</h1>
               </ContentWrap>
          </>
     )
}

export default Page;