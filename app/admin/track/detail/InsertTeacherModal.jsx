"use client"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { UploadOutlined } from '@ant-design/icons';
import { GoPaperclip } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { Empty, Image, message } from "antd";
import { getToken } from "@/app/components/serverAction/TokenAction";
import { hostname } from "@/app/api/hostname";

const InsertTeacherModal = ({ emptyTeachers = [], isOpen, onClose, src = "", track, fn }) => {
    const [uploadImageFile, setUploadImageFile] = useState({});
    const [previewImage, setPreviewImage] = useState(src)
    const [uploadProgress, setUploadProgress] = useState(0);
    const [inserting, setInserting] = useState(false);

    const teachersArr = useMemo(() => {
        if (emptyTeachers?.length === 0) {
            return []
        } else {
            return emptyTeachers.map(t => ({
                key: t.id,
                name: `${t?.prefix || ""}${t?.name} ${t?.surname || ""}`,
            }))
        }
    }, [emptyTeachers])

    const handleUpload = useCallback(e => {
        const file = e.target.files?.[0]
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedFileTypes.includes(file.type)) {
            message.error("อัพโหลดได้เฉพาะรูปภาพเท่านั้น")
            document.querySelector("#image").value = ""
            return
        }
        if (file.size > 1024 * 1024 * 2) {
            message.error("รูปภาพต้องขนาดไม่เกิน 2MB")
            document.querySelector("#image").value = ""
            return
        }
        setUploadImageFile(file)
    }, [])

    useEffect(() => {
        if (uploadImageFile instanceof Blob || uploadImageFile instanceof File) {
            setPreviewImage(URL.createObjectURL(uploadImageFile));
        } else {
            setPreviewImage(src)
        }
    }, [uploadImageFile]);

    const closeForm = useCallback(() => {
        if (teachersArr.length > 0) document.querySelector("#image").value = ""
        setUploadImageFile({})
        setPreviewImage("")
        setUploadProgress(0)
        onClose()
    }, [teachersArr])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData.entries());
        console.log(formDataObject);
        const URL = "/api/teachers/tracks"
        const token = await getToken()
        const headers = {
            'Content-Type': 'multipart/form-data',
            'authorization': `${token}`,
        }

        if (uploadImageFile instanceof Blob || uploadImageFile instanceof File) {
            try {
                setInserting(true)
                await axios.post(`${hostname}${URL}`, formDataObject, {
                    headers,
                    onUploadProgress: (progressObj) => {
                        setUploadProgress(progressObj.progress * 100)
                    }
                });
                await fn()
                closeForm()
                message.success("เพิ่มข้อมูลสำเร็จ")
            } catch (error) {
                console.log(error);
                message.error("เพิ่มข้อมูลไม่สำเร็จ")
            } finally {
                setInserting(false)
            }
        } else {
            message.error("ต้องเพิ่มรูปอาจารย์ก่อน")
        }

    }, [uploadImageFile])
    return (
        <>
            <Modal
                size={"3xl"}
                isOpen={isOpen}
                onClose={closeForm}
                isDismissable={false}
            >
                <ModalContent>
                    {(closeForm) => (
                        <form
                            onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">แบบฟอร์มเพิ่มอาจารย์</ModalHeader>
                            <ModalBody>
                                {teachersArr.length > 0 ?
                                    <div className="flex gap-6">
                                        <div className={`${previewImage ? "border-0 !h-auto" : "border-1"} border-solid w-1/2 h-[300px] mt-1 mb-3 grid grid-cols-1 place-items-center`}>
                                            {
                                                previewImage ?
                                                    <Image
                                                        src={previewImage || "/image/user.png"}
                                                        width={"100%"}
                                                        height={350}
                                                        alt='cover image'
                                                        className={`w-full object-contain h-auto rounded-[10px]`}
                                                    />
                                                    :
                                                    <div className='flex flex-col justify-center items-center gap-1 text-[#E5E7EB]'>
                                                        <BsFillImageFill className='w-14 h-14' />
                                                        <p className='text-sm text-[#d5d9df]'>Preview รูปอาจารย์</p>
                                                    </div>
                                            }
                                        </div>
                                        <div className="w-1/2 flex flex-col">
                                            <input
                                                type="hidden"
                                                name="track"
                                                value={track} />
                                            <div>
                                                <Select
                                                    name='teacher_id'
                                                    variant='bordered'
                                                    classNames={{
                                                        trigger: "border-1",
                                                    }}
                                                    labelPlacement='outside'
                                                    label="อาจารย์"
                                                    placeholder="เลือกอาจารย์"
                                                >
                                                    {teachersArr.map((t) => (
                                                        <SelectItem key={t.key} value={t.key}>
                                                            {t.name}
                                                        </SelectItem>
                                                    ))}
                                                </Select>

                                            </div>
                                            <div className='flex flex-col justify-center items-start mt-4'>
                                                <span className="text-sm mb-2">อัพโหลดไฟล์รูปภาพ [ jpeg, jpg, png ]</span>
                                                <label className="w-fit hover:border-blue-500 hover:text-blue-500 transition duration-75 cursor-pointer border-1 border-default-300 rounded-md px-3.5 py-1 text-default-700">
                                                    <input
                                                        type="file"
                                                        accept='.jpg, .png, .jpeg'
                                                        name="image"
                                                        id="image"
                                                        onChange={handleUpload}
                                                        style={{ display: "none" }} />
                                                    <UploadOutlined className='w-3.5 h-3.5' />
                                                    <span className='ms-2.5 text-sm'>Click to Upload</span>
                                                </label>
                                            </div>
                                            <div className='flex flex-col'>
                                                {
                                                    (uploadImageFile instanceof Blob || uploadImageFile instanceof File) &&
                                                    <div className='text-sm flex items-center mt-2 w-full gap-2'>
                                                        <GoPaperclip className='text-default-500' />
                                                        <span className='block whitespace-nowrap w-full overflow-hidden text-ellipsis'>
                                                            {uploadImageFile.name}
                                                        </span>
                                                        <div
                                                            title="Remove file"
                                                            onClick={() => {
                                                                document.querySelector("#image").value = ""
                                                                setUploadImageFile({})
                                                            }}
                                                            className='bg-gray-200 p-1 ms-auto cursor-pointer transition duration-75 hover:bg-gray-300 rounded-md'>
                                                            <AiOutlineDelete className='text-default-500 w-4 h-4' />
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                uploadProgress > 0 &&
                                                <div className='flex gap-4 items-center'>
                                                    <progress
                                                        max={100}
                                                        value={uploadProgress}
                                                        className='w-[90%] mt-2 h-1 bg-default-500 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-violet-400 [&::-moz-progress-bar]:bg-violet-400' />
                                                    <span className='text-sm text-default-500'>{uploadProgress}%</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    :
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            <span className='text-gray-300'>ไม่มีข้อมูลคณาจารย์</span>
                                        }
                                    />
                                }
                            </ModalBody>
                            {teachersArr.length > 0 &&
                                <ModalFooter>
                                    <Button
                                        radius="sm"
                                        type="button"
                                        color="primary"
                                        variant="light"
                                        className="border-1 border-blue-500"
                                        onPress={closeForm}>
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        radius="sm"
                                        type="submit"
                                        isDisabled={inserting}
                                        isLoading={inserting}
                                        color="primary">
                                        {
                                            inserting ?
                                                "กำลังเพิ่ม..."
                                                :
                                                "เพิ่ม"
                                        }
                                    </Button>
                                </ModalFooter>
                            }
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default InsertTeacherModal