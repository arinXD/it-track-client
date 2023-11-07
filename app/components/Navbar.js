'use client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'
import { BiLogOut } from 'react-icons/bi';


const Navbar = () => {
    const { data:session } = useSession();
    const [profileToggle, setProfileToggle] = useState(false)

    const toggleProfile = () => {
        setTimeout(() => {
            if (profileToggle) {
                setProfileToggle(false)
            } else {
                setProfileToggle(true)
            }
        }, 50)
    }
    useEffect(() => {
        window.onclick = () => {
            if (profileToggle) {
                setProfileToggle(false)
            }
        }
    })
    return (
        <nav className="bg-white fixed top-0 left-0 z-40 w-full border-b">
            <div className="px-2 sm:px-6 lg:ps-5 lg:pe-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>

                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group">
                                <img className="h-8 w-auto" src="/logo.png" alt="it kku" />
                                <span className="ml-3 text-gray-900 font-bold"><code>KKU it track</code></span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {/* {links.map(link => (
                                    <Link key={link.link}
                                        className={(url == link.link) ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"}
                                        href={link.link}>
                                        {link.label}
                                    </Link>
                                ))} */}
                                {/* <a href="#" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Dashboard</a>
                                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Team</a>
                                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Projects</a>
                                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Calendar</a> */}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="relative ml-3">
                            {(session) ?
                                <div className='relative flex justify-center items-center gap-2'>
                                    <Image
                                        onClick={toggleProfile}
                                        className='rounded-full active:scale-90 cursor-pointer'
                                        src={session?.user?.image}
                                        width={40} height={40}
                                        alt="user image"
                                    />
                                    <div className={`${profileToggle ? "block" : "hidden"} rounded absolute border w-[280px] p-4 top-[41px] right-0 bg-white`}>
                                        <div className="flex gap-4 items-start mb-3 border-b pb-3">
                                            <Image
                                                className='rounded-full'
                                                src={session?.user?.image}
                                                width={45} height={45}
                                                alt="user image"
                                            />
                                            <div className='w-full'>
                                                <div>{session.user.name}</div>
                                                <div className='text-sm text-gray-500'>{session.user.email}</div>
                                                <div className='mt-2'>
                                                    <Link href={"/"} className='text-sm text-blue-500'>ดูโปรไฟล์</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-3 cursor-pointer' onClick={() => signOut()}>
                                            <BiLogOut className='w-6 h-6' />
                                            <button className=''>Sign out</button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <button onClick={() => signIn()} className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded active:scale-90'>
                                    เข้าสู่ระบบ
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>


            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">

                    <a href="#" className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" aria-current="page">Dashboard</a>
                    <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Team</a>
                    <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Projects</a>
                    <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Calendar</a>
                </div>
            </div>
        </nav>

    )
}

export default Navbar