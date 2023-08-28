/**
 * Validate czech date format like "12. 12. 2020" or "11.11.1955".
 *
 * @param {String|Object} value
 * @return {null|RegExpMatchArray}
 */
export function matchTime(value) {
    if (typeof value === "string") {
        const re = new RegExp(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
        return value.match(re);
    } else {
        return null;
    }
}
