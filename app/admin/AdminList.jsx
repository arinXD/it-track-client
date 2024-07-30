
"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { IoMdCheckboxOutline } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineRectangleGroup } from "react-icons/hi2";
import { AiOutlineAppstore } from "react-icons/ai";
import { LuUngroup } from "react-icons/lu";
import { RiBookletLine } from 'react-icons/ri';
import { TbCheckupList } from "react-icons/tb";
import { IoBookOutline, IoBarChartOutline } from 'react-icons/io5';
import { LuTextSelect } from "react-icons/lu";

const AdminList = () => {
     const { data: session } = useSession();

     const teacherList = useMemo(() => ([
          "รายชื่อนักศึกษา", "ข้อมูลแทรค", "คัดเลือกแทรค",
          "รายชื่อนักศึกษาภายในแทรค", "อนุมัติจบการศึกษา", "สรุปผลการคัดเลือก"
     ]), []);

     const categories = useMemo(() => ([
          {
               title: "ทั่วไป",
               icon: AiOutlineAppstore,
               links: [
                    { href: "/admin/program", label: "หลักสูตร", icon: IoBookOutline },
                    { href: "/admin/category", label: "หมวดหมู่วิชา", icon: BiCategory },
                    { href: "/admin/group", label: "กลุ่มวิชา", icon: HiOutlineRectangleGroup },
                    { href: "/admin/subgroup", label: "กลุ่มย่อยวิชา", icon: LuUngroup },
                    { href: "/admin/subject", label: "วิชา", icon: RiBookletLine },
                    { href: "/admin/students", label: "รายชื่อนักศึกษา", icon: BsPerson },
               ]
          },
          {
               title: "แทร็ก",
               icon: HiOutlineUserGroup,
               links: [
                    { href: "/admin/track", label: "ข้อมูลแทรค", icon: HiOutlineUserGroup },
                    { href: "/admin/track-selection", label: "คัดเลือกแทรค", icon: LuTextSelect },
                    { href: "/admin/trackstudent", label: "รายชื่อนักศึกษาภายในแทรค", icon: BsPerson },
                    { href: "/admin/track-dashboard", label: "สรุปผลการคัดเลือกแทร็ก", icon: IoBarChartOutline },
               ]
          },
          {
               title: "แนะนำแทร็ก",
               icon: IoMdCheckboxOutline,
               links: [
                    { href: "/admin/suggest-form", label: "จัดการแบบฟอร์มแนะนำแทร็ก", icon: IoMdCheckboxOutline },
               ]
          },
          {
               title: "ตรวจสอบจบ",
               icon: HiOutlineAcademicCap,
               links: [
                    { href: "/admin/verify", label: "แบบฟอร์มตรวจสอบจบ", icon: HiOutlineAcademicCap },
                    { href: "/admin/verify-selection", label: "อนุมัติจบการศึกษา", icon: TbCheckupList },
               ]
          }
     ]), []);

     const renderLink = (link) => {
          const Icon = link.icon;
          return (
               <Link key={link.href} href={link.href} className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100">
                    <Icon className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="flex-1 whitespace-nowrap">{link.label}</span>
               </Link>
          );
     };

     const renderCategory = (category) => {
          const visibleLinks = category.links.filter(link =>
               session?.user?.role === "admin" || teacherList.includes(link.label)
          );

          if (visibleLinks.length === 0) return null;

          const CategoryIcon = category.icon;

          return (
               <div key={category.title} className="mb-6">
                    <h2 className="border-b flex items-center mb-2 text-lg font-semibold text-gray-700 p-2">
                         <CategoryIcon className="w-5 h-5 mr-2 text-gray-500" />
                         {category.title}
                    </h2>
                    <div className="space-y-2">
                         {visibleLinks.map(renderLink)}
                    </div>
               </div>
          );
     };

     return (
          <div className="p-6 bg-white rounded-lg shadow-md">
               <h1 className="mb-6 text-2xl font-bold text-gray-800">Admin Panel</h1>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map(renderCategory)}
               </div>
          </div>
     );
};

export default AdminList;