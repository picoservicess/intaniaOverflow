module.exports = {
    files: ['**/*.ts', '**/*.js'], // Apply ESLint to TypeScript and JavaScript files
    root: true, // Ensure this is the root configuration
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
      ecmaFeatures: {
        jsx: true, // Enable JSX since we might be using React with TypeScript
      },
      project: './tsconfig.json', // Required for TypeScript linting rules
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the react version
      },
    },
    env: {
      browser: true, // Enables browser global variables like 'window'
      node: true, // Enables Node.js global variables like 'process'
      es2021: true, // Supports ES2021 features
    },
    extends: [
      'airbnb-typescript/base', // Airbnb's base config for TypeScript (no React)
      'plugin:@typescript-eslint/recommended', // Recommended rules from the @typescript-eslint/eslint-plugin
      'plugin:prettier/recommended', // Integrates Prettier with ESLint
    ],
    plugins: ['@typescript-eslint', 'prettier'], // Using Prettier with ESLint
    rules: {
      // Airbnb's recommended rules with some overrides
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Allow unused variables with underscore
      'no-console': 'warn', // Console statements are warnings
      'no-use-before-define': 'off', // TypeScript handles this properly
      '@typescript-eslint/no-use-before-define': ['error'], // Use TS version of the rule
      'class-methods-use-this': 'off', // Allow class methods to not use 'this'
      'import/prefer-default-export': 'off', // Allow single named exports
      'prettier/prettier': 'error', // Prettier integration for ESLint
  
      // Optional overrides depending on your project needs
      'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/*.spec.ts'] }], // Allow devDependencies in test files
      'no-shadow': 'off', // Disable because TypeScript's own checking is better
      '@typescript-eslint/no-shadow': ['error'], // Enable TypeScript version of no-shadow
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'], // Apply these rules only for TypeScript files
        rules: {
          '@typescript-eslint/explicit-module-boundary-types': 'off', // Turn off need for explicit return types
        },
      },
    ],
  };
  