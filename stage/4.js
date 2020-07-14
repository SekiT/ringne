import { center, boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import gravity from '@/event/gravity';
import none from '@/event/none';
import dependencies from 'dependencies';
import eventIds from '../event/ids';
import modes from './modes';

const {
  pi, max, cos, sin, random,
} = dependencies.globals;

const swimOrbFrequency = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 15 - level],
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

const createEvent = new Map([
  [modes.easy, (level) => gravity(0.5 + level * 0.05, 200)],
  [modes.normal, (level) => gravity(0.5 + level * 0.07, 200)],
  [modes.hard, (level) => gravity(0.5 + level * 0.1, 200)],
]);

const eventReload = new Map([
  [modes.easy, 300],
  [modes.normal, 300],
  [modes.hard, 0],
]);

const vanishByInvinciblePlayer = (playerInvincible, px, py) => (enemy) => {
  const dx = center + enemy.radius * cos(enemy.angle) - px;
  const dy = center + enemy.radius * sin(enemy.angle) - py;
  const dr = 60 - playerInvincible;
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
        boardRadius * (0.7 + random() * 0.3),
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
