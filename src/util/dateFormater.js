const months = {
    1: 'มกราคม',
    2: 'กุมภาพันธ์',
    3: 'มีนาคม',
    4: 'เมษายน',
    5: 'พฤษภาคม',
    6: 'มิถุนายน',
    7: 'กรกฎาคม',
    8: 'สิงหาคม',
    9: 'กันยายน',
    10: 'ตุลาคม',
    11: 'พฤศจิกายน',
    12: 'ธันวาคม',
}

function dmy(dateString) {
    let [date, time] = dateString.split("T")
    let [y, m, d] = date.split("-")
    let [h, min, s] = time.split(".")[0].split(":")
    const result = `${d} ${months[m]} ${y}`
    return result
}

function dmyt(dateString) {
    let [date, time] = dateString.split("T")
    let [y, m, d] = date.split("-")
    let [h, min, s] = time.split(".")[0].split(":")
    const result = `${d} ${months[m]} ${y} ${h}:${min} น.`
    return result
}

module.exports = {
    dmy,
    dmyt,
}