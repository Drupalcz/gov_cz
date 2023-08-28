/*!
 * GovControl
 * Copyright(c) 2021 Digitalni a informacni agentura
 * Copyright(c) 2021 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

export default class GovControl {

    constructor() {
        this._clickOutside = null;
        this._clickEscape = null;
    }

    /**
     * @param {Object} self
     * @return {vodi}
     * @private
     */
    _registerClickOutside(self) {
        this._clickOutside = this._detectClickOutside.bind(self);
        this._clickEscape = this._detectClickEscape.bind(self);
    }

    /**
     * @return {void}
     * @private
     */
    _bindClickOutside() {
        setTimeout(() => {
            document.addEventListener('click', this._clickOutside);
            document.addEventListener('keyup', this._clickEscape);
        }, 100);
    }

    /**
     * @param {MouseEvent} evt
     * @return {void}
     * @private
     */
    _detectClickOutside(evt) {
        if (typeof this['_outsideElement'] !== 'function') {
            return;
        }
        const flyoutElement = this._outsideElement();
        if (!flyoutElement) this._destroyClickOutside();
        let targetElement = evt.target;
        do {
            if (targetElement == flyoutElement) {
                return;
            }
            targetElement = targetElement.parentNode;
        } while (targetElement);

        this._destroyClickOutside();
    }

    /**
     * @return {void}
     * @private
     */
    _destroyClickOutside() {
        document.removeEventListener('click', this._clickOutside);
        document.removeEventListener('keyup', this._clickEscape);
        if (typeof this['_destroy'] === 'function') {
            this._destroy();
        }
    }

    /**
     * @return {void}
     * @private
     */
    _destroyKeyup() {
        document.removeEventListener('click', this._clickOutside);
        document.removeEventListener('keyup', this._clickEscape);
        if (typeof this['_destroy'] === 'function') {
            this._destroy();
        }
    }

    // ESCAPE

    /**
     * @param {KeyboardEvent} evt
     * @private
     */
    _detectClickEscape(evt) {
        if (evt.key === 'Escape') {
            this._destroyKeyup()
            if (typeof this['_destroy'] === 'function') {
                this._destroy();
            }
        }
    }
};
