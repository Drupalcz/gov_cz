/**
 * Validate czech date format like "12. 12. 2020" or "11.11.1955".
 *
 * @param {String|Object} value
 * @return {null|RegExpMatchArray}
 */
export function matchCzechDate(value) {
    if (typeof value === "string") {
        const re = new RegExp(/^((0?[1-9]|[12][0-9]|3[01])\. ?(0?[1-9]|1[0-2])\. ?((19|20)[0-9]{2}))$/);
        return value.match(re);
    } else {
        return null;
    }
}
