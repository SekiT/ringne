import { center, boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import { lazer } from '@/enemy/lazer';
import { landolt } from '@/enemy/landolt';
import none from '@/event/none';
import rotate from '@/event/rotate';
import gravity from '@/event/gravity';
import dependencies from 'dependencies';
import modes from './modes';
import { vanishByInvinciblePlayer, vanishOrAgeEnemies, makeNextEvent } from './util';

const {
  pi, pi2, infinity, cos, sin, random,
} = dependencies.globals;

const swimOrbWait = new Map([
  [modes.easy, 40],
  [modes.normal, 20],
  [modes.hard, 10],
]);

const swimOrbSize = new Map([
  [modes.easy, () => 6 + random() * 2],
  [modes.normal, () => 6 + random() * 3],
  [modes.hard, () => 6 + random() * 4],
]);

const swimOrbSpeed = new Map([
  [modes.easy, () => -0.008 * random()],
  [modes.normal, () => -0.01 * random()],
  [modes.hard, () => -0.016 * random()],
]);

const spawnOrb = (mode, pa) => swimOrb(
  -pa + 0.4 + random() * pi * 1.6,
  random() * boardRadius,
  swimOrbSpeed.get(mode)(),
  swimOrbSize.get(mode)(),
);

const rotateSpeed = new Map([
  [modes.easy, 0.02],
  [modes.normal, 0.035],
  [modes.hard, 0.05],
]);

const lazerWait = new Map([
  [modes.easy, 350],
  [modes.normal, 250],
  [modes.hard, 200],
]);

const spawnLazers = (angle) => [...Array(4)].map((_, index) => {
  const a = angle + index * (pi / 2);
  return lazer(center + boardRadius * cos(a), center + boardRadius * sin(a), a + 1.125 * pi);
});

const gravityForce = new Map([
  [modes.easy, 1],
  [modes.normal, 1.3],
  [modes.hard, 1.7],
]);

const landoltWait = new Map([
  [modes.easy, 500],
  [modes.normal, 450],
  [modes.hard, 350],
]);

const landoltParams = new Map([
  [modes.easy, { speed: 0.3, hole: pi / 1.2, width: 5 }],
  [modes.normal, { speed: 0.3, hole: pi / 1.3, width: 6 }],
  [modes.hard, { speed: 0.4, hole: pi / 2.3, width: 7 }],
]);

const spawnLandolt = (mode, pa) => {
  const { speed, hole, width } = landoltParams.get(mode);
  const x = center + boardRadius * 0.5 * cos(pi - pa);
  const y = center + boardRadius * 0.5 * sin(pi - pa);
  return landolt(x, y, random() * pi2, 1, random() < 0.5 ? -0.03 : 0.03, speed, hole, width);
};

const nextEvent = makeNextEvent((mode, level) => {
  if (level === 1) {
    return { ...rotate((random() < 0.5 ? -1 : 1) * rotateSpeed.get(mode), infinity), wait: 60 };
  }
  if (level === 3) {
    return { ...gravity(gravityForce.get(mode), infinity), wait: 60 };
  }
  return none();
}, new Map([[modes.easy, 0], [modes.normal, 0], [modes.hard, 0]]));

const stage10 = (
  evtTime = 30, orbTime = 0, lazerTime = 0, landoltTime = 0,
) => (mode, level, levelUp, {
  enemies, px, py, pa, playerInvincible, evt,
}) => {
  const lv = (level - 1) % 10;
  const wait1 = swimOrbWait.get(mode);
  const wait3 = lazerWait.get(mode);
  const wait5 = landoltWait.get(mode);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    orbTime >= wait1 ? [spawnOrb(mode, pa)] : [],
    lv >= 2 && lazerTime >= wait3 ? spawnLazers(random() * pi) : [],
    lv >= 4 && landoltTime >= wait5 ? [spawnLandolt(mode, pa)] : [],
  ].flat();
  const { nextEvt, nextEvtTime } = lv % 2
    ? nextEvent(mode, lv, evtTime, evt)
    : { nextEvt: none(), nextEvtTime: 30 };
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    nextStage: stage10(),
    evt: none(),
  } : {
    enemies: nextEnemies,
    nextStage: stage10(
      nextEvtTime,
      orbTime >= wait1 ? 0 : orbTime + 1,
      lv >= 2 && lazerTime >= wait3 ? 0 : lazerTime + 1,
      lv >= 4 && landoltTime >= wait5 ? 0 : landoltTime + 1,
    ),
    evt: nextEvt,
  };
};

export default stage10;
