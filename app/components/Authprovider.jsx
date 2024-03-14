"use client"
import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from "@nextui-org/react";

const AuthProvider = ({ children }) => {
    return (
        <SessionProvider>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </SessionProvider>
    )
}

export default AuthProvider;