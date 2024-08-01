"use server"

import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";

export async function getPetitionByStatus(status) {
     try {
          const option = await getOptions(`/api/petitions/approves/${status}`)
          const res = await axios(option)
          let data = res.data?.data;
          data = data?.length ? data : [];
          return data;
     } catch (error) {
          console.error(error);
          return []
     }
}