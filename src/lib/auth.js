import { NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers";

export const authOption = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await fetch("https://www.melivecode.com/api/login", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const response = await res.json()

                if (res.ok && response) {
                    const userData = response.user
                    const user = {
                        name: `${userData.fname} ${userData.lname}`,
                        email: userData.email,
                        image: userData.avatar
                    }
                    return user
                }

                return null
            }
        })
    ],
    
}