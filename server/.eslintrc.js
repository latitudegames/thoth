module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:functional/external-recommended",
    "plugin:functional/recommended",
  ],
  plugins: [
    'import',
    '@typescript-eslint',
    'functional',
    'no-autofix'
  ],
  parserOptions: {
    "project": "./tsconfig.json",
    ecmaVersion: 2018,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false
  },
  ignorePatterns: ['.eslintrc.js'],
  "extends": [
  ],
  rules: {
    '@typescript-eslint/no-floating-promises': 'error',
    'require-await': 'error',
    'comma-spacing': ["error", { "before": false, "after": true }],
    'import/no-namespace': 'error',
    'import/no-default-export': 'error',
    'no-invalid-this': 'error',
    'no-autofix/no-unreachable': 'error',
    'space-in-parens': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'space-before-function-paren': 'off',
    'eol-last': 'off',
    'operator-linebreak': 'off',
    'no-useless-escape': 'off',
    'no-var': 'error',
    'no-console': 'error',
    'no-func-assign': 'error',
    'no-const-assign': 'error',
    'no-class-assign': 'error',
    'no-param-reassign': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'no-trailing-spaces': 'error',
    'import/no-duplicates': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/order': ['error',
      {
        groups: [
          ['builtin', 'external', 'internal', 'unknown'],
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      }
    ],
    'camelcase': ['error', { properties: 'never' }],

    // enforced functional rules
    'prefer-const': 'error',
    'functional/prefer-type-literal': 'error',
    'functional/no-loop-statement': 'error',
    'functional/no-let': 'error',

    // not enforced functional rules
    'functional/immutable-data': 'off',
    'functional/no-try-statement': 'off',
    'functional/no-throw-statement': 'off',
    'functional/no-expression-statement': 'off',
    'functional/prefer-readonly-type': 'off',
    'functional/functional-parameters': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'functional/no-conditional-statement': 'off',
    'functional/no-mixed-type': 'off',
  },
}
