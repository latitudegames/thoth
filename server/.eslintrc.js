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
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-loss-of-precision': 'off',
    'require-await': 'off',
    'comma-spacing': ["off", { "before": false, "after": true }],
    'import/no-namespace': 'off',
    'import/no-default-export': 'off',
    'no-invalid-this': 'off',
    'no-autofix/no-unreachable': 'off',
    'space-in-parens': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'space-before-function-paren': 'off',
    'eol-last': 'off',
    'operator-linebreak': 'off',
    'no-useless-escape': 'off',
    'no-var': 'off',
    'no-console': 'off',
    'no-func-assign': 'off',
    'no-const-assign': 'off',
    'no-class-assign': 'off',
    'no-param-reassign': 'off',
    'object-curly-spacing': ['off', 'always'],
    'array-bracket-spacing': ['off', 'never'],
    'linebreak-style': ['off', 'unix'],
    'no-trailing-spaces': 'off',
    'import/no-duplicates': 'off',
    'import/named': 'off',
    'import/default': 'off',
    'import/order': ['off',
      {
        groups: [
          ['builtin', 'external', 'internal', 'unknown'],
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      }
    ],
    'camelcase': ['off'],

    // enforced functional rules
    'prefer-const': 'off',
    'functional/prefer-type-literal': 'off',
    'functional/no-loop-statement': 'off',
    'functional/no-let': 'off',

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
