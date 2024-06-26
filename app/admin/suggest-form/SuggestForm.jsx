"use client"

import { getOptions } from "@/app/components/serverAction/TokenAction";
import { inputClass } from "@/src/util/ComponentClass";
import { Input, Spinner, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const SuggestForm = ({ formId }) => {
     const [title, setTitle] = useState("");
     const [desc, setDesc] = useState("");
     const [fetching, setFetching] = useState(false);

     const getForm = useCallback(async (formId) => {
          if (!formId) {
               setFetching(false)
               return
          }
          const option = await getOptions(`/api/suggestion-forms/get-form/${formId}`, "get")
          try {
               setFetching(true)
               const res = await axios(option)
               setTitle(res?.data?.data?.title)
               setDesc(res?.data?.data?.desc)
          } catch (error) {
               console.log(error);
          } finally {
               setFetching(false)
          }
     }, [])

     useEffect(() => {
          getForm(formId)
     }, [formId])

     return (
          <section>
               {fetching ? (
                    <div className='w-full flex justify-center my-6'>
                         <Spinner label="กำลังโหลด..." color="primary" />
                    </div>
               ) : (
                    <div className="flex flex-col gap-2">
                         <Input
                              name='title_en'
                              type="text"
                              variant="bordered"
                              radius='sm'
                              label="ชื่อแบบฟอร์ม"
                              labelPlacement="outside"
                              value={title}
                              onValueChange={setTitle}
                              classNames={inputClass}
                              isRequired
                         />
                         <Textarea
                              name='desc'
                              variant="bordered"
                              label="คำอธิบาย"
                              labelPlacement="outside"
                              value={desc}
                              onValueChange={setDesc}
                              classNames={inputClass}
                              className='mb-4'
                              isRequired
                         />
                    </div>
               )}
          </section>
     )
}

export default SuggestForm