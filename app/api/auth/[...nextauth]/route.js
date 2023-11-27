import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextResponse } from 'next/server'

const VerifiedEmailProvider = (options) => {
    return {
        id: 'verifiedEmail',
        name: 'Verified Email',
        type: 'credentials',
        credentials: {
            id: { label: "uid", type: "number" },
            email: { label: 'Email', type: 'email' },
            stu_id: { label: "Student Id", type: "text" },
            role: { label: "Role", type: "text" },
            image: { label: "Image", type: "text" },
            fname: { label: "First Name", type: "text" },
            lname: { label: "Last Name", type: "text" },
            verification: { label: "Verification", type: "number" },
        },
        async authorize(credentials, req) {
            console.log(credentials);
            const { id, email, stu_id, role, image, fname, lname, verification } = credentials
            return { id, email, stu_id, role, image, fname, lname, verification }
        }
    };
};

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        VerifiedEmailProvider(),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await fetch("http://localhost:4000/api/auth/student/signin", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const response = await res.json()
                if (res.ok && response) {
                    const userData = response.user
                    return {
                        id: null,
                        name: userData.name,
                        stu_id: userData.stu_id,
                        email: userData.email,
                        image: userData.image,
                        role: userData.role,
                        firstname: userData.fname,
                        lastname: userData.lname,
                        verification: userData.verification,
                    }
                }
                // console.log(response);
                const { message } = response
                throw new Error(message)
            }
        }),
        GoogleProvider({
            async profile(profile) {
                return {
                    id: profile.sub,
                    stu_id: null,
                    email: profile.email,
                    name: profile.name,
                    firstname: profile.given_name,
                    lastname: profile.family_name,
                    image: profile.picture,
                    verification: 1,
                }
            },
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async signIn({ user, account }) {

            if (account.provider === "google") {
                const options = {
                    url: 'http://localhost:4000/api/auth/student/signin/google',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    data: {
                        email: user.email
                    }
                };

                try {
                    const result = await axios(options)
                    console.log(result.data);
                    if (result.data.data) {
                        user.stu_id = result.data.data.stu_id
                        user.role = result.data.data.role
                    }
                } catch (error) {
                    const message = error.response.data.message
                    throw new Error(message)
                    // console.log(message);
                    // const homeUrl = new URL('/auth/sign-in', "http://localhost:3000/")
                    // homeUrl.searchParams.set('error', message)
                    // return NextResponse.redirect(homeUrl)
                }

            }
            return user
        },
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update") {
                if (session.action == "verify signin") {
                    console.log("session in update trigger: ", session);
                    token = session.user
                }
                token.test = session.user.test
                return token
            }
            if (user) {
                token.role = user.role
                token.stu_id = user.stu_id
                token.firstname = user.firstname
                token.lastname = user.lastname
                token.verification = user.verification
            }
            return token
        },
        async session({ session, token }) {
            session.user.role = token.role
            session.user.stu_id = token.stu_id
            session.user.firstname = token.firstname
            session.user.lastname = token.lastname
            session.user.verification = token.verification
            session.user.test = token.test
            return session
        }
    },
    pages: {
        signIn: "/auth/sign-in",
        error: '/auth/sign-in',
    },
})

export { handler as GET, handler as POST }