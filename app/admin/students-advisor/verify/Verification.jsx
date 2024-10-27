'use client'
import { useSearchParams } from 'next/navigation'
import VerificationTable from "./VerificationTable"

const Verification = () => {
     const searchParams = useSearchParams()
     const stdID = searchParams.get('std_id')

     return (
          <div>
               {!stdID ?
                    <p>ต้องการรหัสนักศึกษาเพื่อดึงข้อมูล</p>
                    :
                    <VerificationTable stdID={stdID} />
               }
          </div>
     )
}

export default Verification