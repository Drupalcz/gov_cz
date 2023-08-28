/*!
 * GovElement
 * Copyright(c) 2021 Digitalni a informacni agentura
 * Copyright(c) 2021 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import GovError from '../common/Error/gov.error';

export default class GovElement {

    constructor() {
        this._domElementInstance = null;
    }

    /**
     * @param {Element|HTMLElement} el
     * @throws GovError
     */
    _prepareDomElement(el) {
        if (!el instanceof Element) {
            throw new GovError('Element must be a instance of HTML or HTMLElement');
        }
        this._domElementInstance = el;
    }

    /**
     * @return {Element|HTMLElement}
     * @private
     */
    _domElement() {
        return this._domElementInstance;
    }

    /**
     * @return {HTMLBodyElement}
     * @private
     */
    _body() {
        return document.querySelector('body')
    }
};
