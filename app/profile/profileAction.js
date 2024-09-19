"use server"

import axios from "axios";
import { getOptions } from "@/app/components/serverAction/TokenAction";

export async function updateTeacherData(formData) {
     const formDataObj = {};
     formData.forEach((value, key) => (formDataObj[key] = value));
     formDataObj.track = formDataObj.track || null
     console.log(formDataObj);
     
     const option = await getOptions("/api/users", "post", formDataObj)
     try {
          await axios(option)
          return {
               ok: true,
               message: "แก้ไขข้อมูลผู้ใช้"
          }
     } catch (error) {
          return {
               ok: false,
               message: error?.response?.data?.message || "ไม่สามารถแก้ไขข้อมูลผู้ใช้"
          }
     }
}