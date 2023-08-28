/*!
 * GovSliderBar
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
import GovError from '../common/Error/gov.error';

const PREV = 'prev';
const NEXT = 'next';

class GovSliderBar extends GovElement {

    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super(el);
        this._defaults = {
            controlPrevSelector: '.gov-slider-bar__arrow--prev',
            controlNextSelector: '.gov-slider-bar__arrow--next',
            itemSelector:        '.gov-slider-bar__item',
            itemsHolderSelector: '.gov-slider-bar__items',
        }
        this._options = merge({}, this._defaults, options);
        this._activeIdx = 0;

        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        this._checkElements();
        this._bindEvents();
        this._countSlides();
    }

    /**
     * @return {void}
     * @private
     * @throws GovError
     */
    _checkElements() {
        if (null === this._controlPrevElement || null === this._controlNextElement || null === this._itemsHolderElement || this._itemElements.length === 0) {
            throw new GovError('We could not find all the necessary elements for [GovSliderBar]');
        }
    }

    /**
     * @return {void}
     * @private
     */
    _bindEvents() {
        this._controlPrevElement.addEventListener('click', (e) => {
            e.preventDefault();
            this._makeSlide(PREV);
        });
        this._controlNextElement.addEventListener('click', (e) => {
            e.preventDefault();
            this._makeSlide(NEXT);
        });
        this._controlPrevElement.addEventListener('keyup', (e) => {
            e.preventDefault();
            if (e.keyCode === 13) this._makeSlide(PREV);
        });
        this._controlNextElement.addEventListener('keyup', (e) => {
            e.preventDefault();
            if (e.keyCode === 13) this._makeSlide(NEXT);
        });
        window.addEventListener('resize', () => {
            this._reset();
        });
    }

    /**
     * @return {void}
     * @private
     */
    _countSlides() {
        let itemsHolderWidth = 0;

        this._itemElements.forEach((item) => {
            itemsHolderWidth += item.offsetWidth;
        });

        this._numberOfSlides = Math.ceil(itemsHolderWidth / this._containerElement.offsetWidth);
    }

    /**
     * @param {String} nextWay
     * @return {void}
     * @private
     */
    _makeSlide(nextWay) {
        if (nextWay === PREV && this._activeIdx > 0) {
            this._activeIdx--;
        }
        if (nextWay === NEXT && this._activeIdx < (this._numberOfSlides - 1)) {
            this._activeIdx++;
        }

        this._itemsHolderElement.style.transform = 'translateX(' + (100 * this._activeIdx * -1) + '%)';
        this._handleControlsStates();
    }

    /**
     * @return {void}
     * @private
     */
    _handleControlsStates() {
        if (this._activeIdx === 0) {
            addClass(this._controlPrevElement, 'gov-slider-bar__arrow--disabled');
            removeClass(this._controlNextElement, 'gov-slider-bar__arrow--disabled');
            this._controlPrevElement.setAttribute('tabindex', '-1');
            this._controlNextElement.setAttribute('tabindex', '0');
        } else if (this._activeIdx === this._numberOfSlides - 1) {
            addClass(this._controlNextElement, 'gov-slider-bar__arrow--disabled');
            removeClass(this._controlPrevElement, 'gov-slider-bar__arrow--disabled');
            this._controlPrevElement.setAttribute('tabindex', '0');
            this._controlNextElement.setAttribute('tabindex', '-1');
        } else if (this._activeIdx > 0 && this._activeIdx < (this._numberOfSlides - 1)) {
            removeClass(this._controlPrevElement, 'gov-slider-bar__arrow--disabled');
            removeClass(this._controlNextElement, 'gov-slider-bar__arrow--disabled');
            this._controlPrevElement.setAttribute('tabindex', '0');
            this._controlNextElement.setAttribute('tabindex', '0');
        }
    }

    /**
     * @return {void}
     * @private
     */
    _reset() {
        this._activeIdx = 0;
        this._itemsHolderElement.style.transform = 'translateX(0)';

        this._countSlides();
        this._handleControlsStates();
    }

    /**
     * @return {Element}
     * @private
     */
    get _controlPrevElement() {
        const {controlPrevSelector} = this._options;
        return this._containerElement.querySelector(controlPrevSelector);
    }

    /**
     * @return {Element}
     * @private
     */
    get _controlNextElement() {
        const {controlNextSelector} = this._options;
        return this._containerElement.querySelector(controlNextSelector);
    }

    /**
     * @return {Element}
     * @private
     */
    get _itemsHolderElement() {
        const {itemsHolderSelector} = this._options;
        return this._containerElement.querySelector(itemsHolderSelector);
    }

    /**
     * @return {NodeListOf<HTMLElement>}
     * @private
     */
    get _itemElements() {
        const {itemSelector} = this._options;
        return this._containerElement.querySelectorAll(itemSelector);
    }
}

export default GovSliderBar;
