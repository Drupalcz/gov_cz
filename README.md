# Starter implementation of Design System gov.cz

## For developers

* We are using single directory components (SDC)
* In your Drupal template of your theme you can use SDC in following manner.
```
{% include "gov_cz:[component-name]" with {
  component_variable_1: drupal_variable_1,
  component_variable_2: drupal_variable_2,
} %}
```
The npm scripts are only needed while developing the gov_cz theme directly.
For normal use, all the necesary files are already prepared.
