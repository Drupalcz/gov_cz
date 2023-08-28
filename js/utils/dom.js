/**
 * @param {Element|HTMLElement|null} element
 * @return {Element|null}
 */
export const getFirstFocusableElement = (element = null) => {
    element = element || document;
    const elements = element.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    return elements.length ? elements[0] : null;
}

/**
 * The parents() method returns all ancestor elements of the selected element.
 * @param selector
 * @returns {[Element|HTMLElement]}
 */
Element.prototype.parents = function (selector) {
    let elements = [];
    let elem = this;
    let isHaveSelector = selector !== undefined;

    while ((elem = elem.parentElement) !== null) {
        if (elem.nodeType !== Node.ELEMENT_NODE) {
            continue;
        }

        if (!isHaveSelector || elem.matches(selector)) {
            elements.push(elem);
        }
    }

    return elements;
};

/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    Element.prototype.closest = function (s) {
        let el = this;
        let ancestor = this;

        if (!document.documentElement.contains(el)) return null;

        do {
            if (ancestor.matches(s)) return ancestor;

            ancestor = ancestor.parentElement;
        } while (ancestor !== null);

        return null;
    };
}

if (!Element.prototype.wrap) {
    function wrap(el, wrapper) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }

    Element.prototype.wrap = function (wrapper) {
        let elem = this;
        wrap(elem, wrapper)
    }
}

if (!Element.prototype.unwrap) {
    Element.prototype.unwrap = function () {
        this.replaceWith(...this.childNodes);
    }
}

if (!Element.prototype.optionByText) {
    Element.prototype.optionByText = function (text) {
        let elem = this;
        const buffer = [];
        elem.querySelectorAll('option').forEach((option) => {
            if (option.text === text) buffer.push(option);
        });
        return buffer.length ? buffer[0] : null;
    }
}

if (!Element.prototype.insertAfter) {
    Element.prototype.insertAfter = function (newNode) {
        let referenceNode = this;
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}

if (!Element.prototype.boundingDocumentRect) {
    Element.prototype.boundingDocumentRect = function () {
        let clientRect = this.getBoundingClientRect();
        return {
            left: clientRect.left + document.documentElement.scrollLeft,
            top:  clientRect.top + document.documentElement.scrollTop,
        };
    }
}
