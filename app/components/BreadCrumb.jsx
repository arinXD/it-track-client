'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, RightArrow } from './icons';
import { useEffect, useMemo } from 'react';

const links = {
    "/": "หน้าหลัก",
    "admin": "Admin Panel",
    "acadyears": "ปีการศึกษา",
    "program": "หลักสูตร",
    "programcode": "รหัสหลักสูตร",
    "category": "หมวดหมู่วิชา",
    "group": "กลุ่มวิชา",
    "subgroup": "กลุ่มย่อยวิชา",
    "subject": "วิชา",
    "track": "ข้อมูลแทร็ก",
    "track-selection": "คัดเลือกแทร็ก",
    "track-student": "รายชื่อนักศึกษาภายในแทร็ก",
    "dashboard": "Dashboard",
    "students": "รายชื่อนักศึกษา",
    "restore": "รายการที่ถูกลบ",
    "trackstudent": "รายชื่อนักศึกษาภายในแทร็ก",
    "verify": "แบบฟอร์มตรวจสอบจบ",
    "verify-selection": "อนุมัติจบการศึกษา",
    "detail": "รายละเอียด",
    "tracks": "แทร็ก",
    "web%20and%20mobile": "Mobile and Web Application Development",
    "network": "Network Systems, Information Technology Security, and Internet of Things (IoT)",
    "bit": "Business Information Technology",
    "insert-track": "เพิ่มแทร็ก",
};

const BreadCrumb = () => {
    const url = usePathname();
    const urls = useMemo(() => (url.split("/").filter(e => e)), [url])

    const breadCrumbElements = useMemo(() => {
        const elements = []
        for (const [index, currentUrl] of urls.entries()) {
            const isLastIndex = index + 1 === urls.length;
            let nextIndex = []
            for (let j = 0; j <= index; j++) {
                nextIndex.push(urls[j])
            }
            nextIndex = `/${nextIndex.join("/")}`
            elements.push(
                <li key={currentUrl} className="inline-flex items-center">
                    <div className="flex items-center">
                        {index === 0 ?
                            // index แรก
                            <>
                                <HomeIcon />
                                {
                                    isLastIndex ?
                                        <span
                                            style={{
                                                fontSize: "clamp(3px, 3vw, 16px)",
                                            }}
                                            className="text-sm font-medium text-gray-500">{links[currentUrl] || String(currentUrl)}</span>
                                        :
                                        <Link
                                            style={{
                                                fontSize: "clamp(3px, 3vw, 16px)",
                                            }}
                                            href={`/${currentUrl}`} 
                                            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                                            {links[currentUrl] || String(currentUrl)}
                                        </Link>
                                }
                            </>
                            :
                            // index ต่อไป
                            <>
                                <RightArrow/>
                                {
                                    isLastIndex ?
                                        <span
                                            style={{
                                                fontSize: "clamp(3px, 3vw, 16px)",
                                            }}
                                            className="ms-1.5 text-sm font-medium text-gray-500">{links[currentUrl] || String(currentUrl)}</span>
                                        :
                                        // แสดง link 
                                        <Link
                                            style={{
                                                fontSize: "clamp(3px, 3vw, 16px)",
                                            }}
                                            href={nextIndex} 
                                            className="ms-1.5 inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                                            {links[currentUrl] || String(currentUrl)}
                                        </Link>
                                }
                            </>
                        }
                    </div>
                </li>
            );
        }
        return elements
    }, [urls])

    return (
        <>
            <nav className="flex mb-3 w-full" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    {breadCrumbElements}
                </ol>
            </nav>
        </>
    );
}

export default BreadCrumb;