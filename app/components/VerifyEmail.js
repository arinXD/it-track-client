"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { hostname } from '@/app/api/hostname'
import { useRouter } from 'next/navigation'

const VerifyEmail = ({ decoded }) => {
    const Router = useRouter()
    const { email, uniqueString } = decoded
    const [isSending, setIsSending] = useState(false)
    
    const sendVerification = async () => {
        setIsSending(true)
        // http://localhost:4000/api/auth/student/send-verification
        const axiosOption = {
            url: `${hostname}/api/auth/student/send-verification`,
            method: 'POST',
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
                email,
                uniqueString
            },
        }
        axios(axiosOption)
            .then(async res => {
                // console.log(res.data);
            }).catch(err => {
                const data = err.response.data
                console.log(data);
                if(data.verified){
                    Router.push("/")
                    Router.refresh()
                }
            }).finally(() => {
                setIsSending(false)
            })
    }
    return (
        <>
            {
                // object length more than 0 
                Object.keys(decoded).length ?
                    <div>
                        <p>
                            Thank you for sign up. Please check your email ({email}) inbox to verification.
                            <button
                                disabled={isSending}
                                onClick={() => sendVerification()}
                                className='btn btn-secondary'>
                                {
                                    isSending ?
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            send verification again.
                                        </>
                                        :
                                        <>
                                            send verification again.
                                        </>
                                }
                            </button>
                        </p>
                    </div>
                    :
                    <p>Please sign up or sign in</p>}
        </>
    )
}

export default VerifyEmail