/**
 * @param {HTMLElement|Element} element
 * @param {String} className
 * @return {Boolean}
 */
export function addClass(element, className) {
    element.classList.add(className)
}

/**
 * @param {HTMLElement|Element} element
 * @param {String} className
 * @return {Boolean}
 */
export function removeClass(element, className) {
    element.classList.remove(className)
}

/**
 * @param {HTMLElement|Element} element
 * @param {String} className
 * @return {Boolean}
 */
export function hasClass(element, className) {
    return element.classList.contains(className)
}

/**
 * @param {HTMLElement|Element} element
 * @param {String} className
 */
export function toggleClass(element, className) {
    const fn = hasClass(element, className) ? removeClass : addClass
    fn(element, className)
}
