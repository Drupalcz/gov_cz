import '../../js/utils/dom';

import {initAccordions} from "../../js/Accordion/default";

((Drupal) => {
  Drupal.behaviors.accordion = {
    attach(context) {
      initAccordions()
    }
  }
})(Drupal);
