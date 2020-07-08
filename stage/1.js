import { center, boardRadius } from '@/view/canvas';
import { swimOrb, linearOrb } from '@/enemy/orb';
import dependencies from 'dependencies';

const { pi, random } = dependencies.globals;
const pi2 = pi * 2;

export default (state) => {
  const enemies = [
    state.enemies,
    random() < 0.1
      ? [swimOrb(random() * pi2, random() * boardRadius, random() * 0.02, 6 + random() * 4)]
      : [],
    random() < 0.1
      ? [
        linearOrb(
          center + (2 * random() - 1) * boardRadius,
          center + (2 * random() - 1) * boardRadius,
          random() * pi2,
          1 + random(),
          6 + random() * 4,
          'white',
          'blue',
        ),
      ]
      : [],
  ].flat();
  return { ...state, enemies };
};
