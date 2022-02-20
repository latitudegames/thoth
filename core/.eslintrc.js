module.exports = {
  extends: '../.eslintrc.js',
  ignorePatterns: ['dist/**/*', "webpack.*.js", "*.css", "*.css.d.test", "*.d.ts"],
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  }
}
