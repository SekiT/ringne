import { wire, bind } from 'hyperhtml';

export default {
  hyperhtml: { wire, bind },
  globals: {
    infinity: Number.POSITIVE_INFINITY,
    pi: Math.PI,
    pi2: Math.PI * 2,
    min: Math.min,
    max: Math.max,
    abs: Math.abs,
    trunc: Math.trunc,
    round: Math.round,
    sqrt: Math.sqrt,
    cos: Math.cos,
    sin: Math.sin,
    atan2: Math.atan2,
    random: Math.random,
    now: Date.now,
    window,
    requestAnimationFrame,
    document,
  },
};
