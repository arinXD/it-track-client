import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from 'next-auth/jwt';

const accessRoles = ["admin", "teacher"]
const studentPaths = [
    "/petition/request",
    "/student/tracks",
    "/student/verify",
]
const allowPathForTeacher = [
    "/admin",
    "/admin/students",
    "/admin/trackstudent",
    "/admin/track-dashboard",
    "/admin/students-advisor/:path*",
    "/admin/verify/:path*",
    "/admin/verify-selection/:path*"
]

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
        console.log(path);
        if (studentPaths.includes(path) && accessRoles.includes(userRole)) {
            return NextResponse.rewrite(new URL("/permission/Student-account", req.url));
        }
        if (path.startsWith("/admin")) {
            if (!accessRoles.includes(userRole)) {
                return NextResponse.rewrite(new URL("/permission/Admin-account", req.url));
            }

            if (userRole === "teacher") {
                const isAllowedPath = allowPathForTeacher.some(allowedPath => {
                    if (allowedPath.endsWith("/:path*")) {
                        const basePath = allowedPath.replace("/:path*", "");
                        return path.startsWith(basePath);
                    }
                    return path === allowedPath;
                });

                if (!isAllowedPath) {
                    return NextResponse.rewrite(new URL("/permission/Admin-account", req.url));
                }
            }
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
        "/profile/:path*",
        "/((?!api|_next/static|_next/image|.*\\.png$).*)"
    ]
}