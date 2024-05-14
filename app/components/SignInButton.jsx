"use client"
import Link from 'next/link'
const SignInButton = () => {
    return (
        <div>
            <Link href={"/auth/sign-in"} className='btn btn-primary'>Sign in</Link>
        </div>
    )
}

export default SignInButton