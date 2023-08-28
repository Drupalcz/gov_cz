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
import range from 'lodash/range';
import isObject from 'lodash/isObject';
import GovElement from '../mixins/GovElement';
import {chunk} from '../utils/array';
import {padStart} from '../utils/string';

const DATE_FORMAT = /([12]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/;

const locales = {
    cs: {
        months: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
        days:   ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
    },
    en: {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        days:   ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
}

class GovCalendar extends GovElement {
    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super(el);
        this._defaults = {
            locale:   'cs',
            selected: null,
            classes:  {
                today:    'is-today',
                selected: 'is-selected',
                disabled: 'is-disabled',
            },
            events:   {
                onDateSelect: null,
            }
        }
        this._options = merge({}, this._defaults, options);
        this._selected = null;
        this._daySelectCallback = this._daySelect.bind(this);
        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        this._prepareSelectedDate();
        this._prepareStructure();
        this._renderCalendar();
        this._bindEvents();
    }

    /**
     * @return {void}
     * @private
     */
    _prepareSelectedDate() {
        const {selected} = this._options;
        let date = new Date();
        if (selected) {
            const re = new RegExp(DATE_FORMAT);
            const match = selected.match(re);
            date = new Date(match[1], match[2] - 1, match[3]);

            this._selected = {
                year:  date.getFullYear(),
                month: date.getMonth(),
                day:   date.getDate(),
            };
        }
        this._state = {
            year:  date.getFullYear(),
            month: date.getMonth(),
            day:   date.getDate(),
        }
    }

    /**
     * @return {void}
     * @private
     */
    _bindEvents() {
        this._prevMonthElement.addEventListener('click', () => this._previous());
        this._nextMonthElement.addEventListener('click', () => this._next());
    }

    /**
     * @param {MouseEvent} evt
     * @private
     */
    _daySelect(evt) {
        evt.preventDefault();
        const {onDateSelect} = this._options.events;
        const {target} = evt;
        const date = new Date(target.dataset.date);
        this._selected = {
            year:  date.getFullYear(),
            month: date.getMonth(),
            day:   date.getDate(),
        };
        this._prepareDaysAttribute();
        if (onDateSelect && typeof onDateSelect === 'function') {
            onDateSelect(date, target);
        }
    }

    /**
     * @return {void}
     * @private
     */
    _renderCalendar() {
        const {year, month} = this._state;
        let firstDay =  new Date(year, month).getDay() - 1;
        this._clearDaysElement();
        this._prepareWeekDays()

        const prevDays = this._preparePrevMonthDays(year, month, firstDay);
        const days = this._prepareMonthDays();
        const nextDays = this._prepareNextMonthDays(prevDays.length, days.length, year, month);

        const chunks = chunk([...prevDays, ...days, ...nextDays], 7);

        chunks.forEach((days) => {
            let tbodyEl = document.createElement('tbody'),
                trEl = document.createElement('tr');

            days.forEach((date) => {
                let td = document.createElement('td');
                let button = document.createElement('button');

                if (this._today.day === date.day && this._today.month === date.month && this._today.year === date.year) {
                    button.classList.add(this._options.classes.today);
                }
                if (date.disabled) {
                    button.setAttribute('disabled', 'disabled');
                    button.classList.add(this._options.classes.disabled);
                }
                button.setAttribute('type', 'button');
                button.setAttribute('data-year', date.year);
                button.setAttribute('data-month', padStart(date.month));
                button.setAttribute('data-day', padStart(date.day));
                button.setAttribute('data-date', date.year + '-' + padStart(date.month) + '-' + padStart(date.day));
                button.innerHTML = date.day;

                button.addEventListener('click', this._daySelectCallback);

                td.append(button);
                trEl.append(td);
            });

            tbodyEl.append(trEl);
            this._daysElement.append(tbodyEl);
        });

        this._prepareDaysAttribute();
        this._monthTitleElement.innerHTML = this._locales.months[month];
        this._yearTitleElement.innerHTML = year;
    }

    /**
     * @return {void}
     * @private
     */
    _prepareDaysAttribute() {
        const buttons = this._daysElement.querySelectorAll('button');
        buttons.forEach((button) => {
            button.classList.remove(this._options.classes.selected);

            const year = parseInt(button.getAttribute('data-year'));
            const month = parseInt(button.getAttribute('data-month'));
            const day = parseInt(button.getAttribute('data-day'));

            if (isObject(this._selected)) {
                const s = this._selected;
                if (s.day === day && (s.month + 1) === month && s.year === year) {
                    button.classList.add(this._options.classes.selected);
                }
            }
        });
    }

    /**
     * @return {void}
     * @private
     */
    _next() {
        this._state.year = this._state.month === 11 ? this._state.year + 1 : this._state.year;
        this._state.month = (this._state.month + 1) % 12;
        this._renderCalendar();
    }

    /**
     * @return {void}
     * @private
     */
    _previous() {
        this._state.year = this._state.month === 0 ? this._state.year - 1 : this._state.year;
        this._state.month = this._state.month === 0 ? 11 : this._state.month - 1;
        this._renderCalendar();
    }

    /**
     * @return {void}
     * @private
     */
    _prepareWeekDays() {
        let theadEl = document.createElement('thead'),
            trEl = document.createElement('tr');

        for (let i = 0; i < 7; i++) {
            const cell = document.createElement('th');
            cell.innerHTML = this._locales.days[i];
            trEl.append(cell);
        }

        theadEl.append(trEl);
        this._daysElement.append(theadEl);
    }


    /**
     * @param {Number} year
     * @param {Number} month
     * @return {number}
     * @private
     */
    _daysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * @return {Array}
     * @private
     */
    _prepareMonthDays() {
        const {year, month} = this._state;
        const totalDays = this._daysInMonth(year, this._state.month);
        const days = range(1, totalDays + 1);
        const buffer = [];
        days.forEach((day) => buffer.push({year, month: month + 1, day: day, disabled: false}));
        return buffer;
    }

    /**
     * @param {Number} year
     * @param {Number} month
     * @param {Number} firstDay
     * @return {Array}
     * @private
     */
    _preparePrevMonthDays(year, month, firstDay) {
        if (month === 0) {
            month = 11;
            year = year - 1
        } else {
            month = month - 1;
        }
        let numberOfDays = new Date(year, month + 1, 0).getDate();
        const buffer = [];

        if(firstDay === -1) {
            firstDay = 6;
        }

        for (let k = firstDay; k > 0; k--) {
            buffer.push({year, month: month + 1, day: numberOfDays, disabled: true});
            numberOfDays = numberOfDays - 1;
        }

        buffer.reverse();

        return buffer;
    }

    /**
     *
     * @param {Number} numberOfPrevDays
     * @param {Number} numberOfDays
     * @param {Number} year
     * @param {Number} month
     * @return {Array}
     * @private
     */
    _prepareNextMonthDays(numberOfPrevDays, numberOfDays, year, month) {
        if (month === 11) {
            month = 0;
            year = year + 1
        }
        let restOfDays = 42 - (numberOfPrevDays + numberOfDays);
        if (restOfDays >= 7) restOfDays = restOfDays - 7;
        const days = range(1, restOfDays + 1);
        const buffer = [];
        days.forEach((day) => buffer.push({year, month: month + 1, day: day, disabled: true}));
        return buffer;
    }

    /**
     * @return {void}
     * @private
     */
    _clearDaysElement() {
        const buttons = this._daysElement.querySelectorAll('button');
        buttons.forEach((button) => button.removeEventListener('click', this._daySelectCallback));
        this._daysElement.innerHTML = '';
    }

    /**
     * @return {{dayInt: number, month: number, year: number}}
     * @private
     */
    get _getCurrentDateObject() {
        let today = new Date();
        return {
            today,
            dayInt: today.getDate(),
            month:  today.getMonth(),
            year:   today.getFullYear()
        }
    }

    /**
     * @return {void}
     * @private
     */
    _prepareStructure() {
        const structure = `
            <div class="gov-calendar__container">
                <div class="gov-calendar__header">
                    <button class="gov-calendar__toggle gov-calendar__toggle--prev" type="button"></button>

                    <div class="gov-calendar__title">
                        <span class="gov-calendar__title-month"></span>
                        <span class="gov-calendar__title-year"></span>
                    </div>

                    <button class="gov-calendar__toggle gov-calendar__toggle--next" type="button"></button>
                </div>
                <div class="gov-calendar__body">
                    <table class="gov-calendar__days">
                    </table>
                </div>
            </div>
        `;

        this._containerElement.innerHTML = structure;
    }

    /**
     * @return {Object}
     * @private
     */
    get _locales() {
        const {locale} = this._options;
        return locales.hasOwnProperty(locale) ? locales[locale] : locales['cs'];
    }

    /**
     * @return {{month: number, year: number, day: number}}
     * @private
     */
    get _today() {
        const today = new Date();
        return {
            day:   today.getDate(),
            month: today.getMonth() + 1,
            year:  today.getFullYear(),
        }
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _daysElement() {
        return this._containerElement.querySelector('.gov-calendar__days') || null;
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _prevMonthElement() {
        return this._containerElement.querySelector('.gov-calendar__toggle--prev') || null;
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _nextMonthElement() {
        return this._containerElement.querySelector('.gov-calendar__toggle--next') || null;
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _yearTitleElement() {
        return this._containerElement.querySelector('.gov-calendar__title-year') || null;
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _monthTitleElement() {
        return this._containerElement.querySelector('.gov-calendar__title-month') || null;
    }

    /**
     * @return {Array}
     */
    get _monthNames() {
        this._locales.months;
    }

    /**
     * @return {Array}
     */
    get _dayNames() {
        return this._locales.days;
    }

    /**
     * @return {String}
     */
    get getCurrentDate() {
        const today = new Date();
        const dd = padStart(today.getDate());
        const mm = padStart(today.getMonth() + 1);
        const yyyy = today.getFullYear();

        return yyyy + '-' + mm + '-' + dd;
    }

}

window.GovCalendar = GovCalendar;
export default GovCalendar;
