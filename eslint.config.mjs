import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { configs, plugins, rules } from 'eslint-config-airbnb-extended';
import globals from 'globals';

const gitignorePath = path.resolve('.', '.gitignore');

const jsConfig = [
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  plugins.stylistic,
  {
    ...plugins.importX,
    settings: {
      'import-x/resolver': {
        alias: [
          ['@', './'],
          ['dependencies', './dependencies'],
        ],
      },
    },
  },
  ...configs.base.recommended,
  rules.base.importsStrict,
];

const nodeConfig = [
  plugins.node,
  ...configs.node.recommended,
];

export default [
  includeIgnoreFile(gitignorePath),
  ...jsConfig,
  ...nodeConfig,
  {
    // Allow devDependencies in rollup-config and test directories
    name: 'project/dev-files',
    files: ['rollup-config/**/*', 'test/**/*'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        optionalDependencies: false,
      }],
    },
  },
  {
    name: 'project/settings',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // We should allow hyperHTML.bind at index.js
      'no-unused-expressions': ['error', { allowTaggedTemplates: true }],

      // Defining constructor function requires { Name: function() { ... } }
      'object-shorthand': ['error', 'properties'],
      'func-names': ['error', 'as-needed'],

      // Allow missing extensions including for alias imports
      'import-x/extensions': ['error', 'ignorePackages', {
        mjs: 'never',
        '': 'never', // Allow extensionless imports (for aliases)
      }],

      // Disable no-unresolved for alias patterns until resolver is properly configured
      'import-x/no-unresolved': ['error', {
        ignore: ['^@/', '^dependencies$'],
      }],

      // Allow anonymous default exports
      'import-x/no-anonymous-default-export': 'off',
    },
  },
];
