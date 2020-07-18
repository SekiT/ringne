import { boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import rotate from '@/event/rotate';
import none from '@/event/none';
import dependencies from 'dependencies';
import eventIds from '../event/ids';
import modes from './modes';
import { vanishOrAgeEnemies, vanishByInvinciblePlayer } from './util';
import stage3 from './3';

const { pi, pi2, random } = dependencies.globals;

const swimOrbWait = new Map([
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

const stage2 = (swimOrbTime = 0, evtTime = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const addSwimOrb = swimOrbTime >= swimOrbWait.get(mode)(level - 10);
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
  const { id, eventTime, duration } = evt;
  let nextEvt;
  let nextEvtTime;
  if (id === eventIds.none) {
    if (evtTime === 30) {
      const speed = rotateSpeed.get(mode)(level);
      const count = rotateCount.get(mode)(level - 11);
      nextEvt = rotate((random() < 0.5 ? -1 : 1) * speed, (pi2 / speed) * count);
    } else {
      nextEvt = evt;
    }
    nextEvtTime = evtTime + 1;
  } else if (id === eventIds.rotate && eventTime < duration) {
    nextEvt = evt;
    nextEvtTime = evtTime + 1;
  } else {
    nextEvt = none();
    nextEvtTime = -eventReload.get(mode);
  }
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
