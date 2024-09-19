import { getServerSession } from "next-auth"
import UserTable from "./UserTable"

const Page = async () => {
     const session = await getServerSession()
     return (
          <section>
               <UserTable email={session?.user?.email} />
          </section>
     )
}

export default Page