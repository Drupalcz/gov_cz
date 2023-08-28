import './utils/dom';

import {initAccordions} from './Accordion/default';
import {initTooltips} from './Tooltip/default';
import {initTabs} from './Tabs/default';
import {initScrollUpControler} from './Control/default';
import {initGovSliderBars} from './Slider/default';
import {initHamburgerNavs, initGovSideNav} from './Nav/default';
import {initPortalHamburgerNavs, destroyPortalHamburgerNavs} from './PortalHamburgerNav/default';
import {
    initFormTexts,
    initFileInputs,
    initSelects,
    initMultipleSelect
} from './Form/default';
import {initModals} from './Modal/default';
import {initCalendar} from './Calendar/default';
import {initSortableTable} from './Table/default';
import './Form/GovAutocomplete';
import {govLinkAriaLabel} from './Control/link';

/**
 * @return {void}
 */
function initGovComponents() {
    initScrollUpControler();
    initHamburgerNavs();
}

/**
 * @return {void}
 */
function reinitGovComponents() {
    initModals();
    initSortableTable();
    initFileInputs();
    initSelects();
    initMultipleSelect();
    initFormTexts();
    initTabs();
    initAccordions();
    initTooltips()
    initGovSliderBars();
    initCalendar();
    initGovSideNav();
    govLinkAriaLabel()
}

window.reinitGovComponents = reinitGovComponents;
window.initGovComponents = initGovComponents;

initGovComponents();
reinitGovComponents();

let hamburgerNavInited = false;

function onWindowResize() {
    if (window.innerWidth < 672 && !hamburgerNavInited) {
        initPortalHamburgerNavs();
        hamburgerNavInited = true;
    }

    if (window.innerWidth > 671 && hamburgerNavInited) {
        destroyPortalHamburgerNavs();
        hamburgerNavInited = false;
    }
}

onWindowResize();
window.addEventListener('resize', onWindowResize);
