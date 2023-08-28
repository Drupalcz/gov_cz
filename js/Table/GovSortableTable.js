/*!
 * GovCalendar
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import merge from 'lodash/merge';
import '../utils/dom';
import GovElement from '../mixins/GovElement';

class GovSortableTable extends GovElement {
    constructor(el, options) {
        super(el);
        this._containerElement = el;
        this.columnSorted = null;

        this._defaults = {
            triggerSelector: '.gov-sortable-table__trigger',
        }

        this._options = merge({}, this._defaults, options);

        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        this._bindEvents();
    }

    /**
     * @return {void}
     * @private
     */
    _bindEvents() {
        this._triggerSelectorElements.forEach((trigger, position) => {
            trigger.removeEventListener('click', evt => this._sortTable(evt, position + 1));
            trigger.addEventListener('click', evt => this._sortTable(evt, position + 1));
        });
    }

    _sortTable(evt, column) {
        const {triggerSelector} = this._options;
        let sortButtonParent = evt.target.closest(triggerSelector);
        let rows = Array.from(this._trElements);
        let qs = `tbody tr td:nth-child(${column})`;

        rows.sort((r1, r2) => {
            let t1 = r1.querySelector(qs);
            let t2 = r2.querySelector(qs);

            if (this.columnSorted === column) {
                return this._compareValuesFromSmaller(t1.textContent, t2.textContent);
            } else {
                return this._compareValuesFromBigger(t1.textContent, t2.textContent);
            }
        });

        rows.forEach(row => this._containerElement.querySelector('tbody').appendChild(row));

        if (this.columnSorted === column) {
            this.columnSorted = null;
            sortButtonParent.classList.remove('gov-sortable-table__trigger--asc');
        } else {
            this.columnSorted = column;
            sortButtonParent.classList.add('gov-sortable-table__trigger--asc');
        }
    }

    _compareValuesFromSmaller(a, b) {
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

    _compareValuesFromBigger(a, b) {
        return (a > b) ? -1 : (a < b) ? 1 : 0;
    }

    /**
     * @return {NodeListOf<*> | NodeListOf<Element>}
     * @private
     */
    get _triggerSelectorElements() {
        const {triggerSelector} = this._options;
        return this._containerElement.querySelectorAll(triggerSelector);
    }

    /**
     * @return {NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element> | NodeListOf<SVGElementTagNameMap[string]>}
     */
    get _trElements() {
        return this._containerElement.querySelectorAll('tbody tr');
    }
}

window.GovSortableTable = GovSortableTable;
export default GovSortableTable;
