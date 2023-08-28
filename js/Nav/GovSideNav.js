/*!
 * GovSideNav
 * Copyright(c) 2021 Digitalni a informacni agentura
 * Copyright(c) 2021 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import classes from '../_extends/lib/classes';
import GovElement from '../_extends/GovElement';
import GovComponent from '../_extends/GovComponent';

const locales = {
    cs: {
        closeSubmenu: 'Zavřít submenu',
        openSubmenu:  'Otevřít submenu',
    },
    en: {
        closeSubmenu: 'Close submenu',
        openSubmenu:  'Open submenu',
    },
}

class GovSideNav extends classes(GovElement, GovComponent) {
    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super();
        this._defaults = {
            classes:     {
                hasToggle: '.has-toggle',
            },
            toggleClass: '.gov-sidenav__toggle',
        }

        this._setLocales(locales)
        this._prepareOptions(options);
        this._prepareDomElement(el);
        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        if (this._toggleElements.length) {
            this._registerListeners();
        }
    }

    /**
     * @return {void}
     * @private
     */
    _registerListeners() {
        this._toggleElements.forEach((toggleElement) => {
            toggleElement.addEventListener('click', () => {
                this._toggleSubmenu(toggleElement)
            })
        });
    }

    /**
     * @param {HTMLButtonElement} toggleElement
     * @return {void}
     * @private
     */
    _toggleSubmenu(toggleElement) {
        const submenu = toggleElement.nextElementSibling;
        const linkElement = toggleElement.previousElementSibling;
        const parentLi = toggleElement.parentElement;
        let name = toggleElement.textContent;

        if (linkElement) {
            name = linkElement.textContent
        }

        if (submenu && submenu.tagName === 'UL') {
            if (submenu.hidden) {
                submenu.hidden = false;
                toggleElement.setAttribute('aria-expanded', 'true');
                toggleElement.setAttribute('aria-label', this._locale().closeSubmenu + ' ' + name);
                parentLi.classList.add('is-active');
            } else {
                submenu.hidden = true;
                toggleElement.setAttribute('aria-expanded', 'false');
                toggleElement.setAttribute('aria-label', this._locale().openSubmenu + ' ' + name);
                parentLi.classList.remove('is-active');
            }
        }
    }

    /**
     * @return {NodeListOf<HTMLButtonElement>}
     * @private
     */
    get _toggleElements() {
        const { classes: { hasToggle } } = this._options;
        return this._domElement().querySelectorAll(hasToggle + '> button');
    }
}

export default GovSideNav;
