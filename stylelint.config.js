module.exports = {
  plugins: ['stylelint-scss'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-rscss/config',
  ],

  rules: {
    // 'at-rule-empty-line-before': ['always', {
    //   ignore: ['after-comment'],
    //   except: [
    //     'inside-block',
    //     'after-same-name',
    //   ],
    // }],
    'at-rule-name-case': null,
    'at-rule-name-space-after': null,
    'at-rule-name-newline-after': null,
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': null,
    'block-no-empty': null,
    /**
     * DESC:
     * rscss custom rules
     */
    'rscss/no-descendant-combinator': false,
    'rscss/class-format': false,
  },
}
