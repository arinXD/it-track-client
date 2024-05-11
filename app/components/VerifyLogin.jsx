"use client"
import { signIn } from "next-auth/react"
import { useEffect } from 'react'
import Swal from 'sweetalert2'

const VerifyLogin = ({ verifyData }) => {

    useEffect(() => {
        if (verifyData.ok) {
            Swal.fire({
                title: "Verifired Email",
                text: "Your emali has verify.",
                icon: "success",
                showConfirmButton: false,
            });
        }
    }, [])

    useEffect(() => {
        const setVerifyData = async () => {
            if (verifyData.userData) {
                const { email } = verifyData.userData
                console.log("verify child", verifyData.userData);
                setTimeout(async () => {
                    await signIn("verifiedEmail", {
                        email,
                        redirect: true,
                        callbackUrl: "/",
                    })
                }, 3000)
            }
            else {
                console.log("error in verify email");
                console.log(session);
            }
        }
        setVerifyData()
    }, [])

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