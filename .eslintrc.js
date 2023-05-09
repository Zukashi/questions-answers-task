module.exports = {
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json', // path to your tsconfig.json file
    tsconfigRootDir: '.', // optional: specify the directory containing the tsconfig.json file
    ecmaVersion: 2021, // specify the version of ECMAScript syntax you want to use
    sourceType: 'module', // enable support for ECMAScript modules
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports':"off"
  }
}
