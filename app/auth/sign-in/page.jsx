"use client"
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import Link from 'next/link';
import { SignUp } from '@/app/components';
import { Progress } from "@nextui-org/react";
import { signToken, decodeToken } from '@/app/components/serverAction/TokenAction';
import toast, { Toaster } from 'react-hot-toast';

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') ?? "/"
    const { data: session } = useSession();

    // ======================
    // Redirect if has session
    // ======================
    useEffect(() => {
        if (session) {
            toast.custom(() => (
                <div className='px-3 py-2 rounded-md bg-blue-400 text-white text-xs shadow-md'>
                    Authenticate as {session.user.email}
                </div>
            ));
            router.push(callbackUrl);
            router.refresh()
        }
    }, [session]);

    const email = useRef(null)
    const pass = useRef(null)
    const [isProcress, setIsProcress] = useState(false)
    const [displaySignUp, setDisplaySignUp] = useState(false)
    const [error, setError] = useState(false)
    const [emptyEmail, setEmptyEmail] = useState(false)
    const [emptyPass, setEmptyPass] = useState(false)
    const [displayPass, setDisplayPass] = useState(false)

    /******************
    * Progess state
    ******************/
    const [value, setValue] = useState(0);
    let timeoutError;
    let progressInterval

    // =================
    // Auto fill email
    // =================
    useEffect(() => {
        const getToken = async () => {
            if (localStorage.getItem("token")) {
                const token = localStorage.getItem("token");
                const value = await decodeToken(token);
                email.current.value = value;
            }
        };

        getToken();
    }, [])

    // ===========================
    // Close modal sign up
    // ===========================
    const closeModal = useCallback(() => {
        setDisplaySignUp(false);
    }, [])

    // ===========================
    // Handler progress interval
    // ===========================
    useEffect(() => {
        setValue(0)
        progressInterval = setInterval(() => {
            setValue((v) => (v >= 100 ? 0 : v + 4.2));
        }, 200);

        return () => clearInterval(progressInterval);
    }, [error]);

    // ======================
    // Credentails sign in
    // ======================
    const signInCredentials = useCallback(async (event) => {
        setIsProcress(true)
        setEmptyEmail(false)
        setEmptyPass(false)
        event.preventDefault()
        const eValue = email.current.value
        const pValue = pass.current.value

        setEmptyEmail(empty => {
            if (eValue === "") {
                return true;
            } else {
                return false;
            }
        });

        setEmptyPass(empty => {
            if (pValue === "") {
                return true;
            } else {
                return false;
            }
        });

        if (!eValue || !pValue) {
            setError("กรุณากรอกข้อมูลผู้ใช้ให้ครบ")
            setIsProcress(false)
            return
        }
        const result = await signIn("credentials", {
            email: eValue,
            password: pValue,
            redirect: false,
            callbackUrl: callbackUrl,
        })

        if (!result.ok) {
            setIsProcress(false)
            setError(result.error)
        } else {
            localStorage.setItem("token", await signToken({ email: eValue }))
        }
    }, [
        email,
        pass,
        callbackUrl,
    ])

    // ======================
    // Google sign in
    // ======================
    const signInGoogle = useCallback(async () => {
        await signIn("google", undefined, {
            redirect: true,
            callbackUrl: callbackUrl,
            prompt: 'select_account',
        })
    }, [callbackUrl])

    // ======================
    // If error then Got cha!!
    // ======================
    useEffect(() => {
        if (searchParams.get('error') && !session) {
            setError(searchParams.get('error'))
        }
    }, [])

    // ======================
    // Handler error timing
    // ======================
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
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [error]);

    return (
        <section className="absolute w-full p-5 max-h-full max-w-full h-[calc(100%)]">
            <Toaster />
            <div
                style={{ transform: 'translate(-50%, -50%)' }}
                className='absolute w-full max-h-full max-w-7xl h-[calc(100%)] top-[50%] left-[50%] flex flex-col items-center gap-5 p-4'>
                <div className='pt-8 pb-3 w-full max-h-full flex flex-col items-center justify-center'>
                    <div className='w-fit'>
                        <h1 className="font-bold text-4xl sm:text-5xl leading-tight tracking-tight text-blue-500 text-center">
                            KKU IT
                        </h1>
                        <h2 className='mt-2'>
                            Discover Your Experience with KKU IT
                        </h2>
                    </div>
                </div>
                <div className="max-h-full w-full sm:w-1/2 px-10 flex justify-start items-center">
                    <form className="w-full space-y-4" onSubmit={signInCredentials}>
                        {(error) ?
                            <div className='relative'>
                                <div className={'flex gap-3 items-center bg-red-500 text-white px-3 py-3'}>
                                    <AiOutlineCloseCircle onClick={() => {
                                        setError(false)
                                        clearTimeout(timeoutError)
                                        clearInterval(progressInterval)
                                    }} className='w-7 h-7 cursor-pointer' />
                                    {error}
                                </div>
                                <Progress
                                    size="md"
                                    aria-label="Loading..."
                                    value={value}
                                    color="default"
                                    className="bg-white w-full absolute bottom-0 h-[2px] rounded-none"
                                />
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
                            <Link href="#" className="text-sm font-medium text-primary-600 hover:underline">ลืมรหัสผ่าน?</Link>
                        </div>
                        <button
                            disabled={isProcress}
                            type="submit"
                            className={`${isProcress ? "opacity-70" : null} bg-blue-600 hover:bg-blue-700 w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>
                            เข้าสู่ระบบ
                        </button>

                        <div className='mt-3 flex items-center gap-5'>
                            <hr className='border-slate-500 w-full' />
                            <div className='text-slate-500'>or</div>
                            <hr className='border-slate-500 w-full' />
                        </div>

                        <div className="mt-3">
                            <div onClick={signInGoogle} className='border border-slate-500 rounded-lg flex flex-row gap-4 items-center justify-center py-3 w-full cursor-pointer text-gray-500 hover:text-blue-500 hover:border-blue-500'>
                                <img className='w-5 h-auto' src="/LogoKKU.png" />
                                <span className='text-sm'>
                                    เข้าสู่ระบบด้วยบัญชี KKU Mail
                                </span>
                            </div>
                        </div>

                        {/* <p className="text-sm font-light text-gray-900">
                            ต้องการสร้างบัญชีผู้ใช้ ? <span onClick={() => setDisplaySignUp(!displaySignUp)} className="font-medium cursor-pointer text-gray-900 hover:underline">สร้างบัญชีผู้ใช้</span>
                        </p> */}
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
                    className="z-20 top-[50%] left-[50%] absolute w-full max-w-lg bg-white border-white rounded-lg">
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