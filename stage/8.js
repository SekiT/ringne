import { boardRadius } from '@/view/canvas';
import { swimOrb } from '@/enemy/orb';
import none from '@/event/none';
import mirror from '@/event/mirror';
import dependencies from 'dependencies';
import { vanishByInvinciblePlayer, vanishOrAgeEnemies, makeNextEvent } from './util';
import modes from './modes';
import stage9 from './9';

const { pi, random } = dependencies.globals;

const orbWait = new Map([
  [modes.easy, (level) => 200 - level * 20],
  [modes.normal, (level) => 175 - level * 20],
  [modes.hard, (level) => 150 - level * 18],
]);

const orbParams = new Map([
  [modes.easy, (level) => ({ length: 5, width: 8, speed: 0.01 + level * 0.0015 })],
  [modes.normal, (level) => ({ length: 5, width: 9, speed: 0.013 + level * 0.002 })],
  [modes.hard, (level) => ({ length: 7, width: 7, speed: 0.016 + level * 0.0028 })],
]);

const spawnOrbs = (mode, level, pa, odd) => {
  const angle = -pa + (odd ? 1 : -1) * pi * (0.3 + 0.4 * random());
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

const craeteEvent = new Map([
  [modes.easy, (level) => mirror(200 + level * 10)],
  [modes.normal, (level) => mirror(250 + level * 25)],
  [modes.hard, (level) => mirror(300 + level * 25)],
]);

const eventReload = new Map([
  [modes.easy, (level) => 300 - level * 10],
  [modes.normal, (level) => 200 - level * 20],
  [modes.hard, () => 0],
]);

const nextEvent = makeNextEvent((mode, level) => craeteEvent.get(mode)(level), eventReload);

const stage8 = (swimOrbTime = 130, swimOrbOdd = 0, evtTime = 0) => (mode, level, levelUp, {
  enemies, evt, px, py, pa, playerInvincible,
}) => {
  const lv = (level - 1) % 10;
  const addSwimOrb = swimOrbTime >= orbWait.get(mode)(lv % 5);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addSwimOrb ? spawnOrbs(mode, lv % 5, pa, swimOrbOdd) : [],
  ].flat();
  const { nextEvt, nextEvtTime } = nextEvent(mode, lv, evtTime, evt);
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    nextStage: stage9(),
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
