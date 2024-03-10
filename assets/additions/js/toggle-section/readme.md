# Toggle Section

These classes should work for multiple use cases where toggling section is necesary.
E.g. For toggling an accordion item or when using the button to expand mobile menu.

`const toggleSection = new ToggleSection(button, content, false);`
The false in here is setting `enableDocumentClick` – clicking outside the item will colapse the content.

Full example:

```
(function (Drupal, once) {
  Drupal.behaviors.govczAccordionItem = {
    attach: function (context, settings) {
      const accordionItems = once('js-accordions', '.gov-accordion-item', context);
      if (!accordionItems.length > 0) {
        return;
      }
      accordionItems.forEach(item => {
        const button = item.querySelector('.gov-accordion-item__header');
        const content = item.querySelector('.gov-accordion-item__content');
        const toggleSection = new ToggleSection(button, content, false);

        // Check if the accordion item should be expanded by default
        if (item.getAttribute('is-expanded') === 'true') {
          toggleSection.expand();
        } else {
          toggleSection.collapse();
        }
      });

    }
  };
})(Drupal, once);
```
