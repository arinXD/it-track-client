"use server"
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import { getServerSession } from 'next-auth';

export const decodeToken = async (data) => {
    const decode = jwtDecode(data)
    const result = decode.email
    return result
}

export async function signToken(data) {
    const token = jwt.sign({
        data,
    }, process.env.TOKEN_KEY);
    return token
}

export async function getToken() {
    const session = await getServerSession()
    const token = await signToken({ email: session.user.email })
    return token
}
