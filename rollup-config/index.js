import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import alias from './alias';
import unbreak from './unbreakTemplate';

const commonPlugins = [
  resolve(),
  alias('index'),
];

const envDependentPlugins = process.env.PRODUCTION ? [
  terser(),
  unbreak(),
] : [
  serve({ contentBase: 'build', open: true }),
  livereload(),
];

export default {
  input: 'index.js',
  plugins: [...commonPlugins, ...envDependentPlugins],
  context: 'null',
  moduleContext: 'null',
  output: {
    file: 'build/bundle.js',
    format: 'iife',
  },
};