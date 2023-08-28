/*!
 * GovTooltip
 * Copyright(c) 2022 Digitalni a informacni agentura
 * Copyright(c) 2022 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import GovElement from '../_extends/GovElement';
import GovControl from '../_extends/GovControl';
import classes from '../_extends/lib/classes';
import GovComponent from '../_extends/GovComponent';
import {makeId} from '../utils/string';

const TLT_POS_UP = 'up';
const TLT_POS_DOWN = 'down';
const TLT_POS_LEFT = 'left';
const TLT_POS_RIGHT = 'right';

class GovTooltip extends classes(GovElement, GovComponent, GovControl) {

    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super();
        this._defaults = {
            defaults: {
                size:   'medium',
                theme:  'dark',
                point:  'point-left',
                offset: 12
            }
        }
        this._prepareOptions(options);
        this._prepareDomElement(el);

        this._id = makeId(5);
        this._tooltip = null;
        this._pointer = null;
        this._clickHelper = false;
        this._hoverHelper = false;
        this._setup = {
            point: null,
        }

        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        try {
            this._prepareTooltips();
        } catch (e) {
            console.warn(e.message);
        }
    }

    /**
     * @return {void}
     * @private
     * @throws GovError
     */
    _prepareTooltips() {
        const message = this._trigger.getAttribute('gov-tooltip-message');

        if (String(message).length === 0) {
            return
        }

        const describedBy = 'gov-tooltip-' + this._id
        this._trigger.setAttribute('aria-describedby', describedBy)
        this._trigger.setAttribute('tabindex', '0')

        this._pointer = document.createElement('span')
        this._pointer.classList.add('gov-tooltip--pointer')

        this._tooltip = document.createElement('div');
        this._tooltip.setAttribute('aria-hidden', 'true');
        this._tooltip.setAttribute('id', describedBy);
        this._tooltip.setAttribute('role', 'tooltip');
        this._tooltip.style.display = 'none';
        this._tooltip.classList.add('gov-tooltip');
        this._tooltip.classList.add('gov-tooltip--hidden');
        this._tooltip.innerHTML = message;

        const size = this._trigger.getAttribute('gov-tooltip-size');
        const theme = this._trigger.getAttribute('gov-tooltip-theme');
        const point = this._trigger.getAttribute('gov-tooltip-point');

        if (['small', 'medium', 'large'].indexOf(size) !== -1) {
            this._tooltip.classList.add('gov-tooltip--' + size);
        } else {
            this._tooltip.classList.add('gov-tooltip--' + this._options.defaults.size);
        }
        if (['dark', 'light', 'blue'].indexOf(theme) !== -1) {
            this._tooltip.classList.add('gov-tooltip--' + theme);
        } else {
            this._tooltip.classList.add('gov-tooltip--' + this._options.defaults.theme);
        }
        if ([TLT_POS_LEFT, TLT_POS_RIGHT, TLT_POS_UP, TLT_POS_DOWN].indexOf(point) !== -1) {
            this._setup.point = point;
        } else {
            this._setup.point = this._options.defaults.point;
        }

        this._tooltip.appendChild(this._pointer);
        this._body().appendChild(this._tooltip);
        this._bindEvents();
        govRemoveClickFocus()
    }

    /**
     * @return {void}
     * @private
     */
    _bindEvents() {
        if (this._tooltip) {
            this._trigger.addEventListener('focus', (e) => {
                e.preventDefault();
                if (this._clickHelper === false && this._hoverHelper === false) {
                    this._displayTooltip();
                }
            })
            this._trigger.addEventListener('blur', (e) => {
                e.preventDefault();
                if (this._clickHelper === false && this._hoverHelper === false) {
                    this._hideTooltip();
                }
            })
            this._trigger.addEventListener('mouseenter', (e) => {
                e.preventDefault();
                this._clickHelper = false;
                this._hoverHelper = true;
                this._displayTooltip();
            })
            this._trigger.addEventListener('click', (e) => {
                e.preventDefault();

                if (this._clickHelper) {
                    this._hideTooltip();
                    this._destroy();
                } else {
                    this._registerClickOutside(this);
                    this._bindClickOutside();

                    this._clickHelper = true;
                    if (this._hoverHelper === false) {
                        this._displayTooltip();
                    }
                }
            })
            this._trigger.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this._hoverHelper = false;
                if (this._clickHelper === false) {
                    this._hideTooltip();
                }
            })
        }
    }

    /**
     * @return {void}
     * @private
     */
    _displayTooltip() {
        [TLT_POS_LEFT, TLT_POS_RIGHT, TLT_POS_UP, TLT_POS_DOWN].forEach((point) => {
            this._tooltip.classList.remove('gov-tooltip--point-' + point);
        });

        this._pointer.removeAttribute('style')

        //this._tooltip.style.opacity = '0';
        this._tooltip.style.display = 'inline-block';

        const offset = this._options.defaults.offset

        const bodyWidth = this._body().clientWidth

        const triggerPos = this._trigger.boundingDocumentRect();
        const trgWidth = this._trigger.offsetWidth;
        const trgHeight = this._trigger.offsetHeight;

        const tltHeight = this._tooltip.offsetHeight;
        const tltWidth = this._tooltip.offsetWidth;

        this._tooltip.style.position = 'absolute';
        this._tooltip.style.zIndex = '1000';

        let forcePointUp = false;

        if (this._setup.point === TLT_POS_LEFT) {
            if ((bodyWidth - (offset + triggerPos.left + trgWidth)) > tltWidth) {
                this._addPoint(TLT_POS_LEFT);
                this._tooltip.style.left = offset + triggerPos.left + trgWidth + 'px';
                this._tooltip.style.top = (triggerPos.top + (trgHeight / 2)) - (tltHeight / 2) + 'px';
            } else {
                forcePointUp = true;
            }
        }
        if (this._setup.point === TLT_POS_RIGHT) {
            if ((offset + triggerPos.left) > tltWidth) {
                this._addPoint(TLT_POS_RIGHT);
                this._tooltip.style.left = triggerPos.left - (offset + tltWidth) + 'px';
                this._tooltip.style.top = (triggerPos.top + (trgHeight / 2)) - (tltHeight / 2) + 'px';
            } else {
                forcePointUp = true;
            }
        }
        if (this._setup.point === TLT_POS_UP || this._setup.point === TLT_POS_DOWN || forcePointUp) {
            if (this._setup.point === TLT_POS_UP || forcePointUp) this._addPoint(TLT_POS_UP);

            this._tooltip.style.top = triggerPos.top + offset + trgHeight + 'px';

            if (triggerPos.left + (trgWidth / 2) > (tltWidth / 2) && bodyWidth - (triggerPos.left + (trgWidth / 2)) > (tltWidth / 2)) {
                this._tooltip.style.left = (triggerPos.left + (trgWidth / 2)) - (tltWidth / 2) + 'px';
            } else {
                if ((triggerPos.left + trgWidth + offset) > tltWidth) {
                    this._tooltip.style.left = (triggerPos.left + trgWidth + offset) - tltWidth + 'px';
                    this._pointer.style.left = (tltWidth - (offset + (trgWidth / 2) + this._pointer.offsetWidth / 2)) + 'px';
                } else if (triggerPos.left + tltWidth + offset < bodyWidth) {
                    this._tooltip.style.left = (triggerPos.left - offset) + 'px';
                    this._pointer.style.left = offset + 'px';
                } else {
                    this._tooltip.style.left = (bodyWidth - tltWidth) / 2 + 'px';
                }
            }
        }
        if (this._setup.point === TLT_POS_DOWN) {
            this._addPoint(TLT_POS_DOWN);
            this._tooltip.style.top = triggerPos.top - (offset + trgHeight) + 'px'
        }

        this._tooltip.setAttribute('aria-hidden', 'false');
        this._tooltip.classList.remove('gov-tooltip--hidden');
        //this._tooltip.style.opacity = '1'
    }

    /**
     * @return {void}
     * @private
     */
    _hideTooltip() {
        this._tooltip.style.display = 'none';
        this._tooltip.setAttribute('aria-hidden', 'true');
        this._tooltip.classList.add('gov-tooltip--hidden');
    }

    /**
     * @param {String} point
     * @private
     */
    _addPoint(point) {
        this._tooltip.classList.add('gov-tooltip--point-' + point);
    }

    /**
     * @return {null|HTMLElement}
     * @private
     */
    get _trigger() {
        return this._domElementInstance
    }

    // CONTROLS

    /**
     * @return {HTMLElement | null}
     * @private
     */
    _outsideElement() {
        return this._tooltip
    }

    /**
     * @return {void}
     * @private
     */
    _destroy() {
        this._hideTooltip();
        this._clickHelper = false;
        this._hoverHelper = false;
    }
}

window.GovTooltip = GovTooltip;
export default GovTooltip;
