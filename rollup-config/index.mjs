import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import alias from './alias';
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
  input: 'index.js',
  plugins: [...commonPlugins, ...envDependentPlugins],
  context: 'null',
  moduleContext: 'null',
  output: {
    file: 'build/bundle.js',
    format: 'iife',
  },
};
