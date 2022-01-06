module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  rules: {
    'comma-dangle': [ 2, 'always-multiline' ],
    'semi': [ 2, 'always' ],
    'no-unused-vars': [ 2, { ignoreRestSiblings: true } ]
  },
};
