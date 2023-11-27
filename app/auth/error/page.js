'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { SignInButton } from '@/app/components'

const page = () => {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    return (
        <div>
            <h1>
                Error
            </h1>
            <p>
                error: {error}
            </p>
            <SignInButton />
        </div>
    )
}

export default page