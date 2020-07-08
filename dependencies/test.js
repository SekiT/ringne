import { shadow } from '@/lib/shadow';

export default {
  uhtml: {
    render: shadow(() => {}),
    html: shadow(() => {}),
  },
  globals: {
    pi: Math.PI,
    min: Math.min,
    max: Math.max,
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
    DocumentFragment: shadow({ C: function () {} }.C),
  },
};
