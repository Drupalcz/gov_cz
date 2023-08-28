import GovScrollUp from './GovScrollUp';
import './focus'
import './link'

/**
 * @return {void}
 */
export function initScrollUpControler() {
    const buttons = document.querySelectorAll('.gov-js--scroll-up');
    buttons.forEach((button) => new GovScrollUp(button));
}
