import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import './globals.css'
import { AuthProvider } from './components'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'IT Track',
    description: 'คัดเลือกแทรคของนักศึกษาวิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ',
    icons: {
        icon: '/logo.png',
      },
}
export default async function RootLayout({ children }) {
    const session = await getServerSession()
    return (
        <html>
            <head>
                <link rel="icon" href="/logo.png" sizes="any" />
            </head>
            <body
                className={inter.className}
                suppressHydrationWarning={true}
            >
                <main>
                    <AuthProvider session={session}>
                        {children}
                    </AuthProvider>
                </main>
            </body>
        </html>
    )
}
