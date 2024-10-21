"use client"
import Petitionbar from "./Petitionbar"
import { useEffect, useState } from "react"
import { Button, Spinner } from "@nextui-org/react"
import { simpleDM } from "@/src/util/simpleDateFormatter"
import Link from "next/link"
import { IoSearchOutline } from "react-icons/io5";

const PetitionList = ({ current, fetching, title, data, emptyContent }) => {
     const [petitions, setPetitions] = useState(data);
     const [searchQuery, setSearchQuery] = useState("");

     const handleSearch = () => {
          const filteredPetitions = data.filter((petition) => {
               const senderEmail = petition.Sender?.email?.toLowerCase() || "";
               const studentName = `${petition.Sender?.Student?.first_name} ${petition.Sender?.Student?.last_name}`.toLowerCase();
               const petitionTitle = petition.title.toLowerCase();
               const query = searchQuery.toLowerCase();

               return senderEmail.includes(query) || studentName.includes(query) || petitionTitle.includes(query);
          });

          setPetitions(filteredPetitions);
     };

     useEffect(() => {
          setPetitions(data);
          setSearchQuery("");
     }, [data]);

     return (
          <section className="w-full">
               <h1 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h1>
               <div className="grid grid-cols-6">
                    <Petitionbar className="col-span-6 lg:col-span-1" />
                    <div className="col-span-6 lg:col-span-5 bg-white rounded-lg shadow-sm border lg:rounded-tl-none lg:rounded-bl-none">
                         <div className="flex items-center justify-between p-4 border-b">
                              <div className="flex items-center">
                                   <span className="text-sm text-gray-600">กล่องคำร้อง</span>
                              </div>
                              <div className="flex gap-4">
                                   <input
                                        placeholder="ชื่อ, อีเมล, หัวข้อ"
                                        className="border text-sm rounded-[5px] focus:outline-none focus:border-blue-700 px-2"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                   />
                                   <Button
                                        isIconOnly
                                        className="rounded-full border-0 border-gray-100 bg-gray-300"
                                        variant="bordered"
                                        size="sm"
                                        onClick={handleSearch}>
                                        <IoSearchOutline className="w-4 h-4" />
                                   </Button>
                              </div>
                         </div>
                         {fetching ? (
                              <div className="flex justify-center items-center h-64">
                                   <Spinner />
                              </div>
                         ) : (
                              <ul className="divide-y divide-gray-200">
                                   {petitions?.length === 0 ? (
                                        <li className="text-center py-8 text-gray-500">{emptyContent}</li>
                                   ) : (
                                        petitions.map((petition, key) => (
                                             <li key={key} className="hover:bg-gray-50 transition-colors">
                                                  <Link
                                                       className="w-full grid grid-cols-9 gap-4 items-center p-4"
                                                       href={`/admin/petitions/${current}/${petition.id}`}>
                                                       <span className="w-full col-span-2 font-normal text-gray-900 truncate max-md:col-span-3">
                                                            <p className="w-full text-xs truncate overflow-hidden">
                                                                 {petition?.Sender?.email}
                                                            </p>
                                                            <p className="w-full text-xs truncate overflow-hidden">
                                                                 {petition?.Sender?.Student?.first_name}  {petition?.Sender?.Student?.last_name}
                                                            </p>
                                                       </span>
                                                       <span className="w-full col-span-2 text-sm font-normal text-gray-900 truncate max-md:col-span-3">
                                                            {petition.title}
                                                       </span>
                                                       <span className="w-full col-span-2 xl:col-span-3 text-sm  text-gray-500 truncate overflow-hidden max-md:hidden">
                                                            {petition.detail}
                                                       </span>
                                                       <span className="w-full col-span-2 xl:col-span-1 justify-center flex text-gray-500 truncate text-center max-md:hidden">
                                                            <div className="flex items-center gap-1">
                                                                 <div className={`rounded-full w-2 h-2 ${petition?.status == 0 ? "bg-yellow-600" : petition?.status == 1 ? "bg-green-600" : "bg-red-600"}`}></div>
                                                                 <p className="text-xs">
                                                                      {petition?.status == 0 ? "รอการยืนยัน" : petition?.status == 1 ? "อนุมัติ" : "ปฏิเสธ"}
                                                                 </p>
                                                            </div>
                                                       </span>
                                                       <span className="w-full col-span-1 text-right text-xs text-gray-400 max-md:col-span-3">
                                                            {simpleDM(petition.createdAt)}
                                                       </span>
                                                  </Link>
                                             </li>
                                        ))
                                   )}
                              </ul>
                         )}
                    </div>
               </div>
          </section>
     );
};

export default PetitionList