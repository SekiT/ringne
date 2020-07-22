import { boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import eventIds from '@/event/ids';
import none from '@/event/none';
import mirror from '@/event/mirror';
import dependencies from 'dependencies';
import { vanishByInvinciblePlayer, vanishOrAgeEnemies } from './util';
import modes from './modes';

const { pi, random } = dependencies.globals;

const orbWait = new Map([
  [modes.easy, (level) => 200 - level * 10],
  [modes.normal, (level) => 175 - level * 10],
  [modes.hard, (level) => 150 - level * 12],
]);

const orbParams = new Map([
  [modes.easy, (level) => ({ length: 5, width: 8, speed: 0.008 + level * 0.0008 })],
  [modes.normal, (level) => ({ length: 5, width: 9, speed: 0.01 + level * 0.001 })],
  [modes.hard, (level) => ({ length: 7, width: 7, speed: 0.016 + level * 0.0014 })],
]);

const spawnOrbs = (mode, level, pa, odd) => {
  const angle = pa + (odd ? -1 : 1) * pi * (0.4 + 0.2 * random());
  const { length, width, speed } = orbParams.get(mode)(level);
  const velocity = (odd ? -1 : 1) * speed;
  return [...Array(length + 1 - odd)].map((_, index) => (
    swimOrb(
      angle,
      boardRadius * ((index + odd * 0.5) / length),
      velocity,
      width,
    )
  ));
};

const eventDuration = new Map([
  [modes.easy, (level) => 200 + level * 10],
  [modes.normal, (level) => 250 + level * 20],
  [modes.hard, (level) => 300 + level * 25],
]);

const eventReload = new Map([
  [modes.easy, (level) => 300 - level * 10],
  [modes.normal, (level) => 300 - level * 20],
  [modes.hard, () => 0],
]);

const stage8 = (swimOrbTime = 130, swimOrbOdd = 0, evtTime = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const lv = (level - 1) % 10;
  const addSwimOrb = swimOrbTime >= orbWait.get(mode)(lv);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addSwimOrb ? spawnOrbs(mode, lv, pa, swimOrbOdd) : [],
  ].flat();
  const { id, eventTime, duration } = evt;
  let nextEvt;
  let nextEvtTime;
  if (id === eventIds.none) {
    if (evtTime === 30) {
      nextEvt = mirror(eventDuration.get(mode)(lv));
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
    nextEvtTime = -eventReload.get(mode)(lv);
  }
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    nextStage: stage8(),
    evt: none(),
  } : {
    enemies: nextEnemies,
    nextStage: stage8(
      addSwimOrb ? 0 : swimOrbTime + 1,
      addSwimOrb ? 1 - swimOrbOdd : swimOrbOdd,
      nextEvtTime,
    ),
    evt: nextEvt,
  };
};

export default stage8;
