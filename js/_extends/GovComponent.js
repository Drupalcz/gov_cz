/*!
 * GovComponent
 * Copyright(c) 2021 Digitalni a informacni agentura
 * Copyright(c) 2021 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import merge from 'lodash/merge';
import isObject from 'lodash/isObject';
import {randomNumber} from '../utils/number';

export default class GovComponent {

    constructor() {
        this._options = {};
        this._defaults = {};
        this._id = randomNumber(1000, 9999);
        this._locales = {};
    }

    // OPTIONS

    /**
     * @param Object options
     * @private
     */
    _prepareOptions(options) {
        this._options = merge({
            locale: 'cs',
        }, this._defaults, options);
    }

    // LOCALE

    /**
     * @param {Object} locales
     * @return {void}
     * @private
     */
    _setLocales(locales) {
        if (isObject(locales)) {
            this._locales = locales;
        }
    }

    /**
     * @return {Object}
     * @private
     */
    _locale() {
        const {locale} = this._options;
        return this._locales.hasOwnProperty(locale) ? this._locales[locale] : this._locales['cs'];
    }
};
