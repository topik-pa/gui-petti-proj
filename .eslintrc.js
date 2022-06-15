module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    indent: [
      'error',
      2
    ],
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'never'
    ],
    eqeqeq: ['error', 'always'],
    'comma-dangle': ['error', 'never']
  }
}
