/*!
 * GovFormControl
 * Copyright(c) 2021 Digitalni a informacni agentura
 * Copyright(c) 2021 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import isArray from 'lodash/isArray';
import {addClass, hasClass, removeClass} from '../utils/classie';

export default class GovFormControl {

    constructor() {
        this._tempControlMessage = null;

        this._classes = {
            controlMessage: 'gov-form-control__message',
            formComntrol:   'gov-form-control',
            controlError:   'gov-form-control--error',
            classic:        'gov-form-control--classic',
        }
    }

    /**
     * @return {void}
     * @private
     */
    _prepareTempData() {
        if (this._formMessageElement()) {
            this._tempControlMessage = this._formMessageElement().textContent;
        }
    }

    /**
     * @return {Element|HTMLElement|null}
     * @private
     */
    _formControlElement() {
        if (this._domElement()) {
            const parents = this._domElement().parents(`.${this._classes.formComntrol}`);
            if (isArray(parents) && parents.length) {
                return parents[0];
            }
        } else {
            return null;
        }
    }

    /**
     * @return {boolean}
     * @private
     */
    _isClassicElement() {
        if (this._formControlElement()) {
            return this._formControlElement().classList.contains(this._classes.classic)
        } else {
            return false
        }
    }

    /**
     * @return {HTMLElement|Element|null}
     * @private
     */
    _formMessageElement() {
        if (this._formControlElement()) {
            const messageElement = this._formControlElement().querySelector(`.${this._classes.controlMessage}`);
            if (messageElement) return messageElement;
            else {
                const label = this._formControlElement().querySelector('label');
                if (label) {
                    const element = document.createElement('span');
                    element.classList.add(this._classes.controlMessage);
                    label.insertAfter(element);

                    return element;
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    }

    // ERRORS

    /**
     * @param {String} message
     * @private
     */
    _setError(message) {
        if (this._formControlElement()) {
            const { controlError } = this._classes;
            addClass(this._formControlElement(), controlError);
            if (this._formMessageElement() && message) {
                this._formMessageElement().textContent = message;
            }
        }
    }

    /**
     * @return {void}
     * @private
     */
    _clearError() {
        if (this._formControlElement()) {
            const { controlError } = this._classes;
            this._formMessageElement().textContent = '';
            if (hasClass(this._formControlElement(), controlError)) {
                removeClass(this._formControlElement(), controlError);
            }
            if (this._tempControlMessage) {
                this._formMessageElement().textContent = this._tempControlMessage;
            }
        }
    }
};
