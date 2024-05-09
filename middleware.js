import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"

const auth = withAuth(
    async function middleware(req) {
        const path = req.nextUrl.pathname
        // console.log("Middleware token: ", req?.nextauth?.token);

        if (path === "/" && req.nextauth.token.role === "admin") {
            const url = req.nextUrl.clone()
            url.pathname = '/admin'
            return NextResponse.redirect(url)
        }
        if (path.startsWith("/student")
            && req.nextauth.token.role !== "student"
            && req.nextauth.token.role !== "teacher"
            && req.nextauth.token.role !== "admin") {
            return NextResponse.rewrite(
                new URL("/permission/kkumail.com", req.url)
            )
        }
        if (path.startsWith("/teacher")
            && req.nextauth.token.role !== "teacher"
            && req.nextauth.token.role !== "admin") {
            return NextResponse.rewrite(
                new URL("/permission/Teacher-account", req.url)
            )
        }
        if (path.startsWith("/dashboard")
            && req.nextauth.token.role !== "teacher"
            && req.nextauth.token.role !== "admin") {
            return NextResponse.rewrite(
                new URL("/permission/Admin-account", req.url)
            )
        }
        if (path.startsWith("/admin")
            && req.nextauth.token.role !== "admin") {
            return NextResponse.rewrite(
                new URL("/permission/Admin-account", req.url)
            )
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorize: ({ token }) => {
                if (token) {
                    return true
                }
                return false
            }
        }
    }
)

export default auth

export const config = {
    matcher: [
        "/",
        "/student/:path*",
        "/teacher/:path*",
        "/tracks/:path*",
        "/admin/:path*",
        "/dashboard"
    ]
}