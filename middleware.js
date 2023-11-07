import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
// export { default } from "next-auth/middleware"

export default withAuth(
    middleware = (req) => {
        if (req.nextauth.token) {
            const path = req.nextUrl.pathname
            const studentEmail = "kkumail.com"
            const teacherEmail = "kku.ac.th"
            var email
            console.log(req.nextauth.token)
            if (req.nextauth.token?.email) {
                email = req.nextauth.token?.email.toString()
                email = email.split("@")[1]
            }
            // switch (email) {
            //     case "kkumail.com":
            //         return NextResponse.rewrite(
            //             new URL("/student", req.url)
            //         );
            //     case "kku.ac.th":
            //         return NextResponse.rewrite(
            //             new URL("/teacher", req.url)
            //         );
            // }

            if (path.startsWith("/student") && !email.includes(studentEmail)) {
                return NextResponse.rewrite(
                    new URL("/", req.url)
                );
            }
            if (path.startsWith("/teacher") && !email.includes(teacherEmail)) {
                return NextResponse.rewrite(
                    new URL("/", req.url)
                );
            }
        }
    },
    {
        callbacks: {
            authorize: ({ token }) => {
                console.log('token', token)
            }
        }
    }

)
export const config = {
    matcher: [
        "/student/:path*",
        "/teacher/:path*",
    ]
}