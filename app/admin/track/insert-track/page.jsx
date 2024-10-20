"use client"
import { getOptions, getToken } from '@/app/components/serverAction/TokenAction'
import { Button, Input, Textarea } from '@nextui-org/react'
import axios from 'axios'
import { useState, useCallback } from 'react'
import { message } from 'antd';
import { inputClass } from '@/src/util/ComponentClass'
import { hostname } from '@/app/api/hostname'
import UploadCover from '../detail/UploadCover'
import { BreadCrumb, ContentWrap, Navbar, Sidebar } from '@/app/components'
import { useRouter } from 'next/navigation'

const Page = () => {
     const router = useRouter()
     const [track, setTrack] = useState("");
     const [titleTh, setTitleTh] = useState("");
     const [titleEn, setTitleEn] = useState("");
     const [desc, setDesc] = useState(" ");
     const [information, setInformation] = useState(" ");
     const [coverImageFile, setCoverImageFile] = useState({});
     const [trackImageFile, setTrackImageFile] = useState({});
     const [uploadProgressImg, setuploadProgressImg] = useState(0);
     const [uploadProgressCover, setuploadProgressCover] = useState(0);
     const [inserting, setInserting] = useState(false);

     const fileIsEmpty = useCallback((file) => {
          return (file instanceof Blob || file instanceof File) ? false : true
     }, [])

     const handleSubmit = useCallback(async (e) => {
          e.preventDefault()
          if (fileIsEmpty(coverImageFile)) {
               message.error("ภาพหน้าปกต้องไม่ว่าง")
               return
          }
          if (fileIsEmpty(trackImageFile)) {
               message.error("ภาพแทร็กต้องไม่ว่าง")
               return
          }
          const formData = new FormData(e.target);
          const formDataObject = Object.fromEntries(formData.entries());
          const option = await getOptions(`/api/tracks`, "POST", formDataObject)
          const token = await getToken()
          const headers = {
               'Content-Type': 'multipart/form-data',
               'authorization': `${token}`,
          }

          try {
               setInserting(true)
               await axios(option)

               if (trackImageFile instanceof Blob || trackImageFile instanceof File) {
                    const formData = new FormData();
                    formData.append('image', trackImageFile)
                    await axios.post(`${hostname}/api/tracks/${formDataObject.track}/image/img`, formData, {
                         headers,
                         onUploadProgress: (progressObj) => {
                              setuploadProgressImg(progressObj.progress * 100)
                         }
                    });
               }

               if (coverImageFile instanceof Blob || coverImageFile instanceof File) {
                    const formData = new FormData();
                    formData.append('image', coverImageFile);
                    await axios.post(`${hostname}/api/tracks/${formDataObject.track}/image/coverImg`, formData, {
                         headers,
                         onUploadProgress: (progressObj) => {
                              setuploadProgressCover(progressObj.progress * 100)
                         }
                    });
               }

               message.success("เพิ่มแทร็กเสร็จสิ้น")
               setuploadProgressImg(0)
               setuploadProgressCover(0)
               setCoverImageFile({})
               setTrackImageFile({})
               router.push('/admin/track')
          } catch (error) {
               const errMessage = error?.response?.data?.message || "ไม่สามารถเพิ่มแทร็กได้"
               message.error(errMessage)
          } finally {
               setInserting(false)
          }

     }, [coverImageFile,
          trackImageFile])

     return (
          <>
               <header>
                    <Navbar />
               </header>
               <Sidebar />
               <ContentWrap>
                    <section>
                         <BreadCrumb />
                         <div className='mt-4 border p-6 rounded-[10px] w-full'>
                              <div className='flex flex-col gap-6'>
                                   <div className='w-full flex flex-col-reverse md:flex-row gap-6'>
                                        <UploadCover
                                             containerWidth="w-full md:w-[20%]"
                                             src={""}
                                             label="ภาพแทร็ก"
                                             width="w-full"
                                             setImageFile={setTrackImageFile}
                                             uploadProgress={uploadProgressImg}
                                        />
                                        <UploadCover
                                             containerWidth="w-full md:w-[80%]"
                                             src={""}
                                             label="ภาพหน้าปก"
                                             width="w-full"
                                             setImageFile={setCoverImageFile}
                                             uploadProgress={uploadProgressCover}
                                        />

                                   </div>
                                   <div className='flex flex-col justify-center sm:flex-row gap-6'>
                                        <form
                                             onSubmit={handleSubmit}
                                             className='w-full grid grid-cols-2 gap-4'>
                                             <Input
                                                  name='track'
                                                  type="text"
                                                  variant="bordered"
                                                  radius='sm'
                                                  label="แทร็ก"
                                                  labelPlacement="outside"
                                                  value={track}
                                                  onValueChange={setTrack}
                                                  classNames={inputClass}
                                                  className='col-span-2'
                                                  pattern="^[a-zA-Z0-9]*$"
                                                  isRequired
                                             />
                                             <Input
                                                  name='title_th'
                                                  type="text"
                                                  variant="bordered"
                                                  radius='sm'
                                                  label="ชื่อแทร็กภาษาไทย"
                                                  labelPlacement="outside"
                                                  value={titleTh}
                                                  onValueChange={setTitleTh}
                                                  classNames={inputClass}
                                                  className='col-span-2 md:col-span-1'
                                                  isRequired
                                             />
                                             <Input
                                                  name='title_en'
                                                  type="text"
                                                  variant="bordered"
                                                  radius='sm'
                                                  label="ชื่อแทร็กภาษาอังกฤษ"
                                                  labelPlacement="outside"
                                                  value={titleEn}
                                                  onValueChange={setTitleEn}
                                                  classNames={inputClass}
                                                  className='col-span-2 md:col-span-1'
                                                  isRequired
                                             />
                                             <Textarea
                                                  name='desc'
                                                  variant="bordered"
                                                  label="คำอธิบายแทร็ก"
                                                  labelPlacement="outside"
                                                  value={desc}
                                                  onValueChange={setDesc}
                                                  classNames={inputClass}
                                                  className='col-span-2'
                                             />
                                             <Textarea
                                                  name='information'
                                                  variant="bordered"
                                                  label="ข้อมูลแทร็ก"
                                                  labelPlacement="outside"
                                                  value={information}
                                                  onValueChange={setInformation}
                                                  classNames={inputClass}
                                                  className='col-span-2'
                                             />
                                             <div className='col-span-2 flex justify-end'>
                                                  <Button
                                                       type='submit'
                                                       radius='sm'
                                                       color='primary'
                                                       className='bg-primary-500'
                                                       isDisabled={inserting}
                                                       isLoading={inserting}
                                                  >

                                                       {
                                                            inserting ?
                                                                 "กำลังบันทึก..."
                                                                 :
                                                                 "บันทึก"
                                                       }
                                                  </Button>
                                             </div>
                                        </form>
                                   </div>
                              </div>
                         </div>
                    </section>
               </ContentWrap>
          </>
     )

}

export default Page