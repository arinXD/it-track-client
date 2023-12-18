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
                new URL("/permission/Teacher+account", req.url)
            )
        }
        if (path.startsWith("/admin")
            && req.nextauth.token.role !== "admin") {
            return NextResponse.rewrite(
                new URL("/permission/Admin+account", req.url)
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
        "/admin/:path*",
    ]
}


// if (req.nextauth.token) {
//     const path = req.nextUrl.pathname
//     const url = req.nextUrl.clone()

//     const studentEmail = "kkumail.com"
//     const teacherEmail = "kku.ac.th"
//     var email
//     // console.log(req.nextauth.token)
//     if (req.nextauth.token?.email) {
//         email = req.nextauth.token?.email.toString()
//         email = email.split("@")[1]
//     }
//     if (path.startsWith("/student") && !email.includes(studentEmail)) {
//         url.pathname = '/permission/kkumail.com'
//         return NextResponse.redirect(url)
//     }
//     if (path.startsWith("/teacher") && !email.includes(teacherEmail)) {
//         url.pathname = '/permission/kku.ac.th'
//         return NextResponse.redirect(url)
//     }
// } else {
// }