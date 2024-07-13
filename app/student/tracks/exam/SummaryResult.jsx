"use client"

const SummaryResult = ({ data }) => {
     const { questionScores, assessmentScores, trackSummaries, totalQuestionScore, totalCorrectAnswers, totalQuestions, overallCorrectPercentage, recommendation } = data;

     return (
          <div className="bg-gray-100 min-h-screen p-8 rounded-sm">
               <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <header className="bg-blue-600 text-white p-6">
                         <h1 className="text-3xl font-bold">สรุปผลการทำแบบทดสอบ</h1>
                    </header>

                    <div className="p-6 space-y-8">
                         <section className="bg-blue-50 p-4 rounded-lg">
                              <h2 className="text-2xl font-semibold text-blue-800 mb-4">สถิติโดยรวม</h2>
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="bg-white p-3 rounded shadow">
                                        <p className="text-sm text-gray-600">คะแนนทั้งหมด</p>
                                        <p className="text-xl font-bold">{totalQuestionScore} คะแนน</p>
                                   </div>
                                   <div className="bg-white p-3 rounded shadow">
                                        <p className="text-sm text-gray-600">ตอบถูกทั้งหมด</p>
                                        <p className="text-xl font-bold">{totalCorrectAnswers} ข้อ</p>
                                   </div>
                                   <div className="bg-white p-3 rounded shadow">
                                        <p className="text-sm text-gray-600">คำถามทั้งหมด</p>
                                        <p className="text-xl font-bold">{totalQuestions} ข้อ</p>
                                   </div>
                                   <div className="bg-white p-3 rounded shadow">
                                        <p className="text-sm text-gray-600">ตอบถูกร้อยละ</p>
                                        <p className="text-xl font-bold">{overallCorrectPercentage}</p>
                                   </div>
                              </div>
                         </section>

                         <section>
                              <h2 className="text-2xl font-semibold text-blue-800 mb-4">แบบทดสอบ</h2>
                              <div className="bg-white shadow overflow-hidden rounded-lg">
                                   <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                             <tr>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
                                             </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                             {questionScores.map((qs) => (
                                                  <tr key={qs.qId}>
                                                       <td className="px-6 py-4 whitespace-nowrap">{qs.question}</td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-center">{qs.score}</td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${qs.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                 {qs.isCorrect ? 'Yes' : 'No'}
                                                            </span>
                                                       </td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>
                              </div>
                         </section>

                         <section>
                              <h2 className="text-2xl font-semibold text-blue-800 mb-4">แบบประเมิน</h2>
                              <div className="bg-white shadow overflow-hidden rounded-lg">
                                   <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                             <tr>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                             </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                             {assessmentScores.map((qs) => (
                                                  <tr key={qs.qId}>
                                                       <td className="px-6 py-4 whitespace-nowrap">{qs.question}</td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-center">{qs.score}</td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>
                              </div>
                         </section>

                         <section>
                              <h2 className="text-2xl font-semibold text-blue-800 mb-4">สรุปผลแทร็ก</h2>
                              <div className="space-y-4">
                                   {trackSummaries.map((ts) => (
                                        <div key={ts.track} className="bg-white p-6 rounded-lg shadow">
                                             <h3 className="text-xl font-semibold text-blue-600 mb-3">{ts.track}</h3>
                                             <div className="grid grid-cols-2 gap-4 mb-4">
                                                  <div>
                                                       <p className="text-sm text-gray-600">คะแนนแบบทดสอบ</p>
                                                       <p className="text-lg font-bold">{ts.questionScore}</p>
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-600">คะแนนแบบประเมิน</p>
                                                       <p className="text-lg font-bold">{ts.assessmentScore}</p>
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-600">คะแนนความชอบ</p>
                                                       <p className="text-lg font-bold">{ts.careerScore}</p>
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-600">คะแนนทั้งหมด</p>
                                                       <p className="text-lg font-bold">{ts.totalScore}</p>
                                                  </div>
                                             </div>
                                             <p className="text-sm text-gray-600 mb-2">ตอบถูกทั้งหมด: {ts.correctAnswers} / {ts.totalQuestions} ({ts.correctPercentage})</p>
                                             <p className="text-sm">{ts.summary}</p>
                                        </div>
                                   ))}
                              </div>
                         </section>

                         <section className="bg-yellow-50 p-6 rounded-lg">
                              <h2 className="text-2xl font-semibold text-yellow-800 mb-4">คำแนะนำ</h2>
                              <ul className="text-gray-800">
                                   {
                                        recommendation.map(rec => (
                                             <li>{rec}</li>
                                        ))
                                   }
                              </ul>
                         </section>
                    </div>
               </div>
          </div>
     );
};

export default SummaryResult