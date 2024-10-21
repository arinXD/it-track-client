import React from 'react';

const Footer = () => {
     return (
          <footer className="bg-gray-800 text-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                         <div className="col-span-1 md:col-span-2">
                              <h2 className="text-2xl font-bold mb-4">KKU IT</h2>
                              <p className="text-gray-300">
                                   พัฒนาทักษะ IT สู่ความเป็นเลิศ - เรียนรู้เทคโนโลยีล่าสุด สร้างอาชีพที่มั่นคง เปิดประตูสู่อนาคตดิจิทัลที่สดใส
                              </p>
                         </div>
                         <div>
                              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                              <ul className="space-y-2">
                                   <li><a href="/" className="text-gray-300 hover:text-white transition">หน้าหลัก</a></li>
                                   <li><a href="/tracks" className="text-gray-300 hover:text-white transition">แทร็ก</a></li>
                                   <li><a href="/student/tracks/exam" className="text-gray-300 hover:text-white transition">แนะนำแทร็ก</a></li>
                                   <li><a href="/student/verify" className="text-gray-300 hover:text-white transition">ตรวจสอบสำเร็จการศึกษา</a></li>
                              </ul>
                         </div>
                         <div>
                              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                              <ul className="space-y-2">
                                   <li className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                             <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                             <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <a href="mailto:info@kkuit.com" className="text-gray-300 hover:text-white transition">info@kkuit.com</a>
                                   </li>
                                   <li className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                             <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">Khon Kaen University, Thailand</span>
                                   </li>
                              </ul>
                         </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                         <p>&copy; {new Date().getFullYear()} KKU IT. All rights reserved.</p>
                    </div>
               </div>
          </footer>
     );
};

export default Footer;