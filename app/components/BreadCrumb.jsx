'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, RightArrow } from './icons';

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
};

const BreadCrumb = () => {
    const url = usePathname();
    const urls = url.split("/").filter(e => e);

    const elements = [];
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
                                    <span className="text-sm font-medium text-gray-500">{links[currentUrl] || String(currentUrl)}</span>
                                    :
                                    <Link href={`/${currentUrl}`} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
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
                                    <span className="text-sm font-medium text-gray-500">{links[currentUrl] || String(currentUrl)}</span>
                                    :
                                    // แสดง link 
                                    <Link href={nextIndex} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                                        {links[currentUrl] || String(currentUrl)}
                                    </Link>
                            }
                        </>
                    }
                </div>
            </li>
        );
    }

    return (
        <>
            <nav className="flex mb-3" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    {elements}
                </ol>
            </nav>
        </>
    );
}

export default BreadCrumb;