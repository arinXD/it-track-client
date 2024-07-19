import { ContentWrap, Navbar, Sidebar } from '@/app/components'
import { getOptions } from '@/app/components/serverAction/TokenAction'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import UserProfile from './UserProfile'

async function getUserData(email, session) {
     const option = await getOptions(`/api/users/${email}`, "get")
     try {
          const res = await axios(option)
          const data = res.data.data
          data.image = session.user.image
          data.username = session.user.name
          return data
     } catch (error) {
          return {}
     }
}

const Page = async () => {
     const session = await getServerSession()
     const userData = await getUserData(session.user.email, session)

     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap className='bg-[#F5F5F5]'>
                    <UserProfile userData={userData} />
               </ContentWrap>
          </>
     )
}

export default Page