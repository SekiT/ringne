import { render, html } from 'uhtml';

export default {
  uhtml: { render, html },
  globals: {
    pi: Math.PI,
    min: Math.min,
    max: Math.max,
    trunc: Math.trunc,
    cos: Math.cos,
    sin: Math.sin,
    random: Math.random,
    now: Date.now,
    window,
    setTimeout,
    document,
    DocumentFragment,
  },
};
