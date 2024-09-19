"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { BiCategory } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineRectangleGroup } from "react-icons/hi2";
import { LuUngroup } from "react-icons/lu";
import { RiBookletLine, RiUserSettingsLine } from 'react-icons/ri';
import { TbCheckupList } from "react-icons/tb";
import { IoBookOutline, IoBarChartOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { LuTextSelect } from "react-icons/lu";
import { IoNewspaperOutline } from "react-icons/io5";
import { BiCheckbox } from "react-icons/bi";
import { capitalize } from '@/src/util/utils';

const AdminList = ({ }) => {
     const { data: session } = useSession();

     const teacherCategories = [
          {
               title: "หลักสูตร",
               links: [
                    { href: "/admin/students", label: "รายชื่อนักศึกษาทั้งหมด", icon: BsPerson },
                    { href: "/admin/students-advisor", label: "รายชื่อนักศึกษาในที่ปรึกษา", icon: BsPerson },
               ]
          },
          {
               title: "แทร็ก",
               links: [
                    { href: "/admin/track", label: "ข้อมูลแทร็ก", icon: HiOutlineUserGroup },
                    { href: "/admin/track-selection", label: "คัดเลือกแทร็ก", icon: LuTextSelect },
                    { href: "/admin/trackstudent", label: "รายชื่อนักศึกษาภายในแทร็ก", icon: BsPerson },
                    { href: "/admin/track-dashboard", label: "สรุปผลการคัดเลือกแทร็ก", icon: IoBarChartOutline },
               ]
          },
          {
               title: "ตรวจสอบจบ",
               links: [
                    { href: "/admin/verify", label: "แบบฟอร์มตรวจสอบจบการศึกษา", icon: HiOutlineAcademicCap },
                    { href: "/admin/verify-selection", label: "อนุมัติจบการศึกษา", icon: TbCheckupList },
               ]
          }
     ]

     const adminCategories = [
          {
               title: "ทั่วไป",
               links: [
                    { href: "/admin/users", label: "จัดการบัญชี", icon: RiUserSettingsLine },
                    { href: "/admin/teachers", label: "จัดการข้อมูลอาจารย์", icon: RiUserSettingsLine },
                    { href: "/admin/news", label: "จัดการข่าวสาร", icon: IoNewspaperOutline },
               ]
          },
          {
               title: "หลักสูตร",
               links: [
                    { href: "/admin/program", label: "หลักสูตร", icon: IoBookOutline },
                    { href: "/admin/category", label: "หมวดหมู่วิชา", icon: BiCategory },
                    { href: "/admin/group", label: "กลุ่มวิชา", icon: HiOutlineRectangleGroup },
                    { href: "/admin/subgroup", label: "กลุ่มย่อยวิชา", icon: LuUngroup },
                    { href: "/admin/semisubgroup", label: "กลุ่มรองวิชา", icon: BiCheckbox },
                    { href: "/admin/subject", label: "วิชา", icon: RiBookletLine },
                    { href: "/admin/students", label: "รายชื่อนักศึกษาทั้งหมด", icon: BsPerson },
               ]
          },
          {
               title: "แทร็ก",
               links: [
                    { href: "/admin/track", label: "ข้อมูลแทร็ก", icon: HiOutlineUserGroup },
                    { href: "/admin/track-selection", label: "คัดเลือกแทร็ก", icon: LuTextSelect },
                    { href: "/admin/trackstudent", label: "รายชื่อนักศึกษาภายในแทร็ก", icon: BsPerson },
                    { href: "/admin/track-dashboard", label: "สรุปผลการคัดเลือกแทร็ก", icon: IoBarChartOutline },
                    { href: "/admin/petitions/all", label: "จัดการคำร้องย้ายแทร็ก", icon: IoDocumentTextOutline },
               ]
          },
          {
               title: "แนะนำแทร็ก",
               links: [
                    { href: "/admin/suggest-form", label: "จัดการแบบฟอร์มแนะนำแทร็ก", icon: LuTextSelect },
               ]
          },
          {
               title: "ตรวจสอบจบ",
               links: [
                    { href: "/admin/verify", label: "แบบฟอร์มตรวจสอบจบการศึกษา", icon: HiOutlineAcademicCap },
                    { href: "/admin/verify-selection", label: "อนุมัติจบการศึกษา", icon: TbCheckupList },
               ]
          }
     ]

     const categories = useMemo(() => {
          const cat = {
               "admin": adminCategories,
               "teacher": teacherCategories
          }
          return cat[session?.user?.role] ?? []
     }, [session])

     const renderMenuItem = (item) => {
          const Icon = item.icon;
          return (
               <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <Icon className="w-10 h-10 mb-3 text-blue-600" />
                    <span className="text-center text-gray-800 font-medium">{item.label}</span>
               </Link>
          );
     };

     const renderCategory = (category, index) => {
          return (
               <div key={index} className="mb-10">
                    <h2 className="mb-5 text-2xl font-bold text-gray-800 border-b border-b-gray-300 pb-2">{category.title}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                         {category.links.map(renderMenuItem)}
                    </div>
               </div>
          );
     };

     return (
          <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
               <h1 className="mb-8 text-3xl font-bold text-gray-900 ">{capitalize(session?.user?.role) || "Admin"} Panel</h1>
               {categories.map(renderCategory)}
          </div>
     );
};

export default AdminList;