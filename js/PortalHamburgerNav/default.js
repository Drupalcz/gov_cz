import GovPortalHamburgerNav from './GovPortalHamburgerNav';

/**
 * @return {void}
 */
export function initPortalHamburgerNavs() {
    const navContainers = document.querySelectorAll('.gov-portal-header');
    navContainers.forEach((container) => {
        const hamburger = container.querySelector('.gov-hamburger');
        const nav = container.querySelector('.gov-portal-nav');
        if (hamburger && nav) {
            new GovPortalHamburgerNav(hamburger, nav);
        }
    });
}

/**
 * @return {void}
 */
export function destroyPortalHamburgerNavs() {
    const navContainers = document.querySelectorAll('.gov-portal-header');
    navContainers.forEach((container) => {
        const columns = container.querySelectorAll('.gov-portal-header__column');
        const extrasCol = columns[columns.length - 1];
        const extras = container.querySelector('.gov-portal-header__extras');

        if (null !== extras) {
            extrasCol.appendChild(extras);
        }
    });
}
