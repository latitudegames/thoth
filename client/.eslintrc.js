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
  "ignorePatterns": ["webpack.*.js", "*.css", "*.css.d.test", "*.d.ts"],

  rules: {
    'react-hooks/exhaustive-deps': 0,
    '@typescript-eslint/no-var-requires': 'off',
    'import/named': 'off',
    'camelcase': 'off',
    'no-restricted-globals': 'off',
  },
}
