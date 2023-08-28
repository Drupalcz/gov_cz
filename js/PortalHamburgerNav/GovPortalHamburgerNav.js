/*!
 * GovPortalHamburgerNav
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import merge from 'lodash/merge';
import isArray from 'lodash/isArray';
import { hasClass, toggleClass } from '../utils/classie';
import GovError from '../common/Error/gov.error';

class GovPortalHamburgerNav {

    /**
     * @param {Element} hamburgerElement
     * @param {Element} navElement
     * @param {Object} options
     */
    constructor(hamburgerElement, navElement, options) {
        this._hamburgerElement = hamburgerElement;
        this._navElement = navElement;

        this._defaults = {
            containerSelector: '.gov-portal-header',
            extrasSelector: '.gov-portal-header__extras',
        }

        this._options = merge({}, this._defaults, options);

        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        this._checkElements();
        this._registerListeners();
        this._moveExtras();
    }

    /**
     * @return {void}
     * @private
     * @throws GovError
     */
    _checkElements() {
        if (null === this._hamburgerElement || null === this._navElement) {
            throw new GovError('We could not find all the necessary elements for [GovPortalHamburgerNav]');
        }
    }

    /**
     * @return {void}
     * @private
     * @throws GovError
     */
    _moveExtras() {
        if (null !== this._extrasElement) {
            this._navElement.appendChild(this._extrasElement[0]);
        }
    }

    /**
     * @return {void}
     * @private
     */
    _registerListeners() {
        this._hamburgerElement.addEventListener('click', this._toggleNavigation.bind(this));
    }

    /**
     * @return {void}
     * @private
     */
    _toggleNavigation() {
        toggleClass(this._containerElement, 'is-fixed');
        toggleClass(this._hamburgerElement, 'is-active');

        if (hasClass(this._containerElement, 'is-fixed')) {
            this._bodyElement.style.overflow = 'hidden';
        } else {
            this._bodyElement.style.overflow = 'initial';
        }
    }

    /**
     * @return {HTMLElement|null}
     * @private
     */
    get _containerElement() {
        const {containerSelector} = this._options;
        const parents = this._hamburgerElement.parents(containerSelector);

        if (isArray(parents) && parents.length) {
            return parents[0];
        }

        return null;
    }

    /**
     * @return {HTMLElement|null}
     * @private
     */
    get _extrasElement() {
        const {extrasSelector} = this._options;
        return this._containerElement.querySelectorAll(extrasSelector);
    }

    /**
     * @return {HTMLBodyElement}
     * @private
     */
    get _bodyElement() {
        return document.querySelector('body');
    }
}

export default GovPortalHamburgerNav;
