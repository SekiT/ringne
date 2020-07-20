import { center, boardRadius } from '@/view/canvas';
import { linearOrb } from '@/enemy/orb';
import dependencies from 'dependencies';
import modes from './modes';
import { vanishByInvinciblePlayer } from './util';

const {
  pi, cos, sin, atan2,
} = dependencies.globals;

const orbWait = new Map([
  [modes.easy, (lv) => 30 - lv],
  [modes.normal, (lv) => 20 - lv],
  [modes.hard, (lv) => 15 - lv],
]);

const orbSize = new Map([
  [modes.easy, 6],
  [modes.normal, 5],
  [modes.hard, 6],
]);

const colors = ['red', 'yellow', 'lime', 'cyan', 'blue', 'magenta'];

const makeOrb = (lv, px, py, angle, size, color) => {
  const x = center + boardRadius * cos(angle);
  const y = center + boardRadius * sin(angle);
  const a = atan2(py - y, px - x);
  return lv < 5
    ? [linearOrb(x, y, a, 1, size, 'white', color)]
    : [
      linearOrb(x, y, a, 1, size, 'white', color),
      linearOrb(center * 2 - x, center * 2 - y, a + pi, 1, size, 'white', color),
    ];
};

const stage7 = (orbTime = 0, angle = 0, colorId = 0) => (mode, level, levelUp, {
  enemies, px, py, playerInvincible, evt,
}) => {
  const lv = (level - 1) % 10;
  const addOrb = orbTime >= orbWait.get(mode)(lv % 5);
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addOrb ? makeOrb(lv, px, py, angle, orbSize.get(mode), colors[colorId]) : [],
  ].flat();
  return {
    enemies: nextEnemies,
    nextStage: stage7(
      addOrb ? 0 : orbTime + 1,
      angle + 0.02,
      addOrb ? (colorId + 1) % colors.length : colorId,
    ),
    evt,
  };
};

export default stage7;
