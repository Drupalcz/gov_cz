import GovFormText from './GovFormText';
import GovFileInput from './GovFileInput';
import GovSelect from './GovSelect';
import GovMultiSelect from './GovMultiSelect';

/**
 * @return {void}
 */
export function initFormTexts() {
    const inputs = document.querySelectorAll('.gov-js-input');
    inputs.forEach((input) => new GovFormText(input));
}

/**
 * @return {void}
 */
export function initFileInputs() {
    const fileInputs = document.querySelectorAll('.gov-js-fileinput');
    fileInputs.forEach((fileinput) => new GovFileInput(fileinput));
}

/**
 * @return {void}
 */
export function initSelects() {
    const selects = document.querySelectorAll('.gov-js-select select:not([multiple])');
    selects.forEach((select) => new GovSelect(select));
}

/**
 * @return {void}
 */
export function initMultipleSelect() {
    const multipleSelectContainers = document.querySelectorAll('.gov-js-select select[multiple]');
    multipleSelectContainers.forEach((select) => new GovMultiSelect(select));
}
