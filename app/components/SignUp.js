"use client";
import React from 'react'
import { AiOutlineCloseCircle, AiOutlineClose, AiFillQuestionCircle } from 'react-icons/ai';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { useEffect, useState } from 'react'
import { signIn } from "next-auth/react"
import Link from 'next/link';
import { NextUIProvider } from "@nextui-org/react";
import { Input, Card, CardBody } from "@nextui-org/react";
import axios from 'axios';

export default function SignUp(props) {

    let timeoutError;
    const eyeClass = 'w-5 h-5 text-gray-400 cursor-pointer'
    const [error, setError] = useState(false)
    const [displayPass, setDisplayPass] = useState(false)
    const [displayCon, setDisplayCon] = useState(false)
    const [displayTips, setDisplayTips] = useState(false)

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [stuId, setStuId] = useState("");
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [fValid, setFnameValid] = useState(null);
    const [lvalid, setLnameValid] = useState(null);
    const [stuIdvalid, setStuIdValid] = useState(null);
    const [emailvalid, setemailValid] = useState(null);
    const [passwordvalid, setPasswordValid] = useState(null);
    const [confirmPassvalid, setConfirmPassValid] = useState(null);

    async function checkEmpty(value, setValue) {
        if (value === "") setValue(true)
        else setValue(false)
    }

    async function onCreate(event) {
        event.preventDefault()

        checkEmpty(fname, setFnameValid)
        checkEmpty(lname, setLnameValid)
        checkEmpty(stuId, setStuIdValid)
        checkEmpty(email, setemailValid)
        checkEmpty(password, setPasswordValid)
        checkEmpty(confirmPass, setConfirmPassValid)

        if (!(fname
            && lname
            && stuId
            && email
            && password
            && confirmPass)) {
            // setError("กรอกข้อมูลผู้ใช้ให้ครบ")
            return
        }
        if (password !== confirmPass) {
            setPasswordValid(true)
            setConfirmPassValid(true)
            // setError("รหัสผ่านไม่ตรงกัน")
            return
        }
        const data = {
            stu_id: stuId,
            fname,
            lname,
            stuId,
            email,
            password,
        }
        const options = {
            url: 'http://localhost:4000/api/auth/student/signup',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: data
        };

        axios(options)
            .then(async (res) => {
                if(res.status==201){
                    await signIn("credentials", {
                        email: email,
                        password: password,
                        redirect: true,
                        callbackUrl: "/",
                    })
                }
                return
            }).catch(err => {
                const msg = err.response.data.message
                const field = err.response.data.errorField
                if (field == "email") setemailValid(true)
                if (field == "stu_id") setStuIdValid(true)
                console.log();
                console.log(err);
                console.log(error);
                setError(msg)
                return
            })
    }

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

    async function clearError(params) {
        setFnameValid(false)
        setLnameValid(false)
        setStuIdValid(false)
        setemailValid(false)
        setPasswordValid(false)
        setConfirmPassValid(false)
    }
    return (
        <NextUIProvider>
            <div className='sm:p-8 relative'>
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
                        <div className='flex flex-row gap-4'>
                            <div className='w-full'>
                                <Input
                                    value={fname}
                                    onValueChange={setFname}
                                    isInvalid={fValid}
                                    label="ชื่อจริง"
                                    size="md"
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
                                    size="md"
                                    type="text"
                                    autoComplete="last name" />
                            </div>
                        </div>
                        <div className='relative'>
                            <div className='mb-1 flex items-center'>
                                <label className='text-sm text-gray-600'>รหัสประจำตัวนักศึกษามหาวิทยาลัยขอนแก่น</label>
                                <div className='inline-block ms-1'>
                                    <AiFillQuestionCircle
                                        onMouseOver={() => setDisplayTips(true)}
                                        onMouseOut={() => setDisplayTips(false)}
                                        className='cursor-pointer' />
                                    {displayTips ?
                                        <div className='absolute z-50'>
                                            <Card>
                                                <CardBody>
                                                    <p className='te text-default-foreground text-sm'>ตัวอย่าง 643020423-0</p>
                                                </CardBody>
                                            </Card>
                                        </div>
                                        :
                                        null
                                    }
                                    <div>

                                    </div>
                                </div>
                            </div>
                            <Input
                                value={stuId}
                                onValueChange={setStuId}
                                isInvalid={stuIdvalid}
                                label="รหัสประจำตัวนักศึกษา (มีขีด)"
                                size="md"
                                type="text"
                                autoComplete="student id"
                                pattern='^[0-9]{9}-[0-9]{1}$' />
                        </div>
                        <div>
                            <Input
                                value={email}
                                onValueChange={setemail}
                                isInvalid={emailvalid}
                                label="อีเมล"
                                size="md"
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
                                size="md"
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
                        <div className='relative select-none'>
                            <Input
                                value={confirmPass}
                                onValueChange={setConfirmPass}
                                isInvalid={confirmPassvalid}
                                label="ยืนยันรหัสผ่าน"
                                size="md"
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
                            <button type="submit" className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">สร้างบัญชีผู้ใช้</button>
                        </div>
                    </form>
                </div>
            </div>
        </NextUIProvider>
    )
}