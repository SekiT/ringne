import { boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
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

const two = (time = 0) => (mode, level, levelUp, state) => {
  const enemies = [
    state.enemies,
    random() >= 0.07 ? [] : [
      swimOrb(
        random() * pi2,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ],
  ].flat();
  return { enemies, nextStage: two(time + 1) };
};

export default two;
