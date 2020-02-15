module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': [ 2, 'always-multiline' ],
    'semi': [ 2, 'always' ],
    'curly': [ 2, 'multi-line' ],
    'space-before-function-paren': [ 2, 'always' ],
    'space-infix-ops': 0,
    'sort-vars': 2,
    'dot-notation': 0,
    'no-return-assign': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/no-v-html': 0,
    'vue/order-in-components': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
