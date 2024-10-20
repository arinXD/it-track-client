"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Form, Input, Switch, message, Image } from 'antd';
import { Button } from '@nextui-org/react';
import { UploadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { hostname } from '@/app/api/hostname';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
     ssr: false,
     loading: () => <p>Loading editor...</p>,
});

const EditNews = ({ id }) => {
     const [form] = Form.useForm();
     const [loading, setLoading] = useState(false);
     const [imageUrl, setImageUrl] = useState('');
     const [imageFile, setImageFile] = useState(null);
     const [newImagePreview, setNewImagePreview] = useState('');
     const [editorContent, setEditorContent] = useState('');
     const quillRef = useRef();

     useEffect(() => {
          if (id) {
               fetchNewsDetails();
          }
     }, [id]);

     const fetchNewsDetails = async () => {
          try {
               const response = await axios.get(`${hostname}/api/news/${id}`);
               const newsData = response.data;
               form.setFieldsValue({
                    title: newsData.title,
                    desc: newsData.desc,
                    published: newsData.published,
               });
               setImageUrl(newsData.image);
               setEditorContent(newsData.detail || '');
               form.setFieldsValue({ detail: newsData.detail || '' });
          } catch (error) {
               console.error('Error fetching news details:', error);
               message.error('Failed to fetch news details');
          }
     };

     const handleImageChange = (e) => {
          const file = e.target.files?.[0]
          const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
          if (!allowedFileTypes.includes(file.type)) {
               message.error("อัพโหลดได้เฉพาะรูปภาพเท่านั้น")
               document.querySelector("#coverImg").value = ""
               return
          }
          if (file.size > 1024 * 1024 * 10) {
               message.error("รูปภาพต้องขนาดไม่เกิน 10MB")
               document.querySelector("#coverImg").value = ""
               return
          }
          setImageFile(file)
          if (file) {
               const reader = new FileReader();
               reader.onloadend = () => {
                    setNewImagePreview(reader.result);
               };
               reader.readAsDataURL(file);
          }
     };

     const modules = useMemo(() => ({
          toolbar: {
               container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
               ],
          }
     }), []);

     const onFinish = async (values) => {
          setLoading(true);
          const formData = new FormData();
          if (newImagePreview) {
               formData.append('originalImage', imageUrl);
               formData.append('image', imageFile);
          }
          Object.keys(values).forEach(key => {
               if (key !== 'image') {
                    formData.append(key, values[key]);
               }
          });

          formData.append('detail', editorContent);

          try {
               await axios.put(`${hostname}/api/news/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
               });
               message.success('News updated successfully');
               setTimeout(() => {
                    window.location.href = "/admin/news"
               }, 1000);
          } catch (error) {
               setLoading(false);
               console.error('Error updating news:', error);
               message.error('Failed to update news');
          }
     };

     return (
          <div className="border p-6 bg-white rounded-lg mt-8">
               <h2 className="text-2xl font-bold mb-6 text-start text-gray-800">แก้ไขข้อมูลข่าวประชาสัมพันธ์</h2>
               <Form
                    form={form}
                    layout="vertical"
                    className='h-full'
                    onFinish={onFinish}
               >
                    <Form.Item
                         name="title"
                         label="หัวเรื่อง"
                         rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                         <Input />
                    </Form.Item>
                    <Form.Item
                         name="desc"
                         label="รายละเอียดแบบย่อ"
                         rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                         <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                         name="detail"
                         label="เนื้อหาข่าว"
                         rules={[{ required: true, message: 'Please input the detail!' }]}
                    >
                         <ReactQuill
                              ref={quillRef}
                              theme="snow"
                              value={editorContent}
                              onChange={(content, delta, source, editor) => {
                                   setEditorContent(content);
                                   form.setFieldsValue({ detail: content });
                              }}
                              modules={modules}
                              style={{ height: '300px', marginBottom: '50px' }}
                         />
                    </Form.Item>
                    <div className='flex items-center gap-4 mb-6'>
                         <p>สถานะการเผยแพร่</p>
                         <Form.Item className='mb-0' name="published" valuePropName="checked">
                              <Switch />
                         </Form.Item>
                    </div>
                    {!newImagePreview && (
                         <div>
                              <p>ภาพข่าว</p>
                              <div className='border rounded-lg flex justify-between items-center'>
                                   <Image
                                        src={imageUrl}
                                        className='w-full h-full object-cover rounded-lg'
                                        alt="New image preview"
                                        width={"100%"}
                                        fallback="/image/error_image.png"
                                        height={300} />
                              </div>
                         </div>
                    )}
                    {newImagePreview && (
                         <div>
                              <p>ภาพข่าว</p>
                              <div className='border rounded-lg flex justify-between items-center'>
                                   <Image
                                        src={newImagePreview}
                                        className='w-full h-full object-cover rounded-lg'
                                        alt="New image preview"
                                        width={"100%"}
                                        fallback="/image/error_image.png"
                                        height={300} />
                                        
                              </div>
                         </div>
                    )}
                    <Form.Item name="image" className='mt-6'>
                         <p className='mb-2 text-sm text-default-800'>อัพโหลดรูปภาพ. ขนาดไฟล์สูงสุด 10 MB.</p>
                         <div className='flex'>
                              <label className="hover:bg-blue-50 hover:border-blue-400 w-fit border-gray-300 bg-white text-blue-500 transition duration-75 cursor-pointer border rounded-md px-3.5 py-2">
                                   <input
                                        type="file"
                                        accept='.jpg, .png, .jpeg'
                                        name="coverImg"
                                        id="coverImg"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }} />
                                   <UploadOutlined className='w-3.5 h-3.5 me-2' />
                                   เพิ่มรูป
                              </label>
                         </div>
                    </Form.Item>
                    <div className='mb-0 mt-8 flex gap-4'>
                         <Button
                              isLoading={loading}
                              color='primary'
                              className='rounded-[5px]'
                              type='submit'
                         >
                              บันทึก
                         </Button>
                         <Link href="/admin/news">
                              <Button
                                   variant="bordered"
                                   type="button"
                                   className="rounded-[5px] border-1 border-white hover:border-blue-700 hover:text-blue-700"
                              >
                                   ยกเลิก
                              </Button>
                         </Link>
                    </div>
               </Form>
          </div>
     );
};

export default EditNews;