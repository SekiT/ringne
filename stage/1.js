import { center, boardRadius } from '@/view/canvas';
import { swimOrb, linearOrb } from '@/enemy/orb';
import enemyIds from '@/enemy/ids';
import dependencies from 'dependencies';
import modes from './modes';
import stage2 from './2';

const {
  pi, pi2, max, cos, sin, random,
} = dependencies.globals;

const orbSize = new Map([
  [modes.easy, () => 6 + random() * 2],
  [modes.normal, () => 6 + random() * 3],
  [modes.hard, () => 6 + random() * 4],
]);

const swimOrbFrequency = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 13 - level],
]);

const swimOrbSpeed = new Map([
  [modes.easy, () => -0.008 * random()],
  [modes.normal, () => -0.01 * random()],
  [modes.hard, () => -0.016 * random()],
]);

const addOrNotLinearOrb = new Map([
  [modes.easy, () => false],
  [modes.normal, (level, time) => level > 5 && time % (30 - level * 2) === 0],
  [modes.hard, (level, time) => level > 5 && time % (27 - level * 2) === 0],
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

const vanishByInvinciblePlayer = (playerInvincible, px, py) => (enemy) => {
  const { x, y } = enemy.id === enemyIds.linearOrb ? enemy : {
    x: center + enemy.radius * cos(enemy.angle),
    y: center + enemy.radius * sin(enemy.angle),
  };
  const dx = x - px;
  const dy = y - py;
  const dr = 60 - playerInvincible;
  return dx * dx + dy * dy <= dr * dr ? [] : [enemy];
};

const stage1 = (time = 0) => (mode, level, levelUp, state) => {
  const {
    enemies, evt, px, py, pa, playerInvincible,
  } = state;
  if (levelUp && level === 11) {
    return { enemies: enemies.flatMap(vanishSwimOrb), nextStage: stage2(), evt };
  }
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    time % swimOrbFrequency.get(mode)(level) === 0 ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
    addOrNotLinearOrb.get(mode)(level, time) ? [
      linearOrb(
        center + (2 * random() - 1) * 20,
        center + (2 * random() - 1) * 20,
        random() * pi2,
        linearOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
        'white',
        'blue',
      ),
    ] : [],
  ].flat();
  return { enemies: nextEnemies, nextStage: stage1(time + 1), evt };
};

export default stage1;
