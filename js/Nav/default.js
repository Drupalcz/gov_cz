import GovHamburgerNav from './GovHamburgerNav';
import GovSideNav from './GovSideNav';

/**
 * @return {void}
 */
export function initHamburgerNavs() {
    const navContainers = document.querySelectorAll('.gov-container');
    navContainers.forEach((container) => {
        const hamburger = container.querySelector('.gov-header__hamburger');
        const nav = container.querySelector('.gov-header__nav');
        if (hamburger && nav) {
            new GovHamburgerNav(hamburger, nav);
        }
    });
}

/**
 * @return {void}
 */
export function initGovSideNav() {
    const navContainers = document.querySelectorAll('.gov-sidenav');
    navContainers.forEach((container) => new GovSideNav(container));
}
