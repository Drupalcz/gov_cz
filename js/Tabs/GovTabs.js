/*!
 * GovTabs
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.1.0
 */

'use strict';

import {addClass, removeClass} from '../utils/classie';
import GovElement from '../_extends/GovElement';
import GovError from '../common/Error/gov.error';
import classes from '../_extends/lib/classes';
import GovComponent from '../_extends/GovComponent';
import {govErrorLog} from '../common/Log/gov.log';

class GovTabs extends classes(GovElement, GovComponent) {

    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super();
        this._defaults = {
            triggerSelector: '.gov-tabs__link',
            contentSelector: '.gov-tabs__content',
            events:          {
                onChange: null
            }
        }
        this._prepareOptions(options);
        this._prepareDomElement(el);
        this._activeIndex = 0;
        this._focusIndex = 0;
        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        try {
            this._checkElements();
            this._checkDimenssions();
            this._resize();
            this._verifyWcag();
            this._bindEvents();
        } catch (e) {
            console.warn(e.message);
        }
    }

    /**
     * @return {void}
     * @private
     * @throws GovError
     */
    _checkElements() {
        if (this._contentElements.length === 0 || this._triggerElements.length === 0) {
            throw new GovError('We could not find all the necessary elements for [GovTabs]');
        }
    }

    /**
     * @return {void}
     * @private
     */
    _checkDimenssions() {
        this._tab.style.overflow = 'hidden';
        this._tabList.style.width = '10000px';
        this._tab.classList.remove('gov-tabs--compact')

        const spacer = 32
        const containerWidth = this._tab.offsetWidth;
        let triggersLength = 0;
        this._triggerElements.forEach((trigger) => {
            triggersLength += (trigger.offsetWidth + spacer);
        })

        if (triggersLength > containerWidth) {
            this._tab.classList.add('gov-tabs--compact')
        }

        this._tab.style.overflow = 'auto';
        this._tabList.style.width = 'auto';
    }

    _resize() {
        const observer = new ResizeObserver(() => {
            this._checkDimenssions()
        })
        observer.observe(this._tab)
    }

    /**
     * @return {void}
     * @private
     */
    _bindEvents() {
        this._triggerElements.forEach((triggerElement, index) => {
            triggerElement.addEventListener('click', (e) => {
                e.preventDefault();
                this._goToTab(index);
                this._callChangeCallback(e);
            })
        });
        if (this._tabList) {
            this._tabList.addEventListener('keydown', (e) => this._handleArrows(e));
        }
    }

    /**
     *
     * @param {Event} e
     * @private
     */
    _handleArrows(e) {
        const { keyCode } = e;
        if (keyCode === 39 || keyCode === 37) {
            if (false === this._isTriggerIndex(this._focusIndex)) {
                return;
            }
            this._triggerElements[this._focusIndex].setAttribute('tabindex', '-1');

            if (keyCode === 39) {
                this._focusIndex++;
                if (this._focusIndex >= this._triggerElements.length) {
                    this._focusIndex = 0;
                }
            } else if (keyCode === 37) {
                this._focusIndex--;
                if (this._focusIndex < 0) {
                    this._focusIndex = this._triggerElements.length - 1;
                }
            }
            if (this._isTriggerIndex(this._focusIndex)) {
                const current = this._triggerElements[this._focusIndex]
                current.focus();
                this._goToTab(this._focusIndex);
            }
        }
    }

    /**
     * @param {Number} index
     * @return {Boolean}
     * @private
     */
    _goToTab(index) {
        if (index === this._activeIndex || false === this._isContentIndex(index)) {
            return false;
        }

        this._triggerElements.forEach((triggerElement) => {
            triggerElement.setAttribute('tabindex', '-1')
        });

        // Prepare triggers
        const activeTriggerElement = this._triggerElements[this._activeIndex];
        const nextTriggerElement = this._triggerElements[index];

        activeTriggerElement.setAttribute('aria-selected', 'false');
        nextTriggerElement.setAttribute('aria-selected', 'true');
        nextTriggerElement.setAttribute('tabindex', '0')

        removeClass(activeTriggerElement, 'is-active');
        addClass(nextTriggerElement, 'is-active');

        // Prepare contents
        const activeContentElement = this._contentElements[this._activeIndex];
        const nextContentElement = this._contentElements[index];

        activeContentElement.hidden = true;
        nextContentElement.hidden = false;

        removeClass(activeContentElement, 'is-active');
        addClass(nextContentElement, 'is-active');

        this._activeIndex = this._focusIndex = index;
    }

    /**
     * @return {void}
     * @private
     */
    _verifyWcag() {
        this._triggerElements.forEach((trigger, index) => {
            const isActive = index === 0

            if (!trigger.hasAttribute('aria-selected')) trigger.setAttribute('aria-selected', isActive ? 'true' : 'false')
            if (!trigger.hasAttribute('role')) trigger.setAttribute('role', 'tab')
            if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', isActive ? '0' : '-1')

            if (!trigger.hasAttribute('aria-controls')) {
                govErrorLog(`[GovTabs] controls missing mandatory attribute [aria-controls]`)
            }
            if (!trigger.hasAttribute('id')) {
                govErrorLog(`[GovTabs] controls missing mandatory attribute [id]`)
            }
        });
        this._contentElements.forEach((content) => {
            if (!content.hasAttribute('role')) content.setAttribute('role', 'tabpanel')

            if (!content.hasAttribute('id')) {
                govErrorLog("[GovTabs] content missing mandatory attribute [id]")
            }
            if (!content.hasAttribute('aria-labelledby')) {
                govErrorLog("[GovTabs] content missing mandatory attribute [aria-labelledby]")
            }
        });
    }

    /**
     * @param {Event} e
     * @return {void}
     * @private
     */
    _callChangeCallback(e) {
        const { onChange } = this._options.events;
        if (onChange && typeof onChange === 'function') {
            onChange(e);
        }
    }

    /**
     * @param {Number} index
     * @return {Boolean}
     * @private
     */
    _isContentIndex(index) {
        return (index >= 0 && index <= (this._contentElements.length - 1));
    }

    /**
     * @param {Number} index
     * @return {Boolean}
     * @private
     */
    _isTriggerIndex(index) {
        return (index >= 0 && index <= (this._triggerElements.length - 1));
    }

    /**
     * @return {NodeListOf<HTMLElement>}
     * @private
     */
    get _triggerElements() {
        const { triggerSelector } = this._options;
        return this._domElementInstance.querySelectorAll(triggerSelector);
    }

    /**
     * @return {NodeListOf<HTMLElement>}
     * @private
     */
    get _contentElements() {
        const { contentSelector } = this._options;
        return this._domElementInstance.querySelectorAll(contentSelector);
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    get _tabList() {
        return this._domElementInstance.querySelector('[role="tablist"]');
    }

    /**
     * @return {HTMLElement}
     * @private
     */
    get _tab() {
        return this._domElementInstance;
    }
}

window.GovTabs = GovTabs;
export default GovTabs;
