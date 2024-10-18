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
     const [traches, setTraches] = useState([]);
     const [fetching, setFetching] = useState(true);

     const getTrashPetitions = useCallback(async () => {
          setFetching(true)
          try {
               const option = await getOptions(`/api/petitions/users/${session?.user?.email}/retrieve`, "get")
               const data = (await axios(option)).data.data
               setTraches(data)
          } catch {
               setTraches([])
          } finally {
               setFetching(false)
          }

     }, [session?.user?.email])

     useEffect(() => {
          if (session?.user?.email != undefined && traches?.length == 0) {
               getTrashPetitions()
          }
     }, [session?.user?.email])

     const handleHardDelete = useCallback(async (array) => {
          try {
               const option = await getOptions("/api/petitions/multiple/force", "delete", array)
               await axios(option)
               message.success("ลบคำร้องสำเร็จ")
               await getTrashPetitions()
          } catch (error) {
               console.log(error);
               message.error("ลบคำร้องผิดพลาด")
          }
     }, [])

     return (
          <section>
               <PetitionList
                    cb={getTrashPetitions}
                    current={current}
                    fetching={fetching}
                    emptyContent={"ไม่มีข้อมูลในถังขยะ"}
                    title={"ถังขยะ"}
                    data={traches}
                    handleDelete={handleHardDelete}
                    isRetrievable={true} />
          </section>
     )
}
