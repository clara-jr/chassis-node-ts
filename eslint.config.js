import globals from 'globals';
import js from '@eslint/js';
import jsonformat from 'eslint-plugin-json-format';
import tseslint from 'typescript-eslint';
import tsparser from '@typescript-eslint/parser';


export default [
  {
    // global ignores
    // folders can only be ignored at the global level, per-cfg you must do: '**/dist/**/*'
    ignores: ['**/coverage/', 'package-lock.json', 'tsconfig.json', '*.md'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended, // Recommended config applied to all files
  // Override the recommended config
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.mocha, ...globals.es2021 },
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
    },
    plugins: {
      'json-format': jsonformat,
    },
    rules: {
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'always'
      ],
      'object-curly-spacing': [
        'error',
        'always'
      ],
      'space-in-parens': [
        'error',
        'never'
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ]
    }
  },
];