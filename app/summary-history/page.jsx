"use client"

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getOptions } from "../components/serverAction/TokenAction";
import axios from "axios";
import SummaryHistory from "./SummaryHistory";

const Page = () => {
     const { data: session } = useSession();
     const [fetching, setFetching] = useState(false);
     const [histories, setHistories] = useState([]);
     const email = useMemo(() => session?.user?.email, [session])
     const getHistory = useCallback(async () => {
          const option = await getOptions(`/api/suggestion-forms/history/${email}`, "get")
          try {
               setFetching(true)
               const history = (await axios(option)).data.data
               setHistories(history)
          } catch (error) {
               setHistories([])
          } finally {
               setFetching(false)
          }
     }, [email])

     useEffect(() => {
          if (email) getHistory()
     }, [email])

     return (
          <div className="p-4 md:p-8">
               <SummaryHistory
                    fn={getHistory}
                    fetching={fetching}
                    histories={histories} />
          </div>
     )
}

export default Page