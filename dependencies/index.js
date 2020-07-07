import { render, html } from 'uhtml';

export default {
  uhtml: { render, html },
  globals: {
    pi: Math.PI,
    cos: Math.cos,
    sin: Math.sin,
    random: Math.random,
    now: Date.now,
    window,
    setTimeout,
    createElement: document.createElement,
    DocumentFragment,
  },
};
