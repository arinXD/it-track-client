"use client"
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { BsFillImageFill } from "react-icons/bs";
import { GoPaperclip } from "react-icons/go";
import Image from 'next/image';
import { AiOutlineDelete } from "react-icons/ai";

const UploadCover = ({ setImageFile, label, width, src = "" }) => {
    const [uploadImageFile, setUploadImageFile] = useState({});
    const [previewImage, setPreviewImage] = useState(src)

    useEffect(() => {
        if (uploadImageFile instanceof Blob || uploadImageFile instanceof File) {
            try {
                setImageFile(uploadImageFile)
                setPreviewImage(URL.createObjectURL(uploadImageFile));
            } catch (error) {
                console.error('Error creating object URL:', error);
            }
        } else {
            setPreviewImage(src)
        }
    }, [uploadImageFile]);

    return (
        <div className='flex flex-col mb-6'>
            <p className='text-center'>{label}</p>
            <div className={`${previewImage ? "border-2" : "border-2"} border-gray-400 mx-auto border-dashed ${width} h-[180px] mt-1 mb-3 grid grid-cols-1 place-items-center`}>
                {
                    previewImage ?
                        <img
                            // placeholder='empty'
                            // priority={false}
                            src={previewImage}
                            width={320}
                            height={180}
                            alt='cover image'
                            className={`${width} object-contain h-[180px]`}
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
                        onChange={e => {
                            const file = e.target.files?.[0]
                            setUploadImageFile(file)
                        }}
                        style={{ display: "none" }} />
                    <UploadOutlined className='w-3.5 h-3.5' />
                    <span className='ms-2.5 text-sm'>Click to Upload</span>
                </label>
            </div>
            <div className='flex flex-col'>
                {
                    (uploadImageFile instanceof Blob || uploadImageFile instanceof File) &&
                    <div className='text-sm flex items-center mt-2 w-full'>
                        <GoPaperclip className='text-default-500 me-2' />
                        <span className='block'>
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
        </div>
    )
}

export default UploadCover