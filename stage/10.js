import dependencies from 'dependencies';
import { center, boardRadius } from '@/view/canvas';
import enemyIds from '@/enemy/ids';
import { swimOrb, linearOrb } from '@/enemy/orb';
import { lazer } from '@/enemy/lazer';
import { landolt } from '@/enemy/landolt';
import none from '@/event/none';
import rotate from '@/event/rotate';
import gravity from '@/event/gravity';
import swap from '@/event/swap';
import memorial from '@/event/memorial';
import modes from './modes';
import { vanishByInvinciblePlayer, vanishOrAgeEnemies, makeNextEvent } from './util';

const {
  pi, pi2, infinity, max, trunc, cos, sin, atan2, random,
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
  [modes.easy, 500],
  [modes.normal, 350],
  [modes.hard, 250],
]);

const spawnLazers = (angle) => [...Array(4)].map((_, index) => {
  const a = angle + index * (pi / 2);
  return lazer(
    center + boardRadius * cos(a),
    center + boardRadius * sin(a),
    a + 1.125 * pi,
  );
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
  [modes.normal, { speed: 0.35, hole: pi / 1.3, width: 6 }],
  [modes.hard, { speed: 0.4, hole: pi / 2, width: 7 }],
]);

const spawnLandolt = (mode, pa) => {
  const { speed, hole, width } = landoltParams.get(mode);
  const a = -pa - pi * 0.7;
  const x = center + boardRadius * 0.5 * cos(a);
  const y = center + boardRadius * 0.5 * sin(a);
  return landolt(x, y, -pa, 1, 0.03, speed, hole, width);
};

const swapSpeed = new Map([
  [modes.easy, 1],
  [modes.normal, 1.5],
  [modes.hard, 2],
]);

const aimedOrbWait = new Map([
  [modes.easy, 35],
  [modes.normal, 20],
  [modes.hard, 15],
]);

const colors = ['red', 'yellow', 'lime', 'cyan', 'blue', 'magenta'];

const spawnAimedOrb = (angle, px, py, colorIndex) => {
  const x = center + boardRadius * cos(angle);
  const y = center + boardRadius * sin(angle);
  const a = atan2(py - y, px - x);
  return linearOrb(x, y, a, 1, 6, 'white', colors[colorIndex]);
};

const wallOrbWait = new Map([
  [modes.easy, 400],
  [modes.normal, 350],
  [modes.hard, 200],
]);

const wallOrbParams = new Map([
  [modes.easy, { width: 6, speed: 0.08 }],
  [modes.normal, { width: 7, speed: 0.013 }],
  [modes.hard, { width: 8, speed: 0.017 }],
]);

const spawnWallOrbs = (mode, pa, pr, odd) => {
  const { width, speed } = wallOrbParams.get(mode);
  const d = width * 3.5;
  const a = -pa - pi * 0.6;
  const r = (pr + (odd ? width : 0)) % d;
  return [...Array(trunc(boardRadius / d) + 1)].map((_, index) => (
    swimOrb(a, r + index * d, speed, width, 0, 'gray')
  ));
};

const radialOrbWait = new Map([
  [modes.easy, 150],
  [modes.normal, 100],
  [modes.hard, 80],
]);

const radialOrbParams = new Map([
  [modes.easy, { speed: 0.8, length: 8 }],
  [modes.normal, { speed: 0.9, length: 12 }],
  [modes.hard, { speed: 1, length: 16 }],
]);

const spawnRadialOrbs = (mode, angle) => {
  const { speed, length } = radialOrbParams.get(mode);
  const da = pi2 / length;
  return [...Array(length)].map((_, index) => linearOrb(
    center,
    center,
    angle + index * da,
    speed,
    6,
    'white',
    'blue',
  ));
};

