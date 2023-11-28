"use server"
import React from 'react'
import axios from 'axios'
import { VerifyLogin } from '@/app/components'
import { hostname } from '@/app/api/hostname'

const VerifyingPage = async ({ params }) => {
    const { stu_id, verify_string } = params
    const verifyingEmail = async ({ stu_id, verify_string }) => {
        const options = {
            url: `${hostname}/api/auth/student/verify/email/${stu_id}/${verify_string}`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
        };
        try {
            const result = await axios(options)
            return result.data
        }
        catch (err) {
            return err.response.data
        }
    }
    const verifyData = await verifyingEmail({ stu_id, verify_string })
    
    return (
        <>
            <div className='container mx-auto my-24 text-center'>
                <div>
                    <p className='font-bold text-3xl mb-4'>{verifyData.message}</p>
                </div>
                <VerifyLogin verifyData={verifyData} />
            </div>
        </>
    )
}

export default VerifyingPage