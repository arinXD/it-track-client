"use client"
import './globals.css'
import { AuthProvider } from './components'
import localFont from 'next/font/local'
 
// export const metadata = {
//     title: 'IT Track',
//     description: 'คัดเลือกแทรคของนักศึกษาวิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ',
// }

const prompt = localFont({ src: '../public/fonts/Prompt-Regular.woff2' })

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <link rel="icon" href="/logo.png" sizes="any" />
            </head>
            <body
                className={prompt.className}
                suppressHydrationWarning={true}
            >
                <main>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </main>
            </body>
        </html>
    )
}
