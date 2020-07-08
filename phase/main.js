import dependencies from 'dependencies';
import {
  center, boardRadius,
  context, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import getInputs from '@/state/input';
import enemyIdToMotion from '@/enemy/index';
import { swimOrb } from '@/enemy/orb';
import ids from './ids';

const {
  cos, sin, min, max, random,
} = dependencies.globals;

export default (pauseTime = 0) => ({
  playerAngle, playerRadius, enemies,
}) => {
  const {
    inner, outer, quick, brake, pause,
  } = getInputs();
  if (pause && pauseTime > 10) {
    return {
      nextId: ids.pause,
      nextArgs: [0],
      stateUpdate: {},
    };
  }
  const pa = playerAngle + 0.007 + (quick - brake) * 0.005;
  const pr = min(max(playerRadius + (outer - inner) * 2, 10), boardRadius - 10);
  clearCanvas();
  drawBackground();
  drawTape();
  drawGuide(playerAngle);
  const px = center + pr * cos(-pa);
  const py = center + pr * sin(-pa);
  drawPlayer(px, py);
  // TODO: Execute stage function
  const { nextEnemies, hit } = enemies.reduce((acc, enemy) => {
    const {
      nextEnemies: addedEnemies,
      hit: hitForThis,
    } = enemyIdToMotion.get(enemy.id)(enemy, context, px, py);
    return { nextEnemies: [...acc.nextEnemies, ...addedEnemies], hit: acc.hit || hitForThis };
  }, { nextEnemies: [], hit: false });
  // Add enemy for debugging
  if (random() < 0.05) {
    nextEnemies.push(
      swimOrb(random() * Math.PI * 2, random() * boardRadius, random() * 0.02, 6 + random() * 4),
    );
  }
  drawCenterDot();
  drawOutline();
  drawEventGauge(0.29);
  return hit ? {
    nextId: ids.title,
    nextArgs: [],
    stateUpdate: {},
  } : {
    nextId: ids.main,
    nextArgs: [pauseTime + 1],
    stateUpdate: {
      playerAngle: pa,
      playerRadius: pr,
      enemies: nextEnemies,
    },
  };
};
