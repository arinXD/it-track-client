"use client"
import './globals.css'
import { AuthProvider } from './components'
import localFont from 'next/font/local'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

// export const metadata = {
//     title: 'IT Track',
//     description: 'คัดเลือกแทรคของนักศึกษาวิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ',
// }

const prompt = localFont({ src: '../public/fonts/Prompt-Regular.woff2' })

export default function RootLayout({ children }) {
    return (
        <html>
            <body
                // className={prompt.className}
                suppressHydrationWarning={true}
            >
                <Theme>
                    <main>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </main>
                </Theme>
            </body>
        </html>
    )
}
