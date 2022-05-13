module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    indentation: 2,
    'declaration-block-trailing-semicolon': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['deep']
      }
    ],
    'number-leading-zero': 'never',
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'selector-type-no-unknown': null,
    'at-rule-no-unknown': null,
    'no-duplicate-selectors': null,
    'no-empty-source': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'deep'] }],
    'rule-empty-line-before': 'never'
  }
}
