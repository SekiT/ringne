import dependencies from 'dependencies';
import {
  center, boardRadius,
  context, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import levelView from '@/view/level';
import modeView from '@/view/mode';
import getInputs from '@/state/input';
import stageIndex from '@/stage/index';
import enemyIdToMotion from '@/enemy/index';
import ids from './ids';

const {
  pi, cos, sin, min, max,
} = dependencies.globals;
const pi2 = pi * 2;

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
  mode,
  level: previousLevel,
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
  const levelUp = previousPA >= pi2;
  const level = previousLevel + (levelUp ? 1 : 0);
  const pa = previousPA + 0.007 + (quick - brake) * 0.005 + (levelUp ? -pi2 : 0);
  const pr = min(max(previousPR + (outer - inner) * 2, 10), boardRadius - 10);
  levelView.update(() => ({ level, playerAngle: pa }));
  modeView.update(() => ({ mode }));
  clearCanvas();
  drawBackground();
  drawTape();
  drawGuide(pa);
  const px = center + pr * cos(-pa);
  const py = center + pr * sin(-pa);
  drawPlayer(px, py);
  const { enemies } = stageIndex(level)(mode, level, {
    px, py, enemies: previousEnemies,
  });
  const { nextEnemies, hit } = moveEnemies(enemies, px, py);
  drawCenterDot();
  drawOutline();
  drawEventGauge(0);
  return hit ? {
    nextId: ids.title,
    nextArgs: [],
    stateUpdate: { level },
  } : {
    nextId: ids.main,
    nextArgs: [pauseTime + 1],
    stateUpdate: {
      level,
      playerAngle: pa,
      playerRadius: pr,
      enemies: nextEnemies,
    },
  };
};
