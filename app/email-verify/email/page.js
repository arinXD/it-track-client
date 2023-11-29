"use server"
import React from 'react'
import { cookies } from 'next/headers'
import { jwtDecode } from "jwt-decode";
import { VerifyEmail } from '@/app/components';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation'

const EmailVerifyPage = async () => {
    const cookieStore = cookies()
    const cookie = cookieStore.get('token')
    const session = await getServerSession()
    if(session){
        redirect('/')
    }

    let decoded
    if(cookie){
        decoded = jwtDecode(cookie.value);
    }else{
        decoded = {}
    }

    // console.log(cookie);
    // console.log(decoded);
    return (
        <>
            <div className='container my-4'>
                <h1>Welcome to our page</h1>
                <VerifyEmail decoded={decoded}/>
            </div>
        </>
    )
}

export default EmailVerifyPage