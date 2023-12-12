"use server"
import axios from "axios"
import { hostname } from "@/app/api/hostname"
import { getServerSession } from 'next-auth';
import { signToken } from '@/app/components/serverAction/TokenAction'

export async function createAcadYear(prevState, formData) {
    const session = await getServerSession()
    const token = await signToken({ email: session.user.email })
    const acadyear = formData.get("acadyear")
    try {
        const options = {
            url: `${hostname}/api/acadyear/`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                "authorization": `${token}`,
            },
            data: {
                acadyear
            }
        };
        const result = await axios(options)
        console.log(result);
        return { message: "done" }
    } catch (error) {
        const message = error.response.data.message
        return { message: message }
    }
}

export async function destroyAcadYear(id) {
    const session = await getServerSession()
    const token = await signToken({ email: session.user.email })
    try {
        const result = await axios.delete(`${hostname}/api/acadyear/${id}`, {
            headers: {
                "authorization": `${token}`,
            },
        });
        return { data: result.data.data }
    } catch (err) {
        return { data: null }
    }
}