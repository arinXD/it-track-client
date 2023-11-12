import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
// import { GoogleProfile } from "next-auth/providers/google";

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
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
                // console.log(response);
                if (res.ok && response) {
                    const userData = response.user
                    return {
                        name: `${userData.fname} ${userData.lname}`,
                        email: userData.email,
                        image: userData.image,
                        role: userData.role,
                    }
                }
                return null
            }
        }),
        GoogleProvider({
            profile(profile) {
                // console.log(profile);
                return {
                    id: profile.sub,
                    email: profile.email,
                    name: profile.name,
                    firstname: profile.given_name,
                    lastname: profile.family_name,
                    image: profile.picture,
                    role: profile.role ?? "student",
                }
            },
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    pages: {
        signIn: "/auth/sign-in"
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = user.role
            return token
        },
        session({ session, token }) {
            session.user.role = token.role
            return session
        }
    },

})

export { handler as GET, handler as POST }