/*!
 * GovElement
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import GovError from '../common/Error/gov.error';

class GovElement {
    /**
     * @param {Element|HTMLElement} el
     * @throws GovError
     */
    constructor(el) {
        if (!el instanceof Element) {
            throw new GovError('Element must be a instance of HTML or HTMLElement');
        }
        this._containerElement = el;
    }

}

export default GovElement;
