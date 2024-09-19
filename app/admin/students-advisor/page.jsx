import { getServerSession } from "next-auth"
import StudentTable from "./StudentTable"

const Page = async () => {
    const session = await getServerSession()
    return (
        <section>
            <StudentTable email={session?.user?.email} />
        </section>
    )
}

export default Page