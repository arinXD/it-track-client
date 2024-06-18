"use client"
import { minimalTableClass } from '@/src/util/ComponentClass'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'

const TrackSubjectTable = ({ trackSubj }) => {
    return (
        <div className='border p-4 rounded-[10px] w-full'>
            <div className='bg-gray-100 border-gray-200 border-1 p-2 px-3 flex flex-row justify-between items-center rounded-md mb-3'>
                <h2 className='text-small text-default-900'>วิชาที่ใช้ในการคัดเลือก</h2>
            </div>
            {trackSubj &&
                <Table
                    classNames={minimalTableClass}
                    removeWrapper
                    onRowAction={() => { }}
                    aria-label="track selection subjects table">
                    <TableHeader>
                        <TableColumn>รหัสวิชา</TableColumn>
                        <TableColumn>ชื่อวิชา EN</TableColumn>
                        <TableColumn>ชื่อวิชา TH</TableColumn>
                        <TableColumn>หน่วยกิต</TableColumn>
                    </TableHeader>
                    {trackSubj.length > 0 ?
                        <TableBody>
                            {trackSubj.map(subj => (
                                <TableRow key={subj.subject_code}>
                                    <TableCell className=''>{subj.subject_code}</TableCell>
                                    <TableCell className="w-1/3">{subj.title_en}</TableCell>
                                    <TableCell className="w-1/3">{subj.title_th}</TableCell>
                                    <TableCell>{subj.credit}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody> :
                        <TableBody emptyContent={"ไม่มีวิชาที่ใช้ในการคัดเลือก"}>{[]}</TableBody>}
                </Table>
            }
        </div>
    )
}

export default TrackSubjectTable