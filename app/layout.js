import Image from 'next/image'
import './globals.css'
import AuthProvider from './components/Authprovider'
export default function RootLayout({
    children
}) {
    return (
        <html lang="en" data-theme="winter">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Personal blog website" />
                <meta name="keywords" content="blog,arin,arin application, arin app" />
                <link rel="icon" href="/logo.png" type="image/x-icon" />
                <title>KKU IT Track</title>
            </head>
            <body suppressHydrationWarning={true}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
