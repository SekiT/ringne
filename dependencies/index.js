import { render, html } from 'uhtml';

export default {
  uhtml: { render, html },
  globals: {
    now: Date.now,
    window,
    setTimeout,
    random: Math.random,
    DocumentFragment,
  },
};
