import GovTooltip from './GovTooltip';

/**
 * @return {void}
 */
export function initTooltips() {
    const tooltipsContainers = document.querySelectorAll('.gov-js-tooltip');
    tooltipsContainers.forEach((tootltip) => new GovTooltip(tootltip));
}
