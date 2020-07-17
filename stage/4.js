import { center, boardRadius } from '@/view/canvas';
import enemyIds from '@/enemy/ids';
import { swimOrb, linearOrb } from '@/enemy/orb';
import gravity from '@/event/gravity';
import none from '@/event/none';
import dependencies from 'dependencies';
import eventIds from '../event/ids';
import modes from './modes';
import stage5 from './5';

const {
  pi, pi2, min, max, cos, sin, random,
} = dependencies.globals;

const swimOrbWait = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 16 - level],
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

const stage4 = (swimOrbTime = 0, linearOrbTime = 0, evtTime = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const addSwimOrb = swimOrbTime >= swimOrbWait.get(mode)(level - 30);
  const addLinearOrb = mode !== modes.easy && level >= 36 && linearOrbTime >= (560 - level * 10);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addSwimOrb ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        boardRadius * min(0.7 + random() * 0.4, 1),
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
    addLinearOrb ? new Array(10).fill(random() * pi2).map(
      (a, i) => linearOrb(center, center, (i / 10) * pi2 + a, 2, 7, 'white', 'blue'),
    ) : [],
  ].flat();
  const { id, eventTime, duration } = evt;
  let nextEvt;
  let nextEvtTime;
  if (id === eventIds.none) {
    if (evtTime === 30) {
      nextEvt = createEvent.get(mode)(level - 30);
      nextEvtTime = evtTime + 1;
    } else {
      nextEvt = evt;
      nextEvtTime = evtTime + 1;
    }
  } else if (eventTime < duration) {
    nextEvt = evt;
    nextEvtTime = evtTime + 1;
  } else {
    nextEvt = none();
    nextEvtTime = -eventReload.get(mode);
  }
  if (levelUp && level === 41) {
    return {
      enemies: nextEnemies.map((enemy) => ({ ...enemy, time: max(enemy.time, 270) })),
      nextStage: stage5(),
      evt: none(),
    };
  }
  return {
    enemies: nextEnemies,
    nextStage: stage4(
      addSwimOrb ? 0 : swimOrbTime + 1,
      addLinearOrb ? 0 : linearOrbTime + 1,
      nextEvtTime,
    ),
    evt: nextEvt,
  };
};

export default stage4;
