"use client"
import Link from 'next/link';
import { IoBookOutline } from "react-icons/io5";
import { IoMdCheckboxOutline } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { HiOutlineAcademicCap, HiOutlineUserGroup } from "react-icons/hi2";
import { AiOutlineEdit } from "react-icons/ai";
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { GrPieChart } from "react-icons/gr";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { LuUngroup } from "react-icons/lu";
import { RiBookletLine } from 'react-icons/ri';
import { TbCheckupList } from "react-icons/tb";

const AdminList = () => {
     const { data: session } = useSession();

     const masker = useMemo(() => ({
          maskImage: 'url("/masker/grit.png")',
     }), []);

     const teacherList = useMemo(() => ([
          "รายชื่อนักศึกษา", "ข้อมูลแทรค", "คัดเลือกแทรค",
          "รายชื่อนักศึกษาภายในแทรค", "อนุมัติจบการศึกษา", "สรุปผลการคัดเลือก"
     ]), []);

     const categories = useMemo(() => ([
          {
               title: "ทั่วไป",
               links: [
                    { href: "/admin/program", lable: "หลักสูตร", icon: IoBookOutline },
                    // { href: "/admin/programcode", lable: "รหัสหลักสูตร", icon: IoBook },
                    { href: "/admin/category", lable: "หมวดหมู่วิชา", icon: BiCategory },
                    { href: "/admin/group", lable: "กลุ่มวิชา", icon: HiOutlineRectangleGroup },
                    { href: "/admin/subgroup", lable: "กลุ่มย่อยวิชา", icon: LuUngroup },
                    { href: "/admin/subject", lable: "วิชา", icon: RiBookletLine },
                    { href: "/admin/students", lable: "รายชื่อนักศึกษา", icon: BsPerson },
               ]
          },
          {
               title: "แทร็ก",
               links: [
                    { href: "/admin/track", lable: "ข้อมูลแทรค", icon: HiOutlineUserGroup },
                    { href: "/admin/track-selection", lable: "คัดเลือกแทรค", icon: AiOutlineEdit },
                    { href: "/admin/trackstudent", lable: "รายชื่อนักศึกษาภายในแทรค", icon: BsPerson },
                    { href: "/admin/track-dashboard", lable: "สรุปผลการคัดเลือกแทร็ก", icon: GrPieChart },
               ]
          },
          {
               title: "แนะนำแทร็ก",
               links: [
                    { href: "/admin/suggest-form", lable: "แบบฟอร์มแนะนำแทร็ก", icon: IoMdCheckboxOutline },
               ]
          },
          {
               title: "ตรวจสอบจบ",
               links: [
                    { href: "/admin/verify", lable: "แบบฟอร์มตรวจสอบจบ", icon: HiOutlineAcademicCap },
                    { href: "/admin/verify-selection", lable: "อนุมัติจบการศึกษา", icon: TbCheckupList },
               ]
          }
     ]), []);

     const renderLink = (link, index) => {
          const Icon = link.icon;
          return (
               <li key={index}>
                    <Link className='block group' href={link.href}>
                         <div className='bg-[#ebecee] p-3 h-36 flex justify-center items-center'>
                              <Icon style={masker} className='w-24 h-24 group-hover:scale-110 transition-transform text-[#333333]' />
                         </div>
                         <p className='text-[#2C2F31] mt-1.5'>{link.lable}</p>
                    </Link>
               </li>
          );
     };

     const renderCategory = (category, index) => {
          const visibleLinks = category.links.filter(link =>
               session?.user?.role === "admin" || teacherList.includes(link.lable)
          );

          if (visibleLinks.length === 0) return null;

          return (
               <div key={index} className='first:mt-0'>
                    <h2 className="font-bold text-2xl mb-4">{category.title}</h2>
                    <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-6'>
                         {visibleLinks.map(renderLink)}
                    </ul>
               </div>
          );
     };

     return (
          <div className='flex flex-col space-y-8 mt-8'>
               {categories.map(renderCategory)}
          </div>
     );
};

export default AdminList;