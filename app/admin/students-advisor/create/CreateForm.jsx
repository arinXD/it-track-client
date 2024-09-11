"use client"
import TabsComponent from "@/app/components/TabsComponent"
import { RiFileExcel2Fill } from "react-icons/ri"
import { SiGoogleforms } from "react-icons/si"
import { useSearchParams } from 'next/navigation'
import InsertExcel from "@/app/components/InsertExcel."
import { useCallback } from "react"
import { getOptions } from "@/app/components/serverAction/TokenAction"
import InsertAdvisor from "./InsertAdvisor"

const CreateForm = ({ teacher }) => {
     const searchParams = useSearchParams()
     const tab = searchParams.get('tab') ?? "advisor-form"

     const tabItems = [
          { key: "advisor-form", label: "เพิ่มรายชื่อนักศึกษาในที่ปรึกษา", icon: <SiGoogleforms className="w-4 h-4 text-gray-600" /> },
          { key: "advisor-sheet", label: "เพิ่มรายชื่อนักศึกษาในที่ปรึกษา", icon: <RiFileExcel2Fill className="w-4 h-4 text-gray-600" /> },
     ]

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
          <>
               <TabsComponent
                    current={tab}
                    tabs={tabItems} />
               {tab === tabItems[0].key &&
                    <InsertAdvisor
                         teacher={teacher} />
               }
               {tab === tabItems[1].key &&
                    <InsertExcel
                         title={"เพิ่มรายชื่อนักศึกษาในที่ปรึกษาผ่านไฟล์ Exel"}
                         templateFileName={"advisor_template"}
                         headers={[
                              {
                                   groupTitle: "ข้อมูลนักศึกษา",
                                   items: [
                                        // นศ.
                                        { required: true, label: "STUDENTNAME", desc: "ชื่อ" },
                                        { required: true, label: "STUDENTSURNAME", desc: "นามสกุล" },
                                   ]
                              },
                              {
                                   groupTitle: "ข้อมูลอาจารย์ที่ปรึกษา",
                                   items: [
                                        // อาจารย์ที่ปรึกษา
                                        { required: true, label: "OFFICERNAME", desc: "ชื่ออาจารย์ภาษาไทย" },
                                        { required: true, label: "OFFICERSURNAME", desc: "นามสกุลอาจารย์ภาษาไทย" },
                                   ]
                              },


                         ]}
                         hook={insertAdvisorsExcel}
                    />
               }
          </>
     )
}

export default CreateForm