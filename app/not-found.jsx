import Image from 'next/image';
import './style/not-found.css';
import Link from "next/link";

export default function PageNotFound() {
    return (
        <>
            <section className="page_404" >
                <div className="mx-auto">
                    <div className="row">
                        <div className="col-sm-12 ">
                            <div className="col-sm-10 col-sm-offset-1 text-center">
                                <Image
                                    src={"/image/404.jpg"}
                                    width={400}
                                    height={400}
                                    alt='404 image'
                                />
                                <div className="">
                                    <p className="text-4xl mb-2 font-bold"> ไม่พบหน้าที่คุณกำลังมองหาอยู่ </p>
                                    <p>ตรวจสอบให้แน่ใจว่าลิงก์ของคุณถูกต้อง</p>
                                    <Link href={"/"} className="mt-4 block text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">กลับหน้าหลัก</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
