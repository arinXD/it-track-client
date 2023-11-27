"use client"
import { useSession, signIn } from "next-auth/react"
import SignInButton from "./SignInButton"
import React, { useEffect, useState } from 'react'


const VerifyLogin = ({ verifyData }) => {

    const { data: session, update } = useSession();
    const [localEmail, setLocalEmail] = useState()

    const testLog = () => {
        console.log(session);
    }
    const updateSession = async () => {
        await update({
            ...session,
            user: {
                ...session?.user,
                test: "test session"
            }
        })
            .then(result => {
                console.log("result in update: ", result);
            }).catch(err => {
                console.log("error on update: ", err);
            })
    }
    const getLocalStorage = async () => {
        console.log(localEmail);
    }

    useEffect(() => {
        if (localStorage.getItem("email")) {
            setLocalEmail(localStorage.getItem("email"))
        }
    }, [])

    useEffect(() => {
        const setVerifyData = async () => {
            if (verifyData.userData) {
                const { id, stu_id, role, email, image, fname, lname, verification } = verifyData.userData
                console.log("verify child", verifyData.userData);
                await signIn("verifiedEmail", {
                    id, email, stu_id, role, image, fname, lname, verification,
                    redirect: true,
                    callbackUrl: "/",
                })
            }
            else {
                console.log("error in verify email");
                console.log(session);
            }
        }
        setVerifyData()
    }, [])

    useEffect(() => {
        console.log(session);
    }, [session])

    return (
        <div>
            {/* <SignInButton /> */}
            {/* <div className='my-3 flex gap-4'>
                <button onClick={() => testLog()} className='btn btn-primary'>session</button>
                <button onClick={() => updateSession()} className='btn btn-primary'>update</button>
                <button onClick={() => getLocalStorage()} className='btn btn-primary'>get local storage</button>
            </div> */}
        </div>
    )
}

export default VerifyLogin