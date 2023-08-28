/*!
 * GovMultiSelect
 * Copyright(c) 2021 Digitalni a informacni agentura
 * Copyright(c) 2021 Zdeněk Vítek
 * EUPL v1.2 Licensed
 *
 * Version 1.0.0
 */

'use strict';

import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import find from 'lodash/find';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';
import isUndefined from 'lodash/isUndefined';
import GovAutocomplete from './GovAutocomplete';
import {removeDiacritics} from '../utils/string';
import classes from '../_extends/lib/classes';
import GovElement from '../_extends/GovElement';
import GovControl from '../_extends/GovControl';
import GovComponent from '../_extends/GovComponent';
import GovFormControl from '../_extends/GovFormControl';

const locales = {
    cs: {
        remove: 'Odebrat',
    },
    en: {
        remove: 'Remove',
    },
}

class GovMultiSelect extends classes(GovElement, GovControl, GovComponent, GovFormControl) {
    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super(el);
        this._defaults = {
            locale:              'cs',
            allowCreate:         true,
            classes:             {
                selectContainer: 'gov-select',
                tagsContainer:   'gov-multiselect__tags',
                tagContainer:    'gov-multiselect__tag',
                buttonContainer: 'gov-button--icon-only',
            },
            autocompleteClasses: {
                resultItem:            'gov-multiselect__option',
                emptyItem:             'gov-multiselect__empty',
                autocompleteContainer: 'gov-multiselect',
                resultContainer:       'gov-multiselect__options',
            }
        }
        this._prepareOptions(options);
        this._prepareDomElement(el);
        this._setLocales(locales);
        this._prepareTempData();
        this._inputAutocompleteElement = null;
        this._autocomplete = null;
        this._optionList = [];
        this._selectedList = [];

        this._init();
    }

    /**
     * @return {void}
     * @private
     */
    _init() {
        this._prepareStructure();
        this._createAutocomplete();
    }

    /**
     * @return {void}
     * @private
     */
    _prepareStructure() {
        // Create input for future autocomplete
        const createInput = () => {
            const input = document.createElement('input');
            input.classList.add('gov-form-control__input');
            if (this._domElement().hasAttribute('aria-required')) {
                input.setAttribute('aria-required', this._domElement().getAttribute('aria-required'));
            }
            if (this._domElement().hasAttribute('aria-disabled')) {
                input.setAttribute('aria-disabled', this._domElement().getAttribute('aria-disabled'));
            }
            if (this._domElement().hasAttribute('required')) {
                input.setAttribute('required', this._domElement().getAttribute('required'));
            }
            if (this._domElement().hasAttribute('disabled')) {
                input.setAttribute('disabled', this._domElement().getAttribute('disabled'));
            }
            input.setAttribute('type', 'text');
            input.setAttribute('id', this._id);

            return input;
        }

        // Create container for display selected options
        const createSelectedContainer = () => {
            const {classes: {tagsContainer}} = this._options;
            const container = document.createElement('ul');
            container.classList.add(tagsContainer);

            return container;
        }

        const label = this._formControlElement().querySelector('label');

        this._inputAutocompleteElement = createInput();
        this._selectOptions.forEach((option) => {
            const item = {id: option.getAttribute('value'), name: option.textContent};
            this._optionList.push(item);
            if (option.selected) this._selectedList.push(item);
        });

        this._govSelectContainerElement.style.display = 'none';
        this._formControlElement().append(createSelectedContainer());
        if (label) {
            label.setAttribute('for', this._id);
            this._formControlElement().prepend(label);
        }
        this._formControlElement().prepend(this._inputAutocompleteElement);
        this._redrawOptionsInSelect();
    }

    /**
     * @param {Object} item
     * @private
     */
    _createTagElement(item) {
        if (item.id === null) item.id = item.name;

        const isTagExists = find(this._selectedList, ({id}) => id === item.id);
        if (false === isUndefined(isTagExists)) {
            return;
        }

        const button = document.createElement('button');
        const {classes: {buttonContainer}} = this._options;
        button.classList.add(buttonContainer);
        button.type = 'button';
        button.setAttribute('aria-label', this._locale().remove);

        button.addEventListener('click', (e) => {
            e.preventDefault();
            const index = findIndex(this._selectedList, (selected) => selected.id === item.id);
            if (index !== -1) this._selectedList.splice(index, 1);
            const tagElement = this._tagsContainerElement.querySelector(`[multiselect-id="${item.id}"]`);
            if (tagElement) tagElement.remove();
            this._redrawOptionsInSelect();
        });

        const {classes: {tagContainer}} = this._options;
        const tag = document.createElement('li'),
            tagInner = document.createElement('span');

        tagInner.textContent = item.name;
        tag.classList.add(tagContainer);
        tag.setAttribute('multiselect-id', item.id);
        tag.append(tagInner);
        tag.append(button);

        this._selectedList.push(item);
        this._tagsContainerElement.append(tag);
        this._redrawOptionsInSelect();
    }

    /**
     * @return {void}
     * @private
     */
    _createAutocomplete() {
        this._autocomplete = new GovAutocomplete(this._inputAutocompleteElement, {
            minChars:    0,
            allowCreate: this._options.allowCreate,
            classes:     this._options.autocompleteClasses,
            onSelect:    (item) => {
                if (item) {
                    this._createTagElement(item);
                    this._autocomplete.clear();
                }
            },
            onSearch:    (val) => {
                return new Promise((resolve) => {
                    const filteredBySelected = filter(this._optionList, (item) => {
                        const isSelected = find(this._selectedList, (selected) => selected.id === item.id);
                        return isUndefined(isSelected) ? true : false;
                    });

                    resolve(filter(filteredBySelected, ({name}) => {
                        if (!name) return false;
                        return removeDiacritics(name).toLowerCase().indexOf(removeDiacritics(val).toLowerCase()) > -1;
                    }));
                });
            }
        });
    }

    /**
     * @return {void}
     * @private
     */
    _redrawOptionsInSelect() {
        map(this._selectedList, (item) => {
            const isOption = this._domElement().querySelector(`option[value="${item.id}"]`);

            const createOption = (item) => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.name;
                this._domElement().append(option);
            }

            if (!isOption) {
                createOption(item);
            }
        });
        this._selectOptions.forEach((option) => {
            const isSelected = find(this._selectedList, (selected) => selected.id === option.getAttribute('value'));
            option.selected = isUndefined(isSelected) ? false : true;
        });
    }

    /**
     *
     * @return {Element|HTMLElement|null}
     * @private
     */
    get _govSelectContainerElement() {
        const {classes: {selectContainer}} = this._options;
        const parents = this._domElement().parents(`.${selectContainer}`);
        if (isArray(parents) && parents.length) {
            return parents[0];
        }
        return null;
    }

    /**
     *
     * @return {Element|HTMLElement}
     * @private
     */
    get _tagsContainerElement() {
        const {classes: {tagsContainer}} = this._options;
        return this._formControlElement().querySelector(`.${tagsContainer}`);
    }

    /**
     * @return {NodeListOf<Element|HTMLElement>}
     * @private
     */
    get _selectOptions() {
        return this._domElement().querySelectorAll('option');
    }
}

window.GovMultiSelect = GovMultiSelect;
export default GovMultiSelect;
