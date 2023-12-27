"use server"
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'
import axios from "axios";
import { hostname } from "@/app/api/hostname";

export async function createUser(data) {
    const options = {
        url: `${hostname}/api/auth/signup`,
        method: 'POST',
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data,
    };

    // ======================
    // Sign up api
    // ======================
    try {
        const res = await axios(options)
        const token = res.data.token
        cookies().set({
            name: 'token',
            value: token,
            httpOnly: true,
            maxAge: 21600000,
            secure: true,
            sameSite: "lax",
        })
        return { ok: true }
    } catch (error) {
        return error.response.data
    }
}