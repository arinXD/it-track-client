'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SignInButton } from '@/app/components'
import SearchFallback from '@/app/components/SearchFallback'

const Page = () => {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    return (
        <div>
            <h1>
                Error
            </h1>
            <Suspense fallback={<SearchFallback />}>
                <p>
                    error: {error}
                </p>
            </Suspense>
            <SignInButton />
        </div>
    )
}

export default Page