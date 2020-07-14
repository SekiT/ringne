import { center, boardRadius } from '@/view/canvas';
import enemyIds from '@/enemy/ids';
import { swimOrb, linearOrb } from '@/enemy/orb';
import gravity from '@/event/gravity';
import none from '@/event/none';
import dependencies from 'dependencies';
import eventIds from '../event/ids';
import modes from './modes';

const {
  pi, pi2, min, max, cos, sin, random,
} = dependencies.globals;

const swimOrbFrequency = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 15 - level],
]);

const swimOrbSpeed = new Map([
  [modes.easy, () => -0.008 * random()],
  [modes.normal, () => -0.01 * random()],
  [modes.hard, () => -0.018 * random()],
]);

const orbSize = new Map([
  [modes.easy, () => 6 + random() * 2],
  [modes.normal, () => 6 + random() * 3],
  [modes.hard, () => 6 + random() * 4],
]);

const createEvent = new Map([
  [modes.easy, (level) => gravity(0.5 + level * 0.05, 200)],
  [modes.normal, (level) => gravity(0.5 + level * 0.08, 200)],
  [modes.hard, (level) => gravity(0.5 + level * 0.12, 200)],
]);

const eventReload = new Map([
  [modes.easy, 300],
  [modes.normal, 300],
  [modes.hard, 0],
]);

const vanishByInvinciblePlayer = (playerInvincible, px, py) => (enemy) => {
  const dr = 60 - playerInvincible;
  const { dx, dy } = enemy.id === enemyIds.swimOrb ? {
    dx: center + enemy.radius * cos(enemy.angle) - px,
    dy: center + enemy.radius * sin(enemy.angle) - py,
  } : {
    dx: enemy.x - px,
    dy: enemy.y - py,
  };
  return dx * dx + dy * dy <= dr * dr ? [] : [enemy];
};

const stage4 = (time = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    time % swimOrbFrequency.get(mode)(level - 30) === 0 ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        boardRadius * min(0.7 + random() * 0.4, 1),
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
    mode !== modes.easy && level >= 36 && time % (560 - level * 10) === 0 ? [...new Array(10)].map(
      (_, i) => linearOrb(center, center, (i / 10) * pi2 + time, 2, 7, 'white', 'blue'),
    ) : [],
  ].flat();
  const { id, eventTime, duration } = evt;
  let nextEvt;
  let nextTime;
  if (id === eventIds.none) {
    if (time === 30) {
      nextEvt = createEvent.get(mode)(level - 30);
      nextTime = time + 1;
    } else {
      nextEvt = evt;
      nextTime = time + 1;
    }
  } else if (eventTime < duration) {
    nextEvt = evt;
    nextTime = time + 1;
  } else {
    nextEvt = none();
    nextTime = -eventReload.get(mode);
  }
  if (levelUp && level === 41) {
    return {
      enemies: nextEnemies.map((enemy) => ({ ...enemy, time: max(enemy.time, 270) })),
      nextStage: stage4(),
      evt: none(),
    };
  }
  return { enemies: nextEnemies, nextStage: stage4(nextTime), evt: nextEvt };
};

export default stage4;
