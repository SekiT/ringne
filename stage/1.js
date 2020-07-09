import { center, boardRadius } from '@/view/canvas';
import { swimOrb, linearOrb } from '@/enemy/orb';
import dependencies from 'dependencies';
import modes from './modes';

const { pi2, random } = dependencies.globals;

const swimOrbSpeed = new Map([
  [modes.easy, () => -0.008 * random()],
  [modes.normal, () => -0.01 * random()],
  [modes.hard, () => -0.02 * random()],
]);

const orbSize = new Map([
  [modes.easy, () => 6 + random() * 2],
  [modes.normal, () => 6 + random() * 3],
  [modes.hard, () => 6 + random() * 4],
]);

const linearOrbSpeed = new Map([
  [modes.easy, () => 0.5 + random() * 0.5],
  [modes.normal, () => 0.7 + random() * 0.6],
  [modes.hard, () => 1 + random()],
]);

export default (mode, level, _, state) => {
  const enemies = [
    state.enemies,
    random() >= 0.03 + level * 0.02 ? [] : [
      swimOrb(
        random() * pi2,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ],
    random() >= -0.1 + level * 0.02 ? [] : [
      linearOrb(
        center + (2 * random() - 1) * boardRadius,
        center + (2 * random() - 1) * boardRadius,
        random() * pi2,
        linearOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
        'white',
        'blue',
      ),
    ],
  ].flat();
  return { ...state, enemies };
};
