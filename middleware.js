import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    middleware = (req) => {
        const regex = new RegExp("/auth/*")
        const url = req.nextUrl.clone()

        if (regex.test(req.nextUrl.pathname)) {
            url.pathname = '/'
            console.log("you are loging in");
            return NextResponse.redirect(url)
        }

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
        // "/student/:path*",
        // "/teacher/:path*",
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