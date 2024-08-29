"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Icon } from '@iconify/react';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import { Empty, message } from 'antd';

export default function InsertSubjectModal({
     defaultTrackSubj, isOpen, onClose, trackId, cb, acadyear, setRendering
}) {
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
          const url = `/api/tracks/subjects/${trackId}`
          const option = await getOptions(url, "POST", formData)
          try {
               setInserting(true)
               setRendering(true)
               await axios(option)
               await cb(acadyear)
               setTrackSubj([])
               onClose()
          } catch (error) {
               console.log(error);
               const msg = error?.response?.data?.message
               message.error(msg)
          } finally {
               setInserting(false)
               setRendering(false)
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
                              <ModalHeader className="flex flex-col gap-1">เพิ่มการคัดเลือกแทร็ก</ModalHeader>
                              <ModalBody>
                                   <div className="flex flex-col md:flex-row gap-6 mt-2">
                                        <div className="w-full md:w-1/2">
                                             <h3 className="text-normal font-semibold mb-2">วิชาที่ใช้ในการคัดเลือก {trackSubj.length} วิชา</h3>
                                             <div className="h-[234px] overflow-y-auto border border-gray-200 rounded-lg shadow-sm">
                                                  {trackSubj.length > 0 ? (
                                                       <ul className="divide-y divide-gray-200">
                                                            {trackSubj.map((sbj, index) => (
                                                                 <li key={index} className="p-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                                                      <div className="flex items-center justify-between">
                                                                           <div>
                                                                                <p className="font-medium text-gray-900">{sbj.subject_code}</p>
                                                                                <p className="text-sm text-gray-600">{sbj.title_th}</p>
                                                                           </div>
                                                                           <button
                                                                                type="button"
                                                                                onClick={() => delSubj(sbj.subject_code)}
                                                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                                                           >
                                                                                <Icon icon="heroicons-outline:trash" className="w-5 h-5" />
                                                                           </button>
                                                                      </div>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  ) : (
                                                       <div className="flex items-center justify-center h-full">
                                                            <Empty
                                                                 description={
                                                                      <span className='text-default-300'>ยังไม่มีวิชาที่เลือก</span>
                                                                 }
                                                            />
                                                       </div>
                                                  )}
                                             </div>
                                        </div>

                                        <div className="w-full md:w-1/2">
                                             <h3 className="text-normal font-semibold mb-2">ค้นหาวิชาเพื่อเพิ่ม</h3>
                                             <div className="mb-3">
                                                  <input
                                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                       type="search"
                                                       value={searchSubj}
                                                       onChange={(e) => setSearchSubj(e.target.value)}
                                                       placeholder="ค้นหาวิชา"
                                                  />
                                             </div>
                                             <div className="h-[180px] overflow-y-auto border border-gray-200 rounded-lg shadow-sm">
                                                  <ul className="divide-y divide-gray-200">
                                                       {filterSubj.map((subject, index) => (
                                                            !trackSubj.map(z => z.subject_code).includes(subject.subject_code) && (
                                                                 <li
                                                                      key={index}
                                                                      onClick={() => addSubj(subject)}
                                                                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out"
                                                                 >
                                                                      <p className="font-medium text-gray-900">{subject.subject_code}</p>
                                                                      <p className="text-sm text-gray-600">{subject.title_en}</p>
                                                                      <p className="text-sm text-gray-500">{subject.title_th}</p>
                                                                 </li>
                                                            )
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