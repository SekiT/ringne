import { shadow } from '@/lib/shadow';

export default {
  hyperhtml: {
    wire: shadow(() => {}),
    bind: shadow(() => {}),
  },
  globals: {
    pi: Math.PI,
    min: Math.min,
    max: Math.max,
    trunc: Math.trunc,
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
