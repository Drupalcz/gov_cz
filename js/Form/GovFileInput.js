/*!
 * GovFileInput
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

class GovFileInput extends GovElement {
    /**
     * @param {Element} el
     * @param {Object} options
     */
    constructor(el, options = {}) {
        super(el);

        this._defaults = {
            attachmentsSelector: '.gov-fileinput__attachments',
            inputSelector:       '.gov-fileinput__upload-input'
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
        this._inputElement.addEventListener('change', () => {
            this._resetFileList();
            this._updateFileList(this._inputElement.files);
        });
    }

    /**
     * @param {FileList} filelist
     * @return {void}
     * @private
     */
    _updateFileList(filelist) {
        if (filelist.length) {
            for (var i = 0; i < filelist.length; i++) {
                let node = document.createElement("span"),
                    nodeWrap = document.createElement("li"),
                    txtNode = document.createTextNode(filelist[i].name);

                node.appendChild(txtNode);
                nodeWrap.appendChild(node);
                this._attachmentsElement.appendChild(nodeWrap);
            }

            this._bindFileListItems();
            addClass(this._attachmentsElement, 'is-active');
        }
    }

    /**
     * @return {void}
     * @private
     */
    _resetFileList() {
        let items = this._attachmentsElement.querySelectorAll('li');

        items.forEach((item, idx) => {
            if (idx > 0) item.parentNode.removeChild(item);
        });

        removeClass(this._attachmentsElement, 'is-active');
    }

    /**
     * @return {void}
     * @private
     */
    _bindFileListItems() {
        let items = this._attachmentsElement.querySelectorAll('li span');

        items.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this._removeFileFromList(item);
            });
        });
    }

    /**
     * @param {Element} element
     * @return {void}
     * @private
     */
    _removeFileFromList(element) {
        let text = element.innerHTML,
            tmpFileList = new DataTransfer();

        for (let i = 0; i < this._inputElement.files.length; i++) {
            if (this._inputElement.files[i].name !== text) {
                tmpFileList.items.add(this._inputElement.files[i]);
            }
        }

        this._inputElement.files = tmpFileList.files;

        this._resetFileList();
        this._updateFileList(this._inputElement.files);
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _attachmentsElement() {
        const {attachmentsSelector} = this._options;
        return this._containerElement.querySelector(attachmentsSelector);
    }

    /**
     * @return {Element|null}
     * @private
     */
    get _inputElement() {
        const {inputSelector} = this._options;
        return this._containerElement.querySelector(inputSelector);
    }
}

window.GovFileInput = GovFileInput;
export default GovFileInput;
