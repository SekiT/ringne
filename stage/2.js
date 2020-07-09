import { boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import enemyIds from '@/enemy/ids';
import dependencies from 'dependencies';
import modes from './modes';

const { pi, max, random } = dependencies.globals;
const pi2 = pi * 2;

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

const vanishSwimOrb = (enemy) => (
  enemy.id === enemyIds.swimOrb
    ? [{ ...enemy, time: max(enemy.time, 270) }]
    : []
);

export default (mode, level, levelUp, state) => {
  const enemies = [
    level === 11 && levelUp
      ? state.enemies.flatMap(vanishSwimOrb)
      : state.enemies,
    random() >= 0.07 ? [] : [
      swimOrb(
        random() * pi2,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ],
  ].flat();
  return { ...state, enemies };
};
