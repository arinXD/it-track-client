function getAcadyears(limit = 20) {
    const currentYear = new Date().getFullYear();
    const getAcadyears = [];

    for (let i = currentYear; i >= currentYear - limit; i--) {
        getAcadyears.push(i + 543);
    }

    return getAcadyears
}
module.exports = {
    getAcadyears,
}