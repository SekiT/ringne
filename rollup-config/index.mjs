import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

import alias from './alias.mjs';
import minifyTemplate from './minifyTemplate.mjs';

const commonPlugins = [
  resolve(),
  alias('index'),
];

const envDependentPlugins = process.env.PRODUCTION ? [
  esbuild({ minify: true }),
  minifyTemplate(),
] : [
  serve({ contentBase: 'build', open: true }),
  livereload(),
];

export default {
  input: 'index.mjs',
  plugins: [...commonPlugins, ...envDependentPlugins],
  context: 'null',
  moduleContext: 'null',
  output: {
    file: 'build/bundle.js',
    format: 'iife',
  },
};
