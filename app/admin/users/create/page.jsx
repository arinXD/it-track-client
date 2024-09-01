import { getOptions } from '@/app/components/serverAction/TokenAction';
import AccountCreationForm from './AccountCreationForm';
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

async function getAllPrograms() {
     try {
          const option = await getOptions("/api/programs")
          const res = (await axios(option)).data?.data
          const data = res.map(p => p.program)
          return data
     } catch (error) {
          return []
     }
}

export default async function Page() {
     // แทร็ก หลักสูตร
     const [tracks, programs] = await Promise.all([getAllTracks(), getAllPrograms()])
     return (
          <div className="container mx-auto px-4 py-8">
               <h1 className="max-w-xl mx-auto text-2xl font-bold mb-6 tracking-[.05em]">สร้างบัญชีใหม่</h1>
               <AccountCreationForm
                    tracks={tracks}
                    programs={programs} />
          </div>
     );
}