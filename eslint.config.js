import globals from "globals";
import js from "@eslint/js";
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import stylistic from '@stylistic/eslint-plugin'
import tseslint from "typescript-eslint";
import { defineConfig } from 'eslint/config';

export default defineConfig([
  tseslint.configs.recommended,
  {
    extends: [ 'json/recommended' ],
    files: [ '**/*.json' ],
    language: 'json/json',
    plugins: { json },
  },
  {
    extends: [ 'markdown/recommended' ],
    files: [ '**/*.md' ],
    language: 'markdown/gfm',
    plugins: { markdown },
  },
  {
    extends: [ 'js/recommended' ],
    files: [ '**/*.{js,jsx,mjs,ts,tsx}' ],
    plugins: { '@stylistic': stylistic, js },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/dot-location': [ 'error', 'property' ],
      '@stylistic/indent': [ 'error', 2 ],
      '@stylistic/max-len': [ 'error', { code: 120, ignoreComments: true } ],
      '@stylistic/no-multiple-empty-lines': [ 'error', { max: 2, maxEOF: 1 } ],
      '@stylistic/quote-props': [ 'error', 'as-needed' ],
      '@stylistic/quotes': [ 'error', 'single', { avoidEscape: true, allowTemplateLiterals: 'avoidEscape' } ],
      // 'no-console': [ 'warn' ],
      'no-unused-vars': [ 'warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' } ],
      'prefer-const': [ 'error' ],
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
          imports: 'always-multiline',
          objects: 'always-multiline',
        },
      ],
    },
  },
]);
