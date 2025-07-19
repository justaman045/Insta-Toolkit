// .eslintrc.js

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021, // or "latest"
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    // React
    'react/react-in-jsx-scope': 'off', // Not needed with Next.js
    'react/jsx-key': 'warn',

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Accessibility
    'jsx-a11y/anchor-is-valid': 'off', // Next.js handles this with <Link>

    // Tailwind + formatting handled by Prettier
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
