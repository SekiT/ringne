import { center } from '@/view/canvas';
import { swimOrb, linearOrb, orbToCenter } from '@/enemy/orb';
import none from '@/event/none';
import dependencies from 'dependencies';
import { vanishByInvinciblePlayer, vanishOrAgeEnemies } from './util';
import modes from './modes';

const { pi, pi2, trunc } = dependencies.globals;

const orbWait = new Map([
  [modes.easy, (level) => 200 - level * 10],
  [modes.normal, (level) => 160 - level * 10],
  [modes.hard, (level) => 120 - level * 8],
]);

const orbParams = new Map([
  [modes.easy, (level) => ({ length: 6 + trunc(level / 2), width: 6, speed: 1 })],
  [modes.normal, (level) => ({ length: 7 + level, width: 6, speed: 1 })],
  [modes.hard, (level) => ({ length: 10 + trunc(level / 2), width: 7, speed: 1.5 })],
]);

const spawnOrbs = (mode, level, baseAngle, fromCenter) => {
  const { length, width, speed } = orbParams.get(mode)(level);
  const color = fromCenter ? 'blue' : 'magenta';
  return [...Array(length)].map((_, index) => {
    const angle = baseAngle + pi2 * (index / length) + (fromCenter ? 0 : pi / length);
    return fromCenter
      ? linearOrb(center, center, angle, speed, width, 'white', color)
      : orbToCenter(angle, speed, width, 'white', color);
  });
};

const stage9 = (orbTime = 0, orbAngle = 0) => (mode, level, levelUp, {
  enemies, px, py, pa, pr, playerInvincible,
}) => {
  const lv = (level - 1) % 10;
  const wait = orbWait.get(mode)(lv);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    orbTime === wait / 2 ? spawnOrbs(mode, lv, orbAngle, true) : [],
    orbTime >= wait && (mode !== modes.hard || lv > 5) ? spawnOrbs(mode, lv, orbAngle, false) : [],
    mode === modes.hard && orbTime >= wait ? [swimOrb(-pa - 0.63, pr, 0.01, 6)] : [],
  ].flat();
  return levelUp && level % 10 === 1 ? {
    enemies: vanishOrAgeEnemies(nextEnemies),
    nextStage: stage9(),
    evt: none(),
  } : {
    enemies: nextEnemies,
    nextStage: stage9(
      orbTime >= wait ? 0 : orbTime + 1,
      orbTime >= wait ? orbAngle + (pi / orbParams.get(mode)(lv).length) * 1.2 : orbAngle,
    ),
    evt: none(),
  };
};

export default stage9;
