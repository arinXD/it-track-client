'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, RightArrow } from './icons';
import { useEffect, useMemo } from 'react';

const links = {
    "/": "หน้าหลัก",
    "admin": "หน้าหลัก",
    "acadyears": "ปีการศึกษา",
    "program": "หลักสูตร",
    "programcode": "รหัสหลักสูตร",
    "category": "หมวดหมู่วิชา",
    "group": "กลุ่มวิชา",
    "subgroup": "กลุ่มย่อยวิชา",
    "subject": "วิชา",
    "track": "ข้อมูลแทรค",
    "track-selection": "คัดเลือกแทรค",
    "track-student": "รายชื่อนักศึกษาภายในแทรค",
    "dashboard": "Dashboard",
    "students": "รายชื่อนักศึกษา",
    "restore": "รายการที่ถูกลบ",
    "trackstudent": "รายชื่อนักศึกษาภายในแทรค",
    "verify": "แบบฟอร์มตรวจสอบจบ",
    "detail": "รายละเอียด",
    "tracks": "แทรค",
    "web%20and%20mobile": "Mobile and Web Application Development",
    "network": "Network Systems, Information Technology Security, and Internet of Things (IoT)",
    "bit": "Business Information Technology",

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
                                            href={`/${currentUrl}`} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                                            {links[currentUrl] || String(currentUrl)}
                                        </Link>
                                }
                            </>
                            :
                            // index ต่อไป
                            <>
                                <RightArrow />
                                {
                                    isLastIndex ?
                                        <span
                                            style={{
                                                fontSize: "clamp(3px, 3vw, 16px)",
                                            }}
                                            className="text-sm font-medium text-gray-500">{links[currentUrl] || String(currentUrl)}</span>
                                        :
                                        // แสดง link 
                                        <Link
                                            style={{
                                                fontSize: "clamp(3px, 3vw, 16px)",
                                            }}
                                            href={nextIndex} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
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
            <nav className="flex mb-3" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    {breadCrumbElements}
                </ol>
            </nav>
        </>
    );
}

export default BreadCrumb;