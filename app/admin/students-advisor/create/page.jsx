import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import { getServerSession } from "next-auth";
import CreateForm from './CreateForm';
import { BreadCrumb } from '@/app/components';

async function getTeacherByEmail(email) {
     try {
          const option = await getOptions(`/api/advisors/${email}`)
          const data = (await axios(option)).data?.data
          return data
     } catch (error) {
          return {}
     }
}

const Page = async () => {
     const email = (await getServerSession())?.user?.email
     const teacher = await getTeacherByEmail(email)
     return (
          <section>
               <BreadCrumb />
               <CreateForm
                    teacher={teacher}
               />
          </section>
     )
}

export default Page