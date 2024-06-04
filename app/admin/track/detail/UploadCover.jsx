"use client"
import { useCallback, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { BsFillImageFill } from "react-icons/bs";
import { GoPaperclip } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import { message, Image } from 'antd';

const UploadCover = ({ setImageFile, label, width, src = "", uploadProgress, containerWidth="" }) => {
    const [uploadImageFile, setUploadImageFile] = useState({});
    const [previewImage, setPreviewImage] = useState(src)

    const handleUpload = useCallback(e => {
        const file = e.target.files?.[0]
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedFileTypes.includes(file.type)) {
            message.error("อัพโหลดได้เฉพาะรูปภาพเท่านั้น")
            document.querySelector("#coverImg").value = ""
            return
        }
        if (file.size > 1024 * 1024 * 2) {
            message.error("รูปภาพต้องขนาดไม่เกิน 2MB")
            document.querySelector("#coverImg").value = ""
            return
        }
        setUploadImageFile(file)
    }, [])

    useEffect(() => {
        if (uploadImageFile instanceof Blob || uploadImageFile instanceof File) {
            setImageFile(uploadImageFile)
            setPreviewImage(URL.createObjectURL(uploadImageFile));

        } else {
            setPreviewImage(src)
        }
    }, [uploadImageFile]);

    return (
        <div className={`flex flex-col ${containerWidth}`}>
            <p className='text-center'>{label}</p>
            <div className={`${previewImage ? "!border-solid border-1 !h-auto" : "border-2"} border-gray-400 mx-auto border-dashed ${width} h-[180px] mt-1 mb-3 grid grid-cols-1 place-items-center`}>
                {
                    previewImage ?
                        <Image
                            src={previewImage}
                            width={"100%"}
                            height={180}
                            alt='cover image'
                            className={`${width} object-cover h-[180px]`}
                        />
                        :
                        <div className='flex flex-col justify-center items-center gap-1 text-[#E5E7EB]'>
                            <BsFillImageFill className='w-14 h-14' />
                            <p className='text-sm text-[#d5d9df]'>Preview {label}</p>
                        </div>
                }
            </div>
            <div className='flex justify-center items-center'>
                <label className="w-fit hover:border-blue-500 hover:text-blue-500 transition duration-75 cursor-pointer border-1 border-default-300 rounded-md px-3.5 py-1 text-default-700">
                    <input
                        type="file"
                        accept='.jpg, .png, .jpeg'
                        name="coverImg"
                        id="coverImg"
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
                                document.querySelector("#coverImg").value = ""
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
    )
}

export default UploadCover