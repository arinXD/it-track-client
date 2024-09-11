import TeacherTable from "./TeacherTable"
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';

async function getAllTracks() {
     try {
          const option = await getOptions("/api/tracks/all")
          const res = (await axios(option)).data?.data
          const data = res.map(t => t.track)
          return data
     } catch (error) {
          return []
     }
}

const Page = async () => {
     const [tracks] = await Promise.all([getAllTracks()])
     return (
          <section>
               <TeacherTable
                    tracks={tracks}
               />
          </section>
     )
}

export default Page