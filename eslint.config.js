import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config({
    // Only extending Prettier config to avoid conflicts
    extends: [eslintConfigPrettier],
    languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parser: tseslint.parser,
        parserOptions: {
            project: false, // Set to false since we're not using type-aware rules
        },
    },
    plugins: {
        '@typescript-eslint': tseslint.plugin,
        prettier: prettierPlugin,
    },
    rules: {
        // Minimal set of helpful rules set to warn
        'no-console': 'warn',
        eqeqeq: 'warn',
        curly: 'warn',
        'prefer-const': 'warn',
        'no-var': 'warn',
        'no-return-await': 'warn',
        'require-await': 'warn',
    },
    ignores: [
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        '*.config.js',
        '*.config.ts',
        '*.config.mjs',
        '.github/',
    ],
});
