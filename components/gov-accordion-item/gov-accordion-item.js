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
        var settings = {
          enableDocumentClick: false,
          applyHiddenAttribute: true,
        };
        const toggleSection = new ToggleSection(button, content, settings);

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
