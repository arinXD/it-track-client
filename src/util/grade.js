function getGrades() {
    const grades = {
        hasScore: {
            lable: "มีค่าคะแนน",
            grades: [{
                    grade: "A",
                    meaning: "4.0"
                },
                {
                    grade: "B+",
                    meaning: "3.5"
                },
                {
                    grade: "B",
                    meaning: "3.0"
                },
                {
                    grade: "C+",
                    meaning: "2.5"
                },
                {
                    grade: "C",
                    meaning: "2.0"
                },
                {
                    grade: "D+",
                    meaning: "1.5"
                },
                {
                    grade: "D",
                    meaning: "1.0"
                },
                {
                    grade: "F",
                    meaning: "0"
                },
            ],
        },
        noScore: {
            lable: "ไม่มีค่าคะแนน",
            grades: [{
                    grade: "I ",
                    meaning: "ยังไม่สมบูรณ์"
                },
                {
                    grade: "P",
                    meaning: "กำลังดำเนินอยู่"
                },
                {
                    grade: "R",
                    meaning: "ซ้ำชั้น"
                },
                {
                    grade: "S",
                    meaning: "พอใจ"
                },
                {
                    grade: "T",
                    meaning: "รับโอน"
                },
                {
                    grade: "U",
                    meaning: "ไม่พอใจ"
                },
                {
                    grade: "W",
                    meaning: "ถอนรายวิชา"
                },
            ]
        }
    }
    return grades
    }
module.exports = {
    getGrades
}