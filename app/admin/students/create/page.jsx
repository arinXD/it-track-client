"use client"
import TabsComponent from "@/app/components/TabsComponent"
import { RiFileExcel2Fill } from "react-icons/ri"
import { SiGoogleforms } from "react-icons/si"
import { useSearchParams } from 'next/navigation'
import InsertModal from "../InsertModal"
import InsertEnrollmentForm from "../InsertEnrollmentForm"
import InsertExcel from "@/app/components/InsertExcel."
import { useCallback } from "react"
import { getOptions } from "@/app/components/serverAction/TokenAction"
import InsertAdvisor from "../InsertAdvisor"

const EXAMPLE_STUDENT_CODE = `${String(new Date().getFullYear() + 542).slice(2)}0000000-0`;
const EXAMPLE_FIRSTNAME = "ดวงตา";
const EXAMPLE_LASTNAME = "แก้วใจ";
const EXAMPLE_FULLNAME = "นาย/นางดวงตา แก้วใจ";
const EXAMPLE_EMAIL = "student.kku@kkumail.com";
const EXAMPLE_PROGRAM = "วิทยาการคอมพิวเตอร์, เทคโนโลยีสารสนเทศ, ภูมิสารสนเทศศาสตร์, ปัญญาประดิษฐ์, ความมั่นคงปลอดภัยไซเบอร์";
const EXAMPLE_STUDENT_STATUS = "10";
const EXAMPLE_COURSE_CODE = "GE151144";
const EXAMPLE_COURSE_NAME = "พหุวัฒนธรรม";
const EXAMPLE_COURSE_NAME_ENG = "Multiculturalism";
const EXAMPLE_CREDIT = "3";
const EXAMPLE_ACAD_YEAR = "2567";
const EXAMPLE_GRADE = "A";
const EXAMPLE_OFFICER_PREFIX = "ผศ. ดร.";
const EXAMPLE_OFFICER_NAME = "มัลลิกา";
const EXAMPLE_OFFICER_SURNAME = "วัฒนะ";
const EXAMPLE_OFFICER_EMAIL = "monlwa@kku.ac.th";

