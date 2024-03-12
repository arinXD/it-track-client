"use client"
import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from "@nextui-org/react";

const AuthProvider = ({ session, children }) => {
    return (
        <SessionProvider session={session}>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </SessionProvider>
    )
}

export default AuthProvider;