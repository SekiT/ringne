import dependencies from 'dependencies';

import stage5 from './5';
import modes from './modes';
import { makeNextEvent, vanishByInvinciblePlayer, vanishOrAgeEnemies } from './util';

import { linearOrb, swimOrb } from '@/enemy/orb';
import gravity from '@/event/gravity';
import none from '@/event/none';
import { boardRadius, center } from '@/view/canvas';

const {
  pi, pi2, min, random,
} = dependencies.globals;

const swimOrbWait = new Map([
  [modes.easy, (level) => 28 - level * 2],
  [modes.normal, (level) => 25 - level * 2],
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

const nextEvent = makeNextEvent((mode, level) => createEvent.get(mode)(level), eventReload);

const stage4 = (swimOrbTime = 0, linearOrbTime = 0, evtTime = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const lv = (level - 1) % 10;
  const addSwimOrb = swimOrbTime >= swimOrbWait.get(mode)(lv);
  const addLinearOrb = mode !== modes.easy && lv > 5 && linearOrbTime >= (250 - lv * 10);
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
  const { nextEvt, nextEvtTime } = nextEvent(mode, lv, evtTime, evt);
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    nextStage: stage5(),
    evt: none(),
  } : {
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
