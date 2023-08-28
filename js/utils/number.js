/**
 * @param {Number} min
 * @param {Number} max
 * @return {number}
 */
export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
