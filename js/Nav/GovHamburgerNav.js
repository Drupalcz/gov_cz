/*!
 * GovHamburgerNav
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import merge from 'lodash/merge';
import isArray from 'lodash/isArray';
import {addClass, hasClass, removeClass} from '../utils/classie';
import GovError from '../common/Error/gov.error';

class GovHamburgerNav {

    /**
     * @param {Element} hamburgerElement
     * @param {Element} navElement
     * @param {Object} options
     */
    constructor(hamburgerElement, navElement, options = {}) {
        this._hamburgerElement = hamburgerElement;
        this._navElement = navElement;

        this._defaults = {
            logoSelector:      '.gov-header__nav-logo',
            overlaySelector:   '.gov-header__overlay',
            containerSelector: '.gov-container',
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
    }

    /**
     * @return {void}
     * @private
     * @throws GovError
     */
    _checkElements() {
        if (null === this._hamburgerElement || null === this._navElement) {
            throw new GovError('We could not find all the necessary elements for [GovHamburgerNav]');
        }
    }

    /**
     * @return {void}
     * @private
     */
    _registerListeners() {
        this._hamburgerElement.addEventListener('click', this._toggleNavigation.bind(this));
        if (this._overlayElement) {
            this._overlayElement.addEventListener('click', this._toggleNavigation.bind(this));
        }
    }

    /**
     * @return {void}
     * @private
     */
    _toggleNavigation() {
        if (hasClass(this._navElement, 'active')) {
            removeClass(this._navElement, 'active');
            removeClass(this._hamburgerElement, 'active');
            this._bodyElement.style.overflow = 'initial';

            if (this._logoElement) removeClass(this._logoElement, 'active');
            if (this._overlayElement) removeClass(this._overlayElement, 'active');
            if (this._containerElement) removeClass(this._containerElement, 'is-fixed');
        } else {
            addClass(this._navElement, 'active');
            addClass(this._hamburgerElement, 'active');
            this._bodyElement.style.overflow = 'hidden';

            if (this._logoElement) addClass(this._logoElement, 'active');
            if (this._overlayElement) addClass(this._overlayElement, 'active');
            if (this._containerElement) addClass(this._containerElement, 'is-fixed');
        }
    }

    /**
     * @return {HTMLElement|null}
     * @private
     */
    get _overlayElement() {
        const {overlaySelector} = this._options;
        return this._containerElement.querySelector(overlaySelector);
    }


    /**
     * @return {HTMLElement|null}
     * @private
     */
    get _logoElement() {
        const {logoSelector} = this._options;
        return this._containerElement.querySelector(logoSelector);
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
     * @return {HTMLBodyElement}
     * @private
     */
    get _bodyElement() {
        return document.querySelector('body');
    }
}

export default GovHamburgerNav;
