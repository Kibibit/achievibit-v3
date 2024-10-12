const LINEBREAK_REGEX = /\r\n|[\r\n\u2028\u2029]/;

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce attribute formatting based on the number of attributes',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'whitespace',
    schema: []
  },
  create(context) {
    return {
      Element(node) {
        const sourceCode = context.getSourceCode();
        const openingTag = sourceCode.getText(node);
        const attributes = node.inputs.concat(node.outputs, node.attributes);

        if (attributes.length === 0) {
          // No attributes to check
          return;
        }

        const startLine = node.loc.start.line;
        const endLine = node.loc.end.line;
        const totalAttributes = attributes.length;

        if (totalAttributes <= 2) {
          // All attributes should be on the same line as the opening tag
          const hasLineBreaks = LINEBREAK_REGEX.test(openingTag);
          if (hasLineBreaks) {
            context.report({
              node,
              message:
                'Elements with 2 or fewer attributes should have all attributes on the same line.',
              fix(fixer) {
                // Remove line breaks between attributes
                const fixedOpeningTag = openingTag.replace(LINEBREAK_REGEX, ' ');
                return fixer.replaceText(node, fixedOpeningTag);
              }
            });
          }
        } else {
          // Each attribute should be on its own line
          attributes.forEach((attr) => {
            const attrStartLine = attr.loc.start.line;
            if (attrStartLine === startLine) {
              context.report({
                node: attr,
                message:
                  'Each attribute should be on its own line when there are more than 2 attributes.',
                fix(fixer) {
                  return fixer.insertTextBefore(attr, '\n');
                }
              });
            }
          });
        }
      }
    };
  }
};
