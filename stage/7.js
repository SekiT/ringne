import { center, boardRadius } from '@/view/canvas';
import { linearOrb } from '@/enemy/orb';
import dependencies from 'dependencies';
import { vanishByInvinciblePlayer } from './util';

const {
  pi, cos, sin, atan2,
} = dependencies.globals;

const colors = ['red', 'yellow', 'lime', 'cyan', 'blue', 'magenta'];

const makeOrb = (lv, px, py, angle, colorId) => {
  const x = center + boardRadius * cos(angle);
  const y = center + boardRadius * sin(angle);
  const a = atan2(py - y, px - x);
  const color = colors[colorId];
  return lv < 5
    ? [linearOrb(x, y, a, 1, 6, 'white', color)]
    : [
      linearOrb(x, y, a, 1, 6, 'white', color),
      linearOrb(center * 2 - x, center * 2 - y, a + pi, 1, 6, 'white', color),
    ];
};

const stage7 = (orbTime = 0, angle = 0, colorId = 0) => (mode, level, levelUp, {
  enemies, px, py, playerInvincible, evt,
}) => {
  const lv = (level - 1) % 10;
  const addOrb = orbTime >= 15;
  const nextEnemies = [
    playerInvincible > 0
      ? enemies.flatMap(vanishByInvinciblePlayer(playerInvincible, px, py))
      : enemies,
    addOrb ? makeOrb(lv, px, py, angle, colorId) : [],
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
