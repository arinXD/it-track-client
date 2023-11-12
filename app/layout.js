import Image from 'next/image'
import './globals.css'
import AuthProvider from './components/Authprovider'
import { Navbar, Sidebar } from './components'
export default function RootLayout({
    children
}) {
    return (
        <html data-theme="winter">
            <body suppressHydrationWarning={true}>
                <main>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </main>
            </body>
        </html>
    )
}
