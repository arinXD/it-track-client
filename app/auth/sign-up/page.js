"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import Link from 'next/link';


const page = () => {
    let timeoutError;
    const [error, setError] = useState(false)
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [emptyPass, setEmptyPass] = useState(false)
    const [displayPass, setDisplayPass] = useState(false)
    return (

        <section className="">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-8">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create your account
                        </h1>
                        <form className="space-y-3 md:space-y-4" onSubmit={() => { }}>
                            {(error) ?
                                <div className={'flex gap-3 items-center bg-red-500 text-white px-3 py-3'}>
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
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="username"
                                    className={`${(emptyEmail) ? 'border-2 border-red-500' : 'border border-gray-600'} bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none`}
                                    placeholder="name@email.com" />
                            </div>
                            <div className='relative select-none'>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                {
                                    (displayPass) ?
                                        <BsEyeSlashFill
                                            onClick={() => setDisplayPass(false)}
                                            className='w-5 h-5 text-gray-400 absolute top-[57%] right-[5%] translate-[-50%] cursor-pointer'
                                        />
                                        :
                                        <BsEyeFill
                                            onClick={() => setDisplayPass(true)}
                                            className='w-5 h-5 text-gray-400 absolute top-[57%] right-[5%] translate-[-50%] cursor-pointer'
                                        />
                                }
                                <input
                                    type={(displayPass) ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className={`${(emptyPass) ? 'border-2 border-red-500' : 'border border-gray-600'} bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none`} />
                            </div>
                            <div className='relative select-none'>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                {
                                    (displayPass) ?
                                        <BsEyeSlashFill
                                            onClick={() => setDisplayPass(false)}
                                            className='w-5 h-5 text-gray-400 absolute top-[57%] right-[5%] translate-[-50%] cursor-pointer'
                                        />
                                        :
                                        <BsEyeFill
                                            onClick={() => setDisplayPass(true)}
                                            className='w-5 h-5 text-gray-400 absolute top-[57%] right-[5%] translate-[-50%] cursor-pointer'
                                        />
                                }
                                <input
                                    type={(displayPass) ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className={`${(emptyPass) ? 'border-2 border-red-500' : 'border border-gray-600'} bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none`} />
                            </div>
                            <button type="submit" style={{ marginTop: "2em" }} className="mt-5 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>

                            {/* <div className='mt-3 flex items-center gap-5'>
                                <hr className='border-slate-500 w-full' />
                                <div className='text-slate-500'>or</div>
                                <hr className='border-slate-500 w-full' />
                            </div>

                            <div className="mt-3">
                                <div onClick={() => { }} className='border border-slate-500 rounded-lg flex flex-row gap-2 items-center justify-center py-3 w-full cursor-pointer text-gray-500 hover:bg-gray-700 hover:text-white'>
                                    <img className='w-5 h-5' src="/google.png" />
                                    <span className='text-sm'>
                                        Sign up with Google
                                    </span>
                                </div>
                            </div> */}

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have account? <Link href="/auth/sign-in" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default page