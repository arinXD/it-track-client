"use client"
import Link from 'next/link'

const TMonlicaEmail = () => {
     return (
          <div>
               <span className='me-1'>อาจารย์มัลลิกา วัฒนะ</span>
               <Link className="text-blue-500" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${"monlwa@kku.ac.th"}&authuser=1`} size="sm" isExternal>
                    monlwa@kku.ac.th
               </Link>
          </div>
     )
}

export default TMonlicaEmail