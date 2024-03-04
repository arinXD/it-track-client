const months = {
    "01": 'มกราคม',
    "02": 'กุมภาพันธ์',
    '03': 'มีนาคม',
    "04": 'เมษายน',
    "05": 'พฤษภาคม',
    "06": 'มิถุนายน',
    "07": 'กรกฎาคม',
    '08': 'สิงหาคม',
    "09": 'กันยายน',
    10: 'ตุลาคม',
    11: 'พฤศจิกายน',
    12: 'ธันวาคม',
}

const shortMonths = {
    "01": 'ม.ค.',
    "02": 'ก.พ.',
    '03': 'ม.ค.',
    "04": 'เม.ย.',
    "05": 'พ.ค.',
    "06": 'มิ.ย.',
    "07": 'ก.ค.',
    '08': 'ส.ค.',
    "09": 'ก.ย.',
    10: 'ต.ค.',
    11: 'พ.ย.',
    12: 'ธ.ค.',
}

function dmy(dateString) {
    if (!dateString) return ""
    let [date, time] = dateString.split("T")
    let [y, m, d] = date.split("-")
    const result = `${d} ${months[m]} ${y}`
    return result
}

function dmyt(dateString) {
    if (!dateString) return ""
    let [date, time] = dateString.split("T")
    let [y, m, d] = date.split("-")
    let [h, min, s] = time.split(".")[0].split(":")
    const result = `${d} ${months[m]} ${y} ${h}:${min} น.`
    return result
}

function dMy(dateString) {
    if (!dateString) return ""
    let [date, time] = dateString.split("T")
    let [y, m, d] = `${date}`.split("-")
    const result = `${d} ${shortMonths[m]} ${y}`

    return result
}

function dMyt(dateString) {
    if (!dateString) return ""
    let [date, time] = dateString.split("T")
    let [y, m, d] = date.split("-")
    let [h, min, s] = time.split(".")[0].split(":")
    const result = `${d} ${shortMonths[m]} ${y} ${h}:${min} น.`
    return result
}

module.exports = {
    dmy,
    dmyt,
    dMy,
    dMyt,
}