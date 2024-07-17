"use client"
import { dmy } from '@/src/util/dateFormater';
import { floorGpa } from '@/src/util/grade';
import { capitalize } from '@/src/util/utils';
import { Card, Typography, Table, Collapse } from 'antd';
const { Title, Text } = Typography;
const { Panel } = Collapse;

const UserProfile = ({ userData }) => {
     const { email, role, sign_in_type, createdAt, Student } = userData;

     const columns = [
          {
               title: 'รหัสวิชา',
               dataIndex: ['Subject', 'subject_code'],
               key: 'subject_code',
          },
          {
               title: 'ชื่อวิชา (TH)',
               dataIndex: ['Subject', 'title_th'],
               key: 'title_th',
          },
          {
               title: 'ชื่อวิชา (EN)',
               dataIndex: ['Subject', 'title_en'],
               key: 'title_en',
          },
          {
               title: 'เกรด',
               dataIndex: 'grade',
               key: 'grade',
               render: (grade) => grade || '-'
          },
     ];

     return (
          <div className="container mx-auto p-4">
               <Card className="mb-4">
                    <Title level={2}>User Profile</Title>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                              <Text strong>Email:</Text> {email}
                         </div>
                         <div>
                              <Text strong>Sign In Type:</Text> {capitalize(sign_in_type)}
                         </div>
                         <div>
                              <Text strong>เข้าสู่ระบบ:</Text> {dmy(createdAt)}
                         </div>
                    </div>
               </Card>

               {Student && (
                    <>
                         <Card className="mb-4">
                              <Title level={3}>Student Information</Title>
                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <Text strong>Student ID:</Text> {Student.stu_id}
                                   </div>
                                   <div>
                                        <Text strong>ชื่อ - สกุล:</Text> {Student.first_name} {Student.last_name}
                                   </div>
                                   <div>
                                        <Text strong>หลักสูตร:</Text> {Student.Program.title_en} ({Student.Program.title_th})
                                   </div>
                                   {
                                        Student.Program.program.toLowerCase() === "it" &&
                                        <div>
                                             <Text strong>แทร็ก:</Text> {Student.track || "ยังไม่มีแทร็ก"}
                                        </div>
                                   }
                                   <div>
                                        <Text strong>GPA:</Text> {floorGpa(Student.gpa)}
                                   </div>
                              </div>
                         </Card>

                         <Card>
                              <Title level={3}>Enrollments</Title>
                              <Collapse defaultActiveKey={[Object.keys(Student.Enrollments)[0]]}>
                                   {Object.keys(Student.Enrollments).map(year => (
                                        <Panel header={`ปีการศึกษา ${year}`} key={year}>
                                             <Table
                                                  dataSource={Student.Enrollments[year]}
                                                  columns={columns}
                                                  rowKey={(record) => record.Subject.subject_code}
                                                  pagination={true}
                                                  className="w-full"
                                             />
                                        </Panel>
                                   ))}
                              </Collapse>
                         </Card>
                    </>
               )}
          </div>
     );
};

export default UserProfile;