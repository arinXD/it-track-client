"use client"
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Select, SelectItem, Pagination, Spinner } from "@nextui-org/react";
import { Empty, message } from 'antd';
import axios from 'axios';
import { thinInputClass } from '@/src/util/ComponentClass';
import { DeleteIcon, EditIcon2, PlusIcon, SearchIcon } from '@/app/components/icons';
import { simpleDMY } from '@/src/util/simpleDateFormatter';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { useSession } from 'next-auth/react';
import { swal } from '@/src/util/sweetyAlert';
import Link from 'next/link';

const UserTable = ({ email }) => {
     const [filteredUsers, setFilteredUsers] = useState([]);
     const [searchTerm, setSearchTerm] = useState('');
     const [roleFilter, setRoleFilter] = useState('all');
     const [page, setPage] = useState(1);
     const [rowsPerPage, setRowsPerPage] = useState(10);
     const [newRole, setNewRole] = useState([]);
     const [users, setUsers] = useState([]);
     const [fetching, setFetching] = useState(true);

     const getAllUsers = useCallback(async function () {
          setFetching(true)
          const option = await getOptions("/api/users", "get")
          try {
               const users = (await axios(option)).data.data
               setUsers(users.filter(user => user.email !== email))
          } catch (error) {
               setUsers([])
          } finally {
               setFetching(false)
          }
     }, [email])

     useEffect(() => {
          getAllUsers()
     }, [])

     const handleRoleChange = useCallback((userId, newRole) => {
          setNewRole(prev => {
               const existingRoleIndex = prev.findIndex(userRole => userRole.id === userId);
               if (existingRoleIndex !== -1) {
                    if (prev[existingRoleIndex].role === newRole) {
                         return prev.filter(userRole => userRole.id !== userId);
                    }
                    const updatedRoles = [...prev];
                    updatedRoles[existingRoleIndex] = { id: userId, role: newRole };
                    return updatedRoles;
               } else {
                    return [...prev, { id: userId, role: newRole }];
               }
          });

          setFilteredUsers(prev => {
               return prev.map(user => {
                    if (user.id === userId) {
                         return { ...user, newRole: newRole };
                    }
                    return user;
               });
          });
     }, []);

     const handleUpdateRole = useCallback(async (id, role, userEmail) => {
          const data = { role, email: userEmail }
          const option = await getOptions(`/api/users/${id}/role`, "patch", data)
          try {
               await axios(option)
               setNewRole(prev => prev.filter(item => item.id !== id));
               await getAllUsers()
               message.success("แก้ไขโรลเรียบร้อย")

          } catch (error) {
               message.warning("ไม่สามารถแก้ไขโรลได่้")
          }
     }, [newRole, users]);

     const filterUsers = useCallback((search, role) => {
          const filtered = users.filter(user =>
               (user.email.toLowerCase().includes(search.toLowerCase()) ||
                    user.role.toLowerCase().includes(search.toLowerCase())) &&
               (role === 'all' || user.role === role)
          );
          const data = filtered.map(user => ({
               ...user,
               newRole: newRole.filter(item => item.id == user.id)[0]?.role || null
          }))
          setFilteredUsers(data);
          setPage(1);
     }, [users, newRole]);

     const handleSearch = useCallback((value) => {
          setSearchTerm(value);
          filterUsers(value, roleFilter);
     }, [filterUsers, roleFilter]);

     const handleRoleFilter = useCallback((value) => {
          setRoleFilter(value);
          filterUsers(searchTerm, value);
     }, [filterUsers, searchTerm]);

     useEffect(() => {
          filterUsers(searchTerm, roleFilter);
     }, [users, searchTerm, roleFilter]);

     const columns = useMemo(() => [
          { key: "email", label: "อีเมล", "align": "start" },
          { key: "createdAt", label: "เข้าสู่ระบบ", "align": "start" },
          { key: "role", label: "สิทธิ์การใช้งาน", "align": "start" },
          { key: "newRole", label: "สิทธิ์การใช้งานใหม่", "align": "center" },
          { key: "actions", label: "ACTIONS", "align": "center" },
     ], []);

     const getRole = useCallback((engRole) => {
          const roles = {
               "all": "ทั้งหมด",
               "admin": "เจ้าหน้าที่",
               "teacher": "อาจารย์",
               "student": "นักศึกษา",
               "user": "ผู้ใช้",
          }
          return roles[engRole] ?? engRole
     }, []);

     const roleList = [
          { "key": "admin", "value": "เจ้าหน้าที่" },
          { "key": "teacher", "value": "อาจารย์", },
          { "key": "student", "value": "นักศึกษา", },
          { "key": "user", "value": "ผู้ใช้", },
     ]

     const pages = Math.ceil(filteredUsers.length / rowsPerPage);
     const items = useMemo(() => {
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          return filteredUsers.slice(start, end);
     }, [page, filteredUsers, rowsPerPage]);

     const handleDelete = useCallback(async (id) => {
          swal.fire({
               text: `ต้องการลบบัญชีผู้ใช้หรือไม่ ?`,
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "ตกลง",
               cancelButtonText: "ยกเลิก",
               reverseButtons: true
          }).then(async (result) => {
               if (result.isConfirmed) {
                    const options = await getOptions(`/api/users/${id}`, 'DELETE')
                    await axios(options)
                    await getAllUsers()
                    message.success("ลบบัญชีผู้ใช้เรียบร้อย")
               }
          });
     }, [])

     return (
          <div className="space-y-4 p-4">
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 space-y-2 lg:space-y-0">
                    <h2 className="text-2xl font-bold">ตารางบัญชีผู้ใช้</h2>
                    <div className="max-lg:w-full flex flex-col max-lg:items-end lg:flex-row max-lg:gap-2 lg:space-x-4">
                         <Input
                              type="text"
                              placeholder="ค้นหาบัญชีหรือโรล"
                              value={searchTerm}
                              classNames={thinInputClass}
                              onValueChange={handleSearch}
                              className="max-lg:w-full w-[300px] !text-xs"
                              startContent={<SearchIcon />}
                         />
                         <div className='max-lg:w-full flex flex-row gap-2'>
                              <Select
                                   classNames={{
                                        label: "!text-xs",
                                        trigger: "border-1 h-10 !text-xs",
                                   }}
                                   variant="bordered"
                                   placeholder="Filter by role"
                                   className="w-full lg:max-w-[150px]"
                                   selectedKeys={[roleFilter]}
                                   onChange={(e) => handleRoleFilter(e.target.value || "all")}
                              >
                                   <SelectItem key="all">ทั้งหมด</SelectItem>
                                   <SelectItem key="admin">เจ้าหน้าที่</SelectItem>
                                   <SelectItem key="teacher">อาจารย์</SelectItem>
                                   <SelectItem key="student">นักศึกษา</SelectItem>
                                   <SelectItem key="user">ผู้ใช้</SelectItem>
                              </Select>
                              <Select
                                   classNames={{
                                        label: "!text-xs",
                                        trigger: "border-1 h-10 !text-xs",
                                   }}
                                   variant="bordered"
                                   className="w-full lg:w-[150px]"
                                   selectedKeys={[rowsPerPage.toString()]}
                                   onChange={(e) => setRowsPerPage(Number(e.target.value) || 5)}
                              >
                                   <SelectItem key="5">5 per page</SelectItem>
                                   <SelectItem key="10">10 per page</SelectItem>
                                   <SelectItem key="20">20 per page</SelectItem>
                                   <SelectItem key="50">50 per page</SelectItem>
                              </Select>
                         </div>
                         <div className='max-lg:w-1/2 max-lg:flex max-lg:justify-end'>
                              <Link href={"/admin/users/create"}>
                                   <Button
                                        className='bg-[#edf8f7] text-[#46bcaa]'
                                        startContent={<PlusIcon className="w-4 h-4" />}>
                                        เพิ่มบัญชี
                                   </Button>
                              </Link>
                         </div>
                    </div>
               </div>
               <div className='p-4 rounded-[10px] border'>
                    <Table
                         isStriped
                         removeWrapper
                         aria-label="User management table"
                         className="min-w-full overflow-x-auto">
                         <TableHeader columns={columns}>
                              {(column) => (
                                   <TableColumn key={column.key} className={`text-${column.align} text-sm font-semibold`}>
                                        {column.label}
                                   </TableColumn>
                              )}
                         </TableHeader>
                         <TableBody
                              loadingContent={<Spinner />}
                              isLoading={fetching}
                              emptyContent={
                                   <Empty
                                        className='my-4'
                                        description={
                                             <span className='text-gray-300'>ไม่มีบัญชีผู้ใข้</span>
                                        }
                                   />}
                              items={items}>
                              {(user) => (
                                   <TableRow key={user.id}>
                                        <TableCell className='w-1/4'>
                                             <div className="text-sm">{user.email}</div>
                                        </TableCell>
                                        <TableCell className='w-1/4'>
                                             <div className="text-sm">{simpleDMY(user.createdAt)}</div>
                                        </TableCell>
                                        <TableCell className='w-1/6'>
                                             <div className="text-sm font-medium">
                                                  {getRole(user.role)}
                                             </div>
                                        </TableCell>
                                        <TableCell>
                                             <div className='flex justify-center'>
                                                  <Select
                                                       classNames={{
                                                            trigger: "border-1 h-10 !text-xs",
                                                       }}
                                                       size="sm"
                                                       placeholder="เลือกโรล"
                                                       className="max-w-xs"
                                                       disabledKeys={[user.role, ""]}
                                                       onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                  >
                                                       {roleList.map(role => (
                                                            <SelectItem key={role.key} value={role.key}>{role.value}</SelectItem>
                                                       ))}
                                                  </Select>
                                             </div>
                                        </TableCell>
                                        <TableCell className='w-1'>
                                             <div className='flex justify-center items-center gap-2'>
                                                  <Button
                                                       size="sm"
                                                       color="primary"
                                                       isDisabled={!user.newRole && user.newRole !== user.role}
                                                       onClick={() => handleUpdateRole(user.id, user.newRole, user.email)}
                                                  >
                                                       เปลี่ยนโรล
                                                  </Button>
                                                  <Button
                                                       onClick={() => handleDelete(user.id)}
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
               </div>
               {items?.length > 0 &&
                    <div className="flex justify-end items-center">
                         <Pagination
                              isCompact
                              showControls
                              showShadow
                              color="primary"
                              total={pages}
                              page={page}
                              onChange={setPage}
                         />
                    </div>}
          </div>
     );
};

export default UserTable;