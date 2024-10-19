import { getServerSession } from "next-auth"
import StudentTable from "./StudentTable"
import { BreadCrumb } from "@/app/components"

const Page = async () => {
    const session = await getServerSession()
    return (
        <section>
            <BreadCrumb />
            <StudentTable email={session?.user?.email} />
        </section>
    )
}

export default Page