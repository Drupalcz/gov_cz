/**
 * Accordion item on DS 4.6 native <details>/<summary> markup.
 *
 * The DS styles the arrow rotation via summary[aria-expanded]; this behavior
 * keeps the attribute in sync with the native open state and blocks
 * interaction on disabled items.
 */
((Drupal, once) => {
  'use strict';

  Drupal.behaviors.govczAccordionItem = {
    attach(context) {
      once('gov-accordion-item', '.gov-accordion-item > details', context).forEach((details) => {
        const summary = details.querySelector('summary');
        if (details.closest('.gov-accordion-item').hasAttribute('disabled')) {
          summary.addEventListener('click', (event) => event.preventDefault());
          return;
        }
        details.addEventListener('toggle', () => {
          summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
        });
      });
    },
  };
})(Drupal, once);
