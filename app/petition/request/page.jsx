"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import PetitionList from "@/app/petition/PetitionList";
import { message } from "antd";
import { usePathname } from "next/navigation";

export default function Page() {
     const url = usePathname();
     const current = useMemo(() => (url.split("/").filter(e => e).slice(-1)), [url])
     const { data: session } = useSession();
     const [requests, setRequests] = useState([]);
     const [fetching, setFetching] = useState(true);

     const getPetitions = async () => {
          setFetching(true)
          try {
               // session?.user?.email
               const option = await getOptions(`/api/petitions/users/${session?.user?.email}`, "get")
               const data = (await axios(option)).data.data
               setRequests(data)
          } catch {
               setRequests([])
          } finally {
               setFetching(false)
          }
     }

     useEffect(() => {
          if (session?.user?.email != undefined && requests?.length == 0) {
               getPetitions()
          }
     }, [session?.user?.email])

     const handleSoftDelete = useCallback(async (array) => {
          try {
               const option = await getOptions("/api/petitions/multiple", "delete", array)
               await axios(option)
               message.success("ลบคำร้องสำเร็จ")
               await getPetitions()
          } catch (error) {
               console.log(error);
               message.error("ลบคำร้องผิดพลาด")
          }
     }, [])

     return (
          <section>
               <PetitionList
                    cb={getPetitions}
                    current={current}
                    fetching={fetching}
                    emptyContent={"ไม่มีข้อมูลการยื่นคำร้อง"}
                    title={"กล่องคำร้องของฉัน"}
                    data={requests}
                    handleDelete={handleSoftDelete} />
          </section>
     )
}
