"use server"
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";

export const decodeToken = async (data)=>{
    const decode = jwtDecode(data)
    const result = decode.email
    return result
}

export async function signToken(data) {
    const token = jwt.sign({
        email: data.email,
    },  process.env.TOKEN_KEY);
    return token
}