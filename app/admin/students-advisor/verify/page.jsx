import SearchFallback from "@/app/components/SearchFallback"
import Verification from "./Verification"
import { Suspense } from "react"

const Page = () => {
     return (
          <section>
               <Suspense fallback={<SearchFallback />}>
                    <Verification />
               </Suspense>
          </section>
     )
}

export default Page