const Page = () => {
     const searchParams = useSearchParams()
     const tab = searchParams.get('tab') || "student-form"

     const tabItems = [
          { key: "student-form", label: "เพิ่มรายชื่อนักศึกษา", icon: <SiGoogleforms className="w-4 h-4 text-blue-600" /> },
          { key: "enroll-form", label: "เพิ่มรายวิชาที่ลงทะเบียน", icon: <SiGoogleforms className="w-4 h-4 text-blue-600" /> },
          { key: "advisor-form", label: "เพิ่มรายชื่อนักศึกษาในที่ปรึกษา", icon: <SiGoogleforms className="w-4 h-4 text-blue-600" /> },
          { key: "student-sheet", label: "เพิ่มรายชื่อนักศึกษา", icon: <RiFileExcel2Fill className="w-4 h-4 text-green-600" /> },
          { key: "enroll-sheet", label: "เพิ่มรายวิชาที่ลงทะเบียน", icon: <RiFileExcel2Fill className="w-4 h-4 text-green-600" /> },
          { key: "advisor-sheet", label: "เพิ่มรายชื่อนักศึกษาในที่ปรึกษา", icon: <RiFileExcel2Fill className="w-4 h-4 text-green-600" /> },
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

     const insertAdvisorsExcel = useCallback(async function (formattedData) {
          if (formattedData.every(row =>
               row["STUDENTNAME".toLowerCase()] != null &&
               row["STUDENTSURNAME".toLowerCase()] != null &&
               row["OFFICERNAME".toLowerCase()] != null &&
               row["OFFICERSURNAME".toLowerCase()] != null
          )) {
               const options = await getOptions("/api/advisors/students/spread-sheet", "post")
               return { status: true, options }
          } else {
               return { status: false, options: {} }
          }
     }, [])

     return (
          <div>
               <TabsComponent
                    current={tab}
                    tabs={tabItems} />
               {tab === tabItems[0].key &&
                    <InsertModal />
               }
               {tab === tabItems[1].key &&
                    <InsertEnrollmentForm />
               }
               {tab === tabItems[2].key &&
                    <InsertAdvisor />
               }
               {tab === tabItems[3].key &&
                    <InsertExcel
                         isFileFromREG={true}
                         startRow={5}
                         title={"เพิ่มรายชื่อนักศึกษาผ่านไฟล์ Exel"}
                         templateFileName={"students_template"}
                         headers={[
                              {
                                   groupTitle: "ข้อมูลนักศึกษา",
                                   items: [
                                        { required: true, label: "STUDENTCODE", desc: "รหัสนักศึกษา", example: EXAMPLE_STUDENT_CODE },
                                        { required: true, label: "STUDENTNAME", desc: "ชื่อ - สกุล", example: EXAMPLE_FULLNAME },
                                        { required: true, label: "KKUMAIL", desc: "อีเมล", example: EXAMPLE_EMAIL },
                                        { required: true, label: "PROGRAM", desc: "หลักสูตร", example: EXAMPLE_PROGRAM },
                                   ]
                              },

                         ]}
                         hook={insertStudentExcel}
                    />
               }
               {tab === tabItems[4].key &&
                    <InsertExcel
                         title={"เพิ่มการลงทะเบียนของนักศึกษาผ่านไฟล์ Exel"}
                         templateFileName={"enrollments_template"}
                         headers={[
                              {
                                   groupTitle: "ข้อมูลนักศึกษา",
                                   items: [
                                        // นศ.
                                        { required: true, label: "STUDENTCODE", desc: "รหัสนักศึกษา", example: EXAMPLE_STUDENT_CODE },
                                        { required: true, label: "STUDENTNAME", desc: "ชื่อ", example: EXAMPLE_FIRSTNAME },
                                        { required: true, label: "STUDENTSURNAME", desc: "นามสกุล", example: EXAMPLE_LASTNAME },
                                        { required: true, label: "PROGRAMNAME", desc: "หลักสูตร", example: EXAMPLE_PROGRAM },
                                        { required: true, label: "KKUMAIL", desc: "อีเมล", example: EXAMPLE_EMAIL },
                                        { label: "STUDENTSTATUS", desc: "สถานะ", example: EXAMPLE_STUDENT_STATUS },
                                   ]
                              },
                              {
                                   groupTitle: "ข้อมูลวิชา",
                                   items: [
                                        // วิชา
                                        { required: true, label: "COURSECODE", desc: "รหัสวิชา", example: EXAMPLE_COURSE_CODE },
                                        { required: true, label: "COURSENAME", desc: "ชื่อวิชาภาษาไทย", example: EXAMPLE_COURSE_NAME },
                                        { required: true, label: "COURSENAMEENG", desc: "ชื่อวิชาภาษาอังกฤษ", example: EXAMPLE_COURSE_NAME_ENG },
                                        { required: true, label: "CREDITTOTAL", desc: "หน่วยกิต", example: EXAMPLE_CREDIT },
                                        { required: true, label: "ACADYEAR", desc: "ปีการศึกษา", example: EXAMPLE_ACAD_YEAR },
                                        { label: "GRADEENTRY2", desc: "เกรด", example: EXAMPLE_GRADE },
                                   ]
                              },
                              {
                                   groupTitle: "ข้อมูลอาจารย์ที่ปรึกษา",
                                   items: [
                                        // อาจารย์ที่ปรึกษา
                                        { label: "PREFIXNAME", desc: "คำนำหน้าชื่ออาจารย์ภาษาไทย", example: EXAMPLE_OFFICER_PREFIX },
                                        { label: "OFFICERNAME", desc: "ชื่ออาจารย์ภาษาไทย", example: EXAMPLE_OFFICER_NAME },
                                        { label: "OFFICERSURNAME", desc: "นามสกุลอาจารย์ภาษาไทย", example: EXAMPLE_OFFICER_SURNAME },
                                        { label: "OFFICEREMAIL", desc: "อีเมล", example: EXAMPLE_OFFICER_EMAIL },
                                   ]
                              },


                         ]}
                         hook={insertEnrollmentExcel}
                    />
               }
               {tab === tabItems[5].key &&
                    <InsertExcel
                         title={"เพิ่มรายชื่อนักศึกษาในที่ปรึกษาผ่านไฟล์ Exel"}
                         templateFileName={"advisor_template"}
                         headers={[
                              {
                                   groupTitle: "ข้อมูลนักศึกษา",
                                   items: [
                                        // นศ.
                                        { required: true, label: "STUDENTNAME", desc: "ชื่อ", example: EXAMPLE_FIRSTNAME },
                                        { required: true, label: "STUDENTSURNAME", desc: "นามสกุล", example: EXAMPLE_LASTNAME },
                                   ]
                              },
                              {
                                   groupTitle: "ข้อมูลอาจารย์ที่ปรึกษา",
                                   items: [
                                        // อาจารย์ที่ปรึกษา
                                        { required: true, label: "OFFICERNAME", desc: "ชื่ออาจารย์ภาษาไทย", example: EXAMPLE_OFFICER_NAME },
                                        { required: true, label: "OFFICERSURNAME", desc: "นามสกุลอาจารย์ภาษาไทย", example: EXAMPLE_OFFICER_SURNAME },
                                   ]
                              },


                         ]}
                         hook={insertAdvisorsExcel}
                    />
               }
          </div>
     )
}

export default Page