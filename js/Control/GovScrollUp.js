/*!
 * GovScrollUp
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import merge from 'lodash/merge';
import GovElement from '../mixins/GovElement';
import {getFirstFocusableElement} from '../utils/dom';

class GovScrollUp extends GovElement {
    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super(el);
        this._defaults = {
            behavior: 'smooth',
        }
        this._options = merge({}, this._defaults, options);
        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        this._bindEvents();
    }

    /**
     * @return {void}
     * @private
     */
    _bindEvents() {
        this._containerElement.addEventListener('click', (e) => {
            e.preventDefault();
            this._scrollUp();
            this._focusFirstElement();
        });
    }

    /**
     * @return {void}
     * @private
     */
    _scrollUp() {
        const {behavior} = this._options;
        window.scroll({
            top:  0,
            left: 0,
            behavior
        });
    }

    /**
     * @return {void}
     * @private
     */
    _focusFirstElement() {
        let focusable = getFirstFocusableElement();
        if (focusable) focusable.focus();
    }
}

window.GovScrollUp = GovScrollUp;
export default GovScrollUp;
