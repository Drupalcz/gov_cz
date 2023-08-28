const WARNING_COLORS = { bg: '#ecae1a', text: '#3b3b3b' }
const INFO_COLORS = { bg: '#2362a2', text: '#fff' }
const ERROR_COLORS = { bg: '#c52a3a', text: '#fff' }

/**
 * @param {String | Number | Object | function} message
 * @param {Object} colors
 */
export const govLog = (message, colors = INFO_COLORS) => {
    const styles = [
        'color: ' + colors.text,
        'background: ' + colors.bg,
        'font-size: 12px',
        'padding: 2px',
        'border-radius: 3px'
    ].join(';');

    console.log('%cgov.cz', styles, message);
}

/**
 * @param {String | Number | Object | function} message
 */
export const govWarningLog = (message) => {
    govLog(message, WARNING_COLORS)
}

/**
 * @param {String | Number | Object | function} message
 */
export const govErrorLog = (message) => {
    govLog(message, ERROR_COLORS)
}
