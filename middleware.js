import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    middleware = (req) => {
        const path = req.nextUrl.pathname
        console.log(req.nextUrl.pathname);
        console.log(req.nextauth.token);

        if (path.startsWith("/student")
            && req.nextauth.token.role !== "student") {
            return NextResponse.rewrite(
                new URL("/permission/kkumail.com", req.url)
            )
        }
        if (path.startsWith("/teacher")
            && req.nextauth.token.role !== "teacher") {
            return NextResponse.rewrite(
                new URL("/permission/kku.ac.th", req.url)
            )
        }
        if (path.startsWith("/admin")
            && req.nextauth.token.role !== "admin") {
            return NextResponse.rewrite(
                new URL("/permission/admin@email.com", req.url)
            )
        }
        // const regex = new RegExp("/auth/*")
        // const url = req.nextUrl.clone()

        // if (regex.test(req.nextUrl.pathname)) {
        //     url.pathname = '/'
        //     console.log("you are loging in");
        //     return NextResponse.redirect(url)
        // }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorize: ({ token }) => {
                console.log(token);
                if (token) {
                    return true
                }
                return false
            }
        }
    }
)

export const config = {
    matcher: [
        // "/:path*",
        "/student/:path*",
        "/teacher/:path*",
        "/admin/:path*",
        // "/auth/:path*",
    ]
}


// export default function middleware(request) {
//     const regex = new RegExp("/auth/*")

//     if(regex.test(request.url)){

//     }

//     console.log("-------Middleware---------");

//     console.log(request.method);
//     console.log(request.url);

//     const origin = request.headers.get("origin")

//     console.log(`origin: ${origin}`);

//     return NextResponse.next()

// }

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