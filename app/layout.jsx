import './globals.css'
import { AuthProvider } from './components'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

export const metadata = {
    title: 'KKU IT',
    description: 'คัดเลือกแทรคของนักศึกษาวิทยาลัยการคอมพิวเตอร์ หลักสูตรเทคโนโลยีสารสนเทศ',
}

export default function RootLayout({ children }) {
    return (
        <html>
            <body suppressHydrationWarning={true} >
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
