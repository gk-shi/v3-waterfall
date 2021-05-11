module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    // parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true
    }
  },
  rules: {
    'no-multi-spaces': 'off',
    'vue/no-setup-props-destructure': 'warn',
    'import/no-absolute-path': 'off',
    'no-multiple-empty-lines': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
