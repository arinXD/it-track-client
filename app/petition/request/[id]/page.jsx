"use client"
import { useCallback, useMemo } from "react";
import PetitionDetail from "@/app/petition/PetitionDetail";
import axios from "axios";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { usePathname } from "next/navigation";

const Page = ({ params }) => {
     const { id } = params
     const url = usePathname();
     const current = useMemo(() => (url.split("/").filter(e => e).slice(-2, -1)[0]), [url])

     const handleDelete = useCallback(async () => {
          try {
               const option = await getOptions("/api/petitions/multiple", "delete", [id])
               await axios(option)
               window.location.href = "/petition/request"
          } catch (error) {
               console.log(error);
          }
     }, [id])

     return (
          <section>
               <PetitionDetail
                    id={id}
                    current={current}
                    handleDelete={handleDelete}
                    isEditable={true}
                    isDeletable={true} />
          </section>
     )
}

export default Page