import { AuthProvider, Navbar } from "@/app/components"
export default function AboutLayout({
    children
}) {
    return (

        <>
            <AuthProvider>
                <Navbar />
                <main className='mt-16'>
                    {children}
                </main>
            </AuthProvider>
        </>

    )
}

