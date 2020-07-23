import { boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import rotate from '@/event/rotate';
import none from '@/event/none';
import dependencies from 'dependencies';
import modes from './modes';
import { vanishOrAgeEnemies, vanishByInvinciblePlayer, makeNextEvent } from './util';
import stage3 from './3';

const { pi, pi2, random } = dependencies.globals;

const swimOrbWait = new Map([
  [modes.easy, (level) => 28 - level * 2],
  [modes.normal, (level) => 25 - level * 2],
  [modes.hard, (level) => 12 - level],
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

const eventParams = new Map([
  [modes.easy, (level) => ({ speed: 0.02, rotateCount: level > 5 ? 2 : 1 })],
  [modes.normal, (level) => ({ speed: 0.02, rotateCount: level > 5 ? 3 : 2 })],
  [modes.hard, (level) => ({ speed: 0.05, rotateCount: level > 5 ? 4 : 2 })],
]);

const eventReload = new Map([
  [modes.easy, 600],
  [modes.normal, 300],
  [modes.hard, 0],
]);

const nextEvent = makeNextEvent(
  (mode, level) => {
    const { speed, rotateCount } = eventParams.get(mode)(level);
    return rotate((random() < 0.5 ? -1 : 1) * speed, (pi2 / speed) * rotateCount);
  },
  eventReload,
);

const stage2 = (swimOrbTime = 0, evtTime = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const lv = (level - 1) % 10;
  const addSwimOrb = swimOrbTime >= swimOrbWait.get(mode)(lv);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addSwimOrb ? [
      swimOrb(
        -pa + 0.4 + random() * pi * 1.6,
        random() * boardRadius,
        swimOrbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
  ].flat();
  const { nextEvt, nextEvtTime } = nextEvent(mode, lv, evtTime, evt);
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    nextStage: stage3(),
    evt: none(),
  } : {
    enemies: nextEnemies,
    nextStage: stage2(addSwimOrb ? 0 : swimOrbTime + 1, nextEvtTime),
    evt: nextEvt,
  };
};

export default stage2;
