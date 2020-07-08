import dependencies from 'dependencies';
import {
  center, boardRadius,
  context, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import getInputs from '@/state/input';
import stageIndex from '@/stage/index';
import enemyIdToMotion from '@/enemy/index';
import ids from './ids';

const {
  cos, sin, min, max,
} = dependencies.globals;

const moveEnemies = (enemies, px, py) => (
  enemies.reduce((acc, enemy) => {
    const { nextEnemies, hit } = enemyIdToMotion.get(enemy.id)(enemy, context, px, py);
    return {
      nextEnemies: [...acc.nextEnemies, ...nextEnemies],
      hit: acc.hit || hit,
    };
  }, { nextEnemies: [], hit: false })
);

export default (pauseTime = 0) => ({
  level,
  playerAngle: previousPA,
  playerRadius: previousPR,
  enemies: previousEnemies,
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
  const pa = previousPA + 0.007 + (quick - brake) * 0.005;
  const pr = min(max(previousPR + (outer - inner) * 2, 10), boardRadius - 10);
  clearCanvas();
  drawBackground();
  drawTape();
  drawGuide(pa);
  const px = center + pr * cos(-pa);
  const py = center + pr * sin(-pa);
  drawPlayer(px, py);
  const { enemies } = stageIndex(level)({ px, py, enemies: previousEnemies });
  const { nextEnemies, hit } = moveEnemies(enemies, px, py);
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
