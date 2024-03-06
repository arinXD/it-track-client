function getLastTenYear() {
    const currentYear = new Date().getFullYear();
    const lastTenYears = [];

    for (let i = currentYear; i >= currentYear - 10; i--) {
        lastTenYears.push(i + 543);
    }

    return lastTenYears
}
module.exports = {
    getLastTenYear,
}