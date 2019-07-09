const typeScriptModuleOverrides = path => ({
  files: [`${path}/**/*.ts`],
  parser: '@typescript-eslint/parser',
  excludedFiles: ['**/dist/**'],
  parserOptions: {
    project: `${path}/tsconfig.json`,
  },
  rules: {
    '@typescript-eslint/camelcase': 'always',
    // Typescript compiler does this instead
    '@typescript-eslint/no-unused-vars': 'off',
    // Deny imports with `require()`
    '@typescript-eslint/no-var-requires': 'error',
    // Allow "{obj} as Thing" syntax in tests
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
  },
  plugins: ['@typescript-eslint'],
})

module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: ['pubsweet'],
  parser: 'babel-eslint',
  rules: {
    'no-control-regex': 0,
    'global-require': 0,
    'class-methods-use-this': [
      'error',
      {
        exceptMethods: [
          'storage',
          'render',
          'componentDidMount',
          'shouldComponentUpdate',
        ],
      },
    ],
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'prettier/prettier': 0,
    'react/prop-types': 0,
    'sort-keys': 0,
  },
  overrides: [
    {
      ...typeScriptModuleOverrides('packages/component-survey'),
    },
  ],
}
