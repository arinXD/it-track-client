import Image from 'next/image';
import './style/not-found.css';
import Link from "next/link";

export default function PageNotFound({ params }) {
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
                                    <p className="text-4xl mb-2 font-bold">
                                        Look like you&apos;re lost
                                    </p>
                                    <p>the page you are looking for not available!</p>
                                    <Link href={"/"} className="mt-4 block text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[5px] text-sm px-5 py-2.5 text-center">BACK TO HOMEPAGE</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
