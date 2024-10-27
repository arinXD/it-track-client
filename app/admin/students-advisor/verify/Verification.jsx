"use client"
import { useSearchParams } from 'next/navigation'
import VerificationTable from "./VerificationTable"
import SearchFallback from '@/app/components/SearchFallback'
import { Suspense } from 'react'

const Verification = () => {
     const searchParams = useSearchParams()
     const stdID = searchParams.get('std_id')

     return (
          <div>
               {!stdID ?
                    <p>ต้องการรหัสนักศึกษาเพื่อดึงข้อมูล</p>
                    :
                    <Suspense fallback={<SearchFallback />}>
                         <VerificationTable stdID={stdID} />
                    </Suspense>
               }
          </div>
     )
}

export default Verification