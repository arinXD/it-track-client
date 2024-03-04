import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { hostname } from '@/app/api/hostname'
import { signToken } from "@/app/components/serverAction/TokenAction";

const VerifiedEmailProvider = (options) => {
    return {
        id: 'verifiedEmail',
        name: 'Verified Email',
        type: 'credentials',
        credentials: {
            email: { label: 'Email', type: 'email' },
        },
        async authorize(credentials, req) {
            const options = {
                url: `${hostname}/api/auth/signin/verified/email`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data: {
                    email: credentials.email
                }
            };

            try {
                const result = await axios(options)
                if (result.data.userData) {
                    const userData = result.data.userData
                    return {
                        id: null,
                        ...userData
                    }
                }
            } catch (error) {
                const message = error.response.data.message
                throw new Error(message)
            }
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
                const res = await fetch(`${hostname}/api/auth/signin`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const response = await res.json()
                if (res.ok && response) {
                    let userData = response.user
                    return {
                        id: null,
                        ...userData
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
            console.log(user);
            if (account.provider === "google") {
                const token = await signToken({ email: user.email })
                const options = {
                    url: `${hostname}/api/auth/signin/google`,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    data: {
                        email: token
                    }
                };

                try {
                    const result = await axios(options)
                    let userData = result.data.data
                    if (userData) {
                        for (let key in userData) {
                            if (!(user.hasOwnProperty(key))) {
                                user[key] = userData[key];
                            }
                        }
                    }
                } catch (error) {
                    const message = error.response.data.message
                    throw new Error(message)
                }

            }
            return user
        },
        async signOut({ token, session }) {
            res.setHeader("Set-Cookie", "");
            token = {};
            session = {};
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
                user.picture = token.picture
                token = user
            }
            return token
        },
        async session({ session, token }) {
            session.user = token
            return session
        }
    },
    pages: {
        signIn: "/auth/sign-in",
        error: '/auth/sign-in',
    },
})

export { handler as GET, handler as POST }