"use client"
import Link from 'next/link'

const TMonlicaEmail = () => {
     return (
          <div className='inline-block'>
               FB: <Link
                    className="text-blue-500"
                    href="https://www.facebook.com/Arinchawut"
                    target='_blank'
               >
                    Arin Chawut</Link>
               <span className='me-1'>
               </span>
               หรือ
               FB: <Link
                    className="text-blue-500"
                    href="https://www.facebook.com/kiok127523"
                    target='_blank'
               >
                    Phubes Komutiban</Link>
               <span className='ms-1'>
               </span>
          </div>
     )
}

export default TMonlicaEmail