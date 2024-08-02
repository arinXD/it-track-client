"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import PetitionList from "../PetitionList";
import { usePathname } from "next/navigation";
import { getPetitionByStatus } from "../action";

export default function Page() {
     const url = usePathname();
     const current = useMemo(() => (url.split("/").filter(e => e).slice(-1)), [url])
     const [petitions, setPetitions] = useState([]);
     const [fetching, setFetching] = useState(false);

     const getPetitions = useCallback(async (current) => {
          setFetching(true)
          const data = await getPetitionByStatus(current)
          setPetitions(data)
          setFetching(false)
     }, [])

     useEffect(() => {
          if (petitions.length == 0 || current) getPetitions(current);
     }, [current])

     return (
          <section>
               <PetitionList
                    cb={getPetitions}
                    current={current}
                    fetching={fetching}
                    emptyContent={"ไม่มีข้อมูลการยื่นคำร้อง"}
                    title={"กล่องคำร้องการย้ายแทร็ก"}
                    data={petitions}
               />
          </section>
     )
}
