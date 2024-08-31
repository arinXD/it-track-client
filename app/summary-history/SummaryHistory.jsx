import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination, Select, SelectItem } from "@nextui-org/react";
import { Empty } from 'antd';
import { simpleDMYHM } from '@/src/util/simpleDateFormatter';
import Link from 'next/link';

const SummaryHistory = ({ histories, fetching }) => {
     const [page, setPage] = useState(1);
     const [rowsPerPage, setRowsPerPage] = useState(10);

     const pages = Math.ceil(histories.length / rowsPerPage);

     const items = useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          return histories.slice(start, end);
     }, [page, histories, rowsPerPage]);

     return (
          <div className="max-w-7xl mx-auto">
               <h2 className="text-2xl font-bold mb-4">Summary Histories</h2>
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
                         emptyContent={
                              <Empty
                                   className='my-4'
                                   description={
                                        <span className='text-gray-300'>ไม่มีประวัติการทำแบบทดสอบ</span>
                                   }
                              />}
                         items={items}>
                         {(item) => (
                              <TableRow key={item.id}>
                                   <TableCell>{simpleDMYHM(item.createdAt)}</TableCell>
                                   <TableCell>{item.overallScore} คะแนน</TableCell>
                                   <TableCell>{item.recommendations[0].track}</TableCell>
                                   <TableCell className='w-1'>
                                        <div className='flex justify-center items-center gap-4'>
                                             <Link href={`/summary-history/${item.id}`}>
                                                  <Button
                                                       size="sm"
                                                       onClick={() => { }}
                                                  >
                                                       Show Details
                                                  </Button>
                                             </Link>
                                             <Button
                                                  isIconOnly
                                                  size="sm"
                                                  onClick={() => { }}
                                             >
                                                  ลบ
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
          </div>
     );
};

export default SummaryHistory;