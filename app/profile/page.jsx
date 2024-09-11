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
async function getAllTracks() {
     const option = await getOptions(`/api/tracks/all`, "get")
     try {
          const data = (await axios(option)).data.data
          const tracks = data.map(t => t.track)
          return ["", ...tracks]
     } catch (error) {
          return []
     }
}

const Page = async () => {
     const session = await getServerSession()
     const [userData, tracks] = await Promise.all([getUserData(session.user.email, session), getAllTracks()])

     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap className='bg-[#F5F5F5]'>
                    <UserProfile
                         userData={userData}
                         tracks={tracks}
                    />
               </ContentWrap>
          </>
     )
}

export default Page