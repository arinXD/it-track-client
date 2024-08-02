import { ContentWrap, Navbar, Sidebar } from '@/app/components'
import { IoLogoFacebook } from "react-icons/io5";
import Link from 'next/link';
import { BiLogoGmail } from "react-icons/bi";

const ContactInfo = ({ name, facebookUrl, email }) => {
     return (
          <div className='flex gap-6 mb-2'>
               <div className='flex gap-2 w-[180px]'>
                    <IoLogoFacebook className='text-blue-700 w-5 h-5' />
                    <Link
                         className="text-blue-500 hover:underline"
                         href={facebookUrl}
                         target='_blank'
                         rel="noopener noreferrer"
                    >
                         {name}
                    </Link>
               </div>
               <div className='flex gap-2 w-[250px]'>
                    <BiLogoGmail className='text-red-700 w-5 h-5' />
                    <Link
                         className="text-blue-500 hover:underline"
                         href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&authuser=1`}
                         target='_blank'
                         rel="noopener noreferrer"
                    >
                         {email}
                    </Link>
               </div>
          </div>
     );
};

const Page = async () => {
     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <h1 className='text-2xl font-bold mb-6'>ข้อมูลส่วนตัวผิดพลาด แจ้งปัญหาได้ที่</h1>
                    <div className='space-y-4'>
                         <ContactInfo
                              name="Arin Chawut"
                              facebookUrl="https://www.facebook.com/Arinchawut"
                              email="arinchawut.k@kkumail.com"
                         />
                         <ContactInfo
                              name="Phubes Komutiban"
                              facebookUrl="https://www.facebook.com/kiok127523"
                              email="pubes.k@kkumail.com"
                         />
                    </div>
               </ContentWrap>
          </>
     )
}

export default Page;