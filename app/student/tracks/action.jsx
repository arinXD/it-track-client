"use server"
import axios from "axios"
import { hostname } from "@/app/api/hostname"
import { revalidatePath } from "next/cache"
import { getOptions } from "@/app/components/serverAction/TokenAction"

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
                message: "แทร็กต้องไม่ซ้ำกัน",
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
        const data = {
            track_selection_id,
            stu_id,
            track_order_1,
            track_order_2,
            track_order_3,
            subjectsData,
        }
        const options = await getOptions("/api/students/track/select", "POST", data)
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
}