"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardBody, Input, Select, SelectItem, Button, Checkbox } from "@nextui-org/react";
import { thinInputClass } from '@/src/util/ComponentClass';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import axios from 'axios';
import { message } from 'antd';

export default function AccountCreationForm({ tracks, programs }) {
     const [selectedRole, setSelectedRole] = useState("admin");
     const [formData, setFormData] = useState({});
     const [showTrackInput, setShowTrackInput] = useState(false);

     const roles = useMemo(() => ([
          { key: "admin", name: "แอดมิน" },
          { key: "teacher", name: "อาจารย์" },
          { key: "student", name: "นักศึกษา" },
     ]), [])

     const ctype = useMemo(() => ([
          { key: "reg", name: "โครงการปกติ" },
          { key: "spe", name: "โครงการพิเศษ" },
     ]), [])

     const trackItems = useMemo(() => (tracks.map(t => ({
          key: t, name: t
     }))), [tracks])

     const programItems = useMemo(() => (programs.map(p => ({
          key: p, name: p
     }))), [programs])

     const handleRoleChange = (role) => {
          setSelectedRole(role);
          setFormData({});
          setShowTrackInput(false);
     };

     const handleInputChange = (key, value) => {
          setFormData(prev => ({ ...prev, [key]: value }));
     };

     const renderFormFields = () => {
          switch (selectedRole) {
               case "admin":
                    return (
                         <section className="space-y-9">
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   type="email"
                                   label="อีเมล"
                                   placeholder="กรอกอีเมล"
                                   value={formData.email || ""}
                                   onChange={(e) => handleInputChange("email", e.target.value)}
                              />
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   type="password"
                                   label="รหัสผ่าน"
                                   placeholder="กรอกรหัสผ่าน"
                                   value={formData.password || ""}
                                   onChange={(e) => handleInputChange("password", e.target.value)}
                              />
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   label="คำนำหน้า"
                                   placeholder="กรอกคำนำหน้า"
                                   value={formData.prefix || ""}
                                   onChange={(e) => handleInputChange("prefix", e.target.value)}
                              />
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   label="ชื่อ"
                                   placeholder="กรอกชื่อ"
                                   value={formData.name || ""}
                                   onChange={(e) => handleInputChange("name", e.target.value)}
                              />
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   label="นามสกุล"
                                   placeholder="กรอกนามสกุล"
                                   value={formData.surname || ""}
                                   onChange={(e) => handleInputChange("surname", e.target.value)}
                              />
                         </section>
                    );
               case "teacher":
                    return (
                         <section className="space-y-6">
                              <div className='space-y-9'>
                                   <Input
                                        labelPlacement="outside"
                                        classNames={thinInputClass}
                                        type="email"
                                        label="อีเมล"
                                        placeholder="กรอกอีเมล"
                                        value={formData.email || ""}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                   />
                                   <Input
                                        labelPlacement="outside"
                                        classNames={thinInputClass}
                                        label="คำนำหน้า"
                                        placeholder="กรอกคำนำหน้า"
                                        value={formData.prefix || ""}
                                        onChange={(e) => handleInputChange("prefix", e.target.value)}
                                   />
                                   <Input
                                        labelPlacement="outside"
                                        classNames={thinInputClass}
                                        label="ชื่อ"
                                        placeholder="กรอกชื่อ"
                                        value={formData.name || ""}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                   />
                                   <Input
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
                                                  onChange={(e) => handleInputChange("track", e.target.value)}
                                             >
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
                    );
               case "student":
                    return (
                         <section className="space-y-9">
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   label="อีเมล"
                                   type="email"
                                   placeholder="กรอกอีเมล"
                                   value={formData.email || ""}
                                   onChange={(e) => handleInputChange("email", e.target.value)}
                              />
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   label="รหัสนักศึกษา"
                                   placeholder="กรอกรหัสนักศึกษา"
                                   value={formData.stu_id || ""}
                                   onChange={(e) => handleInputChange("stu_id", e.target.value)}
                              />
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   label="ชื่อ"
                                   placeholder="กรอกชื่อ"
                                   value={formData.first_name || ""}
                                   onChange={(e) => handleInputChange("first_name", e.target.value)}
                              />
                              <Input
                                   labelPlacement="outside"
                                   classNames={thinInputClass}
                                   label="นามสกุล"
                                   placeholder="กรอกนามสกุล"
                                   value={formData.last_name || ""}
                                   onChange={(e) => handleInputChange("last_name", e.target.value)}
                              />
                              <Select
                                   variant='bordered'
                                   classNames={{
                                        trigger: "border-1",
                                   }}
                                   labelPlacement='outside'
                                   label="โครงการ"
                                   placeholder="เลือกโครงการ"
                                   onChange={(e) => handleInputChange("courses_type", e.target.value)}
                              >
                                   {ctype.map((type) => (
                                        <SelectItem key={type.key} value={type.key}>
                                             {type.name}
                                        </SelectItem>
                                   ))}
                              </Select>
                              <Select
                                   variant='bordered'
                                   classNames={{
                                        trigger: "border-1",
                                   }}
                                   labelPlacement='outside'
                                   label="หลักสูตร"
                                   placeholder="เลือกหลักสูตร"
                                   onChange={(e) => handleInputChange("program", e.target.value)}
                              >
                                   {programItems.map((p) => (
                                        <SelectItem key={p.key} value={p.key}>
                                             {p.name}
                                        </SelectItem>
                                   ))}
                              </Select>
                         </section>
                    );
               default:
                    return null;
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (selectedRole === "admin" && (!formData.email || !formData.password)) {
               alert("กรุณากรอกอีเมลและรหัสผ่าน");
               return;
          }
          if (selectedRole === "teacher" && showTrackInput && !formData.track) {
               alert("กรุณาเลือกแทร็ก");
               return;
          }
          if (selectedRole === "student" && (!formData.stu_id || !formData.courses_type || !formData.program)) {
               console.log(formData);

               alert("กรุณากรอกข้อมูลให้ครบถ้วน");
               return;
          }
          const data = { role: selectedRole, ...formData }
          const option = await getOptions("/api/users", "post", data)
          try {
               await axios(option)
               setFormData({});
               setShowTrackInput(false);
               alert("บัญชีถูกสร้างเรียบร้อยแล้ว");
          } catch (error) {
               message.warning(error?.response?.data?.message)
          }

     };

     return (
          <Card className="max-w-xl mx-auto mt-4 shadow border">
               <CardHeader className="grid grid-cols-4">
                    <div className="col-span-3 flex flex-col">
                         <p className="text-md tracking-[.04em]">สร้างบัญชีใหม่</p>
                         <p className="text-small text-default-500 tracking-[.04em]">ป้อนรายละเอียดสำหรับบัญชีใหม่</p>
                    </div>
                    <div className='col-span-1'>
                         <Select
                              variant='bordered'
                              classNames={{
                                   label: "!text-xs",
                                   trigger: "border-1 h-10 !text-xs rounded-xl !py-6",
                              }}
                              label="เลือกโรล"
                              placeholder="Choose a role"
                              selectedKeys={[selectedRole]}
                              onChange={(e) => handleRoleChange(e.target.value)}
                         >
                              {roles.map((role) => (
                                   <SelectItem key={role.key} value={role.key}>
                                        {role.name}
                                   </SelectItem>
                              ))}
                         </Select>
                    </div>
               </CardHeader>
               {selectedRole &&
                    <CardBody>
                         <form onSubmit={handleSubmit} className='space-y-6'>
                              <div className='space-y-9'>
                                   {renderFormFields()}
                              </div>
                              <Button color="primary" type="submit">
                                   สร้างบัญชี
                              </Button>
                         </form>
                    </CardBody>
               }
          </Card>
     );
};