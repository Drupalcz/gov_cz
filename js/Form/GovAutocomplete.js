/*!
 * GovAutocomplete
 * Copyright(c) 2020 Digitalni a informacni agentura
 * Copyright(c) 2020 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import merge from 'lodash/merge';
import map from 'lodash/map';
import GovElement from '../mixins/GovElement';
import {debounce} from '../utils/function';
import {randomNumber} from '../utils/number';
import {addClass, removeClass} from '../utils/classie';

const locales = {
    cs: {
        emptyList: 'Nebyly nalezeny žádné výsledky'
    },
    en: {
        emptyList: 'No results found'
    },
}

class GovAutocomplete extends GovElement {
    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super(el);
        this._defaults = {
            locale:      'cs',
            onSearch:    null,
            onSelect:    null,
            minChars:    2,
            allowCreate: false,
            classes:     {
                resultItem:            'gov-autocomplete__result',
                emptyItem:             'gov-autocomplete__empty',
                autocompleteContainer: 'gov-autocomplete',
                resultContainer:       'gov-autocomplete__results',
                controlContainer:      'gov-form-control'
            }
        }
        this._id = randomNumber(1000, 9999);
        this._options = merge({}, this._defaults, options);
        this._data = [];
        this._arrowCounter = -1;
        this._selected = null;
        this._clickOutside = this._detectClickOutside.bind(this);

        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        this._prepareStructure();
        this._bindEvents();
    }

    _bindEvents() {
        this._containerElement.addEventListener('focus', (e) => {
            const { value } = e.target;
            this._searchValues(value);
            this._bindClickOutside();
        });
        this._containerElement.addEventListener('keyup', (e) => {
            e = e || window.event;
            e.preventDefault();
            if (e.keyCode === 38) this._onArrowUp();
            else if (e.keyCode === 40) this._onArrowDown();
            else if (e.keyCode === 13) this._onEnter();
            else if (e.keyCode === 27) this._pick(null);
        });
        this._containerElement.addEventListener('input', debounce((e) => {
            const { value } = e.target;
            if (value.length === 0) this._pick(null);
            this._searchValues(value);
        }, 200));
    }

    /**
     * @param {String} value
     * @return {void}
     * @private
     */
    _searchValues(value) {
        const { onSearch, minChars } = this._options;
        const minimalCharacters = parseInt(minChars);
        if (onSearch && typeof onSearch === 'function' && String(value).length >= minimalCharacters) {
            // TODO cancel promise
            onSearch(value).then((data) => {
                this._arrowCounter = -1;
                this._data = data;
                this._prepareListeOffer();
            });
        }
    }

    /**
     * @return {void}
     * @private
     */
    _prepareListeOffer() {
        const { classes: { resultItem, emptyItem } } = this._options;
        this._inputListElement.innerHTML = '';
        map(this._data, (item) => {
            const { name } = item;
            const li = document.createElement('li');
            li.classList.add(resultItem);
            li.setAttribute('role', 'option');
            li.innerHTML = name;

            li.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this._pick(item);
            });
            this._inputListElement.append(li);
        });
        if (this._data.length > 0) {
            this._showListOffer();
        } else {
            const li = document.createElement('li');
            li.classList.add(emptyItem);
            li.innerHTML = this._locales.emptyList;
            this._inputListElement.append(li);
            this._showListOffer();
        }
    }

    // ACTION

    /**
     * @param {Object|null} item
     * @return {void}
     * @private
     */
    _pick(item) {
        const { onSelect } = this._options;
        if (null === item) {
            this._containerElement.value = '';
            if (!this._isControlElementClassic) {
                removeClass(this._inputControlElement, 'not-empty');
            }
        } else {
            const { name } = item;
            this._containerElement.value = name;
            if (!this._isControlElementClassic) {
                addClass(this._inputControlElement, 'not-empty');
            }
        }
        this._hideListOffer();
        this._arrowCounter = -1;
        this._selected = item;
        if (onSelect && typeof onSelect === 'function') {
            onSelect(item);
        }
        document.removeEventListener('click', this._clickOutside);
    }

    // EVENTS

    /**
     * @return {void}
     * @private
     */
    _bindClickOutside() {
        setTimeout(() => {
            document.addEventListener('click', this._clickOutside);
        }, 100);
    }

    /**
     * @param {MouseEvent} evt
     * @return {void}
     * @private
     */
    _detectClickOutside(evt) {
        const flyoutElement = this._inputContainerElement;
        let targetElement = evt.target;
        do {
            if (targetElement == flyoutElement) {
                return;
            }
            targetElement = targetElement.parentNode;
        } while (targetElement);

        this._pick(null);
    }

    /**
     * @return {void}
     * @private
     */
    _onArrowDown() {
        if (this._isListVisible()) {
            if (this._arrowCounter < this._data.length) {
                this._arrowCounter = this._arrowCounter + 1;
                this._setSelectedOption();
            }
        }
    }

    /**
     * @return {void}
     * @private
     */
    _onArrowUp() {
        if (this._isListVisible()) {
            if (this._arrowCounter > 0) {
                this._arrowCounter = this._arrowCounter - 1;
                this._setSelectedOption();
            }
        }
    }

    /**
     * @return {void}
     * @private
     */
    _onEnter() {
        if (this._data.hasOwnProperty(this._arrowCounter)) {
            const item = this._data[this._arrowCounter];
            this._pick(item);
        } else {
            const { allowCreate } = this._options;
            if (allowCreate && this._containerElement.value) {
                this._pick({ id: null, name: this._containerElement.value });
            }
        }
    }

    // STRUCTURE

    /**
     * @return {void}
     * @private
     */
    _prepareStructure() {
        const { classes: { autocompleteContainer, resultContainer } } = this._options;
        this._containerElement.setAttribute('role', 'searchbox');
        this._containerElement.setAttribute('aria-autocomplete', 'list');
        this._containerElement.setAttribute('aria-controls', 'autocomplete-' + this._id);
        this._containerElement.setAttribute('aria-activedescendant', '');
        this._containerElement.setAttribute('aria-multiline', '0');

        const container = document.createElement('div');
        container.classList.add(autocompleteContainer);
        container.setAttribute('role', 'combobox');
        container.setAttribute('aria-haspopup', 'listbox');
        container.setAttribute('aria-owns', 'autocomplete-' + this._id);
        container.setAttribute('aria-expanded', '0');

        const list = document.createElement('ul');
        list.setAttribute('id', 'autocomplete-' + this._id);
        list.setAttribute('role', 'listbox');
        list.classList.add(resultContainer);
        list.style.display = 'none';

        let labelElement = null;
        const sibling = this._containerElement.nextElementSibling;
        if (sibling && sibling.tagName === 'LABEL') {
            labelElement = sibling;
        }

        this._containerElement.wrap(container);
        if (labelElement) this._inputContainerElement.append(labelElement);
        this._inputContainerElement.append(list);
    }

    // HELPERS

    /**
     * @return {void}
     * @private
     */
    _setSelectedOption() {
        const options = this._inputListElement.querySelectorAll('li'),
            optionsEl = this._inputListElement;

        map(options, (option, index) => {
            option.classList.remove('selected');
            option.setAttribute('aria-selected', '0');
            if (index === this._arrowCounter) {
                option.classList.add('selected');
                option.setAttribute('aria-selected', '1');
                optionsEl.scrollTop = option.offsetTop;
            }
        })
    }

    /**
     * @return {void}
     * @private
     */
    _hideListOffer() {
        this._inputListElement.style.display = 'none';
        this._inputListElement.innerHTML = '';

        this._inputContainerElement.setAttribute('aria-expanded', '0');
    }

    /**
     * @return {void}
     * @private
     */
    _showListOffer() {
        this._inputListElement.style.display = 'block';
        this._inputContainerElement.setAttribute('aria-expanded', '1');
    }

    /**
     * @return {boolean}
     * @private
     */
    _isListVisible() {
        return this._inputListElement.style.display === 'block';
    }

    // CALLABLE

    /**
     * @return {void}
     */
    clear() {
        this._containerElement.value = '';
        if (!this._isControlElementClassic) {
            removeClass(this._inputControlElement, 'not-empty');
        }
    }

    // ELEMENTS

    /**
     * @return {Element|HTMLElement|null}
     * @private
     */
    get _inputContainerElement() {
        const { classes: { autocompleteContainer } } = this._options;
        const inputContainer = this._containerElement.parents('.' + autocompleteContainer);
        return inputContainer.length ? inputContainer[0] : null;
    }

    /**
     * @return {Element|HTMLElement|null}
     * @private
     */
    get _inputControlElement() {
        const { classes: { controlContainer } } = this._options;
        const container = this._containerElement.parents('.' + controlContainer);
        return container.length ? container[0] : null;
    }

    /**
     * @returns {boolean}
     * @private
     */
    get _isControlElementClassic() {
        if (this._inputControlElement) {
            return this._inputControlElement.classList.contains('gov-form-control--classic')
        }
        return false
    }

    /**
     * @return {HTMLElement|null}
     * @private
     */
    get _inputListElement() {
        return this._inputContainerElement.querySelector('ul');
    }

    /**
     * @return {Object}
     * @private
     */
    get _locales() {
        const { locale } = this._options;
        return locales.hasOwnProperty(locale) ? locales[locale] : locales['cs'];
    }
}

window.GovAutocomplete = GovAutocomplete;
export default GovAutocomplete;
