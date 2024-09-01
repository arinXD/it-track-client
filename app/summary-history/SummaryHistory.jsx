import React, { useState, useMemo, useCallback } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination, Select, SelectItem, Spinner } from "@nextui-org/react";
import { Empty, message } from 'antd';
import { simpleDMYHM } from '@/src/util/simpleDateFormatter';
import Link from 'next/link';
import { DeleteIcon } from '../components/icons';
import { IoMdEye } from 'react-icons/io';
import { swal } from '@/src/util/sweetyAlert';
import { getOptions } from '../components/serverAction/TokenAction';
import axios from 'axios';

const SummaryHistory = ({ histories, fetching, fn }) => {
     const [page, setPage] = useState(1);
     const [rowsPerPage, setRowsPerPage] = useState(10);

     const pages = Math.ceil(histories.length / rowsPerPage);

     const items = useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          return histories.slice(start, end);
     }, [page, histories, rowsPerPage]);

     const handleDelete = useCallback(async (id) => {
          try {
               swal.fire({
                    text: `ต้องการลบประวัตินี้หรือไม่ ?`,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "ตกลง",
                    cancelButtonText: "ยกเลิก",
                    reverseButtons: true
               }).then(async (result) => {
                    if (result.isConfirmed) {
                         const options = await getOptions("/api/suggestion-forms/history/multiple", 'DELETE', [id])
                         await axios(options)
                         await fn()
                    }
               });
          } catch (error) {
               message.warning("ไม่สามารถลบประวัติการแนะนำแทร็กได้ในขณะนี้")
          }
     }, [])

     return (
          <div className="max-w-7xl mx-auto">
               <h2 className="text-2xl font-bold mb-4">ประวัติการแนะนำแทร็ก</h2>
               <Table
                    aria-label="Summary Histories Table"
                    shadow="sm"
               >
                    <TableHeader>
                         <TableColumn>วันที่</TableColumn>
                         <TableColumn>คะแนนรวมทุกหมวด</TableColumn>
                         <TableColumn>แทร็กที่แนะนำ</TableColumn>
                         <TableColumn></TableColumn>
                    </TableHeader>
                    <TableBody
                         isLoading={fetching}
                         loadingContent={<Spinner />}
                         emptyContent={
                              <Empty
                                   className='my-4'
                                   description={
                                        <span className='text-gray-300'>ไม่มีประวัติการแนะนำแทร็ก</span>
                                   }
                              />}
                         items={items}>
                         {(item) => (
                              <TableRow key={item.id}>
                                   <TableCell>{simpleDMYHM(item.createdAt)}</TableCell>
                                   <TableCell>{item.overallScore} คะแนน</TableCell>
                                   <TableCell>{item.recommendations[0].track}</TableCell>
                                   <TableCell className='w-1'>
                                        <div className='flex justify-center items-center gap-2'>
                                             <Link href={`/summary-history/${item.id}`}>
                                                  <Button
                                                       size='sm'
                                                       isIconOnly
                                                       aria-label="รายละเอียด"
                                                       className='p-2 bg-gray-200'
                                                  >
                                                       <IoMdEye className="w-5 h-5 text-gray-600" />
                                                  </Button>
                                             </Link>
                                             <Button
                                                  onClick={() => handleDelete(item.id)}
                                                  size='sm'
                                                  color='danger'
                                                  isIconOnly
                                                  aria-label="ลบ"
                                                  className='p-2 bg-red-400'
                                             >
                                                  <DeleteIcon className="w-5 h-5" />
                                             </Button>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         )}
                    </TableBody>
               </Table>
               <div className="flex justify-between items-center mt-4">
                    <Select
                         variant='bordered'
                         classNames={{
                              label: "!text-xs",
                              trigger: "border-1 h-10 !text-xs",
                         }}
                         size="sm"
                         className="w-[130px]"
                         selectedKeys={[rowsPerPage.toString()]}
                         onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    >
                         <SelectItem key="5">5 per page</SelectItem>
                         <SelectItem key="10">10 per page</SelectItem>
                         <SelectItem key="20">20 per page</SelectItem>
                         <SelectItem key="50">50 per page</SelectItem>
                    </Select>
                    <Pagination
                         total={pages}
                         page={page}
                         onChange={setPage}
                    />
               </div>
          </div >
     );
};

export default SummaryHistory;