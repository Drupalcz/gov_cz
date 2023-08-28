/*!
 * GovFormControl
 * Copyright(c) 2021 Digitalni a informacni agentura
 * Copyright(c) 2021 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import GovElement from './GovElement';
import isArray from 'lodash/isArray';

class GovFormControl extends GovElement {
    /**
     * @param {Element|HTMLElement} el
     * @throws GovError
     */
    constructor(el) {
        super(el);
    }

    /**
     * @return {Element|HTMLElement|null}
     * @private
     */
    get _formControlElement() {
        const parents = this._inputElement.parents('.gov-form-control');
        if (isArray(parents) && parents.length) {
            return parents[0];
        }
        return null;
    }

    /**
     * @return {Element|HTMLElement}
     * @private
     */
    get _inputElement() {
        return this._containerElement;
    }
}

export default GovFormControl;
