/*!
 * GovFormText
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import merge from 'lodash/merge';
import isArray from 'lodash/isArray';
import {addClass, removeClass} from '../utils/classie';
import GovElement from '../mixins/GovElement';

class GovFormText extends GovElement {
    constructor(el, options) {
        super(el);
        this._defaults = {
            controlSelector: '.gov-form-control:not(.gov-form-control--classic)',
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
        this._setStatusInputControl();
    }

    /**
     * @return {void}
     * @private
     */
    _bindEvents() {
        this._containerElement.addEventListener('input', () => {
            this._setStatusInputControl();
        });
    }

    /**
     * @return {void}
     * @private
     */
    _setStatusInputControl() {
        const {value} = this._containerElement;

        if (this._controlElement) {
            if (value.trim() !== '') {
                addClass(this._controlElement, 'not-empty');
            } else {
                removeClass(this._controlElement, 'not-empty');
            }
        }
    }

    /**
     * @return {HTMLElement|null}
     * @private
     */
    get _controlElement() {
        const {controlSelector} = this._options;
        const parents = this._containerElement.parents(controlSelector);
        if (isArray(parents) && parents.length) {
            return parents[0];
        }
        return null;
    }
}

export default GovFormText;
