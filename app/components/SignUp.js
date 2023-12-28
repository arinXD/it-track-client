"use client";
import React from 'react'
import { AiOutlineCloseCircle, AiOutlineClose, AiFillQuestionCircle } from 'react-icons/ai';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { NextUIProvider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { hostname } from '@/app/api/hostname'
import { signToken } from './serverAction/TokenAction';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { createUser } from './serverAction/signUpAction';

export default function SignUp(props) {
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 6,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: strength.color,
        },
    }));

    const router = useRouter()
    let timeoutError;
    const eyeClass = 'w-5 h-5 text-gray-400 cursor-pointer'
    const [isSubmit, setIsSubmit] = useState(false)

    const [error, setError] = useState(false)
    const [displayPass, setDisplayPass] = useState(false)
    const [displayCon, setDisplayCon] = useState(false)

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [fValid, setFnameValid] = useState(null);
    const [lvalid, setLnameValid] = useState(null);
    const [emailvalid, setemailValid] = useState(null);
    const [passwordvalid, setPasswordValid] = useState(null);
    const [confirmPassvalid, setConfirmPassValid] = useState(null);

    async function checkEmpty(value, setValue) {
        if (value === "") setValue(true)
        else setValue(false)
    }

    // ======================
    // Call sign up
    // ======================
    async function onCreate(event) {
        event.preventDefault()
        // // test
        // router.push(`/email-verify/email/${email}`);
        // router.refresh()
        // return
        setIsSubmit(true)
        checkEmpty(fname, setFnameValid)
        checkEmpty(lname, setLnameValid)
        checkEmpty(email, setemailValid)
        checkEmpty(password, setPasswordValid)
        checkEmpty(confirmPass, setConfirmPassValid)

        if (!(fname
            && lname
            && email
            && password
            && confirmPass)) {
            setError("กรอกข้อมูลผู้ใช้ให้ครบ")
            setIsSubmit(false)
            return
        }
        // console.log(strength);
        if (strength.value < 50) {
            setError("ความยากของรหัสผ่านต้อง ปานกลาง ขึ้นไป")
            setIsSubmit(false)
            return
        }
        if (password !== confirmPass) {
            setPasswordValid(true)
            setConfirmPassValid(true)
            setError("รหัสผ่านไม่ตรงกัน")
            setIsSubmit(false)
            return
        }
        const data = {
            fname,
            lname,
            email,
            password,
        }
        const result = await createUser(data);
        if (result.ok) {
            localStorage.setItem("token", await signToken({ email: data.email }))
            router.push('/email-verify/email');
        } else {
            setIsSubmit(false)
            if (result.field == "email") setemailValid(true)
            setError(result.message)
        }

    }

    // ======================
    // Error timing
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
        };
    }, [error]);

    // ======================
    // Cleat error
    // ======================
    async function clearError() {
        setFnameValid(false)
        setLnameValid(false)
        setemailValid(false)
        setPasswordValid(false)
        setConfirmPassValid(false)
    }

    // ======================
    // Password strength
    // ======================
    const strengthColorList = {
        red: "#ef4444",
        yellow: "#facc15",
        green: "#15803d",
    }
    const getPasswordStrength = (password) => {
        let strength = 0;

        if (password.length >= 8) {
            strength++;
        }
        if (/[0-9]/.test(password)) {
            strength++;
        }
        if (/[A-Z]/.test(password)) {
            strength++;
        }
        if (/[a-zก-๛!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            strength++;
        }

        return strength;
    };
    const [strength, setStrength] = useState({
        text: 'Password strength',
        color: "",
        value: 0
    });

    useEffect(() => {
        const strengthValue = getPasswordStrength(password);

        let text, color;
        if (strengthValue === 1) {
            text = 'ง่าย';
            color = strengthColorList.red;
        } else if (strengthValue === 2) {
            text = 'ปานกลาง';
            color = strengthColorList.yellow;
        } else if (strengthValue === 3) {
            text = 'ยาก';
            color = strengthColorList.green;
        } else if (strengthValue >= 4) {
            text = 'ยากมาก';
            color = strengthColorList.green;
        } else {
            text = 'ความยากของรหัสผ่าน';
            color = '';
        }

        setStrength({
            text: text,
            color,
            value: (strengthValue / 4) * 100,
        });
        // console.log(strength);
    }, [password])
    return (
        <NextUIProvider>
            <div className='p-4 sm:p-8 relative'>
                <div className='rounded-full cursor-pointer absolute top-[4.5%] right-[4.5%] p-1 hover:bg-opacity-50 hover:bg-slate-100'>
                    <AiOutlineClose className='w-6 h-6 text-blue-600 relative z-50' onClick={() => {
                        clearError()
                        props.closeModal()
                    }} />
                </div>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    สร้างบัญชีผู้ใช้
                </h1>
                <div className="mt-5 space-y-4 md:space-y-6">
                    <form className="space-y-3 md:space-y-4" onSubmit={onCreate}>
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
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <div className='w-full'>
                                <Input
                                    value={fname}
                                    onValueChange={setFname}
                                    isInvalid={fValid}
                                    label="ชื่อจริง"
                                    size="sm"
                                    type="text"
                                    autoComplete="first name"
                                />
                            </div>
                            <div className='w-full'>
                                <Input
                                    value={lname}
                                    onValueChange={setLname}
                                    isInvalid={lvalid}
                                    label="นามสกุล"
                                    size="sm"
                                    type="text"
                                    autoComplete="last name" />
                            </div>
                        </div>
                        <div>
                            <Input
                                value={email}
                                onValueChange={setemail}
                                isInvalid={emailvalid}
                                label="อีเมล"
                                size="sm"
                                type="email"
                                autoComplete="username"
                            // placeholder="you@example.com"
                            />
                        </div>
                        <div className='relative select-none'>
                            <Input
                                value={password}
                                onValueChange={setPassword}
                                isInvalid={passwordvalid}
                                label="รหัสผ่าน"
                                size="sm"
                                type={(displayPass) ? "text" : "password"}
                                autoComplete="current-password"
                                endContent={
                                    <div className="h-full flex items-center">
                                        {
                                            (displayPass) ?
                                                <BsEyeSlashFill
                                                    onClick={() => setDisplayPass(!displayPass)}
                                                    className={eyeClass}
                                                />
                                                :
                                                <BsEyeFill
                                                    onClick={() => setDisplayPass(!displayPass)}
                                                    className={eyeClass}
                                                />
                                        }
                                    </div>
                                } />
                        </div>
                        {
                            strength.value > 0 &&
                            <div className='px-1'>
                                <p className='mb-2 text-sm text-gray-600 text-end'>
                                    ความยากของรหัสผ่านต้อง <strong>ปานกลาง</strong> ขึ้นไป
                                </p>
                                <BorderLinearProgress variant="determinate"
                                    value={strength.value} />
                                <p className="text-sm mt-1 text-gray-600 text-end">
                                    ระดับ: <strong>{strength.text}</strong>
                                </p>
                            </div>
                        }

                        <div className='relative select-none'>
                            <Input
                                value={confirmPass}
                                onValueChange={setConfirmPass}
                                isInvalid={confirmPassvalid}
                                label="ยืนยันรหัสผ่าน"
                                size="sm"
                                type={(displayCon) ? "text" : "password"}
                                autoComplete="current-password"
                                endContent={
                                    <div className="h-full flex items-center">
                                        {
                                            (displayCon) ?
                                                <BsEyeSlashFill
                                                    onClick={() => setDisplayCon(!displayCon)}
                                                    className={eyeClass}
                                                />
                                                :
                                                <BsEyeFill
                                                    onClick={() => setDisplayCon(!displayCon)}
                                                    className={eyeClass}
                                                />
                                        }
                                    </div>
                                } />
                        </div>
                        <div>
                            <p className='text-xs'>By clicking Create account, you agree to our
                                <Link href={"#"} className='text-blue-700'> Terms </Link> ,
                                <Link href={"#"} className='text-blue-700'> Privacy Policy </Link> and
                                <Link href={"#"} className='text-blue-700'> Cookies Policy </Link>
                                You may receive SMS notifications from us and can opt out at any time.</p>
                        </div>
                        <div>
                            <button
                                disabled={isSubmit}
                                type="submit"
                                className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center">
                                {
                                    isSubmit ?
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                        />
                                        :
                                        "สร้างบัญชีผู้ใช้"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </NextUIProvider>
    )
}