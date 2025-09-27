import multiEntry from '@rollup/plugin-multi-entry';
import resolve from '@rollup/plugin-node-resolve';

import alias from './alias';

export default {
  input: 'test/**/*.mjs',
  plugins: [
    multiEntry(),
    resolve(),
    alias('test'),
  ],
  output: { format: 'cjs' },
  external: ['tape'],
};
