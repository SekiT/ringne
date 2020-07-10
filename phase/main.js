import dependencies from 'dependencies';
import {
  center, boardRadius,
  context, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import getInputs from '@/state/input';
import levelView from '@/view/level';
import modeView from '@/view/mode';
import deathsView from '@/view/deaths';
import { enemyIdToMotion, enemyIdToRenderer } from '@/enemy/index';
import ids from './ids';

const {
  pi2, cos, sin, min, max, random,
} = dependencies.globals;

const moveEnemies = (enemies, px, py) => (
  enemies.reduce((acc, enemy) => {
    const { id } = enemy;
    const { nextEnemies, hit } = enemyIdToMotion.get(id)(enemy, px, py);
    enemyIdToRenderer.get(id)(context, enemy);
    return {
      nextEnemies: [...acc.nextEnemies, ...nextEnemies],
      hit: acc.hit || hit,
    };
  }, { nextEnemies: [], hit: false })
);

export default (pauseTime = 0) => ({
  mode,
  level: previousLevel,
  stage,
  playerAngle: previousPA,
  playerRadius: previousPR,
  playerInvincible,
  enemies: previousEnemies,
  deaths,
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
  if (playerInvincible === 0 || random() < 0.5) {
    drawPlayer(px, py);
  }
  const { nextStage, enemies } = stage(mode, level, levelUp, {
    px, py, enemies: previousEnemies,
  });
  const { nextEnemies, hit } = moveEnemies(enemies, px, py);
  const dead = hit && playerInvincible === 0;
  drawCenterDot();
  drawOutline();
  drawEventGauge(0);
  if (dead) {
    deathsView.update(() => ({ deaths: deaths + 1 }));
  }
  return dead ? {
    nextId: ids.death,
    nextArgs: [],
    stateUpdate: {
      level,
      stage: nextStage,
      deaths: deaths + 1,
      enemies: nextEnemies,
    },
  } : {
    nextId: ids.main,
    nextArgs: [pauseTime + 1],
    stateUpdate: {
      level,
      stage: nextStage,
      playerAngle: pa,
      playerRadius: pr,
      playerInvincible: max(playerInvincible - 1, 0),
      enemies: nextEnemies,
    },
  };
};
