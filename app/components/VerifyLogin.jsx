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
                setTimeout(async () => {
                    await signIn("verifiedEmail", {
                        email,
                        redirect: true,
                        callbackUrl: "/",
                    })
                }, 3000)
            }
        }
        setVerifyData()
    }, [])

    return (
        <>
        </>
    )
}

export default VerifyLogin