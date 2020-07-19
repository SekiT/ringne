import dependencies from 'dependencies';
import { boardRadius } from '@/view/canvas';
import eventIds from '@/event/ids';
import none from '@/event/none';
import swap from '@/event/swap';
import { swimOrb } from '@/enemy/orb';
import modes from './modes';
import { vanishOrAgeEnemies, vanishByInvinciblePlayer } from './util';

const { pi, random } = dependencies.globals;

const orbWait = new Map([
  [modes.easy, (level) => 30 - level * 2],
  [modes.normal, (level) => 27 - level * 2],
  [modes.hard, (level) => 16 - level],
]);

const orbSpeed = new Map([
  [modes.easy, () => -0.008 + 0.016 * random()],
  [modes.normal, () => -0.01 + 0.02 * random()],
  [modes.hard, () => -0.016 + 0.032 * random()],
]);

const orbSize = new Map([
  [modes.easy, () => 6 + random() * 3],
  [modes.normal, () => 7 + random() * 4],
  [modes.hard, () => 8 + random() * 5],
]);

const createEvent = new Map([
  [modes.easy, (level) => swap(0.7, 100 + level * 10)],
  [modes.normal, (level) => swap(1.5, 200 + level * 20)],
  [modes.hard, (level) => swap(2, 250 + level * 30)],
]);

const eventReload = new Map([
  [modes.easy, 300],
  [modes.normal, 300],
  [modes.hard, 0],
]);

const stage6 = (swimOrbTime = 0, evtTime = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const addSwimOrb = swimOrbTime >= orbWait.get(mode)((level - 1) % 10);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addSwimOrb ? [
      swimOrb(
        -pa + pi * 0.2 + random() * pi * 1.6,
        boardRadius * random(),
        orbSpeed.get(mode)(),
        orbSize.get(mode)(),
      ),
    ] : [],
  ].flat();
  const { id, eventTime, duration } = evt;
  let nextEvt;
  let nextEvtTime;
  if (id === eventIds.none) {
    if (evtTime === 30) {
      nextEvt = createEvent.get(mode)((level - 1) % 10);
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
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    nextStage: stage6(),
    evt: none(),
  } : {
    enemies: nextEnemies,
    nextStage: stage6(addSwimOrb ? 0 : swimOrbTime + 1, nextEvtTime),
    evt: nextEvt,
  };
};

export default stage6;
