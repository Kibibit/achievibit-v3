const { propertyOrdering, selectorOrdering } = require('stylelint-semantic-groups');

module.exports = {
  overrides: [
    {
      files: [ '**/*.scss' ],
      customSyntax: 'postcss-scss'
    }
  ],
  extends: [
    'stylelint-config-standard-scss'
  ],
  plugins: [
    'stylelint-order',
    'stylelint-config-rational-order/plugin',
    'stylelint-use-logical',
    './plugins/stylelint-selector-disallowed-custom.mjs'
  ],
  rules: {
    'order/order': selectorOrdering,
    'order/properties-order': propertyOrdering,
    'color-no-invalid-hex': true,
    'declaration-empty-line-before': [ null, { 'severity': 'warning' } ],
    'string-quotes': 'single',
    'selector-class-pattern': [ null, { 'severity': 'warning' } ],
    'selector-pseudo-element-no-unknown': [true, { 'ignorePseudoElements': ['ng-deep'] } ],
    'color-hex-length': 'long',
    'csstools/use-logical': [
      true,
      {
        'except': [
          'width', // not important for RTL support
          'height', // not important for RTL support
          'min-width', // not important for RTL support
          'min-height', // not important for RTL support
          'max-width', // not important for RTL support
          'max-height', // not important for RTL support
          /**
           * might need to eventually add this as well, since it's used in a lot of places and
           * would not affect RTL support anyway. This goes for both top and bottom.
           **/ 
          // 'top',
          // 'bottom'
        ]
      }
    ],
    "plugin/selector-disallowed-custom": [[
      ["/^&[a-zA-Z0-9-_]/", "Avoid concatenating strings with '&' (e.g., '<%= selector %>'). This reduces readability and clarity. Use explicit selectors instead." ],
      ["/__[a-zA-Z0-9]+(--[a-zA-Z0-9]+)?$/", "\"<%= selector %>\" is not allowed. Simplify your class naming strategy and avoid using BEM naming conventions to prevent bloated class names." ]
    ]],
    "selector-disallowed-list": null
  }
};
