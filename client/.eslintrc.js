module.exports = {
  extends: ['../.eslintrc.js', 'react-app'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'react-hooks/exhaustive-deps': 0,
  },
}
