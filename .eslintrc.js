module.exports = {
  extends: 'eslint-config-airbnb-base',
  env: {
    browser: true,
  },
  settings: {
    // Resolve aliased imports
    'import/resolver': {
      alias: [
        ['@', './'],
        ['dependencies', './dependencies'],
      ],
    },
  },
  rules: {
    // We use bitwise operators in this project
    'no-bitwise': ['error', { allow: ['&', '|', '>>', '<<'] }],

    // Defining constructor function requires { Name: function() { ... }}
    'object-shorthand': ['error', 'properties'],
    'func-names': ['error', 'as-needed'],

    // We use devDependencies in rollup-config, which is not included in eslint-config-airbnb-base
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['test/**', 'rollup-config/**'],
      optionalDependencies: false,
    }],
  },
};
