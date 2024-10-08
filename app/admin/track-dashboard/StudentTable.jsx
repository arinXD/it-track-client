"use client"
import { Table } from 'antd';
import { useMemo } from 'react';
import { Chip } from "@nextui-org/chip";

const StudentTable = ({ studentsData, trackColors }) => {
     const columns = useMemo(() => ([
          {
               title: 'รหัสนักศึกษา',
               dataIndex: 'stuId',
               key: 'stuId',
          },
          {
               title: 'ชื่อ - สกุล',
               dataIndex: 'stuName',
               key: 'stuName',
          },
          {
               title: 'อันดับ 1',
               dataIndex: 'track_order_1',
               key: 'track_order_1',
               align: 'center',
               render: (text) => text?.split(" ")[0] || '-',
          },
          {
               title: 'อันดับ 2',
               dataIndex: 'track_order_2',
               key: 'track_order_2',
               align: 'center',
               render: (text) => text?.split(" ")[0] || '-',
          },
          {
               title: 'อันดับ 3',
               dataIndex: 'track_order_3',
               key: 'track_order_3',
               align: 'center',
               render: (text) => text?.split(" ")[0] || '-',
          },
          {
               title: 'แทร็กที่ได้',
               key: 'result',
               align: 'center',
               dataIndex: 'result',
               render: (text) => {
                    const track = text?.split(" ")[0].toLowerCase()
                    const trackColor = trackColors.filter(t => t.track === track)[0].color
                    return (
                         <setion className="w-full flex justify-center">
                              <Chip
                                   style={{
                                        backgroundColor: trackColor.bg,
                                        color: 'white'
                                   }}
                                   variant="flat">
                                   {text?.split(" ")[0] || '?'}
                              </Chip>
                         </setion>
                    )
               },
          },
     ]), [trackColors])

     return (
          <section className='h-[300px]' >
               <Table columns={columns} dataSource={studentsData} />
          </section>
     )
}

export default StudentTable