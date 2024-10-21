"use client"
import Link from 'next/link'

const TMonlicaEmail = () => {
     return (
          <div className='inline-block'>
               <Link
                    className="text-blue-500"
                    href="https://www.facebook.com/"
                    target='_blank'
               >
                    เจ้าหน้าที่ 1 </Link>
               <span className='me-1'> </span>
               หรือ
               <Link
                    className="text-blue-500"
                    href="https://www.facebook.com/"
                    target='_blank'
               > เจ้าหน้าที่ 2</Link>
               <span className='ms-1'>
               </span>
          </div>
     )
}

export default TMonlicaEmail