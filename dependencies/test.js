import { shadow } from '@/lib/shadow';

export default {
  hyperhtml: {
    wire: shadow(() => {}),
    bind: shadow(() => {}),
  },
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
