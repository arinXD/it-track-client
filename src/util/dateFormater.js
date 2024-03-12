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
    let result
    try {
        if (!dateString) return ""
        let [date, time] = dateString.split("T")
        let [y, m, d] = date.split("-")
        result = `${d} ${months[m]} ${parseInt(y)+543}`
    } catch (err) {
        result = ""
    }
    return result
}

function dmyt(dateString) {
    let result
    try {
        if (!dateString) return ""
        let [date, time] = dateString.split("T")
        let [y, m, d] = date.split("-")
        let [h, min, s] = time.split(".")[0].split(":")
        result = `${d} ${months[m]} ${parseInt(y)+543} ${h}:${min} น.`
    } catch (err) {
        result = ""
    }
    return result
}

function dMy(dateString) {
    let result
    try {
        if (!dateString) return ""
        let [date, time] = dateString.split("T")
        let [y, m, d] = `${date}`.split("-")
        result = `${d} ${shortMonths[m]} ${y}`
    } catch (err) {
        result = ""
    }

    return result
}

function dMyt(dateString) {
    let result
    try {
        if (!dateString) return ""
        let [date, time] = dateString.split("T")
        let [y, m, d] = date.split("-")
        let [h, min, s] = time.split(".")[0].split(":")
        result = `${d} ${shortMonths[m]} ${y} ${h}:${min} น.`
    } catch (err) {
        result = ""
    }
    return result
}

module.exports = {
    dmy,
    dmyt,
    dMy,
    dMyt,
}