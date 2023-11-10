import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { redirect } from 'next/navigation'
import { NextResponse } from "next/server"

export default withAuth(
    middleware = (req) => {
        if (req.nextauth.token) {
            const path = req.nextUrl.pathname
            const url = req.nextUrl.clone()

            const studentEmail = "kkumail.com"
            const teacherEmail = "kku.ac.th"
            var email
            // console.log(req.nextauth.token)
            if (req.nextauth.token?.email) {
                email = req.nextauth.token?.email.toString()
                email = email.split("@")[1]
            }
            if (path.startsWith("/student") && !email.includes(studentEmail)) {
                url.pathname = '/permission/kkumail.com'
                return NextResponse.redirect(url)
            }
            if (path.startsWith("/teacher") && !email.includes(teacherEmail)) {
                url.pathname = '/permission/kku.ac.th'
                return NextResponse.redirect(url)
            }
        }
        return NextResponse.redirect(new URL("/", req.url))
    },
    {
        callbacks: {
            authorize: ({ token }) => {
                console.log(token);
                if (token === null) {
                    return false
                }
                return true
            }
        }
    }
)
export const config = {
    matcher: [
        "/student/:path*",
        "/teacher/:path*",
        "/auth/:path*"
    ]
}