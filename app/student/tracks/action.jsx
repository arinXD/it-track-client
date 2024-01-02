"use server"
import axios from "axios"
import { hostname } from "@/app/api/hostname"
import { revalidatePath } from "next/cache"

async function getSubjectsForTrackSelect(id) {
    try {
        const res = await axios.get(`${hostname}/api/tracks/selects/${id}/subjects`)
        const subjects = res.data.data
        return subjects
    } catch (error) {
        console.error(error)
        return ([])
    }
}

export async function createTrackSelection(formData) {
    try {
        const track_selection_id = formData.get("track_selection_id")
        const stu_id = formData.get("stu_id")
        const track_order_1 = formData.get("track_order_1")
        const track_order_2 = formData.get("track_order_2")
        const track_order_3 = formData.get("track_order_3")
        const subjects = await getSubjectsForTrackSelect(track_selection_id)
        const subjectsData = []
        subjects.forEach(subject => {
            let subjectData = {}
            const subject_code = subject.subject_code
            const grade = formData.get(`subject_${subject_code}`)
            subjectData["subject_code"] = subject_code
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
        const err = err.response.data
        return ({
            ok: false,
            message: "create track selection error.",
            err
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