import { center, boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import rotate from '@/event/rotate';
import none from '@/event/none';
import dependencies from 'dependencies';
import eventIds from '../event/ids';
import modes from './modes';
import stage3 from './3';

const {
  pi, pi2, max, cos, sin, random,
} = dependencies.globals;

const swimOrbFrequency = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 13 - level],
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

const rotateSpeed = new Map([
  [modes.easy, () => 0.02],
  [modes.normal, () => 0.02],
  [modes.hard, () => 0.05],
]);

const rotateCount = new Map([
  [modes.easy, (level) => (level > 5 ? 2 : 1)],
  [modes.normal, (level) => (level > 5 ? 3 : 2)],
  [modes.hard, (level) => (level > 5 ? 4 : 2)],
]);

const eventReload = new Map([
  [modes.easy, 600],
  [modes.normal, 300],
  [modes.hard, 0],
]);

const vanishByInvinciblePlayer = (playerInvincible, px, py) => (enemy) => {
  const dx = center + enemy.radius * cos(enemy.angle) - px;
  const dy = center + enemy.radius * sin(enemy.angle) - py;
  const dr = 60 - playerInvincible;
  return dx * dx + dy * dy <= dr * dr ? [] : [enemy];
};

const stage2 = (time = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    time % swimOrbFrequency.get(mode)(level - 10) === 0 ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
  ].flat();
  const { id, eventTime, duration } = evt;
  let nextEvt;
  let nextTime;
  if (id === eventIds.none) {
    if (time === 30) {
      const speed = rotateSpeed.get(mode)(level);
      const count = rotateCount.get(mode)(level - 11);
      nextEvt = rotate((random() < 0.5 ? -1 : 1) * speed, (pi2 / speed) * count);
      nextTime = time + 1;
    } else {
      nextEvt = evt;
      nextTime = time + 1;
    }
  } else if (id === eventIds.rotate && eventTime < duration) {
    nextEvt = evt;
    nextTime = time + 1;
  } else {
    nextEvt = none();
    nextTime = -eventReload.get(mode);
  }
  if (levelUp && level === 21) {
    return {
      enemies: nextEnemies.map((enemy) => ({ ...enemy, time: max(enemy.time, 270) })),
      nextStage: stage3(),
      evt: none(),
    };
  }
  return { enemies: nextEnemies, nextStage: stage2(nextTime), evt: nextEvt };
};

export default stage2;
