"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'
import { Toaster } from 'react-hot-toast';

const Page = () => {
    // const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') ?? "/"
    const [error, setError] = useState(false)

    /******************
    * Progess state
    ******************/
    const [value, setValue] = useState(0);
    let timeoutError;
    let progressInterval

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
        if (searchParams.get('error')) {
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
                className='absolute w-full max-h-full max-w-7xl h-[calc(100%)] top-[50%] left-[50%] flex flex-col justify-center items-center gap-4 p-4'>
                <div className='py-3 w-full max-h-full flex flex-col items-center justify-center'>
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
                    <form className="w-full space-y-4">
                        <div className="mt-0">
                            <div onClick={signInGoogle} className='border border-slate-500 rounded-[5px] flex flex-row gap-4 items-center justify-center p-3 w-full cursor-pointer text-gray-500 hover:text-blue-500 hover:border-blue-500'>
                                <img className='w-6 h-auto' src="/google.png" />
                                <span className='text-sm'>
                                    เข้าสู่ระบบด้วยบัญชี Google หรือ KKU Mail
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Page