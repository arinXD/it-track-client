function getAcadyears() {
    const currentYear = new Date().getFullYear();
    const getAcadyears = [];

    for (let i = currentYear; i >= currentYear - 20; i--) {
        getAcadyears.push(i + 543);
    }

    return getAcadyears
}
module.exports = {
    getAcadyears,
}