"use client"
import { inputClass } from "@/src/util/ComponentClass";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";

const SuggestForm = ({ formId, formStyle, next, suggestForm, setSuggestForm, fetching }) => {

     return (
          <>
               <section
                    style={formStyle}
               >
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
                                   value={suggestForm.title}
                                   onChange={(e) => setSuggestForm(prev => ({
                                        ...prev,
                                        title: e.target.value
                                   }))}
                                   classNames={inputClass}
                              />
                              <Textarea
                                   name='desc'
                                   variant="bordered"
                                   label="คำอธิบาย"
                                   labelPlacement="outside"
                                   value={suggestForm.desc}
                                   onChange={(e) => setSuggestForm(prev => ({
                                        ...prev,
                                        desc: e.target.value
                                   }))}
                                   classNames={inputClass}
                                   className='mb-4'
                              />
                         </div>
                    )}
               </section>
               <div className="my-[24px] flex gap-2 justify-end">
                    <Button
                         type="button"
                         color="primary"
                         className="rounded-[5px]"
                         onClick={next}>
                         ต่อไป
                    </Button>
               </div>
          </>
     )
}

export default SuggestForm