import { center, boardRadius } from '@/view/canvas';
import { swimOrb, linearOrb } from '@/enemy/orb';
import enemyIds from '@/enemy/ids';
import dependencies from 'dependencies';
import modes from './modes';
import two from './2';

const { pi2, max, random } = dependencies.globals;

const swimOrbProbabilty = new Map([
  [modes.easy, (level) => 0.03 + level * 0.01],
  [modes.normal, (level) => 0.03 + level * 0.015],
  [modes.hard, (level) => 0.04 + level * 0.02],
]);

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

const linearOrbProbability = new Map([
  [modes.easy, (level) => -0.05 + level * 0.01],
  [modes.normal, (level) => -0.075 + level * 0.015],
  [modes.hard, (level) => -0.1 + level * 0.02],
]);

const linearOrbSpeed = new Map([
  [modes.easy, () => 0.5 + random() * 0.5],
  [modes.normal, () => 0.7 + random() * 0.6],
  [modes.hard, () => 1 + random()],
]);

const vanishSwimOrb = (enemy) => (
  enemy.id === enemyIds.swimOrb
    ? [{ ...enemy, time: max(enemy.time, 270) }]
    : []
);

const one = (time = 0) => (mode, level, levelUp, state) => {
  if (levelUp && level === 11) {
    return { enemies: state.enemies.flatMap(vanishSwimOrb), nextStage: two() };
  }
  const enemies = [
    state.enemies,
    random() >= swimOrbProbabilty.get(mode)(level) ? [] : [
      swimOrb(
        random() * pi2,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ],
    random() >= linearOrbProbability.get(mode)(level) ? [] : [
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
  return { enemies, nextStage: one(time + 1) };
};

export default one;
