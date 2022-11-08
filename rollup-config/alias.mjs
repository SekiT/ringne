import path from 'path';
import alias from '@rollup/plugin-alias';

const cwd = process.cwd();

export default (dependenciesFileName) => alias({
  entries: {
    '@': cwd,
    dependencies: path.join(cwd, 'dependencies', dependenciesFileName),
  },
});
