import stylelint from 'stylelint';
import selectorParser from 'postcss-selector-parser';
import _ from 'lodash';

const ruleName = 'plugin/selector-disallowed-custom';

// Helper to resolve the full selector when `&` is used
const resolveFullSelector = (rule) => {
  let fullSelector = rule.selector;
  let parent = rule.parent;

  // Traverse upwards to resolve `&` in nested selectors
  while (parent && parent.type !== 'root') {
    if (parent.selector) {
      fullSelector = fullSelector.replace(/&/g, parent.selector);
    }
    parent = parent.parent;
  }

  return fullSelector;
};

const pluginRule = (primaryOption) => {
  return (root, result) => {
    primaryOption.forEach(([ pattern, errorMessage ]) => {
      const regexPattern = (typeof pattern === 'string' && pattern.startsWith('/') && pattern.endsWith('/'))
        ? new RegExp(pattern.slice(1, -1))
        : pattern;

      root.walkRules((rule) => {
        const fullSelector = resolveFullSelector(rule);

        selectorParser((selectors) => {
          selectors.walk((selectorNode) => {
            if (selectorNode.type === 'selector') {
              const partialSelector = selectorNode.toString();

              const selectorIndex = rule.raws.selector && rule.raws.selector.raw
                ? rule.toString().indexOf(rule.raws.selector.raw)
                : rule.toString().indexOf(rule.selector);

              // Check full selector (after resolving `&`)
              const isFullSelectorMatch = typeof regexPattern === 'string' && fullSelector === regexPattern;
              const isFullSelectorRegexMatch =
                regexPattern instanceof RegExp &&
                regexPattern.test(fullSelector);
              if (isFullSelectorMatch || isFullSelectorRegexMatch) {
                const template = _.template(errorMessage);
                const message = template({ selector: fullSelector });
                stylelint.utils.report({
                  message: message,
                  node: rule,
                  result: result,
                  ruleName: ruleName,
                  index: selectorIndex,
                  endIndex: selectorIndex + rule.selector.length
                });

                return;
              }

              // Check partial selector (without resolving `&`)
              const isPartialSelectorMatch = typeof regexPattern === 'string' && partialSelector === regexPattern;
              const isPartialSelectorRegexMatch =
                regexPattern instanceof RegExp &&
                regexPattern.test(partialSelector);
              if (isPartialSelectorMatch || isPartialSelectorRegexMatch) {
                const template = _.template(errorMessage || 'Selector "<%= selector %>" is disallowed');
                const message = template({ selector: partialSelector });
                stylelint.utils.report({
                  message: message,
                  node: rule,
                  result: result,
                  ruleName: ruleName,
                  index: selectorIndex,
                  endIndex: selectorIndex + rule.selector.length
                });
              }
            }
          });
        }).processSync(rule.selector);
      });
    });
  };
};

export default stylelint.createPlugin(ruleName, pluginRule);
