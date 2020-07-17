import dependencies from 'dependencies';
import {
  center, boardRadius,
  canvasContext, clearCanvas,
  drawBackground, drawTape, drawGuide, drawPlayer, drawCenterDot, drawOutline, drawEventGauge,
} from '@/view/canvas';
import getInputs from '@/state/input';
import levelView from '@/view/level';
import modeView from '@/view/mode';
import deathsView from '@/view/deaths';
import eventView from '@/view/event';
import { enemyIdToMotion, enemyIdToRenderer } from '@/enemy/index';
import ids from './ids';
import initialState from './initialState';

const {
  pi2, cos, sin, min, max, random,
} = dependencies.globals;

const moveEnemies = (enemies, px, py) => (
  enemies.reduce((acc, enemy) => {
    const { id } = enemy;
    const { nextEnemies, hit } = enemyIdToMotion.get(id)(enemy, px, py);
    enemyIdToRenderer.get(id)(canvasContext, enemy);
    return {
      nextEnemies: [...acc.nextEnemies, ...nextEnemies],
      hit: acc.hit || hit,
    };
  }, { nextEnemies: [], hit: false })
);

export default (pauseTime = 0) => ({
  mode,
  level: previousLevel,
  practice,
  stage,
  evt: previousEvt,
  playerAngle,
  playerRadius,
  playerInvincible,
  enemies,
  deaths,
}) => {
  const {
    inner, outer, quick, brake, pause, escape,
  } = getInputs();
  if (escape) {
    clearCanvas();
    return {
      nextId: ids.title,
      nextArgs: [],
      stateUpdate: {
        ...initialState(),
        mode,
      },
    };
  }
  if (pause && pauseTime > 10) {
    return {
      nextId: ids.pause,
      nextArgs: [0],
      stateUpdate: {},
    };
  }
  let pa = playerAngle + 0.007 + (quick - brake) * 0.005;
  let pr = min(max(playerRadius + (outer - inner) * 2, 10), boardRadius - 10);
  const effectResult = previousEvt.waitTime >= previousEvt.wait
    ? previousEvt.inputEffect({
      inner, outer, quick, brake, pa, pr, enemies,
    }, previousEvt)
    : { pa, pr, enemies };
  pa = effectResult.pa;
  pr = effectResult.pr;
  const levelUp = pa >= pi2;
  const level = previousLevel + (levelUp ? 1 : 0);
  if (practice && levelUp && level % 10 === 1) {
    return {
      nextId: ids.title,
      nextArgs: [],
      stateUpdate: {},
    };
  }
  pa -= levelUp ? pi2 : 0;
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
  const stageResult = stage(mode, level, levelUp, {
    px, py, pa, pr, playerInvincible, enemies: effectResult.enemies, evt: previousEvt,
  });
  const { evt } = stageResult;
  const { nextEnemies, hit } = moveEnemies(stageResult.enemies, px, py);
  drawCenterDot();
  drawOutline();
  const {
    eventTime, duration, waitTime, wait, afterEffect, props,
  } = evt;
  const eventActive = waitTime >= wait;
  drawEventGauge(eventActive ? (1 - eventTime / duration) : waitTime / wait);
  const nextEvt = {
    ...evt,
    waitTime: waitTime + 1,
    eventTime: eventActive ? eventTime + 1 : 0,
    props: eventActive ? afterEffect(props, eventTime, canvasContext) : props,
  };
  eventView.update(() => ({ name: nextEvt.name }));
  if (hit && playerInvincible === 0) {
    deathsView.update(() => ({ deaths: deaths + 1 }));
    return {
      nextId: ids.death,
      nextArgs: [],
      stateUpdate: {
        level,
        stage: stageResult.nextStage,
        deaths: deaths + 1,
        enemies: nextEnemies,
        evt: nextEvt,
      },
    };
  }
  return {
    nextId: ids.main,
    nextArgs: [pauseTime + 1],
    stateUpdate: {
      level,
      stage: stageResult.nextStage,
      playerAngle: pa,
      playerRadius: pr,
      playerInvincible: max(playerInvincible - 1, 0),
      enemies: nextEnemies,
      evt: nextEvt,
    },
  };
};
