/**
 * @param {String|Number} value
 * @return {Boolean}
 */
export function isNumber(value) {
    if (!value) return false;
    const re = new RegExp(/^\d+$/);
    return Array.isArray(value.match(re)) ? true : false;
}
