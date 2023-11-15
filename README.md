# Implementation of [Design system gov.cz](https://designsystem.gov.cz)

This module brings the styles and components made in DesignSystem v 4 into Drupal 10.

## For developers

* We are using single directory components (SDC)
* In your Drupal template of your theme you can use SDC in following manner.
```
{% include "gov_cz:[component-name]" with {
  component_variable_1: drupal_variable_1,
  component_variable_2: drupal_variable_2,
} %}
```
The npm scripts is only needed while developing the gov_cz module directly.
For normal use, all the necesary files are already included.
