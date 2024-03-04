"use client"
import './globals.css'
import AuthProvider from './components/Authprovider'
import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({ children }) {
    return (
        <html>
            <body suppressHydrationWarning={true}>
                <main>
                    <NextUIProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </NextUIProvider>
                </main>
            </body>
        </html>
    )
}
