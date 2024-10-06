import { getServerSession } from "next-auth"
import Summary from "./Summary"

const Page = async () => {
     const session = await getServerSession()
     const email = session.user.email
     return (
          <Summary email={email} />
     )
}

export default Page