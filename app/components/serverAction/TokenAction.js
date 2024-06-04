"use server"
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import { getServerSession } from 'next-auth';
import { hostname } from "@/app/api/hostname";

export const decodeToken = async (data) => {
    const decode = jwtDecode(data)
    const result = decode.data.email
    return result
}

export async function signToken(data) {
    const token = jwt.sign({ data }, process.env.TOKEN_KEY, {
        expiresIn: '1m', algorithm: "HS256"
    });
    return token
}

export async function getToken() {
    const session = await getServerSession()
    const token = await signToken({
        email: session.user.email
    })
    return token
}

export async function getOptions(url, method = "GET", data = {}) {
    const token = await getToken()
    const options = {
        url: `${hostname}${url}`,
        method,
        headers: {
            'Accept': 'application/json',
            'authorization': `${token}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        withCredentials: true,
        data
    };
    return options
}