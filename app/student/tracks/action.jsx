"use server"
import axios from "axios"
import { hostname } from "@/app/api/hostname"
import { revalidatePath } from "next/cache"

export async function createTrackSelection(formData) {
    try {
        const track_selection_id = formData.get("track_selection_id")
        const stu_id = formData.get("stu_id")
        const track_order_1 = formData.get("track_order_1")
        const track_order_2 = formData.get("track_order_2")
        const track_order_3 = formData.get("track_order_3")
        const unique = new Set([track_order_1, track_order_2, track_order_3]).size === 3
        if (!unique) {
            return ({
                ok: false,
                message: "แทรคต้องไม่ซ้ำกัน",
            })
        }

        const subjectsData = []
        const subjKey = Array.from(formData.keys()).filter(e => e.includes('subject_')).map(f => f.split("_")[1])
        subjKey.forEach(subject => {
            let subjectData = {}
            const grade = formData.get(`subject_${subject}`)
            subjectData["subject_code"] = subject
            subjectData["grade"] = grade
            subjectsData.push(subjectData)
        });
        const options = {
            url: `${hostname}/api/students/track/select`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: {
                track_selection_id,
                stu_id,
                track_order_1,
                track_order_2,
                track_order_3,
                subjectsData,
            }
        };
        const result = await axios(options)
        revalidatePath("/student/tracks");
        return (result.data);
    } catch (error) {
        console.error(error);
        return ({
            ok: false,
            message: "create track selection error.",
        })
    }
    // const acadyear = formData.get("acadyear")
    // try {
    //     const options = {
    //         url: `${hostname}/api/acadyear/`,
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //         },
    //         data: {
    //             acadyear
    //         }
    //     };
    //     const result = await axios(options)
    //     revalidatePath("/admin/acadyears");
    //     return result.data;

    // } catch (error) {
    //     const message = error.response.data.message
    //     return {
    //         ok: false,
    //         message: message
    //     }
    // }
}