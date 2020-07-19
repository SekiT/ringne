import { shadow } from '@/lib/shadow';

export default {
  hyperhtml: {
    wire: shadow(() => {}),
    bind: shadow(() => {}),
  },
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
    random: shadow(Math.random),
    now: shadow(Date.now),
    setTimeout: shadow(setTimeout),
    window: shadow({
      innerWidth: 0,
      innerHeight: 0,
      addEventListener: () => {},
    }),
    document: {
      createElement: shadow(() => {}),
    },
  },
};
