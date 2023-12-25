import React from "react";
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
                                <div className="four_zero_four_bg">
                                    <h1 className="text-center text-8xl">404</h1>
                                </div>
                                <div className="contant_box_404">
                                    <p className="text-4xl mb-2 font-bold">
                                        Look like you&apos;re lost
                                    </p>
                                    <p className="margins">the page you are looking for not available!</p>
                                    <Link href={"/"} className=" text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">BACK TO HOMEPAGE</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
