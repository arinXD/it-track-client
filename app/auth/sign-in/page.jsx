"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'
import { Toaster } from 'react-hot-toast';
import { thinInputClass } from '@/src/util/ComponentClass';
import { Input } from '@nextui-org/react';
import { message } from 'antd';

const Page = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') ?? "/"
    const [isProcress, setIsProcress] = useState(false);
    const [formData, setFormData] = useState({});

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // ======================
    // Credentails sign in
    // ======================
    const signInCredentials = async (event) => {
        setIsProcress(true)
        event.preventDefault()

        if (!formData.email || !formData.password) {
            message.warning("กรุณากรอกข้อมูลผู้ใช้ให้ครบ")
            setIsProcress(false)
            return
        }
        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: true,
                callbackUrl: callbackUrl,
            })
            if (result.error) {
                message.warning(result.error)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsProcress(false)
        }
    }

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
            message.error(searchParams.get('error'))
        }
    }, [])

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
                    <form className="w-full space-y-4" onSubmit={signInCredentials}>
                        <div className='space-y-9'>
                            <Input
                                labelPlacement="outside"
                                classNames={thinInputClass}
                                label="อีเมล"
                                placeholder="กรอกอีเมล"
                                value={formData.email || ""}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                            <Input
                                labelPlacement="outside"
                                classNames={thinInputClass}
                                label="รหัสผ่าน"
                                placeholder="กรอกรหัสผ่าน"
                                type="password"
                                value={formData.password || ""}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                            />
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

                        <div className="mt-0">
                            <div onClick={signInGoogle} className='border border-slate-500 rounded-lg flex flex-row gap-3 items-center justify-center p-3 w-full cursor-pointer text-gray-500 hover:text-blue-500 hover:border-blue-500'>
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