const nextEvent = makeNextEvent((mode, level) => {
  if (level === 1) {
    return { ...rotate((random() < 0.5 ? -1 : 1) * rotateSpeed.get(mode), infinity), wait: 120 };
  }
  if (level === 3) {
    return { ...gravity(gravityForce.get(mode), infinity), wait: 120 };
  }
  if (level === 5) {
    return { ...swap(swapSpeed.get(mode), mode === modes.hard ? 30 : 60), wait: 60 };
  }
  if (level === 9) {
    return memorial();
  }
  return none();
}, new Map([[modes.easy, 0], [modes.normal, 0], [modes.hard, 0]]));

const handleLevelUp = (lv, enemies) => {
  if (lv === 6) {
    return enemies.map((enemy) => (
      enemy.id === enemyIds.swimOrb ? { ...enemy, color: 'lime' } : enemy
    ));
  }
  if (lv === 5) {
    return enemies.filter(({ id }) => id !== enemyIds.landolt);
  }
  if (lv === 8) {
    return enemies.map((enemy) => (
      enemy.id === enemyIds.lazer ? { ...enemy, time: max(enemy.time, 155) } : enemy
    ));
  }
  if (lv === 9) {
    return vanishOrAgeEnemies(enemies);
  }
  return enemies;
};

const stage10 = (
  evtTime = 30,
  swimOrbTime = 0,
  lazerTime = 0,
  landoltTime = 0,
  aimedOrbTime = 0,
  aimedOrbAngle = 0,
  aimedOrbColor = 0,
  wallOrbTime = 0,
  wallOrbOdd = false,
  radialOrbTime = 0,
  radialOrbAngle = 0,
) => (mode, level, levelUp, {
  enemies, px, py, pa, pr, playerInvincible, evt,
}) => {
  const lv = (level - 1) % 10;
  const addSwimOrb = swimOrbTime >= swimOrbWait.get(mode);
  const addLazer = lv >= 2 && lv <= 7 && lazerTime >= lazerWait.get(mode);
  const addLandolt = lv === 4 && landoltTime >= landoltWait.get(mode);
  const addAimedOrb = lv >= 6 && aimedOrbTime >= aimedOrbWait.get(mode);
  const addWallOrb = lv >= 7 && wallOrbTime >= wallOrbWait.get(mode);
  const addRadialOrb = lv >= 8 && radialOrbTime >= radialOrbWait.get(mode);
  const addedEnemies = lv === 9 ? [] : [
    addSwimOrb ? [spawnOrb(mode, pa)] : [],
    addLazer ? spawnLazers(-pa) : [],
    addLandolt ? [spawnLandolt(mode, pa)] : [],
    addAimedOrb ? [spawnAimedOrb(aimedOrbAngle, px, py, aimedOrbColor)] : [],
    addWallOrb ? spawnWallOrbs(mode, pa, pr, wallOrbOdd) : [],
    addRadialOrb ? spawnRadialOrbs(mode, radialOrbAngle) : [],
  ].flat();
  const nextEnemies = (playerInvincible > 0
    ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
    : enemies
  ).concat(addedEnemies);
  const { nextEvt, nextEvtTime } = lv % 2
    ? nextEvent(mode, lv, evtTime, evt)
    : { nextEvt: none(), nextEvtTime: 30 };
  return {
    enemies: levelUp ? handleLevelUp(lv, nextEnemies) : nextEnemies,
    nextStage: stage10(
      nextEvtTime,
      addSwimOrb ? 0 : swimOrbTime + 1,
      addLazer ? 0 : lazerTime + 1,
      addLandolt ? 0 : landoltTime + 1,
      addAimedOrb ? 0 : aimedOrbTime + 1,
      addAimedOrb ? aimedOrbAngle + 0.5 : aimedOrbAngle,
      addAimedOrb ? (aimedOrbColor + 1) % colors.length : aimedOrbColor,
      addWallOrb ? 0 : wallOrbTime + 1,
      addWallOrb ? !wallOrbOdd : wallOrbOdd,
      addRadialOrb ? 0 : radialOrbTime + 1,
      addRadialOrb ? radialOrbAngle : radialOrbAngle - 0.3,
    ),
    evt: nextEvt,
  };
};

export default stage10;
