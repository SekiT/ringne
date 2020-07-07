import { render, html } from 'uhtml';

export default {
  uhtml: { render, html },
  globals: {
    now: Date.now,
    window,
    createElement: document.createElement,
    setTimeout,
    random: Math.random,
    DocumentFragment,
  },
};
