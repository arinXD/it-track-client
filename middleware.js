import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from 'next-auth/jwt';

const accessRoles = ["admin", "teacher"]

export default async function middleware(req, event) {
    const path = req.nextUrl.pathname;
    const token = await getToken({ req });
    const userRole = token?.role;
    const isAuthenticated = !!token;

    if (isAuthenticated) {

        if (req.nextUrl.pathname.startsWith('/auth/sign-in') && isAuthenticated) {
            const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/';
            return NextResponse.redirect(new URL(callbackUrl, req.url));
        }

        if (path.startsWith("/student") && !["student", ...accessRoles].includes(userRole)) {
            return NextResponse.rewrite(new URL("/permission/kkumail.com", req.url));
        }

        if (path.startsWith("/teacher") && !accessRoles.includes(userRole)) {
            return NextResponse.rewrite(new URL("/permission/Teacher-account", req.url));
        }

        if (path.startsWith("/dashboard") && !accessRoles.includes(userRole)) {
            return NextResponse.rewrite(new URL("/permission/Admin-account", req.url));
        }

        if (path.startsWith("/admin") && !accessRoles.includes(userRole)) {
            return NextResponse.rewrite(new URL("/permission/Admin-account", req.url));
        }
    }

    const authMiddleware = withAuth({
        pages: {
            signIn: `/auth/sign-in`,
        },
    });

    return authMiddleware(req, event);
}

export const config = {
    matcher: [
        "/",
        "/student/:path*",
        "/teacher/:path*",
        "/tracks/:path*",
        "/admin/:path*",
        "/dashboard",
        "/((?!api|_next/static|_next/image|.*\\.png$).*)"
    ]
}