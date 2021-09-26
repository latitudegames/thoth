module.exports = {
  extends: '../.eslintrc.js',
  ignorePatterns: ['dist/**/*'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
}
