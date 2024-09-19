"use client"
"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardBody, Input, Select, SelectItem, Button, Checkbox, Modal, ModalContent, ModalHeader, Spinner } from "@nextui-org/react";
import { thinInputClass } from '@/src/util/ComponentClass';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import { message } from 'antd';

const TeacherForm = ({ tracks = [], teacher = {}, isOpen, onClose, fn }) => {
     const [formData, setFormData] = useState({});
     const [showTrackInput, setShowTrackInput] = useState(false);
     const [loading, setLoading] = useState(false);

     useEffect(() => {
          if (isOpen) {
               setLoading(true);
               if (Object.keys(teacher).length > 0) {
                    const track = teacher?.TeacherTrack?.track || "";
                    setShowTrackInput(!!track);
                    setFormData({
                         id: teacher.id,
                         email: teacher.email,
                         prefix: teacher.prefix,
                         name: teacher.name,
                         surname: teacher.surname,
                         track
                    });
               } else {
                    setFormData({});
                    setShowTrackInput(false);
               }
               setLoading(false);
          }
     }, [teacher, isOpen]);

     const trackItems = useMemo(() => (tracks.map(t => ({
          key: t, name: t
     }))), [tracks])

     const handleInputChange = (key, value) => {
          setFormData(prev => ({ ...prev, [key]: value }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (showTrackInput && !formData.track) {
               alert("กรุณาเลือกแทร็ก");
               return;
          }
          if (!showTrackInput) {
               formData.track = null
          }
          const data = { role: "teacher", ...formData }
          console.log(data);
          
          const option = await getOptions("/api/users", "post", data)
          try {
               await axios(option)
               message.success("บันทึกข้อมูลเรียบร้อย")
               await fn()
          } catch (error) {
               message.warning(error?.response?.data?.message)
          } finally {
               clearForm()
          }
     };
     const clearForm = useCallback(() => {
          setFormData({});
          setShowTrackInput(false);
          onClose()
     }, [])

     return (
          <Modal
               size={"xl"}
               isOpen={isOpen}
               onClose={clearForm}
          >
               <ModalContent>
                    {(clearForm) => (
                         <>
                              <Card className="p-4">
                                   <CardHeader className="grid grid-cols-4">
                                        <div className="col-span-3 flex flex-col">
                                             <p className="text-md tracking-[.04em]">เพิ่มข้อมูลอาจารย์</p>
                                             <p className="text-small text-default-500 tracking-[.04em]">ป้อนรายละเอียดสำหรับเพิ่มข้อมูลอาจารย์</p>
                                        </div>
                                   </CardHeader>
                                   <CardBody>
                                        {loading ?
                                             <div className='flex justify-center items-center my-6'>
                                                  <Spinner />
                                             </div>
                                             :
                                             <form onSubmit={handleSubmit} className='space-y-6'>
                                                  <div className='space-y-9'>
                                                       <section className="space-y-6">
                                                            <div className='space-y-9'>
                                                                 <Input
                                                                      isRequired
                                                                      labelPlacement="outside"
                                                                      classNames={thinInputClass}
                                                                      type="email"
                                                                      label="อีเมล"
                                                                      placeholder="กรอกอีเมล"
                                                                      value={formData.email || ""}
                                                                      onChange={(e) => handleInputChange("email", e.target.value)}
                                                                 />
                                                                 <Input
                                                                      isRequired
                                                                      labelPlacement="outside"
                                                                      classNames={thinInputClass}
                                                                      label="คำนำหน้า"
                                                                      placeholder="กรอกคำนำหน้า"
                                                                      value={formData.prefix || ""}
                                                                      onChange={(e) => handleInputChange("prefix", e.target.value)}
                                                                 />
                                                                 <Input
                                                                      isRequired
                                                                      labelPlacement="outside"
                                                                      classNames={thinInputClass}
                                                                      label="ชื่อ"
                                                                      placeholder="กรอกชื่อ"
                                                                      value={formData.name || ""}
                                                                      onChange={(e) => handleInputChange("name", e.target.value)}
                                                                 />
                                                                 <Input
                                                                      isRequired
                                                                      labelPlacement="outside"
                                                                      classNames={thinInputClass}
                                                                      label="นามสกุล"
                                                                      placeholder="กรอกนามสกุล"
                                                                      value={formData.surname || ""}
                                                                      onChange={(e) => handleInputChange("surname", e.target.value)}
                                                                 />
                                                            </div>
                                                            <div className='grid grid-cols-4'>
                                                                 <div className='col-span-1 w-full flex justify-start items-start'>
                                                                      <Checkbox
                                                                           className=''
                                                                           classNames={{
                                                                                label: "!text-xs font-bold",
                                                                           }}
                                                                           isSelected={showTrackInput}
                                                                           onValueChange={setShowTrackInput}
                                                                      >
                                                                           เพิ่มแทร็ก
                                                                      </Checkbox>
                                                                 </div>
                                                                 {showTrackInput && (
                                                                      <div className='col-span-3'>
                                                                           <Select
                                                                                variant='bordered'
                                                                                classNames={{
                                                                                     trigger: "border-1",
                                                                                }}
                                                                                labelPlacement='outside'
                                                                                label="แทร็ก"
                                                                                placeholder="เลือกแทร็ก"
                                                                                defaultSelectedKeys={[formData.track || ""]}
                                                                                onChange={(e) => handleInputChange("track", e.target.value)}
                                                                           >
                                                                                <SelectItem key={""} value={""}>
                                                                                     เลือกแทร็ก
                                                                                </SelectItem>
                                                                                {trackItems.map((track) => (
                                                                                     <SelectItem key={track.key} value={track.key}>
                                                                                          {track.name}
                                                                                     </SelectItem>
                                                                                ))}
                                                                           </Select>
                                                                      </div>

                                                                 )}
                                                            </div>
                                                       </section>
                                                  </div>
                                                  <div className='flex gap-4'>
                                                       <Button color="primary" type="submit">
                                                            บันทึก
                                                       </Button>
                                                       <Button
                                                            onClick={clearForm}
                                                            color="primary"
                                                            variant="bordered"
                                                            className='border-1'
                                                            type="button">
                                                            ยกเลิก
                                                       </Button>
                                                  </div>
                                             </form>
                                        }
                                   </CardBody>
                              </Card>
                         </>
                    )}
               </ModalContent>
          </Modal>
     )
}

export default TeacherForm