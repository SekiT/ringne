import { wire, bind } from 'hyperhtml';

export default {
  hyperhtml: { wire, bind },
  globals: {
    pi: Math.PI,
    pi2: Math.PI * 2,
    min: Math.min,
    max: Math.max,
    abs: Math.abs,
    trunc: Math.trunc,
    round: Math.round,
    cos: Math.cos,
    sin: Math.sin,
    random: Math.random,
    now: Date.now,
    window,
    setTimeout,
    document,
  },
};
