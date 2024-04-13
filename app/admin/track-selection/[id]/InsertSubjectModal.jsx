"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Icon } from '@iconify/react';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';

export default function InsertSubjectModal({ defaultTrackSubj, isOpen, onClose,
     trackId, showToastMessage, callBack }) {
     const [subjects, setSubjects] = useState([]);
     const [trackSubj, setTrackSubj] = useState([])
     const [searchSubj, setSearchSubj] = useState("")
     const [filterSubj, setFilterSubj] = useState([])
     const [disabledInsertBtn, setDisabledInsertBtn] = useState(true);
     const [inserting, setInserting] = useState(false);

     const dupSubject = useMemo(() => {
          return defaultTrackSubj.map(subj => subj.subject_code)
     }, [defaultTrackSubj]);

     const fetchSubject = useCallback(async () => {
          const queryString = `?subjects=${dupSubject.join("&subjects=")}`
          const url = `/api/subjects/track/selection${queryString}`
          const option = await getOptions(url, "GET")
          try {
               const res = await axios(option)
               const filterSubjects = res.data.data
               setSubjects(filterSubjects)
          } catch (error) {
               setSubjects([])
               return
          }
     }, [dupSubject])

     useEffect(() => {
          fetchSubject()
     }, [dupSubject])

     useEffect(() => setFilterSubj(subjects), [subjects])

     useEffect(() => {
          if (searchSubj) {
               const data = subjects.filter(e =>
                    e.subject_code?.includes(searchSubj.toUpperCase()) ||
                    e.title_en?.includes(searchSubj.toUpperCase()) ||
                    e.title_th?.includes(searchSubj.toUpperCase()))
               setFilterSubj(data)
               return
          }
          setFilterSubj(subjects)
     }, [searchSubj])

     const addSubj = useCallback(function (subj) {
          setTrackSubj((prevState) => {
               const data = [...prevState];
               let status = false
               for (const e of data) {
                    if (e[subj.subject_code] === subj.subject_code) {
                         status = true
                         break
                    }
               }
               if (!status) {
                    let result = {
                         subject_id: subj.subject_id,
                         subject_code: subj.subject_code,
                         title_th: subj.title_th,
                         title_en: subj.title_en
                    }
                    data.push(result)
               }
               return data
          })
     }, [])

     useEffect(() => setDisabledInsertBtn(trackSubj.length == 0), [trackSubj])

     const delSubj = useCallback(function (subject_code) {
          const data = trackSubj.filter(element => element.subject_code !== subject_code)
          setTrackSubj(data)
     }, [trackSubj])

     const handleSubmit = useCallback(async (trackSubj) => {
          if (trackSubj.length == 0) return
          const formData = trackSubj.map(subject => subject.subject_id)
          console.log(formData);
          const url = `/api/tracks/subjects/${trackId}`
          const option = await getOptions(url, "POST", formData)
          try {
               setInserting(true)
               const res = await axios(option)
               const { ok, message } = res.data
               showToastMessage(ok, message)
               callBack()
               onClose()
          } catch (error) {
               console.log(error);
               const message = error.response.data.message
               showToastMessage(false, message)
          }finally{
               setInserting(false)
          }
     }, [trackId])


     return (
          <Modal
               size={"3xl"}
               isOpen={isOpen}
               onClose={onClose}
               isDismissable={false}
               placement={"top-center"}
          >
               <ModalContent>
                    {(onClose) => (
                         <>
                              <ModalHeader className="flex flex-col gap-1">เพิ่มการคัดเลือกแทรค</ModalHeader>
                              <ModalBody>
                                   <div className='flex flex-row gap-3'>
                                        <div className='w-1/2 flex flex-col'>
                                             <p>วิชาที่ใช้ในการคัดเลือก</p>
                                             <ul className='h-[210px] overflow-y-auto flex flex-col gap-1 p-2 border-1 rounded-md'>
                                                  {trackSubj.length > 0 ?
                                                       trackSubj.map((sbj, index) => (
                                                            <li key={index} className='bg-gray-100 rounded-md relative p-1 gap-2 border-1 border-b-gray-300'>
                                                                 <input
                                                                      readOnly
                                                                      className='bg-gray-100 block focus:outline-none font-bold'
                                                                      type="text"
                                                                      name="trackSubj[]"
                                                                      value={sbj.subject_code} />
                                                                 <p className='flex flex-col text-sm'>
                                                                      <span>{sbj.title_th}</span>
                                                                 </p>
                                                                 <Icon onClick={() => delSubj(sbj.subject_code)} icon="lets-icons:dell-duotone" className="absolute top-1 right-1 w-6 h-6 cursor-pointer active:scale-95 hover:opacity-80" />
                                                            </li>
                                                       ))
                                                       :
                                                       <li>ยังไม่มีวิชาในการคัดเลือก</li>}
                                             </ul>
                                        </div>
                                        <div className='w-1/2'>
                                             <p>ค้นหาวิชาเพื่อเพิ่ม</p>
                                             <div className='flex flex-col'>
                                                  <input
                                                       className='rounded-md border-1 w-full px-2 focus:outline-none mb-1'
                                                       type="search"
                                                       value={searchSubj}
                                                       onChange={(e) => setSearchSubj(e.target.value)}
                                                       placeholder='ค้นหาวิชา' />

                                                  <ul className='rounded-md border-1 h-[180px] overflow-y-auto p-2 flex flex-col gap-1'>
                                                       {filterSubj.map((subject, index) => (
                                                            !(trackSubj.map(z => z.subject_code).includes(subject.subject_code)) &&
                                                            <li onClick={() => addSubj(subject)} key={index} className='bg-gray-100 rounded-md flex flex-row gap-2 p-1 border-1 border-b-gray-300 cursor-pointer'>
                                                                 <strong className='block'>{subject.subject_code}</strong>
                                                                 <p className='flex flex-col text-sm'>
                                                                      <span>{subject.title_en}</span>
                                                                      <span>{subject.title_th}</span>
                                                                 </p>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </div>
                                   </div>
                              </ModalBody>
                              <ModalFooter>
                                   <Button
                                        type='button'
                                        className='border-1 py-4'
                                        radius='sm'
                                        color="primary"
                                        variant='bordered'
                                        onPress={onClose}>
                                        ยกเลิก
                                   </Button>
                                   <Button
                                        isDisabled={disabledInsertBtn || inserting}
                                        isLoading={inserting}
                                        className='py-4 ms-4'
                                        radius='sm'
                                        color="primary"
                                        variant='solid'
                                        type="submit"
                                        onClick={() => handleSubmit(trackSubj)}
                                   >
                                        เพิ่ม
                                   </Button>
                              </ModalFooter>
                         </>
                    )}
               </ModalContent>
          </Modal>
     )
}