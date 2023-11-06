"use client"
import React, { useRef } from 'react'
import { useSession, signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react'

const page = () => {
    const router = useRouter()
    let timeoutError;
    const { data: session } = useSession();
    const [error, setError] = useState(false)

    const signInCredentials = async (event) => {
        event.preventDefault()
        const username = email.value
        const pass = password.value
        if (!(username && pass)) {
            setError("กรอกข้อมูลผู้ใช้ให้ครบ")
            return
        }
        const result = await signIn("credentials", {
            username,
            password: pass,
            redirect: false,
        })
        console.log(result);
    }
    const signInGoogle = async () => {
        const result = await signIn("google", {
            redirect: true,
            callbackUrl: "/",
        })
    }
    useEffect(() => {
        if (session && session.user) {
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
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-8">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Welcome back
                        </h1>
                        <form className="space-y-3 md:space-y-6" onSubmit={signInCredentials}>
                            <div className={!(error) ? "hidden" : 'flex gap-3 items-center bg-red-500 text-white px-3 py-3'}>
                                <AiOutlineCloseCircle onClick={() => {
                                    setError(false)
                                    clearTimeout(timeoutError)
                                }} className='w-7 h-7 cursor-pointer' />
                                {error}
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>

                            <div className='mt-3 flex items-center gap-5'>
                                <hr className='border-slate-500 w-full' />
                                <div className='text-slate-500'>or</div>
                                <hr className='border-slate-500 w-full' />
                            </div>

                            <div className="mt-3">
                                <div onClick={signInGoogle} className='border border-slate-500 rounded-lg flex flex-row gap-2 items-center justify-center py-3 w-full cursor-pointer text-gray-500 hover:bg-gray-700 hover:text-white'>
                                    <img className='w-5 h-5' src="/google.png" />
                                    <span className='text-sm'>
                                        Sign in with Google
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Create account</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default page
// <section className="bg-gray-50 dark:bg-gray-900">
//     <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//         <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
//             <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
//             Flowbite
//         </a>
//         <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//             <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//                 <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//                     Sign in to your account
//                 </h1>
//                 <htmlForm className="space-y-4 md:space-y-6" action="#">
//                     <div>
//                         <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//                         <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
//                     </div>
//                     <div>
//                         <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
//                         <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
//                     </div>
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-start">
//                             <div className="flex items-center h-5">
//                                 <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
//                             </div>
//                             <div className="ml-3 text-sm">
//                                 <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
//                             </div>
//                         </div>
//                         <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">htmlForgot password?</a>
//                     </div>
//                     <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
//                     <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//                         Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
//                     </p>
//                 </htmlForm>
//             </div>
//         </div>
//     </div>
// </section>