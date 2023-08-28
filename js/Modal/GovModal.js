/*!
 * GovModal
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import merge from 'lodash/merge';
import {addClass, removeClass} from '../utils/classie';
import GovElement from '../mixins/GovElement';
import {getFirstFocusableElement} from '../utils/dom';

class GovModal extends GovElement {
    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super(el);
        this._defaults = {
            backdropSelector:    '.gov-modal__backdrop',
            closeButtonSelector: '.gov-modal__close',
            modalSelector:       '.gov-modal',
            events:              {
                onOpen:  null,
                onClose: null,
            }
        }
        this._options = merge({}, this._defaults, options);
        this._init();

        this._hideModalControl = this._removeModalListeners.bind(this);
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        this._bindEvents();
    }

    // ACCESSIBLE

    /**
     * @return {void}
     */
    open() {
        this._revealModal();
    }

    /**
     * @return {void}
     */
    close() {
        this._hideModal();
    }

    // LISTENER

    /**
     * @return {void}
     * @private
     */
    _bindEvents() {
        this._containerElement.addEventListener('click', (e) => {
            e.preventDefault();
            this._revealModal();
        });
    }

    /**
     * @return {void}
     * @private
     */
    _bindModalEvents() {
        this._backdropElement.addEventListener('click', this._hideModalControl)
        this._closeButtonElement.addEventListener('click', this._hideModalControl)
        document.addEventListener('keydown', (e) => {
            e = e || window.event;
            if (e.keyCode == 27) {
                e.preventDefault();
                this._hideModal();
            }
        })
    }

    /**
     * @return {boolean}
     * @private
     */
    _revealModal() {
        if (false === this._verifyModalExists()) {
            return false;
        }
        this._bodyElement.style.overflow = 'hidden';
        addClass(this._modalElement, 'is-active');
        setTimeout(() => addClass(this._modalElement, 'is-visible'), 64);

        this._modalElement.setAttribute('aria-hidden', 'false');
        this._modalElement.setAttribute('tabindex', '0');

        this._bindModalEvents();
        this._focusToModal();
        this._callOpenCallback();
    }

    /**
     * @return {void}
     * @private
     */
    _hideModal() {
        this._callCloseCallback();
        this._bodyElement.style.overflow = 'initial';
        removeClass(this._modalElement, 'is-visible');
        setTimeout(() => removeClass(this._modalElement, 'is-active'), 1024);

        this._modalElement.setAttribute('aria-hidden', 'true');
        this._modalElement.setAttribute('tabindex', '-1');

        this._containerElement.focus();
    }

    /**
     * @return {void}
     * @private
     */
    _focusToModal() {
        let focusable = getFirstFocusableElement(this._modalElement);
        if (focusable) focusable.focus();
    }

    /**
     * @param {Event} e
     * @private
     */
    _removeModalListeners(e) {
        if (e) e.preventDefault();
        this._backdropElement.removeEventListener('click', this._hideModalControl);
        this._closeButtonElement.removeEventListener('click', this._hideModalControl);
        this._hideModal();
    }

    /**
     * @return {boolean}
     * @private
     */
    _verifyModalExists() {
        if (null === this._modalElement) {
            const {id} = this._containerElement.dataset;
            console.warn('Modal element [' + id + '] does not exists');
            return false;
        } else {
            return true;
        }
    }

    /**
     * @return {void}
     * @private
     */
    _callOpenCallback() {
        const {onOpen} = this._options.events;
        if (onOpen && typeof onOpen === 'function') {
            onOpen(this._modalElement, () => this._hideModalControl());
        }
    }

    /**
     * @return {void}
     * @private
     */
    _callCloseCallback() {
        const {onClose} = this._options.events;
        if (onClose && typeof onClose === 'function') {
            onClose(this._modalElement);
        }
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _modalElement() {
        const {modalSelector} = this._options;
        const {id} = this._containerElement.dataset;
        return document.querySelector(modalSelector + '#' + id);
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _backdropElement() {
        const {backdropSelector} = this._options;
        return document.querySelector(backdropSelector);
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _closeButtonElement() {
        const {closeButtonSelector} = this._options;
        return this._modalElement.querySelector(closeButtonSelector);
    }

    /**
     * @return {HTMLBodyElement}
     * @private
     */
    get _bodyElement() {
        return document.querySelector('body');
    }
}

window.GovModal = GovModal;
export default GovModal;
