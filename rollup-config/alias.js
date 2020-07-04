import alias from '@rollup/plugin-alias';

const path = require('path');

const cwd = process.cwd();

export default (dependenciesFileName) => alias({
  entries: {
    '@': cwd,
    dependencies: path.join(cwd, 'dependencies', dependenciesFileName),
  },
});
