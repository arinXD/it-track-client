"use client"
import TabsComponent from "@/app/components/TabsComponent"
import { RiFileExcel2Fill } from "react-icons/ri"
import { SiGoogleforms } from "react-icons/si"
import { useSearchParams } from 'next/navigation'
import InsertModal from "../InsertModal"
import InsertEnrollmentForm from "../InsertEnrollmentForm"
import InsertExcel from "@/app/components/InsertExcel."
import { useCallback } from "react"
import { getOptions, getToken } from "@/app/components/serverAction/TokenAction"

const Page = () => {
     const searchParams = useSearchParams()
     const tab = searchParams.get('tab')

     const tabItems = [
          { key: "student-form", label: "เพิ่มรายชื่อนักศึกษาผ่านแบบฟอร์ม", icon: <SiGoogleforms className="w-4 h-4 text-gray-600" /> },
          { key: "enroll-form", label: "เพิ่มเกรดผ่านแบบฟอร์ม", icon: <SiGoogleforms className="w-4 h-4 text-gray-600" /> },
          { key: "student-sheet", label: "เพิ่มรายชื่อนักศึกษาผ่านไฟล์ xlsx", icon: <RiFileExcel2Fill className="w-4 h-4 text-gray-600" /> },
          { key: "enroll-sheet", label: "เพิ่มเกรดผ่านไฟล์ xlsx", icon: <RiFileExcel2Fill className="w-4 h-4 text-gray-600" /> },
     ]

     const insertStudentExcel = useCallback(async function (formattedData) {
          if (formattedData.some(row =>
               row["STUDENTCODE".toLowerCase()] != null &&
               row["STUDENTNAME".toLowerCase()] != null &&
               row["KKUMAIL".toLowerCase()] != null &&
               row["PROGRAM".toLowerCase()] != null
          )) {
               const options = await getOptions("/api/students/excel", "post")
               return { status: true, options }
          } else {
               return { status: false, options: {} }
          }
     }, [])

     const insertEnrollmentExcel = useCallback(async function (formattedData) {
          // add required column
          if (formattedData.some(row =>
               row["PROGRAMNAME".toLowerCase()] != null &&
               row["STUDENTCODE".toLowerCase()] != null &&
               row["STUDENTNAME".toLowerCase()] != null &&
               row["STUDENTSURNAME".toLowerCase()] != null &&
               row["KKUMAIL".toLowerCase()] != null &&
               row["COURSECODE".toLowerCase()] != null &&
               row["COURSENAME".toLowerCase()] != null &&
               row["COURSENAMEENG".toLowerCase()] != null &&
               row["CREDITTOTAL".toLowerCase()] != null &&
               row["ACADYEAR".toLowerCase()] != null
          )) {
               const options = await getOptions("/api/students/enrollments/excel", "post")
               return { status: true, options }
          } else {
               return { status: false, options: {} }
          }
     }, [])

     return (
          <div>
               <TabsComponent current={tab} tabs={tabItems} />
               {tab === tabItems[0].key &&
                    <InsertModal />
               }
               {tab === tabItems[1].key &&
                    <InsertEnrollmentForm />
               }
               {tab === tabItems[2].key &&
                    <InsertExcel
                         isFileFromREG={true}
                         startRow={5}
                         title={"เพิ่มรายชื่อนักศึกษาผ่านไฟล์ Exel"}
                         templateFileName={"students_template"}
                         headers={[
                              {
                                   groupTitle: "ข้อมูลนักศึกษา",
                                   items: [
                                        { required: true, label: "STUDENTCODE", desc: "รหัสนักศึกษา" },
                                        { required: true, label: "STUDENTNAME", desc: "ชื่อ - สกุล" },
                                        { required: true, label: "KKUMAIL", desc: "อีเมล" },
                                        { required: true, label: "PROGRAM", desc: "หลักสูตร" },
                                   ]
                              },

                         ]}
                         hook={insertStudentExcel}
                    />
               }
               {tab === tabItems[3].key &&
                    <InsertExcel
                         title={"เพิ่มการลงทะเบียนของนักศึกษาผ่านไฟล์ Exel"}
                         templateFileName={"enrollments_template"}
                         headers={[
                              {
                                   groupTitle: "ข้อมูลนักศึกษา",
                                   items: [
                                        // นศ.
                                        { required: true, label: "STUDENTCODE", desc: "รหัสนักศึกษา" },
                                        { required: true, label: "STUDENTNAME", desc: "ชื่อ" },
                                        { required: true, label: "STUDENTSURNAME", desc: "นามสกุล" },
                                        { required: true, label: "PROGRAMNAME", desc: "หลักสูตร" },
                                        { required: true, label: "KKUMAIL", desc: "อีเมล" },
                                        { label: "STUDENTSTATUS", desc: "สถานะ" },
                                   ]
                              },
                              {
                                   groupTitle: "ข้อมูลวิชา",
                                   items: [
                                        // วิชา
                                        { required: true, label: "COURSECODE", desc: "รหัสวิชา" },
                                        { required: true, label: "COURSENAME", desc: "ชื่อวิชาภาษาไทย" },
                                        { required: true, label: "COURSENAMEENG", desc: "ชื่อวิชาภาษาอังกฤษ" },
                                        { required: true, label: "CREDITTOTAL", desc: "หน่วยกิต" },
                                        { required: true, label: "ACADYEAR", desc: "ปีการศึกษา" },
                                        { label: "GRADEENTRY2", desc: "เกรด" },
                                   ]
                              },
                              {
                                   groupTitle: "ข้อมูลอาจารย์ที่ปรึกษา",
                                   items: [
                                        // อาจารย์ที่ปรึกษา
                                        { label: "PREFIXNAME", desc: "คำนำหน้าชื่ออาจารย์ภาษาไทย" },
                                        { label: "OFFICERNAME", desc: "ชื่ออาจารย์ภาษาไทย" },
                                        { label: "OFFICERSURNAME", desc: "นามสกุลอาจารย์ภาษาไทย" },
                                        { label: "OFFICEREMAIL", desc: "อีเมล" },
                                   ]
                              },


                         ]}
                         hook={insertEnrollmentExcel}
                    />
               }
          </div>
     )
}

export default Page