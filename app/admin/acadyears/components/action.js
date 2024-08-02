"use server"
import axios from "axios"
import { hostname } from "@/app/api/hostname"
import { getToken } from '@/app/components/serverAction/TokenAction'
import { revalidatePath } from "next/cache"

export async function createAcadYear(formData) {
    const token = await getToken()
    const acadyear = formData.get("acadyear")
    const acadyearArr = acadyear.split(" ").filter(e => e)
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
                acadyear: acadyearArr
            }
        };
        const result = await axios(options)
        revalidatePath("/admin/acadyears");
        return result.data;

    } catch (error) {
        const message = error.response.data.message
        return {
            ok: false,
            message: message
        }
    }
}
export async function updateAcadYear(formData) {
    const token = await getToken()
    const oldAcadyear = formData.get("oldAcadyear")
    const acadyear = formData.get("newAcadyear")
    try {
        const options = {
            url: `${hostname}/api/acadyear/${oldAcadyear}`,
            method: 'PUT',
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
        revalidatePath("/admin/acadyears");
        return result.data
    } catch (err) {
        const data = err.response.data
        return data
    }
}
export async function destroyAcadYear(id) {
    const token = await getToken()
    try {
        const result = await axios.delete(`${hostname}/api/acadyear/${id}`, {
            headers: {
                "authorization": `${token}`,
            },
        });
        revalidatePath("/admin/acadyears");
        return result.data
    } catch (err) {
        return {
            data: null
        }
    }
}
export async function destroyMultipleAcadYear(formData) {
    const token = await getToken()
    try {
        const options = {
            url: `${hostname}/api/acadyear`,
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                "authorization": `${token}`,
            },
            data: {
                acadyears: formData
            }
        };
        const result = await axios(options)
        revalidatePath("/admin/acadyears");
        return result.data
    } catch (err) {
        return {
            data: null
        }
    }
}