export async function isEmptyObj(obj) {
    if (Object.keys(obj).length === 0) {
        return true
    } else {
        return false
    }
}
export async function getObjKey(obj) {
    if (!(Object.keys(obj).length === 0)) {
        return Object.keys(obj)
    } else {
        return []
    }
}