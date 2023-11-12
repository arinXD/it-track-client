"use client"
import React, { useRef } from 'react'
import { useSession, signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { useEffect, useState } from 'react'
import Link from 'next/link';

import { SignUp } from '@/app/components';


const Page = () => {
    const email = useRef(null)
    const pass = useRef(null)

    const [displaySignUp, setDisplaySignUp] = useState(false)

    const closeModal = () => {
        setDisplaySignUp(false);
    }

    const router = useRouter()
    let timeoutError;
    const { data: session } = useSession();
    const [error, setError] = useState(false)
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [emptyPass, setEmptyPass] = useState(false)
    const [displayPass, setDisplayPass] = useState(false)

    const signInCredentials = async (event) => {
        setEmptyEmail(false)
        setEmptyPass(false)
        event.preventDefault()
        if (!email) setEmptyEmail(true)
        if (!pass) setEmptyPass(true)
        if (!(email && pass)) {
            setError("กรุณากรอกข้อมูลผู้ใช้ให้ครบ")
            return
        }
        const result = await signIn("credentials", {
            email: email.current.value,
            password: pass.current.value,
            redirect: false,
            callbackUrl: "/",
        })
        // console.log(result);
        if (!result.ok) {
            setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        }
    }

    const signInGoogle = async () => {
        const result = await signIn("google", {
            redirect: true,
            callbackUrl: "/",
        })
    }

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    useEffect(() => {
        if (error) {
            timeoutError = setTimeout(() => {
                setError(false);
            }, 5000);
        }

        return () => {
            if (timeoutError) {
                clearTimeout(timeoutError);
            }
        };
    }, [error]);

    return (

        <section className="absolute w-full p-5 max-h-full max-w-full h-[calc(100%)]">
            <div
                style={{ transform: 'translate(-50%, -50%)' }}
                className='absolute w-full max-h-full max-w-7xl h-[calc(100%)] top-[50%] left-[50%] flex flex-row items-center gap-8 px-10'>
                <div className='w-[50%] h-[calc(100%)] max-h-full flex flex-col items-center justify-center p-8'>
                    <div className='w-fit h-[400px]'>
                        <h1 className="mb-1 font-bold text-5xl leading-tight tracking-tight text-blue-500">
                            IT Tracks
                        </h1>
                        <h2 className=''>
                            Welcome to IT Track by IT64
                        </h2>

                    </div>
                </div>
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-[50%] h-[calc(100%)] max-h-full flex justify-start items-center">
                    <form className="h-[400px] w-full space-y-3 md:space-y-4" onSubmit={signInCredentials}>
                        {(error) ?
                            <div className={'flex gap-3 items-center bg-red-500 text-gray-900 px-3 py-3'}>
                                <AiOutlineCloseCircle onClick={() => {
                                    setError(false)
                                    clearTimeout(timeoutError)
                                }} className='w-7 h-7 cursor-pointer' />
                                {error}
                            </div>
                            :
                            null
                        }
                        <div>
                            {/* <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label> */}
                            <input
                                type="email"
                                name="email"
                                id="email"
                                ref={email}
                                autoComplete="email"
                                className={`${(emptyEmail) ? 'border-2 border-red-500' : 'border border-gray-400'} bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 focus:outline-none`}
                                placeholder="อีเมล" />
                        </div>
                        <div className='relative select-none'>
                            {/* <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label> */}
                            {
                                (displayPass) ?
                                    <BsEyeSlashFill
                                        onClick={() => setDisplayPass(false)}
                                        className='w-5 h-5 text-gray-400 absolute top-[30%] right-[3%] translate-[-50%] cursor-pointer'
                                    />
                                    :
                                    <BsEyeFill
                                        onClick={() => setDisplayPass(true)}
                                        className='w-5 h-5 text-gray-400 absolute top-[30%] right-[3%] translate-[-50%] cursor-pointer'
                                    />
                            }
                            <input
                                type={(displayPass) ? "text" : "password"}
                                name="password"
                                id="password"
                                ref={pass}
                                placeholder="รหัสผ่าน"
                                autoComplete="current-password"
                                className={`${(emptyPass) ? 'border-2 border-red-500' : 'border border-gray-400'} bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 focus:outline-none`} />
                        </div>
                        <div className="flex items-center justify-end">
                            <Link href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">ลืมรหัสผ่าน?</Link>
                        </div>
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">เข้าสู่ระบบ</button>

                        <div className='mt-3 flex items-center gap-5'>
                            <hr className='border-slate-500 w-full' />
                            <div className='text-slate-500'>or</div>
                            <hr className='border-slate-500 w-full' />
                        </div>

                        <div className="mt-3">
                            <div onClick={signInGoogle} className='border border-slate-500 rounded-lg flex flex-row gap-4 items-center justify-center py-3 w-full cursor-pointer text-gray-500 hover:text-blue-500 hover:border-blue-500'>
                                <img className='w-5 h-5' src="/google.png" />
                                <span className='text-sm'>
                                    เข้าสู่ระบบด้วยบัญชี Google
                                </span>
                            </div>
                        </div>

                        <p className="text-sm font-light text-gray-900 dark:text-gray-400">
                            ต้องการสร้างบัญชีผู้ใช้ ? <span onClick={() => setDisplaySignUp(!displaySignUp)} className="font-medium cursor-pointer text-gray-900 hover:underline">สร้างบัญชีผู้ใช้</span>
                        </p>
                    </form>
                </div>
            </div>

            {/* <!-- Sign up modal --> */}
            <div id="default-modal" aria-hidden="true"
                // onClick={closeOnOverlayClick}
                className={`${(displaySignUp) ? "fixed" : "hidden"} z-10 bg-gray-800 bg-opacity-60 top-0 left-0 right-0 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full`}>
                <div
                    id='wrap'
                    style={{ transform: 'translate(-50%, -50%)' }}
                    className="z-20 top-[50%] left-[50%] absolute w-full max-w-lg  bg-white border-white rounded-lg">
                    {/* <!-- Modal content --> */}
                    <div className="relative z-30 rounded-lg shadow">
                        {/* <!-- Modal body --> */}
                        <SignUp closeModal={closeModal} />
                    </div>
                </div>
            </div>
        </section>

    );
}

export default Page