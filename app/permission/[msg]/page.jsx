import SidebarDrawer from '@/app/components/NavbarDrawer'
import Link from 'next/link'
const PagePermission = async ({ params }) => {
    let msg = params.msg
    msg = msg.split("-")
    return (
        <>
            <header>
                <SidebarDrawer />
            </header>
            <section className='mt-16'>
                <section className="bg-white dark:bg-gray-900">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                        <div className="mx-auto max-w-screen-md text-center">
                            <div className='flex mb-10 items-center justify-center text-blue-500 gap-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mt-2">
                                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                </svg>
                                <h1 className="text-4xl font-bold lg:text-6xl"> 403 Forbidden</h1>
                            </div>
                            <div>
                                <p className="mb-2 text-lg font-bold text-gray-900 md:text-2xl dark:text-white">คุณไม่มีสิทธิ์ในการเข้าใช้หน้านี้</p>
                                <p className="mb-8 text-sm md:text-md font-light text-gray-500 dark:text-gray-400">กรุณาเข้าสู่ระบบด้วย {msg.join(" ")} หรือติดต่อผู้ดูแลเว็บไซต์หากคุณเชื่อว่านี่เป็นข้อผิดพลาด </p>
                            </div>
                            <div className='flex flex-col justify-center text-default-500'>
                                <p className='text-sm md:text-lg mb-4 md:mb-0'>นี่คือลิงก์ที่คุณกำลังมองหา?</p>
                                <ul className='flex flex-col md:flex-row gap-4 justify-center text-sm md:text-lg'>
                                    <li><Link href="/" className='underline'>หน้าหลัก</Link></li>
                                    <li><Link href="/" className='underline'>แทร็ก</Link></li>
                                    <li><Link href="/" className='underline'>คัดเลือกแทร็ก</Link></li>
                                    <li><Link href="/" className='underline'>แนะนำแทร็ก</Link></li>
                                    <li><Link href="/" className='underline'>ตรวจสอบสำเร็จการศึกษา</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}

export default PagePermission